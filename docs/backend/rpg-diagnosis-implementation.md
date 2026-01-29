# RPG診断機能 - バックエンド実装依頼書

**作成日**: 2026年1月19日  
**更新日**: 2026年1月19日  
**対象**: バックエンド開発担当者  
**優先度**: 高  
**仕様書**: `/docs/rpg-diagnosis-specification.md`

---

## 📌 実装する機能の概要

ユーザーが12問の質問に答えることで、5つの本能（狩猟本能、警戒本能、職人魂、共感本能、飛躍本能）のレベル（1〜4）を診断する機能です。

**特徴:**
- 質問データはデータベースで管理（12問 + 将来用2問 = 計14問）
- 診断結果はユーザーのプロフィールに保存
- 性別によって共感本能の判定基準が異なる
- 質問の順序や内容を変更しても、フロントエンドのコード変更は不要

**重要な変更点:**
- ✅ Q13とQ14は将来的な拡張用として `active: false` で保存
- ✅ 実際に使用するのは12問のみ
- ✅ 共感本能（ヒーラー）の判定には性別情報が必要

---

## 🎯 実装タスク一覧

### Phase 1: データベース設計（必須）

- [ ] `rpg_questions` テーブル作成
- [ ] `profiles` テーブルにRPG診断結果カラムを追加
- [ ] `profiles` テーブルに性別カラム追加（未実装の場合）
- [ ] 初期データ投入用マイグレーション作成（12問 + 非表示2問）

### Phase 2: API実装（必須）

- [ ] 質問一覧取得API（active=trueの12問のみ）
- [ ] 診断結果保存API

### Phase 3: マイグレーション実行（必須）

- [ ] `rails db:migrate` 実行（テーブル作成 + データ投入）

### Phase 4: 追加実装（推奨）

- [ ] バリデーション追加
- [ ] プロフィール取得APIに診断結果を含める

---

## 📊 データベース設計

### 1. 新規テーブル: `rpg_questions`

質問マスタテーブルです。管理者が質問を追加・変更・削除できるようにします。

#### マイグレーション

```bash
rails g model RpgQuestion text:text factor:string is_reversed:boolean order:integer active:boolean
```

```ruby
# db/migrate/YYYYMMDDHHMMSS_create_rpg_questions.rb
class CreateRpgQuestions < ActiveRecord::Migration[7.0]
  def change
    create_table :rpg_questions do |t|
      t.text :text, null: false
      t.string :factor, null: false
      t.boolean :is_reversed, default: false, null: false
      t.integer :order, null: false
      t.boolean :active, default: true, null: false

      t.timestamps
    end

    add_index :rpg_questions, :order
    add_index :rpg_questions, :active
  end
end
```

#### カラム説明

| カラム名 | 型 | 説明 | 例 |
|---------|-----|------|-----|
| `text` | text | 質問文 | "知らない人とすぐに会話ができる" |
| `factor` | string | 因子名 | "fencer", "healer", "schemer", "gunner", "shielder" |
| `is_reversed` | boolean | 逆転項目か | false（通常）/ true（逆転） |
| `order` | integer | 表示順序 | 1, 2, 3, ... |
| `active` | boolean | 有効フラグ | true（表示）/ false（非表示） |

**因子の種類:**
- `fencer`: 狩猟本能（フェンサー素質）
- `shielder`: 警戒本能（シールダー素質）
- `gunner`: 職人魂（ガンナー素質）
- `healer`: 共感本能（ヒーラー素質）
- `schemer`: 飛躍本能（スキーマー素質）

---

### 2. 既存テーブル拡張: `profiles`

診断結果を保存するカラムを追加します。**性別カラムも必要です。**

#### マイグレーション（診断結果）

```bash
rails g migration AddRpgDiagnosisToProfiles rpg_fencer:integer rpg_shielder:integer rpg_gunner:integer rpg_healer:integer rpg_schemer:integer rpg_diagnosed_at:datetime
```

