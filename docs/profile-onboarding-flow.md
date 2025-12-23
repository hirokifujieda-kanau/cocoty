# 🎉 初回ログイン後のプロフィール編集フロー

## 📋 実装概要

新規登録後、ユーザーは最小限の情報（名前・生年月日）だけを入力し、その他の詳細情報はログイン後にプロフィール編集モーダルで入力できるようになりました。

---

## 🔄 新しいフロー

### 1️⃣ 新規登録（Signup）
```
1. ユーザーが /signup にアクセス
2. 基本情報を入力
   - 名前（必須）
   - 生年月日（必須）
   - メールアドレス（必須）
   - パスワード（必須）
3. Firebase認証
4. POST /api/v1/auth/setup_profile
   - profile.name
   - profile.birthday
5. /profile にリダイレクト
```

### 2️⃣ 初回ログイン後（Profile Page）
```
1. /profile ページを表示
2. プロフィールが存在するか確認
   ├─ プロフィールあり → 通常のプロフィール表示
   └─ プロフィールなし（初回） → ウェルカム画面 + 自動的にプロフィール編集モーダルを開く
3. ユーザーが追加情報を入力（任意）
   - プロフィール画像
   - ニックネーム
   - 自己紹介
   - 趣味
   - 好きな食べ物
   - MBTI
   - 血液型
   - 出身地
   など
4. 保存 → プロフィールページに反映
```

---

## 💻 実装内容

### InstagramProfilePage.tsx

#### 新しいState
```typescript
const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
```

#### プロフィール取得ロジック
```typescript
const response = await getCurrentUser();

if (response.profile) {
  setDisplayUser(response.profile);
  setIsFirstTimeUser(false);
} else {
  // プロフィールがない場合、初回ユーザーとして扱う
  setIsFirstTimeUser(true);
  setError(null);
}
```

#### 自動モーダル表示
```typescript
// 初回ユーザーの場合、自動的にプロフィール編集モーダルを開く
useEffect(() => {
  if (isFirstTimeUser && isOwner) {
    setShowEditProfile(true);
  }
}, [isFirstTimeUser, isOwner]);
```

#### ウェルカム画面
```tsx
{isFirstTimeUser && isOwner && (
  <div className="flex items-center justify-center min-h-[calc(100vh-30px)] px-4">
    <div className="text-center max-w-md">
      <div className="mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Users className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          ようこそ！
        </h2>
        <p className="text-gray-600 mb-6">
          アカウント登録が完了しました。<br />
          プロフィール情報を入力して、コミュニティに参加しましょう！
        </p>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          プロフィール編集で設定できること
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• プロフィール画像</li>
          <li>• ニックネーム</li>
          <li>• 自己紹介</li>
          <li>• 趣味・特技</li>
          <li>• その他の詳細情報</li>
        </ul>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        ※ プロフィール編集画面が自動的に開きます
      </p>
    </div>
  </div>
)}
```

---

### ProfileEditModal.tsx

#### プロフィールがない場合の処理
```typescript
const response = await getCurrentUser();

if (response.profile) {
  setProfile(response.profile);
  setFormData({
    name: response.profile.name || '',
    bio: response.profile.bio || '',
    // ... 既存のプロフィールデータ
  });
} else {
  // プロフィールが存在しない初回ユーザー
  setProfile(null);
  setFormData({
    name: '',
    bio: '',
    email: user.email || '',
    // ... デフォルト値
  });
}
```

#### nullセーフな表示
```typescript
<img
  src={profile?.avatar_url || 'https://via.placeholder.com/150'}
  alt={profile?.name || 'プロフィール画像'}
  className="w-24 h-24 rounded-full object-cover"
/>

<h3 className="font-semibold text-gray-900 mb-1">
  {profile?.name || formData.name || 'ユーザー名未設定'}
</h3>
```

---

## 🧪 テスト手順

### 1. 新規登録テスト
```bash
# ブラウザで開く
open http://localhost:3000/signup

# 入力
名前: 藤枝
生年月日: 1999年1月1日
メールアドレス: test@example.com
パスワード: password123

# 登録ボタンをクリック
```

**期待される動作:**
1. ✅ Firebase認証成功
2. ✅ POST /api/v1/auth/setup_profile 成功
3. ✅ `/profile` にリダイレクト
4. ✅ ウェルカム画面が表示される
5. ✅ プロフィール編集モーダルが自動的に開く

