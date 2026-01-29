/**
 * タロットカード用のサンプル画像を生成するスクリプト
 * Node.jsのCanvasライブラリを使用して22枚の画像を自動生成
 */

const fs = require('fs');
const path = require('path');

// 22枚のタロットカード情報
const tarotCards = [
  { id: 0, name: 'The Fool', nameJa: '愚者', color: '#FFD700' },
  { id: 1, name: 'The Magician', nameJa: '魔術師', color: '#FF6B6B' },
  { id: 2, name: 'The High Priestess', nameJa: '女教皇', color: '#4ECDC4' },
  { id: 3, name: 'The Empress', nameJa: '女帝', color: '#FF9FF3' },
  { id: 4, name: 'The Emperor', nameJa: '皇帝', color: '#8B4513' },
  { id: 5, name: 'The Hierophant', nameJa: '教皇', color: '#9370DB' },
  { id: 6, name: 'The Lovers', nameJa: '恋人', color: '#FF69B4' },
  { id: 7, name: 'The Chariot', nameJa: '戦車', color: '#4169E1' },
  { id: 8, name: 'Strength', nameJa: '力', color: '#FF4500' },
  { id: 9, name: 'The Hermit', nameJa: '隠者', color: '#696969' },
  { id: 10, name: 'Wheel of Fortune', nameJa: '運命の輪', color: '#DAA520' },
  { id: 11, name: 'Justice', nameJa: '正義', color: '#00CED1' },
  { id: 12, name: 'The Hanged Man', nameJa: '吊られた男', color: '#708090' },
  { id: 13, name: 'Death', nameJa: '死神', color: '#000000' },
  { id: 14, name: 'Temperance', nameJa: '節制', color: '#87CEEB' },
  { id: 15, name: 'The Devil', nameJa: '悪魔', color: '#8B0000' },
  { id: 16, name: 'The Tower', nameJa: '塔', color: '#B22222' },
  { id: 17, name: 'The Star', nameJa: '星', color: '#1E90FF' },
  { id: 18, name: 'The Moon', nameJa: '月', color: '#9370DB' },
  { id: 19, name: 'The Sun', nameJa: '太陽', color: '#FFA500' },
  { id: 20, name: 'Judgement', nameJa: '審判', color: '#FFD700' },
  { id: 21, name: 'The World', nameJa: '世界', color: '#32CD32' },
];

// 出力ディレクトリ
const outputDir = path.join(__dirname, '../public/tarot-images');

// ディレクトリがなければ作成
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('🎨 タロットカード画像を生成中...\n');

// SVGで画像を生成（Canvasなしで軽量に実装）
tarotCards.forEach((card) => {
  const filename = `${card.id}-${card.name.toLowerCase().replace(/\s+/g, '-')}.svg`;
  const filepath = path.join(outputDir, filename);

  // SVG画像の内容
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="600" xmlns="http://www.w3.org/2000/svg">
  <!-- 背景 -->
  <rect width="400" height="600" fill="${card.color}" rx="20"/>
  
  <!-- 装飾ボーダー -->
  <rect x="20" y="20" width="360" height="560" fill="none" stroke="#FFFFFF" stroke-width="4" rx="15"/>
  <rect x="30" y="30" width="340" height="540" fill="none" stroke="#FFFFFF" stroke-width="2" rx="12"/>
  
  <!-- カード番号 -->
  <text x="200" y="80" font-family="Georgia, serif" font-size="32" fill="#FFFFFF" text-anchor="middle" font-weight="bold">
    ${card.id}
  </text>
  
  <!-- 英語名 -->
  <text x="200" y="300" font-family="Georgia, serif" font-size="28" fill="#FFFFFF" text-anchor="middle" font-weight="bold">
    ${card.name.split(' ').map((word, i) => 
      `<tspan x="200" dy="${i > 0 ? '1.2em' : '0'}">${word}</tspan>`
    ).join('')}
  </text>
  
  <!-- 日本語名 -->
  <text x="200" y="450" font-family="Arial, sans-serif" font-size="36" fill="#FFFFFF" text-anchor="middle" font-weight="bold">
    ${card.nameJa}
  </text>
  
  <!-- 装飾シンボル -->
  <circle cx="200" y="180" r="50" fill="none" stroke="#FFFFFF" stroke-width="3"/>
  <circle cx="200" y="180" r="40" fill="none" stroke="#FFFFFF" stroke-width="2"/>
  <polygon points="200,140 220,170 190,170" fill="#FFFFFF"/>
  <polygon points="200,220 220,190 190,190" fill="#FFFFFF"/>
  <polygon points="160,180 190,200 190,160" fill="#FFFFFF"/>
  <polygon points="240,180 210,200 210,160" fill="#FFFFFF"/>
</svg>`;

  fs.writeFileSync(filepath, svg);
  console.log(`✅ ${filename} を生成しました`);
});

console.log(`\n🎉 22枚すべての画像を生成完了！`);
console.log(`📁 保存先: ${outputDir}`);
console.log(`\n次のステップ:`);
console.log(`1. http://localhost:3000/admin/tarot-upload にアクセス`);
console.log(`2. ${outputDir} から22枚すべて選択してアップロード`);
