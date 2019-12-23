---
title: 簡単実装！BukkitPluginでSidebarを表示するには？
category: "Dev"
tags: ["Bukkit", "Spigot", "Kotlin",  "Scoreboard", "Minecraft"]
author: TrollCoding
---

実装まで簡単すぎるSidebarを紹介していきます

##開発環境
* Language: Kotlin
* Editor: JetBrains Intellij IDEA (Ultimate)
* JDK: 1.8.0_201
* Framework: Maven
* Spigot: 1.14.1-R0.1-SNAPSHOT
* OS: Windows 10 (64bit)

##1. パッケージ構成

    SidebarTutorialPlugin                                        
    ├─ lib                                                      
    │   └─ spigot-1.14.1.jar                                     
    │   
    ├─ src                                                       
    │   ├─ main                                                  
    │   │   ├─ kotlin                                            
    │   │   │   └─ me                                            
    │   │   │       └─ trollcoding                               
    │   │   │           └─ sidebartutorial                       
    │   │   │               ├─ sidebar                           
    │   │   │               │   ├─ impl                         
    │   │   │               │   │   └─ TutorialBoardAdapter.kt   
    │   │   │               │   │   
    │   │   │               │   ├─ listener                      
    │   │   │               │   │   └─ SidebarListener.kt        
    │   │   │               │   │   
    │   │   │               │   ├─ Board.kt                      
    │   │   │               │   ├─ BoardAdapter.kt               
    │   │   │               │   ├─ BoardEntry.kt                
    │   │   │               │   ├─ BoardManager.kt              
    │   │   │               │   └─ BoardTimer.kt                 
    │   │   │               │   
    │   │   │               └─ TutorialPlugin.kt          
    │   │   │               
    │   │   └─ resources                                         
    │   │       └─ plugin.yml                                   
    │   │       
    │   └─ test                                                 
    │       └─ kotlin                                           
    │           └─ me                                            
    │               └─ trollcoding                              
    │                   └─ sidebartutorial                       
    │                       
    └─ pom.xml

##2. 依存関係 (Maven)

<details><summary>pom.xml</summary><div>

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">

    <modelVersion>4.0.0</modelVersion>

    <groupId>me.trollcoding.sidebartutorial</groupId>
    <artifactId>SidebarTutorialPlugin</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>jar</packaging>

    <name>me.trollcoding.sidebartutorial SidebarTutorialPlugin</name>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <kotlin.version>1.3.41</kotlin.version>
        <kotlin.code.style>official</kotlin.code.style>
        <junit.version>4.12</junit.version>
    </properties>

    <dependencies>
        <!-- JetBrains純正ライブラリ -->
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-stdlib-jdk8</artifactId>
            <version>${kotlin.version}</version>
        </dependency>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-test-junit</artifactId>
            <version>${kotlin.version}</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>${junit.version}</version>
            <scope>test</scope>
        </dependency>

        <!-- 使用するSpigot -->
        <dependency>
            <groupId>org.spigotmc</groupId>
            <artifactId>spigot-api</artifactId>
            <version>1.14.1-R0.1-SNAPSHOT</version>
            <scope>system</scope>
            <systemPath>${project.basedir}/lib/spigot-1.14.1.jar</systemPath>
        </dependency>
    </dependencies>

    <build>
        <sourceDirectory>src/main/kotlin</sourceDirectory>
        <testSourceDirectory>src/test/kotlin</testSourceDirectory>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                    <compilerArgument>-parameters</compilerArgument>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-shade-plugin</artifactId>
                <version>2.4.3</version>
                <executions>
                    <execution>
                        <phase>package</phase>
                        <goals>
                            <goal>shade</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
            <plugin>
                <groupId>org.jetbrains.kotlin</groupId>
                <artifactId>kotlin-maven-plugin</artifactId>
                <version>${kotlin.version}</version>
                <executions>
                    <execution>
                        <id>compile</id>
                        <phase>compile</phase>
                        <goals>
                            <goal>compile</goal>
                        </goals>
                    </execution>
                    <execution>
                        <id>test-compile</id>
                        <phase>test-compile</phase>
                        <goals>
                            <goal>test-compile</goal>
                        </goals>
                    </execution>
                </executions>
                <configuration>
                    <jvmTarget>1.8</jvmTarget>
                </configuration>
            </plugin>
        </plugins>
        <resources>
            <resource>
                <directory>src/main/resources</directory>
                <filtering>true</filtering>
                <includes>
                    <include>plugin.yml</include>
                </includes>
            </resource>
            <resource>
                <directory>src/main/resources</directory>
                <filtering>false</filtering>
                <excludes>
                    <exclude>plugin.yml</exclude>
                </excludes>
            </resource>
        </resources>
    </build>
