# RPG診断機能 - クイックリファレンス

**更新日**: 2026年1月19日  
**詳細仕様**: `/docs/rpg-diagnosis-specification.md`

## 🚀 5分でわかる実装ガイド

### 📋 やること

1. ✅ マイグレーション3つ（+ gender追加）作成・実行
2. ✅ モデル2つ作成
3. ✅ コントローラー2つ作成
4. ✅ 動作確認

**重要な変更点:**
- 使用する質問は **12問のみ**（Q1-Q12）
- Q13, Q14は `active: false` で保存（将来用）
- 性別（gender）カラムが必要（ヒーラー因子の判定用）

---

## 1️⃣ マイグレーション

```bash
# 1. 質問テーブル作成
rails g model RpgQuestion text:text factor:string is_reversed:boolean order:integer active:boolean

# 2. プロフィールにRPG診断結果カラム追加
rails g migration AddRpgDiagnosisToProfiles rpg_fencer:integer rpg_shielder:integer rpg_gunner:integer rpg_healer:integer rpg_schemer:integer rpg_diagnosed_at:datetime

# 3. プロフィールに性別カラム追加（既にある場合はスキップ）
rails g migration AddGenderToProfiles gender:string

# 4. 初期データ投入用マイグレーション
rails g migration InsertRpgQuestions

# 5. マイグレーションファイル編集後、実行
rails db:migrate
```

---

## 2️⃣ モデル

### `app/models/rpg_question.rb`
```ruby
class RpgQuestion < ApplicationRecord
  VALID_FACTORS = %w[fencer shielder gunner healer schemer].freeze

  validates :text, presence: true
  validates :factor, inclusion: { in: VALID_FACTORS }
  validates :order, presence: true

  scope :active, -> { where(active: true) }
  scope :ordered, -> { order(:order) }
end
```

### `app/models/profile.rb` に追加
```ruby
# RPG診断結果のバリデーション
validates :rpg_fencer, :rpg_shielder, :rpg_gunner, :rpg_healer, :rpg_schemer,
  numericality: { 
    only_integer: true, 
    greater_than_or_equal_to: 1, 
    less_than_or_equal_to: 4, 
    allow_nil: true 
  }

# 性別のバリデーション
validates :gender, inclusion: { in: ['男性', '女性'], allow_nil: true }
```

---

## 3️⃣ ルーティング

### `config/routes.rb` に追加
```ruby
namespace :api do
  namespace :v1 do
    resources :rpg_questions, only: [:index]
    resources :rpg_diagnoses, only: [:create]
  end
end
```

---

## 4️⃣ コントローラー

### `app/controllers/api/v1/rpg_questions_controller.rb`
```ruby
module Api
  module V1
    class RpgQuestionsController < ApplicationController
      # 認証不要

      def index
        # active: true の質問のみ返す（12問）
        questions = RpgQuestion.active.ordered
        
        render json: { 
          questions: questions.as_json(
            only: [:id, :text, :factor, :is_reversed, :order]
          ) 
        }
      end
    end
  end
end
```

### `app/controllers/api/v1/rpg_diagnoses_controller.rb`
```ruby
module Api
  module V1
    class RpgDiagnosesController < ApplicationController
      before_action :authenticate_user!

      def create
        profile = current_user.profile
        
        if profile.update(rpg_diagnosis_params)
          render json: {
            rpg_diagnosis: {
              fencer: profile.rpg_fencer,
              shielder: profile.rpg_shielder,
              gunner: profile.rpg_gunner,
              healer: profile.rpg_healer,
              schemer: profile.rpg_schemer
            },
            message: '診断結果を保存しました'
          }
        else
          render json: { 
            error: '保存失敗', 
            details: profile.errors.full_messages 
          }, status: :unprocessable_entity
        end
      end

      private

      def rpg_diagnosis_params
        params.require(:rpg_diagnosis)
              .permit(:fencer, :shielder, :gunner, :healer, :schemer)
              .transform_keys { |k| "rpg_#{k}" }
              .merge(rpg_diagnosed_at: Time.current)
      end
    end
  end
end
```

---

## 5️⃣ 初期データ投入（データマイグレーション）

**⚠️ 重要**: 本番環境でも使うデータなので、Seedではなく**データマイグレーション**で投入してください。

```bash
rails g migration InsertRpgQuestions
```

