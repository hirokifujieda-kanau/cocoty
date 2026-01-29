# バックエンド実装指示書：RPG診断・タロット占い 性別対応と完了フラグ

## 📋 実装概要

RPG診断とタロット占いの正確な実装のため、以下を実装してください。

---

## 1️⃣ マイグレーション実装

### ファイル
既に生成済み: `db/migrate/20260120062719_add_gender_and_diagnosis_completion_to_profiles.rb`

### 実装内容

```ruby
class AddGenderAndDiagnosisCompletionToProfiles < ActiveRecord::Migration[8.1]
  def change
    add_column :profiles, :gender, :string
    add_column :profiles, :rpg_diagnosis_completed_at, :datetime
    add_column :profiles, :tarot_last_drawn_at, :datetime
    
    add_index :profiles, :gender
  end
end
```

### 実行

```bash
cd /Users/fujiedahiroki/Projects/cocoty-api
rails db:migrate
```

### 確認

```bash
rails c
> Profile.column_names
# => gender, rpg_diagnosis_completed_at, tarot_last_drawn_at が含まれることを確認
```

---

## 2️⃣ コントローラー更新

### ファイル: `app/controllers/api/v1/rpg_diagnoses_controller.rb`

**変更内容**: 診断保存時に `rpg_diagnosis_completed_at` を設定

```ruby
def create
  @profile = current_user.profile
  
  if @profile.update(
    rpg_fencer: diagnosis_params[:fencer],
    rpg_healer: diagnosis_params[:healer],
    rpg_schemer: diagnosis_params[:schemer],
    rpg_gunner: diagnosis_params[:gunner],
    rpg_shielder: diagnosis_params[:shielder],
    rpg_diagnosed_at: Time.current,
    rpg_diagnosis_completed_at: Time.current  # 👈 追加
  )
    render json: {
      rpg_diagnosis: {
        fencer: @profile.rpg_fencer,
        healer: @profile.rpg_healer,
        schemer: @profile.rpg_schemer,
        gunner: @profile.rpg_gunner,
        shielder: @profile.rpg_shielder,
        diagnosed_at: @profile.rpg_diagnosed_at,
        completed_at: @profile.rpg_diagnosis_completed_at  # 👈 追加
      },
      message: '診断結果を保存しました'
    }, status: :ok
  else
    render json: { errors: @profile.errors.full_messages }, status: :unprocessable_entity
  end
end

private

def diagnosis_params
  params.require(:rpg_diagnosis).permit(:fencer, :healer, :schemer, :gunner, :shielder)
end
```

---

### ファイル: `app/controllers/api/v1/profiles_controller.rb`

**変更内容**: 性別の更新を許可

```ruby
def update
  if @profile.update(profile_params)
    render json: { profile: @profile }, status: :ok
  else
    render json: { errors: @profile.errors.full_messages }, status: :unprocessable_entity
  end
end

private

def profile_params
  params.require(:profile).permit(
    :name,
    :nickname,
    :bio,
    :avatar_url,
    :cover_url,
    :gender,  # 👈 追加
    :birthday,
    :birthplace,
    :blood_type,
    :mbti_type,
    :goal,
    :goal_progress,
    :skills,
    :social_link
    # ... 他の既存フィールド
  )
end
```

---

## 3️⃣ JSONレスポンスの更新

### ファイル: ProfileSerializer または profiles_controller.rb のレスポンス部分

**確認事項**: 以下のフィールドがJSON レスポンスに含まれることを確認

```json
{
  "profile": {
    "id": 1,
    "name": "山田太郎",
    "gender": "男性",
    "rpg_fencer": 3,
    "rpg_healer": 2,
    "rpg_schemer": 4,
    "rpg_gunner": 3,
    "rpg_shielder": 2,
    "rpg_diagnosed_at": "2024-01-15T10:30:00Z",
    "rpg_diagnosis_completed_at": "2024-01-15T10:30:00Z",
    "tarot_last_drawn_at": "2024-01-16T09:00:00Z"
  }
}
```

---

## 4️⃣ モデルにヘルパーメソッド追加（オプション）

### ファイル: `app/models/profile.rb`

```ruby
class Profile < ApplicationRecord
  # タロット占いの1日1回制限チェック
  def can_draw_tarot?
    return true if tarot_last_drawn_at.nil?
    tarot_last_drawn_at.to_date < Date.current
  end

  def tarot_drawn_today?
    return false if tarot_last_drawn_at.nil?
    tarot_last_drawn_at.to_date == Date.current
  end

  # RPG診断が完了しているか
  def rpg_diagnosis_completed?
    rpg_diagnosis_completed_at.present?
  end
end
```

---

## 5️⃣ テスト

### 手動テスト

```bash
# 1. 診断結果保存のテスト（認証トークン必要）
curl -X POST http://localhost:5000/api/v1/rpg_diagnoses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -d '{
    "rpg_diagnosis": {
      "fencer": 3,
      "healer": 2,
      "schemer": 4,
      "gunner": 3,
      "shielder": 2
    }
  }'

# 期待される結果: rpg_diagnosis_completed_at が設定される

# 2. プロフィール更新で性別を保存
curl -X PATCH http://localhost:5000/api/v1/profiles/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -d '{
    "profile": {
      "gender": "男性"
    }
  }'

# 3. プロフィール取得で新しいフィールドが返ることを確認
curl http://localhost:5000/api/v1/profiles/1
```

---

## 6️⃣ 確認チェックリスト

- [ ] マイグレーション実行完了
- [ ] `gender`, `rpg_diagnosis_completed_at`, `tarot_last_drawn_at` カラムが追加されている
- [ ] RPG診断保存時に `rpg_diagnosis_completed_at` が自動設定される
- [ ] プロフィール更新APIで `gender` が保存できる
- [ ] GET /api/v1/profiles/:id のレスポンスに新しいフィールドが含まれる
- [ ] GET /api/v1/auth/me のレスポンスに新しいフィールドが含まれる

---

## 📝 データ仕様

### gender カラム
- 型: `string`
- 許可値: `"男性"`, `"女性"`, `"その他"`, `nil`
- 用途: RPG診断の共感本能（ヒーラー因子）の判定基準が性別で異なる

### rpg_diagnosis_completed_at カラム
- 型: `datetime`
- 用途: 診断完了フラグ。NULLなら未診断、値があれば診断完了済み
- 設定タイミング: RPG診断結果を保存したとき

### tarot_last_drawn_at カラム
- 型: `datetime`
- 用途: タロット占いの1日1回制限。当日の日付と比較して制限判定
- 設定タイミング: タロットカードを引いたとき

---

## 🔄 既存データへの影響

- 既存のプロフィールは `gender`, `rpg_diagnosis_completed_at`, `tarot_last_drawn_at` が NULL
- NULL を許可しているため、既存機能に影響なし
- 既存の診断結果（rpg_fencer等）は保持される

---

## 📌 注意事項

1. **タイムゾーン**: `DateTime` は UTC で保存、表示時にタイムゾーン変換すること
2. **NULL許可**: すべてのカラムはNULL許可（既存データとの互換性）
3. **インデックス**: `gender` にインデックスを追加（検索パフォーマンス向上）

---

## ✅ 完了報告

実装完了後、以下を確認して報告してください：

```bash
# スキーマ確認
cat db/schema.rb | grep -A 50 "create_table.*profiles" | grep -E "(gender|rpg_diagnosis_completed_at|tarot_last_drawn_at)"

# Railsコンソールで確認
rails c
> p = Profile.first
> p.gender = "男性"
> p.save
> p.gender
# => "男性"
```

実装完了後、Railsサーバーを再起動してください。
