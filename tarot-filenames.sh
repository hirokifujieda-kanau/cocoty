#!/bin/bash

# タロットカード画像ファイル名リスト（22枚の Major Arcana）

cat << 'EOF'
📋 必要なタロットカード画像ファイル（22枚）

以下のファイル名で画像を準備してください：

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

✅ アップロード手順:
1. 上記22枚の画像ファイルを準備
2. http://localhost:3000/admin/tarot-upload にアクセス
3. すべてのファイルを選択してアップロード
4. 完了まで待機（自動的にCloudinary + DB更新）

📖 詳細手順: docs/tarot-image-upload-guide.md を参照
EOF
