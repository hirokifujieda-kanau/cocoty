# 🃏 タロットカード画像アップロード手順

## 📋 概要

フロントエンドから直接Cloudinaryに22枚のタロットカード画像をアップロードします。

## 🎯 アップロード手順

### 1. 画像ファイルを準備

画像ファイル名を以下の形式で命名してください：

```
0-the-fool.png
1-the-magician.png
2-the-high-priestess.png
3-the-empress.png
4-the-emperor.png
5-the-hierophant.png
6-the-lovers.png
7-the-chariot.png
8-strength.png
9-the-hermit.png
10-wheel-of-fortune.png
11-justice.png
12-the-hanged-man.png
13-death.png
14-temperance.png
15-the-devil.png
16-the-tower.png
17-the-star.png
18-the-moon.png
19-the-sun.png
20-judgement.png
21-the-world.png
```

**重要**: ファイル名の先頭の数字がカードIDと一致している必要があります。

### 2. アップロードページにアクセス

開発サーバーを起動している状態で、以下のURLにアクセス：

```
http://localhost:3000/admin/tarot-upload
```

### 3. 画像を選択してアップロード

1. 「画像を選択」ボタンをクリック
2. 準備した22枚の画像ファイルをすべて選択（Cmd/Ctrlキーで複数選択可能）
3. 自動的にアップロードが開始されます

### 4. 進捗確認

- ✅ 緑色: アップロード成功
- ⏳ 青色: アップロード中
- ❌ 赤色: エラー発生

### 5. 完了確認

すべてのアップロードが完了したら：

1. 「APIレスポンスを確認」リンクをクリックして、画像URLが正しく設定されているか確認
2. タロット占い画面（`/`のタロットモーダル）で画像が表示されることを確認

## 🔧 技術詳細

### アップロードフロー

```
画像選択
  ↓
Cloudinaryに直接アップロード
  ↓
アップロード成功 → secure_urlを取得
  ↓
バックエンドAPI呼び出し (PATCH /api/v1/tarot/cards/:id/update_image)
  ↓
データベース更新 (image_url列)
  ↓
完了！
```

### 使用する設定

- **Cloudinary Cloud Name**: `dq9cfrfvc`
- **Upload Preset**: `ml_default`（署名なしアップロード）
- **フォルダ**: `tarot-cards/major-arcana`

### バックエンドAPI

```
PATCH /api/v1/tarot/cards/:id/update_image
Authorization: Bearer {Firebase ID Token}

Body:
{
  "image_url": "https://res.cloudinary.com/..."
}

Response:
{
  "success": true,
  "message": "愚者の画像URLを更新しました",
  "card": { ... }
}
```

## 🎨 サンプル画像の取得方法

### オプション1: バックエンドから既存の画像を使用

バックエンド側で既にサンプル画像が生成されている場合：

```bash
# バックエンドのディレクトリに移動
cd ../cocoty-api

# サンプル画像のディレクトリを確認
ls db/tarot_images/

# フロントエンドにコピー
cp -r db/tarot_images/* ../community-platform/public/temp-tarot-images/
```

### オプション2: フリー素材を使用

以下のサイトからタロットカード画像をダウンロード：

- [Pixabay](https://pixabay.com/images/search/tarot/)
- [Unsplash](https://unsplash.com/s/photos/tarot-cards)
- [Pexels](https://www.pexels.com/search/tarot/)

ダウンロード後、ファイル名を上記の形式にリネームしてください。

### オプション3: AIで生成

DALL-E、Midjourney、Stable Diffusionなどで生成：

```
Prompt例:
"tarot card design, major arcana, the fool, mystical, ornate border, professional illustration"
```

## 📊 アップロード後の確認

### APIレスポンス確認

```bash
curl http://localhost:5000/api/v1/tarot/cards | jq '.cards[0:3]'
```

期待される出力：

```json
[
  {
    "id": 0,
    "name": "愚者",
    "name_en": "The Fool",
    "image_url": "https://res.cloudinary.com/dq9cfrfvc/image/upload/v1234567890/tarot-cards/major-arcana/xyz123.png",
    ...
  },
  ...
]
```

### ブラウザで画像確認

1. タロット占い機能を開く
2. カードを引く
3. 結果画面で画像が表示されるか確認

## ❗ トラブルシューティング

### 問題1: 403エラーが出る

**原因**: Cloudinaryのupload presetがUnsignedになっていない

**解決方法**:
1. https://console.cloudinary.com/settings/upload にアクセス
2. Upload presetsタブを開く
3. `ml_default` プリセットを編集
4. **Signing Mode: Unsigned** に変更
5. 保存

### 問題2: ファイル名エラー

**原因**: ファイル名の形式が正しくない

**解決方法**:
ファイル名を `{カードID}-{カード名}.png` の形式に変更
- 先頭が数字
- ハイフン `-` で区切る
- 例: `0-the-fool.png`

### 問題3: 認証エラー（401）

**原因**: Firebaseでログインしていない

**解決方法**:
1. ログインページ（`/login`）でログイン
2. 再度アップロードページにアクセス

## ✅ チェックリスト

- [ ] 22枚の画像ファイルを準備（正しいファイル名形式）
- [ ] 開発サーバーが起動している（`npm run dev`）
- [ ] Firebaseでログイン済み
- [ ] `/admin/tarot-upload` ページにアクセス
- [ ] 画像を選択してアップロード実行
- [ ] すべて成功（22/22 ✅）
- [ ] APIレスポンスで `image_url` が設定されていることを確認
- [ ] タロット占い画面で画像が表示されることを確認

## 🎉 完了！

アップロード完了後、タロット占い機能で美しいカード画像が表示されます！
