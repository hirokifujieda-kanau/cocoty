# RPG診断・タロット占い 性別対応と完了フラグ実装ガイド

## 📋 実装サマリー

### 完了した作業
- ✅ バックエンドマイグレーションガイド作成
- ✅ フロントエンドのProfile型に`gender`, `rpg_diagnosis_completed_at`, `tarot_last_drawn_at`追加
- ✅ calculator.tsを性別対応に更新（共感本能の判定）
- ✅ GenderStepコンポーネント作成

### 残りの作業
1. RpgDiagnosisModalに性別収集フローを追加
2. プロフィールページにRPG診断結果表示カードを追加
3. 診断完了済みの場合は結果表示のみ
4. タロットも1日1回制限実装
5. バックエンドマイグレーション実行

---

## 🎯 実装の全体フロー

### フロントエンド実装手順

#### 1. RpgDiagnosisModalの更新

`/src/components/rpg/RpgDiagnosisModal.tsx`

```typescript
// 追加のstate
const [gender, setGender] = useState<'男性' | '女性' | 'その他' | null>(null);
const [showGenderStep, setShowGenderStep] = useState(true);

// 性別選択後に質問開始
const handleGenderSelect = (selectedGender: '男性' | '女性' | 'その他') => {
  setGender(selectedGender);
  setShowGenderStep(false);
};

// 診断計算時に性別を渡す
const diagnosis = calculateRpgDiagnosis(answers, gender || undefined);

// JSX部分
{showGenderStep ? (
  <GenderStep onSelect={handleGenderSelect} />
) : showResult ? (
  <ResultStep
    instinctLevels={instinctLevels}
    gender={gender}
    onClose={onClose}
    onRetry={handleRetry}
    onSave={handleSave}
  />
) : (
  <QuestionStep ... />
)}
```

#### 2. ResultStepの更新

性別情報をプロフィールに保存：

```typescript
const handleSave = async () => {
  setIsSaving(true);
  try {
    const diagnosisData = {
      fencer: instinctLevels['狩猟本能'],
      shielder: instinctLevels['警戒本能'],
      gunner: instinctLevels['職人魂'],
      healer: instinctLevels['共感本能'],
      schemer: instinctLevels['飛躍本能'],
    };

    await saveRpgDiagnosis(diagnosisData);
    
    // 性別も保存（プロフィール更新API）
    if (gender) {
      await updateProfile(currentProfile.id, { gender });
    }
    
    setIsSaved(true);
    onSave?.(true);
    alert('診断結果を保存しました！');
  } catch (error) {
    // error handling
  }
};
```

#### 3. プロフィールページにRPG診断結果カード追加

`/src/components/profile/RpgDiagnosisCard.tsx` を新規作成：

```typescript
'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import type { Profile } from '@/lib/api/client';

interface RpgDiagnosisCardProps {
  profile: Profile;
  isOwner: boolean;
  onOpenDiagnosis: () => void;
}

export const RpgDiagnosisCard: React.FC<RpgDiagnosisCardProps> = ({
  profile,
  isOwner,
  onOpenDiagnosis,
}) => {
  const hasCompletedDiagnosis = profile.rpg_diagnosis_completed_at;

  return (
    <div
      className="bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 rounded-xl p-6 cursor-pointer hover:scale-105 transition-transform"
      onClick={onOpenDiagnosis}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-yellow-300" />
          <h3 className="text-xl font-bold text-white">RPG診断</h3>
        </div>
        {hasCompletedDiagnosis && (
          <span className="px-3 py-1 bg-green-500/20 text-green-300 text-sm font-medium rounded-full">
            完了
          </span>
        )}
      </div>

      {hasCompletedDiagnosis ? (
        <div className="space-y-2">
          <DiagnosisResult label="狩猟本能" level={profile.rpg_fencer} />
          <DiagnosisResult label="共感本能" level={profile.rpg_healer} />
          <DiagnosisResult label="飛躍本能" level={profile.rpg_schemer} />
          <DiagnosisResult label="職人魂" level={profile.rpg_gunner} />
          <DiagnosisResult label="警戒本能" level={profile.rpg_shielder} />
          <p className="text-purple-300 text-sm mt-4">
            クリックして詳細を表示
          </p>
        </div>
      ) : (
        <div>
          {isOwner ? (
            <p className="text-purple-200">
              クリックして診断を開始
            </p>
          ) : (
            <p className="text-purple-300">
              未診断
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const DiagnosisResult: React.FC<{ label: string; level?: number }> = ({ label, level }) => {
  if (!level) return null;
  
  return (
    <div className="flex items-center justify-between text-white">
      <span className="text-sm">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i <= level ? 'bg-yellow-400' : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
```

#### 4. InstagramProfilePageに統合

```typescript
// import追加
import { RpgDiagnosisCard } from '@/components/profile/RpgDiagnosisCard';

// 診断結果表示モーダルの状態
const [showDiagnosisResult, setShowDiagnosisResult] = useState(false);

// JSX部分
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <RpgDiagnosisCard
    profile={displayUser}
    isOwner={isOwner}
    onOpenDiagnosis={() => {
      if (displayUser.rpg_diagnosis_completed_at) {
        setShowDiagnosisResult(true);
      } else if (isOwner) {
        setShowRpgDiagnosisModal(true);
      }
    }}
  />
  {/* タロットカードも同様に追加 */}
</div>

{/* 診断完了済みの場合は結果のみ表示するモーダル */}
{showDiagnosisResult && displayUser.rpg_fencer && (
  <ResultStep
    instinctLevels={{
      狩猟本能: displayUser.rpg_fencer,
      共感本能: displayUser.rpg_healer!,
      飛躍本能: displayUser.rpg_schemer!,
      職人魂: displayUser.rpg_gunner!,
      警戒本能: displayUser.rpg_shielder!,
    }}
    gender={displayUser.gender}
    onClose={() => setShowDiagnosisResult(false)}
    onRetry={() => {}} // 無効化
    readOnly={!isOwner} // 他人のプロフィールでは保存ボタン非表示
  />
)}
```

