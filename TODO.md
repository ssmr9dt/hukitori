# TODO

hukitori の作業メモ。

## ゴール

**こすったら見えるデジタルクロック**（JST・1 秒更新・グレー露出）

---

## デジタルクロック（コア）

- [x] PR #2 時刻表示（`HH:MM:SS`・64px・1 秒 `imagedata`）を master にマージ
- [x] PR #3 こすり拡張・蛇行デバッグ・ドキュメントを master にマージ
- [x] グレー未こすり / こすったマスのみ時計表示（モデル B）
- [x] 秒更新は裏側の `clockColor` のみ更新（`scratched` と `remain_time` 維持）
- [x] タイムゾーン **JST 固定**（`Asia/Tokyo`）

## こすり・同期

- [x] `pos` ハイライト範囲拡張
- [x] デバッグ自動こすり（蛇行・`debugAutoScratch` デフォルト true）
- [ ] 複数クライアントでの露出同期の手動確認（要ブラウザ）

## クライアント UX

- [x] タッチ操作（`pointerdown` / `pointermove`）
- [x] ローディング UI
- [x] `DEBUG_AUTO_SCRATCH_DEFAULT = true`（本番方針どおり）

## サーバー・インフラ

- [x] listen ログとポート 3001 の一致（PR #2）
- [x] 環境変数ドキュメント（README）
- [x] `image.json` 再生成手順（README）

## 品質・メンテナンス

- [x] `generate-image.js` 最小テスト（`npm test`）
- [x] 未使用ファイル削除（`design.html`, `_index.html`, `cover.css`）
- [x] 未使用依存削除（`bootstrap`, `angular2-twitter-bootstrap`）
- [ ] ESLint / Prettier（要否のみ未決 → 現状は見送り可）

## ドキュメント

- [x] ゴール改定（AGENTS.md / TODO.md）
- [x] README（デジタルクロック・JST・Socket 一覧・mermaid）
- [x] 「答える」削除

---

完了した項目は `- [x]`。手動確認のみ `[ ]` を残す。
