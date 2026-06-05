# AGENTS.md

## ゴール

**こすったら見えるデジタルクロック**（常に **JST**、**1 秒更新**）

- 未こすり: **グレー**（`0xc0c0c0`）
- こすり後: `imagedata.pixels` の時計色（赤／黒）を表示
- 秒更新: `clockColor` だけ差し替え。`scratched` とハイライト用 `remain_time` は維持

## 技術スタック

Node.js, Express 5, Socket.IO 4, PIXI.js 8（バンドルなし）

## 開発

```bash
npm install && npm start && npm test
```

- ポート: `3001`（`PORT`）
- 時刻: `server/generate-image.js` の `formatClockText`（`Asia/Tokyo`）
- デバッグこすり: `DEBUG_AUTO_SCRATCH_DEFAULT = true`、`?debug=0` で無効

## Socket.IO

| イベント | 内容 |
|----------|------|
| `imagedata` | `{ text, pixels }` 毎秒ブロードキャスト |
| `pos` | `{ x, y }` こすり位置のブロードキャスト |

## Git

- ベース: `master`
- ブランチ: `cursor/<name>-2d33`
- 作業者: **Murakami**

詳細タスク: [TODO.md](./TODO.md)
