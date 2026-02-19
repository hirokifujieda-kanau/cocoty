# Vercel 環境変数設定ガイド

## 🚀 デプロイ前の必須設定

Vercelダッシュボードで以下の環境変数を設定してください。

### 📍 設定場所
1. Vercelダッシュボードにログイン
2. プロジェクトを選択
3. **Settings** → **Environment Variables** を開く

---

## 🔑 必須環境変数

### Firebase Configuration
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDwspTUsWohl7rAN8KHpplZE4cNKTN9PJY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=cocoty-auth.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=cocoty-auth
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=cocoty-auth.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=619911394014
NEXT_PUBLIC_FIREBASE_APP_ID=1:619911394014:web:91db2ff19c38912b42884f
```

### Cloudinary Configuration
```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dq9cfrfvc
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=ml_default
```

### Rails API Configuration（本番環境）
```bash
NEXT_PUBLIC_API_URL=https://cocoty-api-production.up.railway.app/api/v1
```

### Admin Basic Authentication（本番環境用）
```bash
NEXT_PUBLIC_ADMIN_USERNAME=cocoty_admin
NEXT_PUBLIC_ADMIN_PASSWORD=sWkrMjuQ0X5C1wNFC4e6Vw==
```

---

## 📌 環境別の設定

### Production（本番環境）
- `NEXT_PUBLIC_API_URL`: `https://cocoty-api-production.up.railway.app/api/v1`
- `NEXT_PUBLIC_ADMIN_USERNAME`: `cocoty_admin`
- `NEXT_PUBLIC_ADMIN_PASSWORD`: `sWkrMjuQ0X5C1wNFC4e6Vw==`

### Preview（プレビュー環境）
- 本番環境と同じ設定を使用

### Development（ローカル開発）
- `NEXT_PUBLIC_API_URL`: `http://localhost:5000/api/v1`
- `NEXT_PUBLIC_ADMIN_USERNAME`: `admin`
- `NEXT_PUBLIC_ADMIN_PASSWORD`: `changeme`

---

## ✅ 設定確認方法

1. Vercelでデプロイ後、ブラウザの開発者ツールを開く
2. `Console`タブで以下を実行：
   ```javascript
   console.log(process.env.NEXT_PUBLIC_API_URL);
   console.log(process.env.NEXT_PUBLIC_ADMIN_USERNAME);
   ```
3. 正しい値が表示されることを確認

---

## 🔒 セキュリティ注意事項

- ⚠️ `.env.local`ファイルは**絶対にGitにコミットしない**
- ⚠️ `NEXT_PUBLIC_`プレフィックスの変数は**ブラウザに公開される**
- ⚠️ 機密情報（APIキー、パスワードなど）は慎重に管理

---

## 📝 更新履歴

- 2026-02-13: Basic認証追加（RPG診断API用）
