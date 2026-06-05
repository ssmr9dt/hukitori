# hukitori

**こすったら見えるデジタルクロック** — 隠れた現在時刻を、みんなでこすって表示していくリアルタイム Web アプリです。

1. みんなでコスるのを共有
2. こすった分だけ時計が見える

## 起動

```bash
npm start
# または
node server/index.js
```

時計のピクセル画像は `server/generate-image.js` が生成します（目標表示: `HH:MM:SS`、1 秒更新は PR #2 参照）。

## Reference

### WebSocket
 - http://www.html5rocks.com/ja/tutorials/websockets/basics/
