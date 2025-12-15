# 🔧 バックエンド API リクエスト：favorite_food フィールド追加

**送付日:** 2025年12月11日  
**優先度:** 中

---

## 📝 リクエスト内容

プロフィール取得 API (`GET /api/v1/profiles/:id`) の レスポンスに **`favorite_food`** フィールドを追加してください。

---

## 📊 必要な情報

### 1. フロントエンド側の実装状態
```typescript
// InstagramProfilePage.tsx 内で以下を使用します
{(displayUser as any).favoriteFood && (displayUser as any).favoriteFood.length > 0 && (
  <div className="mt-[18px]">
    <div className="font-bold text-xs leading-3 text-gray-700 mb-[10px]">好きな食べ物</div>
    <div className="flex flex-wrap gap-1.5">
      {(displayUser as any).favoriteFood.map((food: string, idx: number) => (
        <button key={idx} className="inline-flex items-center px-2 py-1 bg-pink-50 ...">
          🍽️ {food}
        </button>
      ))}
    </div>
  </div>
)}
```

### 2. 必要なデータ型
- **フィールド名:** `favorite_food` （スネークケース）
- **データ型:** 文字列の配列 `string[]`
- **例:**
```json
{
  "id": 1,
  "name": "田中太郎",
  "bio": "こんにちは",
  "age": 25,
  "birthplace": "東京都",
  "blood_type": "A",
  "mbti": "ENFP",
  "hobby": ["料理", "旅行", "読書"],
  "favorite_food": ["ラーメン", "すし", "カレー"],
  "avatar_url": "...",
  "created_at": "2025-12-11T..."
}
```

### 3. バックエンド側で確認すべき項目

- [ ] Profile モデルに `favorite_food` カラムがあるか（なければマイグレーション必要）
- [ ] Profile API レスポンスに `favorite_food` フィールドを含めるか（Serializer で追加）
- [ ] `favorite_food` は JSON 配列で返すか（例：`["ラーメン", "すし", "カレー"]`）
- [ ] `favorite_food` が NULL の場合は空配列 `[]` を返すか（またはスキップして OK）

---

## 🔗 参考情報

### フロントエンド実装予定箇所
- **ファイル:** `src/components/profile/InstagramProfilePage.tsx`
- **行数:** 574-587

### データ取得箇所
```typescript
// src/lib/api/client.ts 内でプロフィール型定義をしているはず
type Profile = {
  id: number;
  name: string;
  bio?: string;
  age?: number;
  hobby?: string[];
  favorite_food?: string[];  // ← この行を追加または確認してほしい
  // ... その他のフィールド
}
```

---

## 📱 UI 実装例

このフィールドが追加されると、以下のようにプロフィールページに表示されます：

```
┌─────────────────────────────┐
│  🖼️ プロフィール            │
├─────────────────────────────┤
│  基本情報                    │
│  25歳 | 東京都 | A型 | ENFP │
│                              │
│  趣味                        │
│  [料理] [旅行] [読書]        │
│                              │
│  好きな食べ物 ← 👈 追加      │
│  [🍽️ラーメン] [🍽️すし]      │
│  [🍽️カレー]                 │
└─────────────────────────────┘
```

---

## ✅ チェックリスト：バックエンド実装確認

実装完了時に以下を確認してください：

- [ ] Profile モデルに `favorite_food` カラムが追加されている
- [ ] カラム型は `text` 配列型または JSON 型
- [ ] Profile Serializer が `favorite_food` を include している
- [ ] `/api/v1/profiles/1` エンドポイントのレスポンスに `favorite_food` が含まれている
- [ ] `favorite_food` が NULL の場合の処理が実装されている
- [ ] テストプロフィールに複数の好物が登録されている

---

## 📞 質問・確認事項

もし不明な点があれば、以下を教えてください：

1. Profile モデルは既に `hobby` フィールドがあるか？
2. `favorite_food` の保存方法は？（JSON 配列？カンマ区切り文字列？別テーブル？）
3. 実装予定は？（いつまでに必要か）
4. テストアカウントに `favorite_food` を登録できるか？