```ruby
# db/migrate/YYYYMMDDHHMMSS_add_rpg_diagnosis_to_profiles.rb
class AddRpgDiagnosisToProfiles < ActiveRecord::Migration[7.0]
  def change
    add_column :profiles, :rpg_fencer, :integer
    add_column :profiles, :rpg_shielder, :integer
    add_column :profiles, :rpg_gunner, :integer
    add_column :profiles, :rpg_healer, :integer
    add_column :profiles, :rpg_schemer, :integer
    add_column :profiles, :rpg_diagnosed_at, :datetime
  end
end
```

#### マイグレーション（性別カラム）※既にある場合はスキップ

```bash
rails g migration AddGenderToProfiles gender:string
```

```ruby
# db/migrate/YYYYMMDDHHMMSS_add_gender_to_profiles.rb
class AddGenderToProfiles < ActiveRecord::Migration[7.0]
  def change
    add_column :profiles, :gender, :string, default: '男性'
  end
end
```

#### カラム説明

| カラム名 | 型 | 説明 | 値の範囲 |
|---------|-----|------|---------|
| `rpg_fencer` | integer | 狩猟本能のレベル | 1〜4 |
| `rpg_shielder` | integer | 警戒本能のレベル | 1〜4 |
| `rpg_gunner` | integer | 職人魂のレベル | 1〜4 |
| `rpg_healer` | integer | 共感本能のレベル | 1〜4 |
| `rpg_schemer` | integer | 飛躍本能のレベル | 1〜4 |
| `rpg_diagnosed_at` | datetime | 診断実施日時 | - |
| `gender` | string | 性別 | "男性" / "女性" |

**⚠️ 重要:** `gender` カラムは共感本能（ヒーラー）の判定基準に使用します。性別によってレベル判定のしきい値が異なります。

---

## 🔌 API実装

### API 1: 質問一覧取得

#### エンドポイント
```
GET /api/v1/rpg_questions
```

#### 認証
不要（誰でもアクセス可能）

#### レスポンス例
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
    }
    // ... 全12問（active: true のみ）
  ]
}
```

**⚠️ 注意:** `active: false` のQ13とQ14は含めないでください。

#### 実装例

**ルーティング:**
```ruby
# config/routes.rb
namespace :api do
  namespace :v1 do
    resources :rpg_questions, only: [:index]
  end
end
```

**コントローラー:**
```ruby
# app/controllers/api/v1/rpg_questions_controller.rb
module Api
  module V1
    class RpgQuestionsController < ApplicationController
      # 認証不要

      def index
        questions = RpgQuestion.active.ordered
        
        render json: {
          questions: questions.as_json(only: [:id, :text, :factor, :is_reversed, :order])
        }, status: :ok
      end
    end
  end
end
```

**モデル:**
```ruby
# app/models/rpg_question.rb
class RpgQuestion < ApplicationRecord
  VALID_FACTORS = %w[fencer shielder gunner healer schemer].freeze

  validates :text, presence: true
  validates :factor, presence: true, inclusion: { in: VALID_FACTORS }
  validates :order, presence: true, numericality: { only_integer: true, greater_than: 0 }
  validates :is_reversed, inclusion: { in: [true, false] }
  validates :active, inclusion: { in: [true, false] }

  scope :active, -> { where(active: true) }
  scope :ordered, -> { order(:order) }
end
```

---

### API 2: 診断結果保存

#### エンドポイント
```
POST /api/v1/rpg_diagnoses/:profile_id
```

#### 認証
必須（Firebase Authentication）

#### リクエスト例
```json
{
  "rpg_diagnosis": {
    "fencer": 3,
    "shielder": 2,
    "gunner": 4,
    "healer": 3,
    "schemer": 2
  }
}
```

#### レスポンス例（成功）
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

#### レスポンス例（エラー）
```json
{
  "error": "診断結果の保存に失敗しました",
  "details": ["Rpg fencer must be between 1 and 4"]
}
```

#### 実装例

**ルーティング:**
```ruby
# config/routes.rb
namespace :api do
  namespace :v1 do
    resources :rpg_diagnoses, only: [:create]
  end
