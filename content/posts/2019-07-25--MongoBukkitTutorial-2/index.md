---
title: MongoDBを使ったKotlin製プラグイン開発 ②
category: "Dev"
tags: ["Bukkit", "Spigot", "Kotlin", "Mongo", "Minecraft"]
author: TrollCoding
---

前回に引き続き「MongoDBを使ったKotlin製プラグイン開発」です

[MongoDBを使ったKotlin製プラグイン開発 ①](https://trollcoding.me/MongoBukkitTutorial-1/) の続きです

##開発環境
* Language: Kotlin
* Editor: JetBrains Intellij IDEA (Ultimate)
* JDK: 1.8.0_201
* Framework: Maven
* Spigot: 1.14.1-R0.1-SNAPSHOT
* OS: Windows 10 (64bit)
* MongoDB: 4.0

##今回の目的
* プラグインからMongoDBに接続する

##1. パッケージ構成

    MongoTutorialPlugin 
    │  pom.xml
    │
    │
    ├─lib
    │      spigot-1.14.1.jar
    │
    └─src
       ├─main
       │  ├─kotlin
       │  │  └─me
       │  │      └─trollcoding
       │  │          └─mongotutorial
       │  │              │  TutorialPlugin.kt
       │  │              │
       │  │              └─mongo
       │  │                      MongoSecret.kt
       │  │                      TutorialMongo.kt
       │  │
       │  └─resources
       │          plugin.yml
       │
       └─test
           └─kotlin
               └─me
                   └─trollcoding
                       └─mongotutorial

##2. 依存関係 (Maven)

<details><summary>pom.xml</summary><div>

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">

    <modelVersion>4.0.0</modelVersion>

    <groupId>me.trollcoding.mongotutorial</groupId>
    <artifactId>MongoTutorialPlugin</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>jar</packaging>

    <name>me.trollcoding.mongotutorial MongoTutorialPlugin</name>

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

        <!-- 追加ライブラリ -->

        <!-- MongoDB接続用ドライバ -->
        <dependency>
            <groupId>org.mongodb</groupId>
            <artifactId>mongo-java-driver</artifactId>
            <version>3.8.2</version>
            <scope>compile</scope>
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

##3. 基本的なクラスを書こう

<details><summary>plugin.yml</summary><div>

```yaml
name: MongoTutorialPlugin
main: me.trollcoding.mongotutorial.TutorialPlugin
version: 1.0
```

</div></details>

##メインクラス

<details><summary>TutorialPlugin.kt</summary><div>

```kotlin
package me.trollcoding.mongotutorial

import me.trollcoding.mongotutorial.mongo.MongoSecret
import me.trollcoding.mongotutorial.mongo.TutorialMongo
import org.bukkit.plugin.java.JavaPlugin

class TutorialPlugin : JavaPlugin() {

    companion object {
        //インスタンス宣言
        lateinit var instance: TutorialPlugin
    }

    //接続用オブジェクト
    lateinit var mongo: TutorialMongo

    override fun onEnable() {
        instance = this

        //接続
        mongo = TutorialMongo(
            MongoSecret.HOST,
            MongoSecret.PORT,
            MongoSecret.DATABASE_NAME,
            MongoSecret.USERNAME,
            MongoSecret.PASSWORD
        )
    }

    override fun onDisable() {
        //接続終了
        mongo.client.close()
    }
}
```

</div></details>


##MongoDB接続用クラス

<details><summary>TutorialMongo.kt</summary><div>

```kotlin
package me.trollcoding.mongotutorial.mongo

import com.mongodb.MongoClient
import com.mongodb.MongoClientOptions
import com.mongodb.MongoCredential
import com.mongodb.ServerAddress
import com.mongodb.client.MongoCollection
import com.mongodb.client.MongoDatabase
import me.trollcoding.mongotutorial.TutorialPlugin
import org.bson.Document

/**
 * @param host 接続先IP
 * @param port 接続先ポート
 * @param dbName データベース
 * @param username 認証用ユーザー名
 * @param password 認証用パスワード
 */
class TutorialMongo(val host: String,
                    val port: Int,
                    val dbName: String,
                    val username: String?,
                    val password: String?) {
    /**
     * クライアント
     */
    lateinit var client: MongoClient

    /**
     * データベース
     */
    lateinit var database: MongoDatabase

    /**
     * プレイヤーデータ用ドキュメント
     */
    lateinit var profiles: MongoCollection<Document>

    /**
     * オブジェクト生成されたときにデータベース接続
     */
    init {
        open()
    }

    /**
     * 接続処理
     */
    private fun open() {
        //認証接続有効の場合
        if (username != null && username.isNotEmpty()
                   && password != null && password.isNotEmpty()) {
            val serverAddress = ServerAddress(host, port)

            val credential = MongoCredential.createCredential(
                username, "admin", password.toCharArray()
            )

              database = MongoClient(
                           serverAddress, credential,
                           MongoClientOptions.builder().build()
                       ).getDatabase(dbName)
            

            TutorialPlugin.instance.logger.info("認証接続完了")

        } else {

            //データベース取得
            database = MongoClient(
                host,
                port
            ).getDatabase(dbName)

            TutorialPlugin.instance.logger.info("非認証接続完了")
        }

        //プレイヤーデータ用ドキュメント取得
        this.profiles = this.database.getCollection("profiles")
    }

    /**
     * Collectionを取得
     */
    fun getCollection(collectionName: String) : MongoCollection<Document> {
        return database.getCollection(collectionName)
    }

    /**
     * Collectionを取得してDocumentを更新
     */
    fun updateOne(collectionName: String, source: Document, update: Document) {
        getCollection(collectionName).updateOne(source, Document("\$set", update))
    }
}
```
</div></details>

##MongoDBへの接続に必要な情報を保管するクラス
実際に運用する場合はセキュリティに問題があるため接続情報をクラスに書き込むのはダメだけど今回は省略

<details><summary>MongoSecret.kt</summary><div>

```kotlin
package me.trollcoding.mongotutorial.mongo

object MongoSecret {
    val HOST = "127.0.0.1"
    val PORT = 27017
    val DATABASE_NAME = "admin"
    val USERNAME = ""
    val PASSWORD = ""
}
```

</div></details>

##5. デバッグしてみる
こんな感じの表示がでたら完成

```kotlin
[Server thread/INFO]: [MongoTutorialPlugin] Enabling MongoTutorialPlugin v1.0
[Server thread/INFO]: Cluster created with settings {hosts=[127.0.0.1:27017], mode=SINGLE, requiredClusterType=UNKNOWN, serverSelectionTimeout='30000 ms', maxWaitQueueSize=500}
[Server thread/INFO]: [MongoTutorialPlugin] 非認証接続完了
[Server thread/INFO]: Server permissions file permissions.yml is empty, ignoring it
[cluster-ClusterId{value='5d3841256c64bd3aa4367414', description='null'}-127.0.0.1:27017/INFO]: Opened connection [connectionId{localValue:1, serverValue:196}] to 127.0.0.1:27017
[cluster-ClusterId{value='5d3841256c64bd3aa4367414', description='null'}-127.0.0.1:27017/INFO]: Monitor thread successfully connected to server with description ServerDescription{address=127.0.0.1:27017, type=STANDALONE, state=CONNECTED, ok=true, version=ServerVersion{versionList=[4, 0, 10]}, minWireVersion=0, maxWireVersion=7, maxDocumentSize=16777216, logicalSessionTimeoutMinutes=30, roundTripTimeNanos=3318300}
[Server thread/INFO]: Done (11.091s)! For help, type "help"
pl
[Server thread/INFO]: Plugins (1): MongoTutorialPlugin
```

##今回はここまで
次回から応用編やっていきます。 ご不明な点がございましたらコメントでお聞きください。
