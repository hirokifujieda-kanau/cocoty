# RPG診断機能 - バックエンドAPI仕様書

## 📋 概要

ユーザーが14問の質問に答えて、5つの本能（狩猟本能、警戒本能、職人魂、共感本能、飛躍本能）のレベルを診断する機能です。

質問データはバックエンドで管理し、管理者が自由に変更・追加・削除できるようにします。

---

## 🗄️ データベース設計

### 1. `rpg_questions` テーブル（質問マスタ）

質問データを管理するテーブルです。

```ruby
# rails g model RpgQuestion text:text factor:string is_reversed:boolean order:integer active:boolean

class CreateRpgQuestions < ActiveRecord::Migration[7.0]
  def change
    create_table :rpg_questions do |t|
      t.text :text, null: false           # 質問文
      t.string :factor, null: false       # 因子 ('fencer', 'healer', 'schemer', 'gunner', 'shielder')
      t.boolean :is_reversed, default: false  # 逆転項目かどうか
      t.integer :order, null: false       # 表示順序（1から開始）
      t.boolean :active, default: true    # 有効/無効フラグ

      t.timestamps
    end

    add_index :rpg_questions, :order
    add_index :rpg_questions, :active
  end
end
```

**カラム説明:**
- `text`: 質問文（例: "知らない人とすぐに会話ができる"）
- `factor`: どの因子に紐づくか
  - `fencer`: 狩猟本能（フェンサー素質）
  - `shielder`: 警戒本能（シールダー素質）
  - `gunner`: 職人魂（ガンナー素質）
  - `healer`: 共感本能（ヒーラー素質）
  - `schemer`: 飛躍本能（スキーマー素質）
- `is_reversed`: 逆転項目かどうか（計算時に6-scoreで逆転）
- `order`: 表示順序（ソート用）
- `active`: 有効フラグ（無効な質問は取得されない）

### 2. `profiles` テーブルへのカラム追加

診断結果を保存するカラムを追加します。

```ruby
# rails g migration AddRpgDiagnosisToProfiles

class AddRpgDiagnosisToProfiles < ActiveRecord::Migration[7.0]
  def change
    add_column :profiles, :rpg_fencer, :integer    # 狩猟本能のレベル（1-4）
    add_column :profiles, :rpg_shielder, :integer  # 警戒本能のレベル（1-4）
    add_column :profiles, :rpg_gunner, :integer    # 職人魂のレベル（1-4）
    add_column :profiles, :rpg_healer, :integer    # 共感本能のレベル（1-4）
    add_column :profiles, :rpg_schemer, :integer   # 飛躍本能のレベル（1-4）
    add_column :profiles, :rpg_diagnosed_at, :datetime  # 診断実施日時
  end
end
```

---

## 🔌 API仕様

### 1. 質問一覧取得API

**エンドポイント:**
```
GET /api/v1/rpg_questions
```

**認証:** 不要（公開API）

**レスポンス:**
```json
{
  "questions": [
    {
      "id": 1,
      "text": "知らない人とすぐに会話ができる",
      "factor": "fencer",
      "is_reversed": false,
      "order": 1
    },
    {
      "id": 2,
      "text": "人が快適で幸せかどうか、気になる",
      "factor": "healer",
      "is_reversed": false,
      "order": 2
    },
    {
      "id": 3,
      "text": "絵画・映像・小説・音楽などの創作活動をしている",
      "factor": "schemer",
      "is_reversed": false,
      "order": 3
    },
    {
      "id": 4,
      "text": "メカ・乗り物などに興味がある",
      "factor": "gunner",
      "is_reversed": false,
      "order": 4
    },
    {
      "id": 5,
      "text": "体調・怪我・病気に敏感",
      "factor": "shielder",
      "is_reversed": false,
      "order": 5
    },
    {
      "id": 6,
      "text": "家にいるより外出したい",
      "factor": "fencer",
      "is_reversed": false,
      "order": 6
    },
    {
      "id": 7,
      "text": "人との深い繋がりは苦手",
      "factor": "healer",
      "is_reversed": true,
      "order": 7
    },
    {
      "id": 8,
      "text": "細部よりも全体像を重視する",
      "factor": "schemer",
      "is_reversed": false,
      "order": 8
    },
    {
      "id": 9,
      "text": "結果重視で過程は気にしない",
      "factor": "gunner",
      "is_reversed": true,
      "order": 9
    },
    {
      "id": 10,
      "text": "リスクを避けて安全策を選ぶ",
      "factor": "shielder",
      "is_reversed": false,
      "order": 10
    },
    {
      "id": 11,
      "text": "新しいアイデアを考えるのが好き",
      "factor": "schemer",
      "is_reversed": false,
      "order": 11
    },
    {
      "id": 12,
      "text": "他人の感情に敏感",
      "factor": "healer",
      "is_reversed": false,
      "order": 12
    },
    {
      "id": 13,
      "text": "単独行動が好き",
      "factor": "fencer",
      "is_reversed": true,
      "order": 13
    },
    {
      "id": 14,
      "text": "手順やマニュアルを重視する",
      "factor": "gunner",
      "is_reversed": false,
      "order": 14
    }
  ]
}
```