</project>
```

</div></details>

##3. クラスを書いていこう

<details><summary>plugin.yml</summary><div>

```yaml
name: SidebarTutorialPlugin
main: me.trollcoding.sidebartutorial.TutorialPlugin
version: 1.0
```

</div></details>

##メインクラス
<details><summary>TutorialPlugin.kt</summary><div>

```kotlin
package me.trollcoding.sidebartutorial

import me.trollcoding.sidebartutorial.sidebar.BoardManager
import me.trollcoding.sidebartutorial.sidebar.impl.TutorialBoardAdapter
import me.trollcoding.sidebartutorial.sidebar.listener.SidebarListener
import org.bukkit.Bukkit
import org.bukkit.plugin.java.JavaPlugin

class TutorialPlugin : JavaPlugin() {

    companion object {
        lateinit var instance: TutorialPlugin
    }

    var boardManager: BoardManager? = null

    override fun onEnable() {
        instance = this
        setupBoardManager(BoardManager(this, TutorialBoardAdapter()))
        Bukkit.getPluginManager().registerEvents(SidebarListener(this), this)
    }

    override fun onDisable() {

    }

    /**
     * BoardManager設定
     */
    fun setupBoardManager(manager: BoardManager) {
        this.boardManager = manager

        this.server.scheduler.runTaskTimer(
            this,
            manager,
            manager.adapter.interval,
            manager.adapter.interval
        )
    }
}
```

</div></details>

##要となるクラス

<details><summary>Board.kt</summary><div>

```kotlin
package me.trollcoding.sidebartutorial.sidebar

import org.bukkit.ChatColor
import org.bukkit.entity.Player
import org.bukkit.plugin.java.JavaPlugin
import org.bukkit.scoreboard.DisplaySlot
import org.bukkit.scoreboard.Objective
import org.bukkit.scoreboard.Scoreboard

import java.util.ArrayList
import java.util.HashSet

class Board(
    plugin: JavaPlugin,
    val player: Player,
    val adapter: BoardAdapter
) {

    val entries: MutableList<BoardEntry> = ArrayList()
    val timers = HashSet<BoardTimer>()
    val keys = HashSet<String>()
    var scoreboard: Scoreboard? = null
    var objective: Objective? = null

    val boardEntriesFormatted: List<String>
        get() {
            val toReturn = ArrayList<String>()

            for (entry in ArrayList(entries)) {
                toReturn.add(entry.text)
            }

            return toReturn
        }

    init {

        this.init(plugin)
    }

    private fun init(plugin: JavaPlugin) {
        if (this.player.scoreboard != plugin.server.scoreboardManager!!.mainScoreboard) {
            this.scoreboard = this.player.scoreboard
        } else {
            this.scoreboard = plugin.server.scoreboardManager!!.newScoreboard
        }

        this.objective = this.scoreboard!!.registerNewObjective("Default", "dummy")

        this.objective!!.displaySlot = DisplaySlot.SIDEBAR
        this.objective!!.displayName = this.adapter.getTitle(player)
    }

    fun getNewKey(entry: BoardEntry): String {
        for (color in ChatColor.values()) {
            var colorText = color.toString() + "" + ChatColor.WHITE

            if (entry.text.length > 16) {
                val sub = entry.text.substring(0, 16)
                colorText += ChatColor.getLastColors(sub)
            }

            if (!keys.contains(colorText)) {
                keys.add(colorText)
                return colorText
            }
        }

        throw IndexOutOfBoundsException("IndexOutOfBoundsException")
    }

    fun getByPosition(position: Int): BoardEntry? {
        for (i in this.entries.indices) {
            if (i == position) {
                return this.entries[i]
            }
        }

        return null
    }

    fun getCooldown(id: String): BoardTimer? {
        for (cooldown in getTimers()) {
            if (cooldown.id == id) {
                return cooldown
            }
        }

        return null
    }

    fun getTimers(): MutableSet<BoardTimer> {
        this.timers.removeIf { cooldown -> System.currentTimeMillis() >= cooldown.end }
        return this.timers
    }

}
```

</div></details>

##表示する要素(エントリ)用クラス

<details><summary>BoardEntry.kt</summary><div>

```kotlin
package me.trollcoding.sidebartutorial.sidebar
import org.bukkit.ChatColor
import org.bukkit.scoreboard.Team

