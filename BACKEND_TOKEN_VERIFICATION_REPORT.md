# 🔐 Firebase Token 検証エラーレポート

**作成日:** 2025年12月11日  
**状態:** Firebase トークンはフロントエンドで正常に生成・送信されているが、バックエンド側で検証失敗  
**エラーコード:** 401 Unauthorized

---

## ✅ **フロントエンド側の状態（正常）**

### 1. ユーザー認証状態
- **ステータス:** ✅ ログイン済み
- **メール:** `htue0_0125@yahoo.co.jp`
- **Firebase UID:** `fLDNHyG12NbKlDJSBtu5z9YzGGi2`

### 2. トークン取得状態
- **ステータス:** ✅ 正常に取得・保存
- **保存先:** `localStorage.getItem('firebaseIdToken')`
- **トークン長:** 約 1000 文字

### 3. API リクエスト状態
- **ステータス:** ✅ 正しく送信
- **エンドポイント:** `GET http://localhost:5000/api/v1/auth/me`
- **リクエストヘッダー:** `Authorization: Bearer {token}`

---

## ❌ **バックエンド側の状態（エラー）**

### レスポンス
```
Status Code: 401 Unauthorized
Response Body: {"error": "Invalid or expired token"}
```

---

## 📋 **テスト用トークン情報**

以下のテスト用トークンを使用して、バックエンド側でデコード・検証してください：

```
eyJhbGciOiJSUzI1NiIsImtpZCI6Ijk1MTg5MTkxMTA3NjA1NDM0NGUxNWUyNTY0MjViYjQyNWVlYjNhNWMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vY29jb3R5LWF1dGgiLCJhdWQiOiJjb2NvdHktYXV0aCIsImF1dGhfdGltZSI6MTc2NTQyNTAwNywidXNlcl9pZCI6ImZMRE5IeUcxMk5iS2xESlNCdHU1ejlZekdHaTIiLCJzdWIiOiJmTEROSHlHMTJOYktsREpTQnR1NXo5WXpHR2kyIiwiaWF0IjoxNzY1NDI1NDQ0LCJleHAiOjE3NjU0MjkwNDQsImVtYWlsIjoiaHR1ZTBfMDEyNUB5aGFvby5jby5qcCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJodHVlMF8wMTI1QHloYW9vLmNvLmpwIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.C_3y01y5nzj7O8z4TRSMLlflqMYDY_ql8H6EPWayCC076hloZFaMCXWLrwlDESNBKtFv_FIz0iJ1UGhrY-Yaa_kPtTFtiWDePoCwe59KRjil4Q_gNJkftjEoQTMWFhkHv65tOivuta0mbkD83TGANZ7oTUXjXqwnXUVtbxbChgdvnjuyirI4_rBg50D_xG2bk9WOHJ-ksYjqKFdUP6DoKfU_h6HDvi5WzP9JFVbv8WksbrwZgYaXBRbewokkif-7X54HF5dvivFXrz_z9eZLmqGICq-a1SOo32nlwaFKSLoUSKpHWrenxoe6PWlAqZVbn6TqyYdk-__KAH9lAZHpug
```

### トークンペイロード（デコード済み）
```json
{
  "iss": "https://securetoken.google.com/cocoty-auth",
  "aud": "cocoty-auth",
  "auth_time": 1765425007,
  "user_id": "fLDNHyG12NbKlDJSBtu5z9YzGGi2",
  "sub": "fLDNHyG12NbKlDJSBtu5z9YzGGi2",
  "iat": 1765425444,
  "exp": 1765429044,
  "email": "htue0_0125@yahoo.co.jp",
  "email_verified": false,
  "firebase": {
    "identities": {
      "email": [
        "htue0_0125@yahoo.co.jp"
      ]
    },
    "sign_in_provider": "password"
  }
}
```

### トークン有効期限
- **発行時刻（iat）:** 1765425444
- **有効期限（exp）:** 1765429044
- **有効期間:** 約 1 時間（3600秒）
- **有効期限切れ時刻:** 2025-12-11 04:30:44 UTC