**実装例:**
```ruby
# app/controllers/api/v1/rpg_questions_controller.rb
module Api
  module V1
    class RpgQuestionsController < ApplicationController
      # 認証不要（公開API）

      def index
        questions = RpgQuestion.where(active: true).order(:order)
        
        render json: {
          questions: questions.as_json(only: [:id, :text, :factor, :is_reversed, :order])
        }
      end
    end
  end
end
```

---

### 2. 診断結果保存API

**エンドポイント:**
```
POST /api/v1/rpg_diagnoses/:profile_id
```

**認証:** 必須（Firebase JWT）

**リクエストボディ:**
```json
{
  "rpg_diagnosis": {
    "fencer": 3,     // 狩猟本能のレベル（1-4）
    "shielder": 2,   // 警戒本能のレベル（1-4）
    "gunner": 4,     // 職人魂のレベル（1-4）
    "healer": 3,     // 共感本能のレベル（1-4）
    "schemer": 2     // 飛躍本能のレベル（1-4）
  }
}
```

**レスポンス（成功時）:**
```json
{
  "rpg_diagnosis": {
    "fencer": 3,
    "shielder": 2,
    "gunner": 4,
    "healer": 3,
    "schemer": 2
  },
  "message": "診断結果を保存しました"
}
```

**レスポンス（エラー時）:**
```json
{
  "error": "診断結果の保存に失敗しました",
  "details": ["Rpg fencer must be between 1 and 4"]
}
```

**実装例:**
```ruby
# app/controllers/api/v1/rpg_diagnoses_controller.rb
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
          }, status: :ok
        else
          render json: { 
            error: '診断結果の保存に失敗しました',
            details: profile.errors.full_messages 
          }, status: :unprocessable_entity
        end
      end

      private

      def rpg_diagnosis_params
        params.require(:rpg_diagnosis).permit(
          :fencer, :shielder, :gunner, :healer, :schemer
        ).transform_keys { |key| "rpg_#{key}" }
         .merge(rpg_diagnosed_at: Time.current)
      end
    end
  end
end
```

---

## 📊 初期データ（Seed）

```ruby
# db/seeds.rb

# RPG診断の質問データ
RpgQuestion.create!([
  { text: '知らない人とすぐに会話ができる', factor: 'fencer', is_reversed: false, order: 1 },
  { text: '人が快適で幸せかどうか、気になる', factor: 'healer', is_reversed: false, order: 2 },
  { text: '絵画・映像・小説・音楽などの創作活動をしている', factor: 'schemer', is_reversed: false, order: 3 },
  { text: 'メカ・乗り物などに興味がある', factor: 'gunner', is_reversed: false, order: 4 },
  { text: '体調・怪我・病気に敏感', factor: 'shielder', is_reversed: false, order: 5 },
  { text: '家にいるより外出したい', factor: 'fencer', is_reversed: false, order: 6 },
  { text: '人との深い繋がりは苦手', factor: 'healer', is_reversed: true, order: 7 },
  { text: '細部よりも全体像を重視する', factor: 'schemer', is_reversed: false, order: 8 },
  { text: '結果重視で過程は気にしない', factor: 'gunner', is_reversed: true, order: 9 },
  { text: 'リスクを避けて安全策を選ぶ', factor: 'shielder', is_reversed: false, order: 10 },
  { text: '新しいアイデアを考えるのが好き', factor: 'schemer', is_reversed: false, order: 11 },
  { text: '他人の感情に敏感', factor: 'healer', is_reversed: false, order: 12 },
  { text: '単独行動が好き', factor: 'fencer', is_reversed: true, order: 13 },
  { text: '手順やマニュアルを重視する', factor: 'gunner', is_reversed: false, order: 14 }
])
```

---

## ✅ バリデーション

