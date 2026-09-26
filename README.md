# シクッター MVP（テスト版・AIなし）

しくったら、シクッター。匿名で失敗談を読んだり投稿したりできるWebアプリです。
URLを送るだけで、友人がスマホからそのまま使えます（登録・ログイン不要）。

- 画面：`public/`（ホーム、投稿、プレビュー、投稿完了、失敗談詳細、運営管理）
- API：`api/`（Vercel のサーバー関数。DBのキーはここだけで使います）
- DB：`supabase/`（Supabase の Postgres。テーブルは外部から直接読めないようにしてあります）

---

## 公開までの手順（30分ほど）

用意するアカウントは3つです。**Supabase**（データベース）、**GitHub**（コード置き場）、**Vercel**（公開）。どれも無料プランの範囲で動きます。

### 1. Supabase でデータベースを作る

1. https://supabase.com で「New project」を作ります。Region は **Northeast Asia (Tokyo)** を選んでください。
2. 左メニュー「SQL Editor」→「New query」を開き、`supabase/schema.sql` の中身を全部貼り付けて「Run」を押します。
3. もう一度「New query」を開き、`supabase/seed.sql` を貼り付けて「Run」を押します（ダミーの失敗談16件が入ります）。
4. 左メニュー「Project Settings」→「API Keys」を開き、次の2つを控えておきます。
   - **Project URL**（`https://xxxx.supabase.co`）
   - **secret key**（`sb_secret_...`）。表示されない場合は「Legacy API keys」タブの **service_role** キーを使います。
   > このキーは絶対に画面側のコードやSNSに貼らないでください。Vercel の環境変数にだけ入れます。

### 2. GitHub にコードを置く

1. https://github.com で新しい **Private** リポジトリを作ります（名前は `shikutter` など）。
2. 「uploading an existing file」から、このフォルダの中身（`api` `public` `supabase` `scripts` `package.json` `vercel.json` `README.md` など）をまとめてドラッグ＆ドロップして「Commit」します。

### 3. Vercel で公開する

1. https://vercel.com に GitHub でログインし、「Add New → Project」で 2 のリポジトリを選びます。
2. Framework Preset は **Other** のままで大丈夫です。
3. 「Environment Variables」に次を入れます。

| 名前 | 値 |
|---|---|
| `SUPABASE_URL` | 1で控えた Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | 1で控えた secret key（または service_role キー） |
| `ADMIN_PASSWORD` | 管理画面のパスワード（8文字以上。自分で決める） |
| `SIGNING_SECRET` | 適当な長い英数字（30文字以上。自分で決める） |
| `IP_SALT` | 適当な長い英数字（30文字以上。上とは別のもの） |

4. 「Deploy」を押します。1分ほどで `https://shikutter-xxxx.vercel.app` のようなURLができます。

### 4. 動作確認

1. URLをスマホで開き、ダミーの失敗談が並んでいることを確認します。
2. 「＋しくった」から自分で1件投稿してみます。
3. `https://（あなたのURL）/admin` を開き、`ADMIN_PASSWORD` でログインします。投稿の原文・編集文・伏せた言葉、KPIが見られます。

ここまで動いたら、URLを友人に送ってください。

---

## 友人に配る前に決めておくこと

- **ダミー投稿をどうするか**：最初は並んでいた方が「見たくなるか（仮説1）」を試しやすいので、残しておくのがおすすめです。本番公開前に、管理画面の「ダミー」タブ →「ダミーを削除…」で消せます。
- **友人への一言**：「失敗したときに開いてみて。自分の失敗も匿名で書けるよ」くらいの頼み方にすると、閲覧→投稿の自然な流れが計測できます。

## 管理画面でわかること

| KPI | 意味 |
|---|---|
| 😌 少しマシになった率 | 「ちょっとマシになった？」で「少しマシになった」を選んだ割合（最重要） |
| 閲覧前の落ち込み平均 | 最初に聞く「今どれくらい落ち込んでる？」（1〜5）の平均と、マシ派／それ以外の比較 |
| 1セッションの閲覧数 | 2.5秒以上表示されたカード＋最後まで読んだ詳細の数 |
| 詳細CTR / 読了率 | 表示された失敗談のうち、詳細を開いた割合／読まれた割合 |
| リアクション率 / 🤝俺もある率 | 表示された失敗談あたりのリアクション数 |
| 閲覧→投稿開始 / 投稿開始→完了 | 投稿ファネル |

生データは Supabase の「Table Editor」で `events`（行動ログ）、`failures`（投稿）、`failure_raw`（原文）、`reactions` として見られます。CSVでも書き出せます。

## 仕様メモ

- リアクションは端末ごとに1種類1回（もう一度押すと取り消し）。同じ回線から1時間300回まで。
- 投稿は同じ回線から1時間5件まで。
- 投稿文は、回答を決まった型（タイトル→状況→起きたこと→心の声→結末→現在）に並べて作ります。AIは使っていないので、文章の言い回しは回答のままです。
- 会社名・「〇〇さん」などの人名・学校名・電話番号・メール・住所・URLは、ルールで自動的に伏せます。ルールで拾えない固有名詞（カタカナの人名、店名など）は残るので、管理画面で確認し、気になる投稿は非公開にしてください。
- 「死にたい」「殺す」などの強い言葉を含む投稿は自動では公開せず、管理画面の「要修正」に入ります。
- 第三者の失敗を晒す投稿かどうかは自動では判定できません。投稿は即時にタイムラインに載るので、友人テスト中はこまめに管理画面の「未確認」を見てください。
- 原文は管理画面でだけ見られます。
- TikTok/カルーセル/X用の文章も、同じ型から自動で作ります。
- 使っていないSupabase無料プロジェクトは1週間で一時停止します。止まったら Supabase の画面で「Restore」を押してください。

## うまくいかないとき

- **トップが404になる**：Vercel の Project Settings → Build and Deployment → Output Directory を `public` にして再デプロイ。
- **タイムラインが「読み込めませんでした」**：`SUPABASE_URL` と `SUPABASE_SERVICE_ROLE_KEY` を確認。Vercel の「Logs」にエラー内容が出ます。
- **環境変数を変えたのに反映されない**：Vercel の Deployments から「Redeploy」を押します。

## 手元で動かす（任意・開発者向け）

```bash
npm i --no-save pg
DATABASE_URL=postgres://... ADMIN_PASSWORD=testpass123 node scripts/dev-server.mjs
# → http://localhost:3000
```
ダミーデータを編集したら `node scripts/make-seed.mjs` で `supabase/seed.sql` を作り直せます。

## あとでAIを戻すには

AIによる文章の整形・匿名化・内容チェックは、`api/_lib.js` の `fallbackEdit()` と `normalizeEdited()` を差し替える形で戻せます（前バージョンのコードに実装があります）。
