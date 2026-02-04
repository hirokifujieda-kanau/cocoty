# バグ修正・機能追加 設計書（2026年2月4日）

## 📋 概要

以下の4つのタスクを実装します：

1. 一覧から自分を選択すると他人のUIのまま自分が出るエラー修正
2. アバター登録できない問題の修正
3. RPG診断に性別因子を反映
4. RPG診断の全員の一覧表示・検索機能

---

## 🌳 ブランチ戦略

- **フロントエンド**: `feature/fixes-and-improvements`
- **バックエンド**: `feature/fixes-and-improvements`
- 完了後、両方を `main` にマージ

---

## 1️⃣ 一覧から自分を選択すると他人のUIのまま自分が出るエラー修正

### 🎯 目的
ユーザー一覧から自分のプロフィールを選択した際、「他人を見るUI」ではなく「自分のプロフィールUI」を表示する。

### 🔍 問題の原因
`InstagramProfilePage.tsx` で、URLパラメータからプロフィールIDを取得し、常に「他人のプロフィール」として扱っているため。

### 🛠️ 修正内容（フロントエンド）

#### ファイル
- `src/components/profile/InstagramProfilePage.tsx`
- `src/app/profile/[id]/page.tsx`

#### 修正ロジック
```typescript
// 現在のユーザーIDと表示するプロフィールIDを比較
const isOwnProfile = currentUser?.id === displayUser?.id;

// UI表示を切り替え
{isOwnProfile ? (
  <button>プロフィールを編集</button>
) : (
  <button>フォロー</button>
)}
```

#### 実装手順
1. `InstagramProfilePage.tsx` で `isOwnProfile` の判定ロジックを追加
2. 編集ボタン、フォローボタンの表示切り替え
3. プライベート情報（メールアドレス等）の表示制御

---

## 2️⃣ アバター登録できない問題の修正

### 🎯 目的
プロフィール画像（アバター）のアップロードを正常に動作させる。

### 🔍 問題の原因（推定）
- Cloudinaryへのアップロード処理のエラー
- Rails API側のファイル受信処理の問題
- CORS設定の問題

### 🛠️ 修正内容

#### フロントエンド
**ファイル**: 
- `src/hooks/useAvatarUpload.ts`
- `src/components/profile/InstagramProfilePage.tsx`

**修正内容**:
```typescript
// エラーハンドリングの追加
try {
  const formData = new FormData();
  formData.append('avatar', file);
  
  const response = await uploadAvatar(profileId, formData);
  console.log('✅ Avatar upload success:', response);
} catch (error) {
  console.error('❌ Avatar upload failed:', error);
  // エラー内容を詳細にログ出力
}
```

#### バックエンド
**ファイル**: 
- `app/controllers/api/v1/avatars_controller.rb`

**修正内容**:
```ruby
def create
  # パラメータの検証を追加
  unless params[:avatar].present?
    return render json: { error: 'アバター画像が指定されていません' }, status: :bad_request
  end

  # Cloudinaryへのアップロード処理
  result = Cloudinary::Uploader.upload(
    params[:avatar].tempfile,
    folder: 'avatars',
    public_id: "user_#{@profile.id}",
    overwrite: true
  )

  @profile.update!(avatar_url: result['secure_url'])
  
  render json: { 
    message: 'アバターを更新しました',
    avatar_url: @profile.avatar_url 
  }, status: :ok
rescue => e
  Rails.logger.error "Avatar upload error: #{e.message}"
  render json: { error: 'アバターのアップロードに失敗しました' }, status: :internal_server_error
end
```

---

## 3️⃣ RPG診断に性別因子を反映

### 🎯 目的
RPG診断結果の計算時に、ユーザーの性別を因子として考慮する。

### 📐 設計

#### 性別による補正係数

| 性別 | Fencer | Healer | Schemer | Gunner | Shielder |
|------|--------|--------|---------|--------|----------|
| 男性 | +10%   | -5%    | +0%     | +10%   | +5%      |
| 女性 | -5%    | +10%   | +5%     | -5%    | +10%     |
| その他 | +0%  | +0%    | +0%     | +0%    | +0%      |

※ 補正後、合計が100になるように正規化

