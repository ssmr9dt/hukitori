# AGENTS.md

このリポジトリで作業する AI エージェント（Cursor Cloud Agent など）向けのガイドです。

## ゴール

**こすったら見えるデジタルクロック** をつくる。

- 画面上には最初、**現在時刻**（デジタル表示）が隠れている
- ユーザーがマスをこすると、その部分の時刻が **見えていく**
- 複数人で同時にこすると、**こすった軌跡が共有**される（リアルタイム）
- 時刻は **1 秒ごと**に更新され、見えている部分も新しい時刻に追従する

## プロジェクト概要

**hukitori** は、上記ゴールを実現するためのリアルタイム Web アプリです。

1. みんなでコスるのを共有する
2. こすった分だけ時計の表示が見える

旧来の「4 桁を当てる」「答える」フローは **対象外**（実装・ドキュメントに戻さない）。

## 現状とギャップ（目安）

| 領域 | 状態 |
|------|------|
| こすり・ハイライト・`pos` 同期 | 一部実装済み（周辺 9 マスハイライト、蛇行デバッグこすりなど） |
| 時刻のピクセル描画・1 秒更新 | `cursor/time-display-hhmmss-2d33`（PR #2）で実装済み。**master 未マージ** |
| マージ後のゴール到達 | master に時刻表示 PR を取り込み、こすり＋時刻更新の結合を確認 |

詳細タスクは [TODO.md](./TODO.md) を参照。

## 技術スタック

| 領域 | 技術 |
|------|------|
| サーバー | Node.js, Express 5, Socket.IO 4 |
| クライアント | 素の HTML + PIXI.js 8（ビルドツールなし） |
| クロック画像 | `server/generate-image.js`（`HH:MM:SS` 形式、秒更新） |
| フォント | `server/gdfont-large.js`（0–9 と `:`） |

## ディレクトリ構成

```
/
├── index.html          # メイン UI（PIXI + Socket.IO）
├── server/
│   ├── index.js        # HTTP + WebSocket、imagedata 配信
│   ├── generate-image.js
│   ├── gdfont-large.js
│   └── image.json
└── README.md
```

## 開発コマンド

```bash
npm install
npm start
```

- デフォルトポート: **3001**（`process.env.PORT` で変更可）
- Socket.IO: `imagedata`（時刻ピクセル）、`pos`（こすり位置）

## 作業時の原則

1. **ゴール優先** — 変更が「こすって見えるクロック」に寄与するか確認する。
2. **スコープを最小に** — 依頼と無関係なリファクタや依存追加は避ける。
3. **既存スタイルに合わせる** — CommonJS、インライン `<script>`、バンドルなし。
4. **時刻の正** — 表示文字列・ピクセルは `generate-image.js`、配信はサーバー。
5. **こすり状態** — 秒更新でハイライトが消えないよう、差分更新を維持する。

## よく触るファイル

| 変更内容 | 主なファイル |
|----------|----------------|
| 時刻生成・PNG | `server/generate-image.js` |
| 1 秒ごとの配信 | `server/index.js` |
| こすり・表示・フェード | `index.html` |
| 字形 | `server/gdfont-large.js` |

## 既知の注意点

- `debugAutoScratch`（`?debug=0`）は開発用の自動こすり（蛇行スキャン）。本番ではオフ想定。
- タイムゾーンはサーバー `Date` のローカル時刻（JST 固定は `TZ` 等で運用側が指定）。
- `design.html` / `_index.html` はレガシー。削除は TODO と相談。

## Git・PR

- ベースブランチ: `master`
- 機能ブランチ: `cursor/<説明的な名前>-2d33`
- 作業者名: **Murakami**

## 参考

- [TODO.md](./TODO.md)
- [README.md](./README.md)
