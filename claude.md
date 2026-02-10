# Claude コーディングルール

## 🚫 絶対禁止事項

### 1. デバッグコードの残存
- **console.log()** は本番コードに残さない
- **デバッグ用コメント**（例: `// デバッグ用ログ`）は削除する
- **絵文字付きログ**（例: `console.log('✅ ...')`）も全て削除

### 2. 不要なファイルのコミット
- **ドキュメントファイル（.md）** は以下のみ許可:
  - `README.md` - プロジェクト概要
  - `.github/copilot-instructions.md` - Copilot設定
  - `claude.md` - このファイル
- その他の`.md`ファイルは**コミット前に削除**
- **テストファイル** は本番環境にコミットしない

### 3. 不適切な命名
- `mock*` という名前は本番データには使用しない
- マスターデータや定数ファイルは `constants.ts` など適切な名前を使用

## ✅ 必須作業フロー

### コミット前のチェックリスト
```bash
# 1. 全console.logを削除
grep -r "console.log" src/

# 2. 不要な.mdファイルを確認
find . -name "*.md" -not -path "./node_modules/*" -not -name "README.md" -not -path "./.github/*" -not -name "claude.md"

# 3. git statusで確認
git status

# 4. 問題があれば修正してから再度git add
```

### プッシュ前のチェックリスト
1. ✅ console.log が残っていないか確認
2. ✅ 不要な.mdファイルがコミットされていないか確認
3. ✅ デバッグコメントが残っていないか確認
4. ✅ ファイル名が適切か確認（mockなど）
5. ✅ テストファイルがコミットされていないか確認

## 📝 コードレビューポイント

### 必ずチェックすること
- [ ] 全ての`console.log()`を削除したか
- [ ] デバッグコメントを削除したか
- [ ] 不要な.mdファイルを削除したか
- [ ] ファイル名が適切か
- [ ] テストコードが本番に混入していないか
- [ ] import文が正しいか

### 例外ルール
- **エラーログは許可**: `console.error()` は本番でも使用可
- **JSDocの例は許可**: APIドキュメント内の`console.log()`サンプルコードは許可

## 🔧 自動化推奨

### ESLint設定（将来追加推奨）
```json
{
  "rules": {
    "no-console": ["error", { "allow": ["error", "warn"] }]
  }
}
```

### Pre-commit hook（将来追加推奨）
```bash
#!/bin/sh
# .git/hooks/pre-commit

if git diff --cached | grep -E "console\.log"; then
  echo "❌ Error: console.log found in staged files"
  exit 1
fi
```

## 💡 ベストプラクティス

### デバッグ時
- 開発中は`console.log`を使ってOK
- **コミット前に必ず削除**
- または環境変数で制御:
  ```typescript
  if (process.env.NODE_ENV === 'development') {
    console.log('デバッグ情報');
  }
  ```

### ドキュメント管理
- 一時的なメモは`docs/`フォルダに作成
- **コミット前に必ず削除**
- 残す必要があるものは`.gitignore`に追加

---

**最終更新**: 2026年2月11日  
**このルールを必ず守ること！**