#### 計算例
```
回答結果（性別: 女性）:
Fencer: 30, Healer: 20, Schemer: 15, Gunner: 25, Shielder: 10

↓ 性別補正適用
Fencer: 30 * 0.95 = 28.5
Healer: 20 * 1.10 = 22.0
Schemer: 15 * 1.05 = 15.75
Gunner: 25 * 0.95 = 23.75
Shielder: 10 * 1.10 = 11.0

↓ 正規化（合計100に）
合計 = 101
Fencer: 28.5 / 101 * 100 = 28.2
Healer: 22.0 / 101 * 100 = 21.8
...
```

### 🛠️ 修正内容（バックエンド）

#### ファイル
- `app/services/rpg_diagnosis_service.rb`（新規作成）
- `app/controllers/api/v1/rpg_diagnoses_controller.rb`

#### 実装コード
```ruby
# app/services/rpg_diagnosis_service.rb
class RpgDiagnosisService
  GENDER_FACTORS = {
    'male' => {
      rpg_fencer: 1.10,
      rpg_healer: 0.95,
      rpg_schemer: 1.00,
      rpg_gunner: 1.10,
      rpg_shielder: 1.05
    },
    'female' => {
      rpg_fencer: 0.95,
      rpg_healer: 1.10,
      rpg_schemer: 1.05,
      rpg_gunner: 0.95,
      rpg_shielder: 1.10
    },
    'other' => {
      rpg_fencer: 1.00,
      rpg_healer: 1.00,
      rpg_schemer: 1.00,
      rpg_gunner: 1.00,
      rpg_shielder: 1.00
    }
  }.freeze

  def self.calculate_with_gender(scores, gender)
    factors = GENDER_FACTORS[gender] || GENDER_FACTORS['other']
    
    # 性別補正を適用
    adjusted_scores = {
      rpg_fencer: scores[:rpg_fencer] * factors[:rpg_fencer],
      rpg_healer: scores[:rpg_healer] * factors[:rpg_healer],
      rpg_schemer: scores[:rpg_schemer] * factors[:rpg_schemer],
      rpg_gunner: scores[:rpg_gunner] * factors[:rpg_gunner],
      rpg_shielder: scores[:rpg_shielder] * factors[:rpg_shielder]
    }
    
    # 正規化（合計100に）
    total = adjusted_scores.values.sum
    normalized_scores = adjusted_scores.transform_values do |score|
      (score / total * 100).round(1)
    end
    
    normalized_scores
  end
end
```

#### コントローラー修正
```ruby
# app/controllers/api/v1/rpg_diagnoses_controller.rb
def create
  # ... 既存のスコア計算 ...
  
  # 性別を取得
  gender = @profile.gender || 'other'
  
  # 性別因子を適用してスコアを計算
  final_scores = RpgDiagnosisService.calculate_with_gender(scores, gender)
  
  # プロフィールを更新
  @profile.update!(
    rpg_fencer: final_scores[:rpg_fencer],
    rpg_healer: final_scores[:rpg_healer],
    rpg_schemer: final_scores[:rpg_schemer],
    rpg_gunner: final_scores[:rpg_gunner],
    rpg_shielder: final_scores[:rpg_shielder],
    rpg_diagnosed_at: Time.current,
    rpg_diagnosis_completed_at: Time.current
  )
  
  # ...
end
```

---

## 4️⃣ RPG診断の全員の一覧表示・検索機能

### 🎯 目的
全ユーザーのRPG診断結果を一覧表示し、名前で検索できる機能を提供する。

### 📐 API設計

#### エンドポイント1: 診断済みユーザー一覧
```
GET /api/v1/rpg_diagnoses
```

**クエリパラメータ**:
- `page`: ページ番号（デフォルト: 1）
- `per_page`: 1ページあたりの件数（デフォルト: 20）
- `sort_by`: ソート項目（`fencer`, `healer`, `schemer`, `gunner`, `shielder`, `name`）
- `order`: ソート順（`asc`, `desc`）

**レスポンス例**:
```json
{
  "users": [
    {
      "id": 1,
      "name": "藤枝太郎",
      "avatar_url": "https://...",
      "rpg_diagnosis": {
        "fencer": 28.5,
        "healer": 22.0,
        "schemer": 15.5,
        "gunner": 23.5,
        "shielder": 10.5,
        "diagnosed_at": "2026-02-03T10:30:00Z"
      }
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_count": 100,
    "per_page": 20
  }
}
```

