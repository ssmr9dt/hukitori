# hukitori

 1. みんなでコスるのを共有
 2. こすった分表示される
 3. 答える！

## 起動

```bash
npm start
# または
node server/index.js
```

キャプチャ画像（時刻表示）の生成は `server/generate-image.js` が担当します（旧 `php/index.php` 相当）。キャンバス幅は 8 文字（`14:30:52`）用に 64px です。

## Reference

### WebSocket
 - http://www.html5rocks.com/ja/tutorials/websockets/basics/