### 2. プロフィール編集テスト
```
モーダルで追加情報を入力:
- プロフィール画像: （アップロード）
- ニックネーム: フジエダ
- 自己紹介: よろしくお願いします！
- 趣味: 読書, 旅行
- 好きな食べ物: カレー, ラーメン
- MBTI: INFP
- 血液型: A
- 出身地: 東京都

保存ボタンをクリック
```

**期待される動作:**
1. ✅ プロフィール情報が保存される
2. ✅ モーダルが閉じる
3. ✅ プロフィールページが再読み込みされる
4. ✅ 通常のプロフィール表示になる
5. ✅ 入力した情報がすべて表示される

### 3. 再ログインテスト
```
1. ログアウト
2. 同じアカウントで再ログイン
3. /profile にアクセス
```

**期待される動作:**
1. ✅ ウェルカム画面は表示されない
2. ✅ プロフィール編集モーダルは自動的に開かない
3. ✅ 通常のプロフィールページが表示される
4. ✅ 前回保存した情報がすべて表示される

---

## 📊 データフロー

### 新規登録時
```
Signup
  ↓
Firebase Auth (email, password)
  ↓
POST /auth/setup_profile
  {
    profile: {
      name: "藤枝",
      birthday: "1999-01-01"
    }
  }
  ↓
Rails API creates:
  - User (firebase_uid, email)
  - Profile (name, birthday)
  ↓
Redirect to /profile
```

### 初回ログイン後
```
/profile
  ↓
GET /api/v1/users/me
  {
    user: { ... },
    profile: {
      id: 1,
      name: "藤枝",
      birthday: "1999-01-01",
      bio: null,
      avatar_url: null,
      hobbies: [],
      ...
    }
  }
  ↓
プロフィール編集モーダル自動表示
  ↓
ユーザーが追加情報を入力
  ↓
PUT /api/v1/profiles/1
  {
    profile: {
      bio: "よろしくお願いします！",
      hobbies: ["読書", "旅行"],
      avatar_url: "https://...",
      ...
    }
  }
  ↓
プロフィールページ再読み込み
  ↓
完全なプロフィール表示
```

---

## 🎨 UI/UX ポイント

### ✅ 良いポイント
1. **段階的な情報入力**
   - 新規登録時は最小限の情報のみ（名前・生年月日）
   - 詳細はログイン後にゆっくり入力

2. **スムーズなオンボーディング**
   - ウェルカムメッセージでユーザーを歓迎
   - 何ができるか事前に説明
   - 自動的にモーダルが開くのでスムーズ

3. **柔軟な編集**
   - 初回以降もいつでもプロフィール編集可能
   - 一部だけ変更することも可能

### ⚠️ 注意点
1. **モーダルを閉じた場合**
   - 初回ユーザーがモーダルを閉じても、ウェルカム画面に戻る
   - 再度編集ボタンから開くことができる

2. **プロフィール未完成でも使える**
   - プロフィール情報が一部未入力でも問題なし
   - 後から追加できる

---

## 🔧 今後の改善案

### 1. プロフィール完成度表示
```typescript
const profileCompleteness = () => {
  const fields = ['avatar_url', 'bio', 'hobbies', 'mbti_type', 'blood_type'];
  const completed = fields.filter(f => profile[f]).length;
  return (completed / fields.length) * 100;
};
```

### 2. プロフィール完成報酬
- 完成度100%でバッジ獲得
- ポイント付与
- 特別機能アンロック

### 3. 段階的ガイド
- ステップバイステップでフォーム入力
- 各項目の説明を表示
- スキップ可能

---

## ✅ チェックリスト

### フロントエンド
- [x] `isFirstTimeUser` state 追加
- [x] プロフィール取得時の分岐処理
- [x] 自動モーダル表示のuseEffect
- [x] ウェルカム画面のUI
- [x] ProfileEditModalのnull対応
- [x] エラーハンドリング

### テスト
- [ ] 新規登録フロー
- [ ] 初回ログイン後のウェルカム画面
- [ ] プロフィール編集モーダル自動表示
- [ ] プロフィール保存
- [ ] 再ログイン時の通常表示

---

## 🎉 完成！

ユーザーフレンドリーな新規登録→プロフィール編集フローが完成しました！

テストして動作を確認してください 🚀
