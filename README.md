# Sound Direction

![IMAGE ALT TEXT HERE](sumnail.png)
プロダクト：https://ch-directions.web.app/
デモ動画：https://77.gigafile.nu/0130-e7eed8f861b652735ff436f8160dcef12

## 製品概要
立体音響技術を用いて目的地から音が流れているように感じさせることによる、新しい道案内。  

### 背景(製品開発のきっかけ、課題等）
我々のチームが住む北海道の冬は過酷である。  
元々本州に住んでいた私だから言える、本当に過酷である。  
試しに例を挙げてみると、昨年2月の平均気温は-2.2度。最低気温は-5.6度だ。  
そんな中、マップを確認するために手袋を外すなどあり得ない。  
もしもそんなことをした日には指先から伝わる冷気が全身を巡り、心臓まで凍り付かせてしまう。  
もはや自殺行為と言ってもいい。  
この悩みを解決するために、Sound Directionが提案された。  
手を使わずに目的地を知る方法として我々が考えたのが、立体音響を用いた道案内であったのだ。

### 製品説明（具体的な製品の説明）
目的地が設定されれば、現在向いている方角から目的地の方位を割り出して、立体音響技術によってあたかも目的地から音がなっているように音楽を流す。  
これにより、聴覚から目的地を把握することができるため、マップを確認することなく目的地までたどり着くことができる。  
検索窓に目的地を入力すると、GoogleMap apiによる候補地が表示され、行きたい場所を選択することで道案内を開始する。

### 特長
#### 1. 立体音響によって、マップを見ずとも目的地がわかること。
#### 2. GoogleMap apiによる、高度な検索機能
#### 3. 使い方に迷わないシンプルなUI

### 解決出来ること  
- 寒い季節に手を出さなくて済む。
- (夏場でも)毎回立ち止まってスマホを開き、マップを確認するという手間を省略することができる。
- 歩きスマホの危険防止。

### 今後の展望  
- フレンド機能を追加することによって、目的地を「ユーザー」にも設定できるようにすること。  
- フレンド機能追加のための、ログイン機能。  
- 音源を自由に選べる(せめてバラエティを増やす)ようにするor現在流れている音楽を立体音響にする機能。
- webappでは操作性・利便性に限界があるため、それを向上させるためのネイティブアプリ化。

### 注力したこと（こだわり等）
- 音を継続的に流す以上、一つの処理が継続することになりお互いに干渉、つまりバグが発生しやすくなる。音にバグが発生すると、ユーザーが非常に不快に感じることが予想されるため、デバックを丁寧に行った。 


## 開発技術
### 活用した技術
- firehosting
- githubpages(テスト段階のみ)

#### API・データ
- GoogleMap api

#### フレームワーク・ライブラリ・モジュール
- React(TypeScript)
- Material UI  


#### デバイス
- Mac
- Windows
- andoroid
- iPhone

### 独自技術
#### ハッカソンで開発した独自機能・技術
なし

#### 製品に取り入れた研究内容（データ・ソフトウェアなど）（※アカデミック部門の場合のみ提出必須）
なし