#### エンドポイント2: 名前検索
```
GET /api/v1/rpg_diagnoses/search?name=藤枝
```

**クエリパラメータ**:
- `name`: 検索キーワード（部分一致）

**レスポンス**: 上記と同じ形式

### 🛠️ 実装内容

#### バックエンド

**ファイル**: 
- `app/controllers/api/v1/rpg_diagnoses_controller.rb`

**実装コード**:
```ruby
# app/controllers/api/v1/rpg_diagnoses_controller.rb
class Api::V1::RpgDiagnosesController < Api::V1::ApplicationController
  # GET /api/v1/rpg_diagnoses
  def index
    page = params[:page] || 1
    per_page = params[:per_page] || 20
    sort_by = params[:sort_by] || 'diagnosed_at'
    order = params[:order] || 'desc'
    
    # RPG診断完了済みのプロフィールを取得
    profiles = Profile.where.not(rpg_diagnosis_completed_at: nil)
                     .includes(:user)
    
    # ソート
    case sort_by
    when 'name'
      profiles = profiles.order(name: order)
    when 'fencer', 'healer', 'schemer', 'gunner', 'shielder'
      profiles = profiles.order("rpg_#{sort_by}" => order)
    else
      profiles = profiles.order(rpg_diagnosed_at: order)
    end
    
    profiles = profiles.page(page).per(per_page)
    
    render json: {
      users: profiles.map { |profile| diagnosis_json(profile) },
      pagination: pagination_json(profiles)
    }
  end
  
  # GET /api/v1/rpg_diagnoses/search
  def search
    name = params[:name]
    
    if name.blank?
      return render json: { error: '検索キーワードを入力してください' }, status: :bad_request
    end
    
    profiles = Profile.where.not(rpg_diagnosis_completed_at: nil)
                     .where('name ILIKE ?', "%#{name}%")
                     .includes(:user)
                     .order(rpg_diagnosed_at: :desc)
                     .limit(50)
    
    render json: {
      users: profiles.map { |profile| diagnosis_json(profile) }
    }
  end
  
  private
  
  def diagnosis_json(profile)
    {
      id: profile.id,
      name: profile.name,
      avatar_url: profile.avatar_url,
      gender: profile.gender,
      rpg_diagnosis: {
        fencer: profile.rpg_fencer,
        healer: profile.rpg_healer,
        schemer: profile.rpg_schemer,
        gunner: profile.rpg_gunner,
        shielder: profile.rpg_shielder,
        diagnosed_at: profile.rpg_diagnosed_at
      }
    }
  end
end
```

**ルーティング追加**:
```ruby
# config/routes.rb
namespace :api do
  namespace :v1 do
    resources :rpg_diagnoses, only: [:index, :create] do
      collection do
        get :search
      end
    end
  end
end
```

#### フロントエンド

**ファイル**: 
- `src/app/rpg/users/page.tsx`（新規作成）
- `src/components/rpg/RpgUserList.tsx`（新規作成）
- `src/lib/api/rpg.ts`（API関数追加）

**API関数**:
```typescript
// src/lib/api/rpg.ts
export interface RpgDiagnosis {
  fencer: number;
  healer: number;
  schemer: number;
  gunner: number;
  shielder: number;
  diagnosed_at: string;
}

export interface RpgUser {
  id: number;
  name: string;
  avatar_url: string | null;
  gender: string | null;
  rpg_diagnosis: RpgDiagnosis;
}

export interface RpgUsersResponse {
  users: RpgUser[];
  pagination?: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
}

export async function getRpgDiagnosedUsers(
  page: number = 1,
  perPage: number = 20,
  sortBy: string = 'diagnosed_at',
  order: 'asc' | 'desc' = 'desc'
): Promise<RpgUsersResponse> {
  return apiRequest<RpgUsersResponse>(
    `/rpg_diagnoses?page=${page}&per_page=${perPage}&sort_by=${sortBy}&order=${order}`
  );
}

export async function searchRpgUsers(name: string): Promise<RpgUsersResponse> {
  return apiRequest<RpgUsersResponse>(
    `/rpg_diagnoses/search?name=${encodeURIComponent(name)}`
  );
}
```