### マイグレーションファイルを編集（12問 + 非表示2問）
```ruby
# db/migrate/YYYYMMDDHHMMSS_insert_rpg_questions.rb
class InsertRpgQuestions < ActiveRecord::Migration[7.0]
  def up
    RpgQuestion.create!([
      # 実際に使用する12問（active: true）
      { text: '知らない人とすぐに会話ができる', factor: 'fencer', is_reversed: false, order: 1, active: true },
      { text: '人が快適で幸せかどうか、気になる', factor: 'healer', is_reversed: false, order: 2, active: true },
      { text: '絵画・映像・小説・音楽などの創作活動をしている', factor: 'schemer', is_reversed: false, order: 3, active: true },
      { text: '事前準備は、余裕を持って入念にする方だ', factor: 'gunner', is_reversed: false, order: 4, active: true },
      { text: '気分が落ち込んだり、憂うつになったりする', factor: 'shielder', is_reversed: false, order: 5, active: true },
      { text: 'パーティや交流イベントを企画するのが好き', factor: 'fencer', is_reversed: false, order: 6, active: true },
      { text: '人と議論を起こしやすい。批判をすることが得意', factor: 'healer', is_reversed: true, order: 7, active: true },
      { text: '哲学的、精神的なテーマを考えるのが好き', factor: 'schemer', is_reversed: false, order: 8, active: true },
      { text: 'ものごとを整理して考えるのが苦手', factor: 'gunner', is_reversed: true, order: 9, active: true },
      { text: 'ストレスを感じたり、不安になったりする', factor: 'shielder', is_reversed: false, order: 10, active: true },
      { text: 'カタカナ語や、むずかしい言葉を使うことが多い', factor: 'schemer', is_reversed: false, order: 11, active: true },
      { text: '他の人の気持ちを思いやり、優先する', factor: 'healer', is_reversed: false, order: 12, active: true },
      
      # 将来用の非表示質問（active: false）
      { text: '自分は、他の人よりも、チームに貢献したり、成果を出していると思う', factor: 'fencer', is_reversed: false, order: 13, active: false },
      { text: '自分は、現在の職場や置かれた状況に満足している', factor: 'shielder', is_reversed: false, order: 14, active: false }
    ])
    
    puts "✅ Created #{RpgQuestion.count} RPG questions (#{RpgQuestion.active.count} active)"
  end

  def down
    RpgQuestion.delete_all
  end
end
```

```bash
rails db:migrate
# 出力: ✅ Created 14 RPG questions (12 active)
```

---

## 6️⃣ プロフィールAPIに診断結果を追加

### Serializerを使用している場合
```ruby
# app/serializers/profile_serializer.rb
class ProfileSerializer < ActiveModel::Serializer
  attributes :id, :nickname, :bio, :avatar_url, :gender,
             :rpg_fencer, :rpg_shielder, :rpg_gunner, 
             :rpg_healer, :rpg_schemer, :rpg_diagnosed_at
end
```

---

## 7️⃣ 動作確認

### 質問取得（認証不要）
```bash
curl http://localhost:5000/api/v1/rpg_questions
```

**期待される結果:**
- 12個の質問が返る（active: true のみ）
- Q13, Q14は含まれない

### 結果保存（要認証）
```bash
curl -X POST http://localhost:5000/api/v1/rpg_diagnoses/1 \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rpg_diagnosis": {
      "fencer": 3,
      "shielder": 2,
      "gunner": 4,
      "healer": 3,
      "schemer": 2
    }
  }'
```

### プロフィール取得（要認証）
```bash
curl http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

**期待される結果:**
- `gender` フィールドが含まれている
- RPG診断結果（rpg_fencer〜rpg_schemer）が含まれている

---

## 📊 データ構造早見表

### 因子（factor）とDB列名

| 英語名 | 日本語名 | DB列名 | 質問数 | 逆転項目 |
|--------|---------|--------|--------|---------|
| fencer | 狩猟本能 | rpg_fencer | 2 | なし |
| healer | 共感本能 | rpg_healer | 3 | Q7 |
| schemer | 飛躍本能 | rpg_schemer | 3 | なし |
| gunner | 職人魂 | rpg_gunner | 2 | Q9 |
| shielder | 警戒本能 | rpg_shielder | 2 | なし |

### 使用する質問リスト

| ID | 質問文 | 因子 | 逆転 |
|----|--------|------|------|
| 1 | 知らない人とすぐに会話ができる | fencer | ❌ |
| 2 | 人が快適で幸せかどうか、気になる | healer | ❌ |
| 3 | 絵画・映像・小説・音楽などの創作活動をしている | schemer | ❌ |
| 4 | 事前準備は、余裕を持って入念にする方だ | gunner | ❌ |
| 5 | 気分が落ち込んだり、憂うつになったりする | shielder | ❌ |
| 6 | パーティや交流イベントを企画するのが好き | fencer | ❌ |
| 7 | 人と議論を起こしやすい。批判をすることが得意 | healer | ✅ |
| 8 | 哲学的、精神的なテーマを考えるのが好き | schemer | ❌ |
| 9 | ものごとを整理して考えるのが苦手 | gunner | ✅ |
| 10 | ストレスを感じたり、不安になったりする | shielder | ❌ |
| 11 | カタカナ語や、むずかしい言葉を使うことが多い | schemer | ❌ |
| 12 | 他の人の気持ちを思いやり、優先する | healer | ❌ |

### レベル範囲
- 値: **1〜4** の整数
- nil: 未診断

---

## ⚠️ 重要な注意点

1. **Q13とQ14は非表示**
   - データベースには登録するが `active: false`
   - APIでは返さない
   - 将来的な拡張用として保持

2. **逆転項目は2つのみ**
   - Q7（批判が得意） → ヒーラー因子の逆転項目
   - Q9（整理が苦手） → ガンナー因子の逆転項目

3. **性別が必須**
   - 共感本能（ヒーラー）の判定は性別で基準が異なる
   - プロフィールに `gender` カラムが必要
   - デフォルト値: "男性"

4. **計算はフロントエンド側**
   - バックエンドは質問提供と結果保存のみ
   - 因子スコアや本能レベルの計算は不要

---

以上で実装完了です！