#### 5. ResultStepにreadonlyモード追加

```typescript
interface ResultStepProps {
  instinctLevels: InstinctLevels;
  gender?: string | null;
  onClose: () => void;
  onRetry: () => void;
  onSave?: (saved: boolean) => void;
  readOnly?: boolean; // 追加
}

// 保存ボタンの表示制御
{!readOnly && (
  <button
    onClick={handleSave}
    disabled={isSaving || isSaved}
    className="..."
  >
    {isSaving ? '保存中...' : isSaved ? '✓ 保存済み' : '結果を保存'}
  </button>
)}
```

---

## 🔧 バックエンド実装

### マイグレーション実行

```bash
cd /Users/fujiedahiroki/Projects/cocoty-api

# マイグレーション作成
rails generate migration AddGenderAndDiagnosisCompletionToProfiles

# マイグレーションファイル編集（docs/backend/add-gender-and-diagnosis-completion.md参照）

# 実行
rails db:migrate

# 確認
rails c
> Profile.column_names
# => ["gender", "rpg_diagnosis_completed_at", "tarot_last_drawn_at" が含まれること]
```

### RpgDiagnosesController更新

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
    rpg_diagnosis_completed_at: Time.current  # 完了フラグ設定
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
```

### ProfilesController更新

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

---

## ✅ テストチェックリスト

### フロントエンド
- [ ] 未診断の状態で診断開始できる
- [ ] 性別選択画面が表示される
- [ ] 性別選択後に質問が開始される
- [ ] 診断結果が性別に応じて正しく計算される（女性は共感本能の基準が高い）
- [ ] 診断結果を保存できる
- [ ] 保存後にプロフィールページでカードに「完了」バッジが表示される
- [ ] 診断完了済みの場合、カードクリックで結果のみ表示される
- [ ] 他人のプロフィールでは診断結果が閲覧のみ可能

### バックエンド
- [ ] マイグレーション実行成功
- [ ] gender, rpg_diagnosis_completed_at, tarot_last_drawn_at カラムが追加されている
- [ ] RPG診断保存時に rpg_diagnosis_completed_at が設定される
- [ ] プロフィール更新APIで gender が保存できる
- [ ] API レスポンスに新しいフィールドが含まれる

---

## 🎨 タロット占いも同様に実装

### TarotCardコンポーネント作成

```typescript
// /src/components/profile/TarotCard.tsx

export const TarotCard: React.FC<TarotCardProps> = ({ profile, isOwner, onOpenTarot }) => {
  const lastDrawn = profile.tarot_last_drawn_at 
    ? new Date(profile.tarot_last_drawn_at)
    : null;
  const isToday = lastDrawn && isToday(lastDrawn);
  
  return (
    <div onClick={onOpenTarot} className="...">
      {isToday ? (
        <div>今日のタロット結果を表示</div>
      ) : isOwner ? (
        <div>クリックしてタロットを引く</div>
      ) : (
        <div>未実施</div>
      )}
    </div>
  );
};
```

---

## 📝 コミット準備

完了したら以下のコマンドでコミット：

```bash
git add .
git commit -m "feat: RPG診断に性別対応と診断完了フラグを実装

- 性別選択UIを追加（GenderStep）
- 計算ロジックを性別対応に更新（共感本能の判定基準）
- Profile型にgender, rpg_diagnosis_completed_at, tarot_last_drawn_atを追加
- プロフィールページにRPG診断結果カードを追加
- 診断完了済みの場合は結果表示のみ（再診断は管理画面で）
- バックエンドマイグレーションガイド作成"
```

---

## タロット占いの画像について

### 質問への回答

> タロット占いの部分、画像とテキストを用意してもらう形でいいのか？
> 画像サイズは？

**推奨仕様:**

1. **画像提供形式**: はい、画像とテキストを用意してもらう形式でOKです

2. **推奨画像サイズ**:
   - **サムネイル**: 200x300px (縦長、カード型)
   - **詳細画像**: 400x600px (高解像度版)
   - **フォーマット**: PNG or JPG
   - **ファイル名**: `tarot-0.png` 〜 `tarot-21.png` (大アルカナ22枚)

3. **データ構造**:
```typescript
// /src/lib/mock/mockTarotCards.ts
export interface TarotCard {
  id: number;
  name: string;
  imageUrl: string;
  meaning: string;
  advice: string;
}

export const TAROT_CARDS: TarotCard[] = [
  {
    id: 0,
    name: '愚者',
    imageUrl: '/tarot/fool.png',
    meaning: '新しい始まり、自由、冒険',
    advice: '今日は新しいことにチャレンジしてみましょう',
  },
  // ... 22枚
];
```

4. **画像配置**: `/public/tarot/` ディレクトリに配置

5. **バックエンド対応**: 将来的にはデータベースで管理することも可能