end
```

**コントローラー:**
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
        permitted = params.require(:rpg_diagnosis).permit(
          :fencer, :shielder, :gunner, :healer, :schemer
        )
        
        # パラメータ名を変換（fencer → rpg_fencer）
        transformed = permitted.transform_keys { |key| "rpg_#{key}" }
        
        # 診断日時を追加
        transformed.merge(rpg_diagnosed_at: Time.current)
      end
    end
  end
end
```

**モデルバリデーション:**
```ruby
# app/models/profile.rb
class Profile < ApplicationRecord
  # RPG診断結果のバリデーション
  validates :rpg_fencer, numericality: { 
    only_integer: true, 
    greater_than_or_equal_to: 1, 
    less_than_or_equal_to: 4,
    allow_nil: true
  }
  
  validates :rpg_shielder, numericality: { 
    only_integer: true, 
    greater_than_or_equal_to: 1, 
    less_than_or_equal_to: 4,
    allow_nil: true
  }
  
  validates :rpg_gunner, numericality: { 
    only_integer: true, 
    greater_than_or_equal_to: 1, 
    less_than_or_equal_to: 4,
    allow_nil: true
  }
  
  validates :rpg_healer, numericality: { 
    only_integer: true, 
    greater_than_or_equal_to: 1, 
    less_than_or_equal_to: 4,
    allow_nil: true
  }
  
  validates :rpg_schemer, numericality: { 
    only_integer: true, 
    greater_than_or_equal_to: 1, 
    less_than_or_equal_to: 4,
    allow_nil: true
  }
end
```

---

## 📝 初期データ投入（データマイグレーション）

**⚠️ 重要:** 本番環境でも使用するマスタデータなので、Seedではなく**データマイグレーション**で投入してください。

### マイグレーション作成

```bash
rails g migration InsertRpgQuestions
```

### マイグレーションファイルを編集

**12問 + 将来用2問（非表示）= 計14レコード**

```ruby
# db/migrate/YYYYMMDDHHMMSS_insert_rpg_questions.rb
class InsertRpgQuestions < ActiveRecord::Migration[7.0]
  def up
    RpgQuestion.create!([
      # 1-5問目（実際に使用する質問）
      { 
        text: '知らない人とすぐに会話ができる', 
        factor: 'fencer', 
        is_reversed: false, 
        order: 1,
        active: true 
      },
      { 
        text: '人が快適で幸せかどうか、気になる', 
        factor: 'healer', 
        is_reversed: false, 
        order: 2,
        active: true 
      },
      { 
        text: '絵画・映像・小説・音楽などの創作活動をしている', 
        factor: 'schemer', 
        is_reversed: false, 
        order: 3,
        active: true 
      },
      { 
        text: '事前準備は、余裕を持って入念にする方だ', 
        factor: 'gunner', 
        is_reversed: false, 
        order: 4,
        active: true 
      },
      { 
        text: '気分が落ち込んだり、憂うつになったりする', 
        factor: 'shielder', 
        is_reversed: false, 
        order: 5,
        active: true 
      },
      
      # 6-10問目（実際に使用する質問）
      { 
        text: 'パーティや交流イベントを企画するのが好き', 
        factor: 'fencer', 
        is_reversed: false, 
        order: 6,
        active: true 
      },
      { 
        text: '人と議論を起こしやすい。批判をすることが得意', 
        factor: 'healer', 
        is_reversed: true,  # 逆転項目
        order: 7,
        active: true 
      },
      { 
        text: '哲学的、精神的なテーマを考えるのが好き', 
        factor: 'schemer', 
        is_reversed: false, 
        order: 8,
        active: true 
      },
      { 
        text: 'ものごとを整理して考えるのが苦手', 
        factor: 'gunner', 
        is_reversed: true,  # 逆転項目
        order: 9,
        active: true 
      },
      { 
        text: 'ストレスを感じたり、不安になったりする', 
        factor: 'shielder', 
        is_reversed: false, 
        order: 10,
        active: true 
      },
      
      # 11-12問目（実際に使用する質問）
      { 
        text: 'カタカナ語や、むずかしい言葉を使うことが多い', 
        factor: 'schemer', 
        is_reversed: false, 
        order: 11,
        active: true 
      },
      { 
        text: '他の人の気持ちを思いやり、優先する', 
        factor: 'healer', 
        is_reversed: false, 
        order: 12,
        active: true 
      },
      
      # 13-14問目（将来的な拡張用 - 非表示）
      { 
        text: '自分は、他の人よりも、チームに貢献したり、成果を出していると思う', 
        factor: 'fencer',  # 仮の因子
        is_reversed: false, 
        order: 13,
        active: false  # 非表示
      },
      { 
        text: '自分は、現在の職場や置かれた状況に満足している', 
        factor: 'shielder',  # 仮の因子
        is_reversed: false, 
        order: 14,
        active: false  # 非表示
      }
    ])
    
    puts "✅ Created #{RpgQuestion.count} RPG questions (#{RpgQuestion.active.count} active)"
  end

  def down
    # ロールバック時は全削除
    RpgQuestion.delete_all
  end
end
```