class BoardEntry(
    val board: Board,
    var text: String
) {

    var team: Team? = null
    val key: String = board.getNewKey(this)

    init {
        this.setup()
    }

    fun setup(): BoardEntry {
        val scoreboard = this.board.scoreboard

        var teamName = this.key
        if (teamName.length > 16) {
            teamName = teamName.substring(0, 16)
        }

        if (scoreboard!!.getTeam(teamName) != null) {
            this.team = scoreboard.getTeam(teamName)
        } else {
            this.team = scoreboard.registerNewTeam(teamName)
        }

        if (!this.team!!.entries.contains(this.key)) {
            this.team!!.addEntry(this.key)
        }

        if (!this.board.entries.contains(this)) {
            this.board.entries.add(this)
        }

        return this
    }

    fun send(position: Int): BoardEntry {
        val objective = board.objective

        if (this.text.length > 16) {
            this.team!!.prefix = this.text.substring(0, 16)

            val addOne = this.team!!.prefix.endsWith(ChatColor.COLOR_CHAR + "")

            if (addOne) {
                this.team!!.prefix = this.text.substring(0, 15)
            }

            var suffix = ChatColor.getLastColors(this.team!!.prefix) + this.text.substring(
                if (addOne) 15 else 16,
                this.text.length
            )

            if (suffix.length > 16) {
                if (suffix.length - 2 <= 16) {
                    suffix = this.text.substring(if (addOne) 15 else 16, this.text.length)
                    this.team!!.suffix = suffix.substring(0, suffix.length)
                } else {
                    this.team!!.suffix = suffix.substring(0, 16)
                }

            } else {
                this.team!!.suffix = suffix
            }
        } else {
            this.team!!.suffix = ""
            this.team!!.prefix = this.text
        }

        val score = objective!!.getScore(this.key)
        score.score = position

        return this
    }

    fun remove() {
        this.board.keys.remove(this.key)
        this.board.scoreboard!!.resetScores(this.key)
    }

    fun setText(text: String) : BoardEntry{
        this.text = text
        return this
    }
}
```

</div></details>

##管理クラス

<details><summary>BoardManager.kt</summary><div>

```kotlin
package me.trollcoding.sidebartutorial.sidebar

import org.bukkit.Bukkit
import org.bukkit.plugin.java.JavaPlugin
import org.bukkit.scoreboard.DisplaySlot

import java.util.*
import java.util.function.Consumer

class BoardManager(
    val plugin: JavaPlugin,
    val adapter: BoardAdapter
) : Runnable {

    val playerBoards: MutableMap<UUID, Board> = HashMap()

    override fun run() {
        this.adapter.preLoop()

        for (player in Bukkit.getOnlinePlayers()) {
            val board = this.playerBoards[player.uniqueId] ?: continue

            try {
                val scoreboard = board.scoreboard
                val scores = this.adapter.getScoreboard(player, board)

                if(scores != null){
                    Collections.reverse(scores)

                    val objective = board.objective

                    if (objective!!.displayName != this.adapter.getTitle(player)) {
                        objective.displayName = this.adapter.getTitle(player)
                    }

                    if (scores.isEmpty()) {
                        val iter = board.entries.iterator()
                        while (iter.hasNext()) {
                            val boardEntry = iter.next()
                            boardEntry.remove()
                            iter.remove()
                        }
                        continue
                    }

                    forILoop@ for (i in scores.indices) {
                        val text = scores[i]
                        val position = i + 1

                        for (boardEntry in LinkedList(board.entries)) {
                            val score = objective.getScore(boardEntry.key)

                            if (score != null && boardEntry.text == text) {
                                if (score.score == position) {
                                    continue@forILoop
                                }
                            }
                        }

                        var iter: MutableIterator<BoardEntry> = board.entries.iterator()
                        while (iter.hasNext()) {
                            val boardEntry = iter.next()
                            val entryPosition = scoreboard!!.getObjective(DisplaySlot.SIDEBAR)!!.getScore(
                                boardEntry.key
                            ).score
                            if (entryPosition > scores.size) {
                                boardEntry.remove()
                                iter.remove()
                            }
                        }

                        val positionToSearch = position - 1

                        val entry = board.getByPosition(positionToSearch)
                        entry?.setText(text)?.setup()?.send(position) ?: BoardEntry(board, text).send(position)

                        if (board.entries.size > scores.size) {
                            iter = board.entries.iterator()
                            while (iter.hasNext()) {
                                val boardEntry = iter.next()
                                if (!scores.contains(boardEntry.text) || Collections.frequency(
                                        board
                                            .boardEntriesFormatted, boardEntry.text
                                    ) > 1
                                ) {
                                    boardEntry.remove()
                                    iter.remove()
                                }
                            }
                        }
                    }
                } else {
                    if (!board.entries.isEmpty()) {
                        board.entries.forEach(Consumer<BoardEntry> { it.remove() })
                        board.entries.clear()
                    }
                }

                this.adapter.onScoreboardCreate(player, scoreboard!!)

                player.scoreboard = scoreboard
            } catch (e: Exception) {
                e.printStackTrace()

                plugin.logger.severe(
                    "更新失敗: (" + player.name + " - " +
                            "" + board + " - " + board.adapter + ")"
                )
            }

        }
    }

}
```

</div></details>

##実装するときに接続するインターフェース

<details><summary>BoardAdapter.kt</summary><div>

```kotlin
package me.trollcoding.sidebartutorial.sidebar