```ruby
# app/models/profile.rb
class Profile < ApplicationRecord
  # RPG診断結果のバリデーション（1-4の範囲）
  validates :rpg_fencer, numericality: { 
    only_integer: true, 
    greater_than_or_equal_to: 1, 
    less_than_or_equal_to: 4 
  }, allow_nil: true
  
  validates :rpg_shielder, numericality: { 
    only_integer: true, 
    greater_than_or_equal_to: 1, 
    less_than_or_equal_to: 4 
  }, allow_nil: true
  
  validates :rpg_gunner, numericality: { 
    only_integer: true, 
    greater_than_or_equal_to: 1, 
    less_than_or_equal_to: 4 
  }, allow_nil: true
  
  validates :rpg_healer, numericality: { 
    only_integer: true, 
    greater_than_or_equal_to: 1, 
    less_than_or_equal_to: 4 
  }, allow_nil: true
  
  validates :rpg_schemer, numericality: { 
    only_integer: true, 
    greater_than_or_equal_to: 1, 
    less_than_or_equal_to: 4 
  }, allow_nil: true
end

# app/models/rpg_question.rb
class RpgQuestion < ApplicationRecord
  VALID_FACTORS = %w[fencer shielder gunner healer schemer].freeze

  validates :text, presence: true
  validates :factor, presence: true, inclusion: { in: VALID_FACTORS }
  validates :order, presence: true, uniqueness: true
  validates :is_reversed, inclusion: { in: [true, false] }
  validates :active, inclusion: { in: [true, false] }

  scope :active, -> { where(active: true) }
  scope :ordered, -> { order(:order) }
end
```

---

## 🔄 プロフィール取得APIへの追加

既存の `GET /api/v1/auth/me` または `GET /api/v1/profiles/:id` のレスポンスに、診断結果を含めてください：

```json
{
  "profile": {
    "id": 1,
    "nickname": "太郎",
    "bio": "よろしくお願いします",
    "avatar_url": "https://...",
    // ... 既存のフィールド
    "rpg_fencer": 3,
    "rpg_shielder": 2,
    "rpg_gunner": 4,
    "rpg_healer": 3,
    "rpg_schemer": 2,
    "rpg_diagnosed_at": "2026-01-19T10:30:00Z"
  }
}
```

---

## 🛠️ ルーティング

```ruby
# config/routes.rb
namespace :api do
  namespace :v1 do
    resources :rpg_questions, only: [:index]
    resources :rpg_diagnoses, only: [:create]
  end
end
```

---

## 📝 補足情報

### 5つの本能の対応関係

| 日本語名 | 英語名（factor） | DB カラム名 | 素質名 | 説明 |
|---|---|---|---|---|
| 狩猟本能 | fencer | rpg_fencer | フェンサー素質 | 積極的に行動し、新しい環境に飛び込む力 |
| 警戒本能 | shielder | rpg_shielder | シールダー素質 | 危険を察知し、安全を守る力 |
| 職人魂 | gunner | rpg_gunner | ガンナー素質 | 技術や知識を追求する力 |
| 共感本能 | healer | rpg_healer | ヒーラー素質 | 人の気持ちを理解し、支援する力 |
| 飛躍本能 | schemer | rpg_schemer | スキーマー素質 | 創造的に考え、新しいアイデアを生む力 |

### レベルの意味

- **4**: 最も強い
- **3**: 強い
- **2**: 標準的
- **1**: 弱い

### フロントエンドでの計算ロジック

質問の回答（1-5点）から、各因子のレベル（1-4）を以下のロジックで計算します：

1. 各因子に紐づく質問のスコアを合計
2. 逆転項目は `6 - score` で計算
3. 合計点から4段階でレベルを判定
   - 合計 ≥ 9: レベル4
   - 合計 7-8: レベル3
   - 合計 5-6: レベル2
   - 合計 < 5: レベル1

**重要:** 質問の順序や内容が変わっても、フロントエンドは `factor` と `is_reversed` を見て自動的に計算します。

---

## 🎯 実装の優先順位

1. **必須（MVP）:**
   - `rpg_questions` テーブル作成
   - `profiles` テーブルへのカラム追加
   - 質問一覧取得API（GET /api/v1/rpg_questions）
   - 診断結果保存API（POST /api/v1/rpg_diagnoses/:profile_id）
   - 初期データ投入（14問の質問）

2. **推奨:**
   - バリデーション追加
   - プロフィール取得APIへの診断結果追加

3. **将来的に:**
   - 管理画面での質問管理（CRUD）
   - 質問の一時無効化機能
   - 診断履歴の保存（複数回診断可能）

---

以上の仕様でバックエンド実装をお願いします！