**UIコンポーネント**:
```tsx
// src/components/rpg/RpgUserList.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { getRpgDiagnosedUsers, searchRpgUsers, type RpgUser } from '@/lib/api/rpg';

export default function RpgUserList() {
  const [users, setUsers] = useState<RpgUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await getRpgDiagnosedUsers();
      setUsers(response.users);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadUsers();
      return;
    }

    setLoading(true);
    try {
      const response = await searchRpgUsers(searchQuery);
      setUsers(response.users);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">RPG診断ユーザー一覧</h1>
      
      {/* 検索フォーム */}
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="名前で検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1 px-4 py-2 border rounded"
        />
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          検索
        </button>
      </div>

      {/* ユーザー一覧 */}
      {loading ? (
        <p>読み込み中...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <div key={user.id} className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                {user.avatar_url && (
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    className="w-12 h-12 rounded-full"
                  />
                )}
                <div>
                  <h3 className="font-bold">{user.name}</h3>
                  {user.gender && (
                    <span className="text-sm text-gray-500">{user.gender}</span>
                  )}
                </div>
              </div>
              
              {/* RPG診断結果 */}
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>⚔️ Fencer:</span>
                  <span className="font-bold">{user.rpg_diagnosis.fencer}</span>
                </div>
                <div className="flex justify-between">
                  <span>💚 Healer:</span>
                  <span className="font-bold">{user.rpg_diagnosis.healer}</span>
                </div>
                <div className="flex justify-between">
                  <span>🎭 Schemer:</span>
                  <span className="font-bold">{user.rpg_diagnosis.schemer}</span>
                </div>
                <div className="flex justify-between">
                  <span>🔫 Gunner:</span>
                  <span className="font-bold">{user.rpg_diagnosis.gunner}</span>
                </div>
                <div className="flex justify-between">
                  <span>🛡️ Shielder:</span>
                  <span className="font-bold">{user.rpg_diagnosis.shielder}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 📝 実装チェックリスト

### フロントエンド (`feature/fixes-and-improvements`)
- [ ] 自分のプロフィールUI修正
- [ ] アバターアップロード修正（FE側）
- [ ] RPG診断ユーザー一覧ページ作成
- [ ] 検索機能実装
- [ ] API関数追加

### バックエンド (`feature/fixes-and-improvements`)
- [ ] アバターアップロード修正（BE側）
- [ ] RPG診断性別因子サービス作成
- [ ] RPG診断計算ロジック修正
- [ ] RPG診断一覧APIエンドポイント作成
- [ ] 検索APIエンドポイント作成

---

## 🧪 テスト項目

### 1. 自分のプロフィールUI
- [ ] 一覧から自分を選択 → 編集ボタンが表示される
- [ ] URLで `/profile/[自分のID]` にアクセス → 編集UIが表示される

### 2. アバターアップロード
- [ ] 画像選択 → アップロード成功
- [ ] アバターがプロフィールに反映される
- [ ] エラー時に適切なメッセージが表示される

### 3. RPG診断性別因子
- [ ] 男性で診断 → Fencer, Gunnerが高くなる傾向
- [ ] 女性で診断 → Healer, Shielderが高くなる傾向
- [ ] その他で診断 → 補正なし

### 4. RPG診断一覧・検索
- [ ] 診断済みユーザーが一覧表示される
- [ ] 名前で検索できる
- [ ] ソート機能が動作する
- [ ] ページネーションが動作する

---

## 📅 スケジュール

- **Day 1**: 設計完了、ブランチ作成、自分のプロフィールUI修正
- **Day 2**: アバターアップロード修正（FE + BE）
- **Day 3**: RPG診断性別因子実装
- **Day 4**: RPG診断一覧・検索機能実装
- **Day 5**: テスト、バグ修正、mainマージ

---

## 🔗 関連ファイル

### フロントエンド
- `src/components/profile/InstagramProfilePage.tsx`
- `src/hooks/useAvatarUpload.ts`
- `src/app/rpg/users/page.tsx`
- `src/components/rpg/RpgUserList.tsx`
- `src/lib/api/rpg.ts`

### バックエンド
- `app/controllers/api/v1/avatars_controller.rb`
- `app/services/rpg_diagnosis_service.rb`
- `app/controllers/api/v1/rpg_diagnoses_controller.rb`
- `config/routes.rb`
