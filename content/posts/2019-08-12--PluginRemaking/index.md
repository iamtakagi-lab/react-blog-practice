---
title: また最近BukkitPluginの開発を再開した件について
category: "雑記"
tags: ["Bukkit", "Spigot", "Kotlin", "Java", "Minecraft"]
author: TrollCoding
---

##どんなことをしているの？
再開までとはいかないけど、「以前運営していたPvPサーバーで開発していたプラグインを、Kotlinで書き直してみたり、
リメイクしたり」 みたいな感じのことをしているよ。

要するに、プラグインが完成する可能性は100％だけど、サーバーを公開はしないかもしれない って感じなので、ただの自己満足で開発を進めているよ。

##ここ2日間でリメイクしたり、新しく作った物とか (成果)
* [SpicaCore](https://github.com/TrollCoding/SpicaCore)\
これは中核プラグインのリメイクで、前のより少し便利な新機能をいくつか実装してみた\
他のプラグインを開発するときに使うライブラリの役目も果たしている\
このプラグインを中心に他のプラグインを設計したり、開発をしているよ。

* [SpicaHub](https://github.com/TrollCoding/SpicaHub)\
これはHubプラグインで、以前開発していたコードを綺麗にする感じでリメイクしてみた

* [SpicaKitPvP](https://github.com/TrollCoding/SpicaKitPvP)\
これは今回新しく作ったもの。新しいKitを実装したり値段を決めたりして、アンロック方式に設定できる。\
実用化するとしたら、やりこみ要素としては我ながら十分な出来栄えだと思っている。\
書き始めから11時間くらいで完成しました。

##これからリメイクしたり、新しく作ったりする物とか (課題)
* **SpicaSG** (リメイク)\
HotsSG(2018/12月) → RouteSG(2019/4月)とリメイクしてきたので今回が2回目のリメイク

* **SpicaPractice** (リメイク)\
最近はフロントエンドとの連携に興味がわいてきたので、Web連携を上手くやりながら開発してみたい

* **SpicaTeamPvP** (新作)\
とりあえず思い付きで作ってみるよ

##開発ペース
今のところ早くも遅くもないって感じです。
アイデアの限り質のいいものが作れるように、マイペースにやっていきたいと思います。

##最後に
GitHubのやつを緑色に埋めてみたいので、進捗はGitHubに載せていくことにしました。