### 実行

```bash
rails db:migrate
```

**実行結果の確認:**
```
✅ Created 14 RPG questions (12 active)
```

**メリット:**
- ✅ 本番環境でも同じコマンドで投入可能
- ✅ ロールバック可能（`rails db:rollback`）
- ✅ マイグレーション履歴に残る
- ✅ バージョン管理できる
- ✅ Q13, Q14を将来的に活用可能（現在は非表示） 
  },
  { 
    text: '結果重視で過程は気にしない', 
    factor: 'gunner', 
    is_reversed: true,  # 逆転項目
    order: 9,
    active: true 
  },
  { 
    text: 'リスクを避けて安全策を選ぶ', 
    factor: 'shielder', 
    is_reversed: false, 
    order: 10,
    active: true 
  },
  
  # 11-14問目
  { 
    text: '新しいアイデアを考えるのが好き', 
    factor: 'schemer', 
    is_reversed: false, 
    order: 11,
    active: true 
  },
  { 
    text: '他人の感情に敏感', 
    factor: 'healer', 
    is_reversed: false, 
    order: 12,
    active: true 
  },
  { 
    text: '単独行動が好き', 
    factor: 'fencer', 
    is_reversed: true,  # 逆転項目
    order: 13,
    active: true 
  },
  { 
    text: '手順やマニュアルを重視する', 
    factor: 'gunner', 
    is_reversed: false, 
    order: 14,
    active: true 
  }
])

puts "✅ Created #{RpgQuestion.count} RPG questions"
```

**実行:**
```bash
rails db:seed
```

---

## 🔄 プロフィール取得APIの更新

既存の `GET /api/v1/auth/me` または `GET /api/v1/profiles/:id` のレスポンスに、RPG診断結果を含めてください。

### 修正前
```json
{
  "profile": {
    "id": 1,
    "nickname": "太郎",
    "bio": "よろしく"
  }
}
```

### 修正後
```json
{
  "profile": {
    "id": 1,
    "nickname": "太郎",
    "bio": "よろしく",
    "gender": "男性",
    "rpg_fencer": 3,
    "rpg_shielder": 2,
    "rpg_gunner": 4,
    "rpg_healer": 3,
    "rpg_schemer": 2,
    "rpg_diagnosed_at": "2026-01-19T10:30:00Z"
  }
}
```

**⚠️ 重要:** `gender` フィールドも含めてください（共感本能の判定に使用）。

### 実装例（Serializer使用の場合）

```ruby
# app/serializers/profile_serializer.rb
class ProfileSerializer < ActiveModel::Serializer
  attributes :id, :nickname, :bio, :avatar_url, :gender,
             :rpg_fencer, :rpg_shielder, :rpg_gunner, 
             :rpg_healer, :rpg_schemer, :rpg_diagnosed_at
  
  # ... その他の既存属性
