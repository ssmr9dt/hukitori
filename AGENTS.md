# AGENTS.md

このリポジトリで作業する AI エージェント（Cursor Cloud Agent など）向けのガイドです。

## プロジェクト概要

**hukitori** は、複数ユーザーが同時に「こする」操作を共有し、隠れた画像が徐々に見えていくリアルタイム Web 体験です。

1. みんなでコスるのを共有
2. こすった分が表示される

（「答える」フロー・正解入力 UI は **廃止**。4 桁当てゲームとしての説明は使わない。）

## 技術スタック

| 領域 | 技術 |
|------|------|
| サーバー | Node.js, Express 5, Socket.IO 4 |
| クライアント | 素の HTML + PIXI.js 8（ビルドツールなし） |
| 画像生成 | `server/generate-image.js`（旧 PHP `index.php` 相当、外部画像ライブラリなし） |
| フォントデータ | `server/gdfont-large.js`（`scripts/extract-gdfont.js` で生成可能） |

## ディレクトリ構成

```
/
├── index.html          # メインゲーム UI（PIXI + Socket.IO）
├── design.html         # Bootstrap カバーページ（レガシー／未接続）
├── _index.html         # 旧版 HTML（参照用）
├── server/
│   ├── index.js        # HTTP + WebSocket サーバー
│   ├── generate-image.js
│   ├── gdfont-large.js
│   └── image.json      # 生成画像のピクセル／テキストキャッシュ
├── scripts/
│   └── extract-gdfont.js
└── README.md
```

## 開発コマンド

```bash
npm install
npm start
# または
node server/index.js
```

- デフォルトポート: `process.env.PORT` 未設定時は **3001**（`server/index.js`）
- ルート `/` → `index.html`
- `/image.png` → キャプチャ用 PNG
- Socket.IO イベント: `imagedata`, `pos`, `hi`

## 作業時の原則

1. **スコープを最小に** — 依頼と無関係なリファクタや依存追加は避ける。
2. **既存スタイルに合わせる** — CommonJS、`let`/`const` 混在、インライン `<script>` など現状の書き方を維持する。
3. **クライアントはバンドルなし** — `index.html` 内スクリプトと `node_modules` 直配信のみ。Webpack 等は導入しない（明示依頼時を除く）。
4. **画像生成はサーバー側** — ピクセル配列・表示テキストは `generate-image.js` を単一の正とする。
5. **テスト** — `npm test` は未整備。テスト追加は依頼がある場合のみ、意味のある挙動をカバーする。
6. **コメント** — 非自明なビジネスロジック（シード、PHP 互換の色値など）に限定する。

## よく触るファイル

| 変更内容 | 主なファイル |
|----------|----------------|
| 同期・ブロードキャスト | `server/index.js` |
| 問題画像・シード・PNG | `server/generate-image.js`, `server/image.json` |
| 描画・入力・フェード | `index.html` |
| フォントグリフ | `server/gdfont-large.js`, `scripts/extract-gdfont.js` |

## 既知の注意点

- `index.html` の `debugAutoScratch`（`DEBUG_AUTO_SCRATCH_DEFAULT` / `?debug=0`）はデバッグ用の自動こすり（蛇行スキャン）。本番挙動変更時は意図を確認すること。
- `server/index.js` の listen ログメッセージと実際のポート表記が一致していない可能性がある（修正時は README も合わせる）。
- `design.html` / `_index.html` / `angular2-twitter-bootstrap` は現行ゲーム経路から外れている可能性が高い。削除・統合は Issue／TODO と相談してから。

## Git・PR

- ベースブランチ: `master`
- 機能ブランチ: `cursor/<説明的な名前>-2d33` 形式
- コミット後: `git push -u origin <branch>` → PR 作成（ドラフト可）
- 作業者名の参照: **Murakami**（ユーザー指定）

## タスク管理

進行中・未着手の作業はルートの [TODO.md](./TODO.md) に記載する。エージェントは着手前に TODO を確認し、完了した項目は PR 説明またはコミットとあわせて TODO を更新する。

## 参考

- [README.md](./README.md) — 起動手順
- WebSocket 入門（README 記載）: https://www.html5rocks.com/ja/tutorials/websockets/basics/