---

## 🔍 **バックエンド側で確認すべき項目**

### 1. **Firebase Project ID の確認**
- フロントエンド側の Firebase Project ID: `cocoty-auth`
- バックエンド側で使用している Project ID は同じか確認
- トークンペイロードの `aud` フィールド: `cocoty-auth` と一致しているか確認

### 2. **トークン署名検証**
バックエンド側で以下の手順でトークン検証を実施してください：

**Ruby (Rails) の例:**
```ruby
require 'google/auth/client_id'
require 'google/auth/jwt'

# リクエストから Bearer トークンを抽出
auth_header = request.headers['Authorization']
token = auth_header&.split(' ')&.last

# トークンをデコード（署名検証も含む）
begin
  payload = Google::Auth::JWT.decode_jwt_token(
    token,
    audience: 'cocoty-auth'  # Firebase Project ID
  )
  
  # Firebase UID をデータベースから検索
  user_id = payload['sub']  # fLDNHyG12NbKlDJSBtu5z9YzGGi2
  user = User.find_by(firebase_uid: user_id)
  
  if user
    # 認証成功
    return user
  else
    # ユーザーが見つからない（DBに登録されていない可能性）
    return 401
  end
rescue => e
  # 署名検証エラーまたは有効期限切れ
  return 401, { error: "Invalid or expired token: #{e.message}" }
end
```

**Node.js (Express) の例:**
```javascript
const admin = require('firebase-admin');

app.get('/api/v1/auth/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    // Firebase Admin SDK でトークン検証
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;  // fLDNHyG12NbKlDJSBtu5z9YzGGi2
    
    // ユーザーをデータベースから検索
    const user = await User.findByFirebaseUID(uid);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    return res.json({ user });
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
});
```

### 3. **よくある問題と解決策**

| 問題 | 原因 | 解決方法 |
|------|------|--------|
| `Invalid signature` | Firebase 公開鍵が正しくない | Google の公開鍵 endpoint から最新の鍵を取得 |
| `Invalid audience` | Project ID が一致していない | トークンの `aud` と設定の `audience` を確認 |
| `Token expired` | 有効期限を超えている | フロントエンド側で新しいトークンを取得（`getIdToken(true)`） |
| `User not found` | Firebase UID がDB に存在しない | Firebase ユーザー同期機能を確認 |

---

## 📞 **デバッグ用コマンド**

### トークンのデコード（オンラインツール）
- https://jwt.io にアクセス
- 上記のトークンをペースト
- ペイロードが正しく表示されることを確認

### Firebase Admin SDK でのトークン検証テスト
```bash
# Node.js REPL で実行
node
> const admin = require('firebase-admin');
> const token = 'eyJhbGciOi...' // 上記トークン
> admin.auth().verifyIdToken(token).then(console.log).catch(console.error)
```

---

## ✅ **確認チェックリスト**

バックエンド開発者は以下を確認してください：

- [ ] Firebase Admin SDK が正しくセットアップされているか
- [ ] Firebase Project ID が `cocoty-auth` か
- [ ] トークン署名検証が実装されているか
- [ ] トークンペイロードの `aud` が `cocoty-auth` か確認
- [ ] トークンペイロードの `exp` (有効期限) が現在時刻より後か確認
- [ ] Firebase ユーザー (UID: `fLDNHyG12NbKlDJSBtu5z9YzGGi2`) がデータベースに登録されているか確認
- [ ] Google 公開鍵キャッシュが最新か確認

---

## 📊 **次のステップ**

バックエンド開発者が以下の対応をしてください：

1. **緊急:** トークン検証ロジックをデバッグ（署名検証、有効期限確認）
2. **重要:** Firebase Admin SDK の初期化を確認
3. **確認:** テスト用トークンで `/api/v1/auth/me` エンドポイントを叩いて 200 OK を返すことを確認
4. **検証:** フロントエンドから再度 API リクエストを送信して動作確認

---

**質問がある場合は、このレポートを参考に バックエンド開発者に直接相談してください。**