import org.bukkit.entity.Player
import org.bukkit.scoreboard.Scoreboard

/**
 * 実装用アダプタクラス
 */
interface BoardAdapter {

    /**
     * 更新頻度をLongで返す
     */
    val interval: Long

    /**
     * タイトル
     */
    fun getTitle(player: Player): String

    /**
     * 要素
     */
    fun getScoreboard(player: Player, board: Board): List<String>?

    /**
     * 生成したときに行う処理
     */
    fun onScoreboardCreate(player: Player, board: Scoreboard)

    /**
     * 更新前に行う処理
     */
    fun preLoop()

}
```

</div></details>

##タイマークラス(今回は使わない)

<details><summary>BoardTimer.kt</summary><div>

```kotlin
package me.trollcoding.sidebartutorial.sidebar

import org.apache.commons.lang.time.DurationFormatUtils

import java.text.DecimalFormat

class BoardTimer(val board: Board, val id: String, duration: Double) {

    val end: Long = (System.currentTimeMillis() + duration * 1000).toLong()

    init {
        board.getTimers().add(this)
    }

    fun getFormattedString(format: TimerType): String {
        return if (format == TimerType.SECONDS) {
            SECONDS_FORMATTER.format(((this.end - System.currentTimeMillis()) / 1000.0f).toDouble())
        } else {
            DurationFormatUtils.formatDuration(this.end - System.currentTimeMillis(), "mm:ss")
        }
    }

    fun cancel() {
        this.board.getTimers().remove(this)
    }

    enum class TimerType {
        SECONDS,
        MINUTES,
        HOURS
    }

    companion object {

        private val SECONDS_FORMATTER = DecimalFormat("#0.0")
    }

}
```

</div></details>

##リスナーを実装する
<details><summary>SidebarListener.kt</summary><div>

```kotlin
package me.trollcoding.sidebartutorial.sidebar.listener

import me.trollcoding.sidebartutorial.TutorialPlugin
import me.trollcoding.sidebartutorial.sidebar.Board
import org.bukkit.event.EventHandler
import org.bukkit.event.EventPriority
import org.bukkit.event.Listener
import org.bukkit.event.player.PlayerJoinEvent
import org.bukkit.event.player.PlayerQuitEvent

class SidebarListener(val instance: TutorialPlugin) : Listener {

    @EventHandler(priority = EventPriority.HIGHEST)
    fun onJoin(event: PlayerJoinEvent) {
        event.apply {
            val boardManager = instance.boardManager
            if (boardManager != null) {
                boardManager.playerBoards[player.uniqueId] = Board(instance, player, boardManager.adapter)
            }
        }
    }

    @EventHandler(priority = EventPriority.HIGHEST)
    fun onQuit(event: PlayerQuitEvent) {
        event.apply {
            val boardManager = instance.boardManager
            if (boardManager != null) {
                if (boardManager.playerBoards[player.uniqueId] != null) {
                    boardManager.playerBoards.remove(player.uniqueId)
                }
            }
        }
    }
}
```

</div></details>

##実装してみる
<details><summary>TutorialBoardAdapter.kt</summary><div>

```kotlin
package me.trollcoding.sidebartutorial.sidebar.impl

import me.trollcoding.sidebartutorial.sidebar.Board
import me.trollcoding.sidebartutorial.sidebar.BoardAdapter
import org.bukkit.ChatColor
import org.bukkit.entity.Player
import org.bukkit.scoreboard.Scoreboard
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.*

/**
 * 実装クラス
 */
class TutorialBoardAdapter : BoardAdapter {

    val SCOREBAORD_SEPARATOR = ChatColor.GRAY.toString() + ChatColor.STRIKETHROUGH.toString() + "----------------------"

    override val interval: Long
        get() = 2L

    override fun getScoreboard(player: Player, board: Board): List<String> {
        val entries = ArrayList<String>()

        entries.add(0,SCOREBAORD_SEPARATOR)

        entries.add("")
        entries.add(ChatColor.RESET.toString() + "Name: " + ChatColor.YELLOW.toString() + player.name)
        entries.add(ChatColor.RESET.toString() + "Current: " + ChatColor.YELLOW.toString() + LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss")))
        entries.add("")
        entries.add(SCOREBAORD_SEPARATOR)

        return entries
    }

    override fun getTitle(player: Player): String {
        return ChatColor.YELLOW.toString() + ChatColor.BOLD.toString() + "Tutorial"
    }

    override fun onScoreboardCreate(player: Player, board: Scoreboard) {

    }

    override fun preLoop() {

    }
}
```

</div></details>

##4. デバッグしてみる
こんな感じで動きます
![](Debug.gif)


##おわり
超簡単に実装できます。ぜひ活用してみてください。
