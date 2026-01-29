# プロフィールに性別と診断完了フラグを追加

## 概要

RPG診断とタロット占いの正確な実装のため、以下のカラムを `profiles` テーブルに追加します。

## 追加するカラム

| カラム名 | 型 | NULL | デフォルト | 説明 |
|---------|-----|------|-----------|------|
| `gender` | string | YES | NULL | 性別（"男性" / "女性" / "その他"） |
| `rpg_diagnosis_completed_at` | datetime | YES | NULL | RPG診断完了日時 |
| `tarot_last_drawn_at` | datetime | YES | NULL | タロット最終引いた日時 |

## マイグレーション手順

### 1. マイグレーションファイルを作成

```bash
cd /Users/fujiedahiroki/Projects/cocoty-api
rails generate migration AddGenderAndDiagnosisCompletionToProfiles
```

### 2. マイグレーションファイルを編集

`db/migrate/XXXXXX_add_gender_and_diagnosis_completion_to_profiles.rb`

```ruby
class AddGenderAndDiagnosisCompletionToProfiles < ActiveRecord::Migration[8.1]
  def change
    add_column :profiles, :gender, :string
    add_column :profiles, :rpg_diagnosis_completed_at, :datetime
    add_column :profiles, :tarot_last_drawn_at, :datetime
    
    # インデックスを追加（検索パフォーマンス向上）
    add_index :profiles, :gender
  end
end
```

### 3. マイグレーション実行

```bash
rails db:migrate
```

### 4. スキーマ確認

```bash
rails db:schema:dump
cat db/schema.rb | grep -A 70 "create_table.*profiles"
```

## API仕様の変更

### Profile レスポンスに追加

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
    "rpg_diagnosis_completed_at": "2024-01-15T10:30:00Z",
    "rpg_diagnosed_at": "2024-01-15T10:30:00Z",
    "tarot_last_drawn_at": "2024-01-16T09:00:00Z"
  }
}
```

### プロフィール更新APIで性別を受け付ける

```ruby
# app/controllers/api/v1/profiles_controller.rb

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
    :gender,  # 追加
    # ... 他のフィールド
  )
end
```

### RPG診断保存APIの変更

診断結果を保存する際に、`rpg_diagnosis_completed_at` を自動設定：

```ruby
# app/controllers/api/v1/rpg_diagnoses_controller.rb

def create
  @profile = current_user.profile
  
  if @profile.update(
    rpg_fencer: diagnosis_params[:fencer],
    rpg_healer: diagnosis_params[:healer],
    rpg_schemer: diagnosis_params[:schemer],
    rpg_gunner: diagnosis_params[:gunner],
    rpg_shielder: diagnosis_params[:shielder],
    rpg_diagnosed_at: Time.current,
    rpg_diagnosis_completed_at: Time.current  # 追加
  )
    render json: {
      rpg_diagnosis: {
        fencer: @profile.rpg_fencer,
        healer: @profile.rpg_healer,
        schemer: @profile.rpg_schemer,
        gunner: @profile.rpg_gunner,
        shielder: @profile.rpg_shielder,
        diagnosed_at: @profile.rpg_diagnosed_at,
        completed_at: @profile.rpg_diagnosis_completed_at
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

## ロジック仕様

### 性別の使用

- **RPG診断**: 共感本能（ヒーラー因子）の判定基準が性別で異なる
  - 男性: スコア14以上でレベル4
  - 女性: スコア15以上でレベル4
  - その他/未設定: 男性基準を使用

### 診断完了フラグの使用

1. **RPG診断**
   - `rpg_diagnosis_completed_at` が NULL → 未診断（診断可能）
   - `rpg_diagnosis_completed_at` が 設定済み → 診断済み（結果表示のみ）
   - 管理画面でリセット可能（将来実装）

2. **タロット占い**
   - `tarot_last_drawn_at` が NULL → 未実施（占い可能）
   - `tarot_last_drawn_at` が 当日 → 本日実施済み（結果表示のみ）
   - `tarot_last_drawn_at` が 前日以前 → 占い可能

### タロット1日1回チェックロジック

```ruby
# app/models/profile.rb

def can_draw_tarot?
  return true if tarot_last_drawn_at.nil?
  tarot_last_drawn_at.to_date < Date.current
end

def tarot_drawn_today?
  return false if tarot_last_drawn_at.nil?
  tarot_last_drawn_at.to_date == Date.current
end
```

## テストデータ

### 開発環境用シードデータ例

```ruby
# db/seeds.rb

profile1 = Profile.find_by(name: 'テストユーザー1')
if profile1
  profile1.update(
    gender: '男性',
    rpg_fencer: 3,
    rpg_healer: 2,
    rpg_schemer: 4,
    rpg_gunner: 3,
    rpg_shielder: 2,
    rpg_diagnosed_at: Time.current,
    rpg_diagnosis_completed_at: Time.current,
    tarot_last_drawn_at: 1.day.ago
  )
end
```

## 確認項目

- [ ] マイグレーション実行完了
- [ ] スキーマにカラムが追加されている
- [ ] Profile モデルにバリデーション追加（必要に応じて）
- [ ] API レスポンスに新しいフィールドが含まれる
- [ ] RPG診断保存時に `rpg_diagnosis_completed_at` が設定される
- [ ] タロット占い実施時に `tarot_last_drawn_at` が設定される

## ロールバック方法

問題が発生した場合:

```bash
rails db:rollback
```

## 注意事項

1. **既存データ**: 既存のプロフィールは `gender` が NULL
2. **後方互換性**: NULL を許可しているため、既存機能に影響なし
3. **タイムゾーン**: `DateTime` は UTC で保存、表示時にタイムゾーン変換
