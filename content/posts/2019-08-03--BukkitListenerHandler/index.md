---
title: 指定したパッケージの中にあるListenerクラスをまとめて登録する
category: "Tips"
tags: ["Bukkit", "Spigot", "Kotlin", "Minecraft"]
author: TrollCoding
---

##クラス

指定したパッケージの中にあるListenerクラスをまとめて登録

`ListenerHandler.loadListenersFromPackage(plugin, "me.plugin.listeners")`

##ListenerHandler.kt

```kotlin
import com.google.common.collect.ImmutableSet
import org.bukkit.event.Listener
import org.bukkit.plugin.Plugin
import java.io.IOException
import java.util.ArrayList
import java.util.jar.JarFile

object ListenerHandler {

    /**
     * パッケージの中にある全てのクラスを取得
     */
    private fun getClassesInPackage(plugin: Plugin, packageName: String): Collection<Class<*>> {
        val classes = ArrayList<Class<*>>()

        val codeSource = plugin.javaClass.protectionDomain.codeSource
        val resource = codeSource.location
        val relPath = packageName.replace('.', '/')
        val resPath = resource.path.replace("%20", " ")
        val jarPath = resPath.replaceFirst("[.]jar[!].*".toRegex(), ".jar").replaceFirst("file:".toRegex(), "")
        val jarFile: JarFile

        try {
            jarFile = JarFile(jarPath)
        } catch (e: IOException) {
            throw RuntimeException("Unexpected IOException reading JAR File '$jarPath'", e)
        }

        val entries = jarFile.entries()

        while (entries.hasMoreElements()) {
            val entry = entries.nextElement()
            val entryName = entry.name
            var className: String? = null

            if (entryName.endsWith(".class") && entryName.startsWith(relPath) && entryName.length > relPath.length + "/".length) {
                className = entryName.replace('/', '.').replace('\\', '.').replace(".class", "")
            }

            if (className != null) {
                var clazz: Class<*>? = null

                try {
                    clazz = Class.forName(className)
                } catch (e: ClassNotFoundException) {
                    e.printStackTrace()
                }

                if (clazz != null) {
                    classes.add(clazz)
                }
            }
        }

        try {
            jarFile.close()
        } catch (e: IOException) {
            e.printStackTrace()
        }

        return ImmutableSet.copyOf(classes)
    }

    /**
     * リスナーが実装されているクラスか判定
     */
    private fun isListener(clazz: Class<*>): Boolean {
        for (interfaze in clazz.interfaces) {
            if (interfaze == Listener::class.java) {
                return true
            }
        }

        return false
    }


    /**
     * 指定したパッケージの中にある全てのリスナークラスを登録
     */
    fun loadListenersFromPackage(plugin: Plugin, packageName: String) {
        for (clazz in getClassesInPackage(plugin, packageName)) {
            if (isListener(clazz)) {
                try {
                    plugin.server.pluginManager.registerEvents(clazz.newInstance() as Listener, plugin)
                } catch (e: Exception) {
                    e.printStackTrace()
                }

            }
        }
    }
}
```

##おわり
ちょっとした小ネタでした。是非参考にしてみてください。