end
```

---

## ✅ 動作確認方法

### 1. 質問一覧取得のテスト

```bash
# 認証不要
curl -X GET http://localhost:5000/api/v1/rpg_questions
```

**期待されるレスポンス:**
- ステータスコード: 200
- 12個の質問データが返る（`active: true` のみ）
- `order` 順にソートされている

### 2. 診断結果保存のテスト

```bash
# 認証必要（Bearerトークンを設定）
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

**期待されるレスポンス:**
- ステータスコード: 200
- 保存した診断結果が返る
- データベースに保存されている

### 3. プロフィール取得のテスト

```bash
# 認証必要
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

**期待されるレスポンス:**
- プロフィール情報に `rpg_fencer` 〜 `rpg_schemer` が含まれている
- 診断未実施の場合は `null`

---

## 🎨 補足資料

### 5つの本能の詳細

| 日本語名 | 英語名 | DB名 | 素質名 | 説明 |
|---------|--------|------|--------|------|
| 狩猟本能 | fencer | rpg_fencer | フェンサー素質 | 積極的に行動し、新しい人や環境に飛び込む力 |
| 警戒本能 | shielder | rpg_shielder | シールダー素質 | 危険を察知し、安全を守る力 |
| 職人魂 | gunner | rpg_gunner | ガンナー素質 | 技術や知識を追求し、専門性を高める力 |
| 共感本能 | healer | rpg_healer | ヒーラー素質 | 人の気持ちを理解し、支援する力 |
| 飛躍本能 | schemer | rpg_schemer | スキーマー素質 | 創造的に考え、新しいアイデアを生む力 |

### レベルの意味

- **4**: 非常に高い
- **3**: 高い
- **2**: 標準的
- **1**: 低い

### 逆転項目とは？

一部の質問は「当てはまらない」方が高得点になる項目です（心理学で一般的な手法）。

**例:**
- 通常項目: "知らない人とすぐに会話ができる" → 当てはまる（5点）= 狩猟本能が高い
- 逆転項目: "人との深い繋がりは苦手" → 当てはまらない（1点）→ 逆転後（5点）= 共感本能が高い

**計算方法:**
- 通常項目: そのままのスコアを使用
- 逆転項目: `6 - score` で計算（フロントエンド側で処理）

---

## 📅 実装スケジュール（目安）

| タスク | 所要時間 | 担当者 |
|--------|---------|--------|
| マイグレーション作成・実行 | 30分 | BE |
| モデル作成・バリデーション | 1時間 | BE |
| 質問一覧取得API実装 | 1時間 | BE |
| 診断結果保存API実装 | 1.5時間 | BE |
| Seed投入 | 15分 | BE |
| プロフィールAPI更新 | 30分 | BE |
| テスト・動作確認 | 1時間 | BE |
| **合計** | **約6時間** | |

---

## 📞 質問・相談先

実装中に不明点があれば、以下までご連絡ください：

- **フロントエンド担当**: [あなたの名前]
- **Slack**: #dev-backend チャンネル
- **ドキュメント**: `/docs/rpg-diagnosis-api-spec.md`（詳細仕様）

---

## ⚠️ 重要な注意点

1. **使用する質問は12問のみ**
   - Q1〜Q12が `active: true`（表示）
   - Q13〜Q14は `active: false`（非表示・将来用）
   - APIは `active: true` の質問のみ返してください

2. **逆転項目に注意**
   - Q7（批判が得意）: `is_reversed: true`
   - Q9（整理が苦手）: `is_reversed: true`
   - その他はすべて `is_reversed: false`

3. **性別情報が必須**
   - 共感本能（ヒーラー）の判定は性別によって基準が異なる
   - `gender` カラムが未実装の場合は追加してください
   - デフォルト値: "男性"

4. **レベルは1〜4の範囲**
   - バリデーションで必ず制限してください
   - 範囲外の値は保存拒否

5. **認証必須**
   - 診断結果保存APIは必ずFirebase認証を通すこと
   - `current_user.profile` に保存

6. **計算ロジックはフロントエンド側**
   - バックエンドは質問提供と結果保存のみ
   - 因子スコアや本能レベルの計算は不要

---

以上、実装よろしくお願いします！
