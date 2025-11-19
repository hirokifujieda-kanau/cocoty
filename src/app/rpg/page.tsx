'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ドット絵キャラクターのSVGコンポーネント
const PixelCharacter = ({ walking }: { walking: boolean }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!walking) return;
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % 4);
    }, 200);
    return () => clearInterval(interval);
  }, [walking]);

  // キャラクターのドット絵（8x8ピクセル）
  const getPixelData = (frameIndex: number) => {
    const frames = [
      // フレーム0: 立ち
      [
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 1, 2, 2, 2, 2, 1, 0],
        [0, 1, 2, 3, 3, 2, 1, 0],
        [0, 0, 1, 2, 2, 1, 0, 0],
        [0, 0, 1, 4, 4, 1, 0, 0],
        [0, 1, 4, 4, 4, 4, 1, 0],
        [0, 1, 5, 0, 0, 5, 1, 0],
        [0, 0, 5, 0, 0, 5, 0, 0],
      ],
      // フレーム1: 歩き1
      [
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 1, 2, 2, 2, 2, 1, 0],
        [0, 1, 2, 3, 3, 2, 1, 0],
        [0, 0, 1, 2, 2, 1, 0, 0],
        [0, 0, 1, 4, 4, 1, 0, 0],
        [0, 1, 4, 4, 4, 4, 1, 0],
        [0, 0, 5, 0, 0, 5, 1, 0],
        [0, 0, 0, 0, 0, 5, 0, 0],
      ],
      // フレーム2: 立ち
      [
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 1, 2, 2, 2, 2, 1, 0],
        [0, 1, 2, 3, 3, 2, 1, 0],
        [0, 0, 1, 2, 2, 1, 0, 0],
        [0, 0, 1, 4, 4, 1, 0, 0],
        [0, 1, 4, 4, 4, 4, 1, 0],
        [0, 1, 5, 0, 0, 5, 1, 0],
        [0, 0, 5, 0, 0, 5, 0, 0],
      ],
      // フレーム3: 歩き2
      [
        [0, 0, 1, 1, 1, 1, 0, 0],
        [0, 1, 2, 2, 2, 2, 1, 0],
        [0, 1, 2, 3, 3, 2, 1, 0],
        [0, 0, 1, 2, 2, 1, 0, 0],
        [0, 0, 1, 4, 4, 1, 0, 0],
        [0, 1, 4, 4, 4, 4, 1, 0],
        [0, 1, 5, 0, 0, 5, 0, 0],
        [0, 0, 5, 0, 0, 0, 0, 0],
      ],
    ];

    return frames[frameIndex];
  };

  const colors = [
    'transparent',  // 0: 透明
    '#000000',      // 1: 黒（輪郭）
    '#FFD700',      // 2: 金色（髪）
    '#FFA500',      // 3: オレンジ（髪の影）
    '#8B4513',      // 4: 茶色（服）
    '#D2691E',      // 5: 薄茶（足）
  ];

  const pixelData = getPixelData(frame);
  const pixelSize = 8;

  return (
    <div className="relative" style={{ width: pixelSize * 8, height: pixelSize * 8, imageRendering: 'pixelated' }}>
      {pixelData.map((row, y) => (
        <div key={y} className="flex">
          {row.map((pixel, x) => (
            <div
              key={`${x}-${y}`}
              style={{
                width: pixelSize,
                height: pixelSize,
                backgroundColor: colors[pixel],
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// ドット絵のコイン
const PixelCoin = () => {
  const [spin, setSpin] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSpin((prev) => (prev + 1) % 4);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const coinFrames = [
    // 正面
    [
      [0, 1, 1, 1, 1, 0],
      [1, 2, 2, 2, 2, 1],
      [1, 2, 3, 3, 2, 1],
      [1, 2, 2, 2, 2, 1],
      [0, 1, 1, 1, 1, 0],
    ],
    // 斜め1
    [
      [0, 1, 1, 1, 0, 0],
      [1, 2, 2, 2, 1, 0],
      [1, 2, 3, 2, 1, 0],
      [1, 2, 2, 2, 1, 0],
      [0, 1, 1, 1, 0, 0],
    ],
    // 横
    [
      [0, 1, 1, 0, 0, 0],
      [1, 2, 2, 1, 0, 0],
      [1, 2, 2, 1, 0, 0],
      [1, 2, 2, 1, 0, 0],
      [0, 1, 1, 0, 0, 0],
    ],
    // 斜め2
    [
      [0, 0, 1, 1, 1, 0],
      [0, 1, 2, 2, 2, 1],
      [0, 1, 2, 3, 2, 1],
      [0, 1, 2, 2, 2, 1],
      [0, 0, 1, 1, 1, 0],
    ],
  ];

  const colors = [
    'transparent',
    '#8B4513',
    '#FFD700',
    '#FFA500',
  ];

  const pixelSize = 6;
  const frame = coinFrames[spin];

  return (
    <div style={{ width: pixelSize * 6, height: pixelSize * 5, imageRendering: 'pixelated' }}>
      {frame.map((row, y) => (
        <div key={y} className="flex">
          {row.map((pixel, x) => (
            <div
              key={`${x}-${y}`}
              style={{
                width: pixelSize,
                height: pixelSize,
                backgroundColor: colors[pixel],
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// ドット絵のハート（HP）
const PixelHeart = ({ filled }: { filled: boolean }) => {
  const heart = [
    [0, 1, 1, 0, 1, 1, 0],
    [1, 2, 2, 1, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 1],
    [0, 1, 2, 2, 2, 1, 0],
    [0, 0, 1, 2, 1, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
  ];

  const colors = filled
    ? ['transparent', '#8B0000', '#FF0000']
    : ['transparent', '#333333', '#555555'];

  const pixelSize = 4;

  return (
    <div style={{ width: pixelSize * 7, height: pixelSize * 7, imageRendering: 'pixelated' }}>
      {heart.map((row, y) => (
        <div key={y} className="flex">
          {row.map((pixel, x) => (
            <div
              key={`${x}-${y}`}
              style={{
                width: pixelSize,
                height: pixelSize,
                backgroundColor: colors[pixel],
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// ドット絵の宝箱
const PixelTreasure = ({ open }: { open: boolean }) => {
  const closedChest = [
    [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 2, 2, 2, 2, 2, 2, 1, 0],
    [1, 2, 3, 3, 4, 4, 3, 3, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 5, 5, 5, 5, 2, 2, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  ];

  const openChest = [
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 3, 3, 4, 4, 3, 3, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 0, 0, 0, 0, 0, 0, 2, 1],
    [1, 2, 0, 6, 6, 6, 6, 0, 2, 1],
    [1, 2, 2, 5, 5, 5, 5, 2, 2, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  ];

  const colors = [
    'transparent',
    '#000000',
    '#8B4513',
    '#FFD700',
    '#FFA500',
    '#D2691E',
    '#FFFF00',
  ];

  const pixelSize = 5;
  const chest = open ? openChest : closedChest;

  return (
    <div style={{ width: pixelSize * 10, height: pixelSize * 7, imageRendering: 'pixelated' }}>
      {chest.map((row, y) => (
        <div key={y} className="flex">
          {row.map((pixel, x) => (
            <div
              key={`${x}-${y}`}
              style={{
                width: pixelSize,
                height: pixelSize,
                backgroundColor: colors[pixel],
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default function RPGHomePage() {
  const [selectedQuest, setSelectedQuest] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [walking, setWalking] = useState(false);
  const [treasureOpen, setTreasureOpen] = useState(false);
  const [hp, setHp] = useState(5);

  const quests = [
    {
      id: 'profile',
      title: 'プロフィール編集',
      description: '自己紹介を書こう',
      difficulty: '★☆☆',
      reward: '50 EXP',
    },
    {
      id: 'tarot',
      title: 'タロット占い',
      description: '今日の運勢は？',
      difficulty: '★☆☆',
      reward: '30 EXP',
    },
    {
      id: 'diagnosis',
      title: '四季診断',
      description: '性格タイプ診断',
      difficulty: '★★☆',
      reward: '100 EXP',
    },
    {
      id: 'party',
      title: 'パーティー',
      description: '仲間と冒険へ',
      difficulty: '★★★',
      reward: '150 EXP',
    },
  ];

  return (
    <div 
      className="min-h-screen bg-black text-white relative overflow-hidden"
      style={{ 
        fontFamily: '"Press Start 2P", monospace',
        imageRendering: 'pixelated',
      }}
    >
      {/* ドット絵背景グリッド */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 8px, #4B0082 8px, #4B0082 9px),
            repeating-linear-gradient(90deg, transparent, transparent 8px, #4B0082 8px, #4B0082 9px)
          `,
        }}
      />

      {/* ヘッダー */}
      <motion.div 
        className="border-b-8 bg-gradient-to-r from-indigo-900 to-purple-900 relative"
        style={{ borderColor: '#FFD700', borderStyle: 'solid' }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", bounce: 0.4 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <PixelCharacter walking={walking} />
              </motion.div>
              <div className="text-sm text-yellow-400 tracking-wider">
                COCOTY RPG GUILD
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-black border-4 border-yellow-500 px-3 py-2 flex items-center gap-2">
                <PixelCoin />
                <span className="text-yellow-400 text-xs">3250G</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 説明セクション */}
        <motion.div 
          className="bg-purple-900/80 border-8 border-purple-500 p-6 mb-8 relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="absolute -top-3 -left-3 w-6 h-6 bg-purple-500"></div>
          <div className="absolute -top-3 -right-3 w-6 h-6 bg-purple-500"></div>
          <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-purple-500"></div>
          <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-purple-500"></div>
          
          <div className="text-center mb-4">
            <h1 className="text-xl text-yellow-400 mb-4">🎮 PIXEL ART RPG 🎮</h1>
            <p className="text-xs text-purple-200 leading-relaxed mb-4">
              ドット絵キャラクター & スプライト実装！<br/>
              CSS Pixel Art + Framer Motion 使用
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-black/50 border-4 border-purple-400 p-3">
              <div className="text-purple-300 mb-2">✨ 実装機能</div>
              <ul className="space-y-1 text-gray-300">
                <li>• 歩行アニメーション</li>
                <li>• コイン回転</li>
                <li>• ハートHP表示</li>
                <li>• 宝箱開閉</li>
              </ul>
            </div>
            <div className="bg-black/50 border-4 border-purple-400 p-3">
              <div className="text-purple-300 mb-2">🎨 ドット絵</div>
              <ul className="space-y-1 text-gray-300">
                <li>• 8x8 キャラクター</li>
                <li>• 6x5 コイン</li>
                <li>• 7x7 ハート</li>
                <li>• 10x7 宝箱</li>
              </ul>
            </div>
            <div className="bg-black/50 border-4 border-purple-400 p-3">
              <div className="text-purple-300 mb-2">⚡ 技術</div>
              <ul className="space-y-1 text-gray-300">
                <li>• React Hooks</li>
                <li>• CSS Sprites</li>
                <li>• Pixel Rendering</li>
                <li>• Frame Animation</li>
              </ul>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左サイド - ステータス */}
          <motion.div 
            className="lg:col-span-1 space-y-6"
            initial={{ x: -200 }}
            animate={{ x: 0 }}
          >
            {/* HPディスプレイ */}
            <div className="bg-red-900 border-8 border-red-500 p-4 relative">
              <div className="absolute -top-3 -left-3 w-6 h-6 bg-red-500"></div>
              <div className="absolute -top-3 -right-3 w-6 h-6 bg-red-500"></div>
              <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-red-500"></div>
              <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-red-500"></div>
              
              <div className="text-xs text-red-300 mb-3 text-center">♥ HERO HP ♥</div>
              <div className="flex gap-2 justify-center flex-wrap">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <PixelHeart filled={i < hp} />
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 flex gap-2 justify-center">
                <button
                  onClick={() => setHp((prev) => Math.max(0, prev - 1))}
                  className="px-3 py-2 bg-red-700 border-4 border-red-800 text-white text-xs hover:bg-red-600"
                >
                  -1 HP
                </button>
                <button
                  onClick={() => setHp((prev) => Math.min(5, prev + 1))}
                  className="px-3 py-2 bg-green-700 border-4 border-green-800 text-white text-xs hover:bg-green-600"
                >
                  +1 HP
                </button>
              </div>
            </div>

            {/* キャラクターコントロール */}
            <div className="bg-blue-900 border-8 border-blue-500 p-4 relative">
              <div className="absolute -top-3 -left-3 w-6 h-6 bg-blue-500"></div>
              <div className="absolute -top-3 -right-3 w-6 h-6 bg-blue-500"></div>
              <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-blue-500"></div>
              <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-blue-500"></div>
              
              <div className="text-xs text-blue-300 mb-3 text-center">HERO CONTROL</div>
              <div className="flex justify-center mb-4">
                <PixelCharacter walking={walking} />
              </div>
              <button
                onMouseDown={() => setWalking(true)}
                onMouseUp={() => setWalking(false)}
                onMouseLeave={() => setWalking(false)}
                className="w-full px-4 py-3 bg-blue-600 border-4 border-blue-700 text-white text-xs hover:bg-blue-500"
              >
                {walking ? '◀ WALKING ▶' : 'HOLD TO WALK'}
              </button>
            </div>

            {/* 宝箱 */}
            <div className="bg-yellow-900 border-8 border-yellow-600 p-4 relative">
              <div className="absolute -top-3 -left-3 w-6 h-6 bg-yellow-600"></div>
              <div className="absolute -top-3 -right-3 w-6 h-6 bg-yellow-600"></div>
              <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-yellow-600"></div>
              <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-yellow-600"></div>
              
              <div className="text-xs text-yellow-300 mb-3 text-center">TREASURE BOX</div>
              <div className="flex justify-center mb-4">
                <motion.div
                  animate={treasureOpen ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <PixelTreasure open={treasureOpen} />
                </motion.div>
              </div>
              <button
                onClick={() => setTreasureOpen(!treasureOpen)}
                className="w-full px-4 py-3 bg-yellow-600 border-4 border-yellow-700 text-black text-xs hover:bg-yellow-500"
              >
                {treasureOpen ? '✓ OPENED' : 'OPEN CHEST'}
              </button>
              <AnimatePresence>
                {treasureOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 text-xs text-yellow-300 text-center"
                  >
                    +100 GOLD!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* 右サイド - クエスト */}
          <motion.div 
            className="lg:col-span-2 space-y-6"
            initial={{ x: 200 }}
            animate={{ x: 0 }}
          >
            {/* クエストボード */}
            <div className="bg-orange-900 border-8 border-orange-500 p-4 relative">
              <div className="absolute -top-3 -left-3 w-6 h-6 bg-orange-500"></div>
              <div className="absolute -top-3 -right-3 w-6 h-6 bg-orange-500"></div>
              <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-orange-500"></div>
              <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-orange-500"></div>
              
              <div className="text-sm text-orange-300 mb-4 text-center">
                ▼ QUEST BOARD ▼
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quests.map((quest, idx) => (
                  <motion.div
                    key={quest.id}
                    className={`bg-gradient-to-br from-purple-700 to-pink-700 border-4 p-4 cursor-pointer relative ${
                      selectedQuest === quest.id ? 'border-yellow-400' : 'border-black'
                    }`}
                    initial={{ opacity: 0, rotate: -5 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedQuest(quest.id)}
                  >
                    <div className="text-xs text-white font-bold mb-2">{quest.title}</div>
                    <div className="text-xs text-gray-200 mb-2">{quest.description}</div>
                    <div className="flex justify-between text-xs">
                      <span className="text-yellow-300">{quest.difficulty}</span>
                      <span className="text-green-300">{quest.reward}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <AnimatePresence>
                {selectedQuest && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mt-4 p-4 bg-black border-4 border-yellow-400"
                  >
                    <div className="text-xs text-yellow-400 mb-3 text-center">
                      ACCEPT QUEST?
                    </div>
                    <div className="flex gap-2 justify-center">
                      <button className="px-6 py-2 bg-green-600 border-4 border-green-700 text-white text-xs">
                        YES
                      </button>
                      <button 
                        onClick={() => setSelectedQuest(null)}
                        className="px-6 py-2 bg-red-600 border-4 border-red-700 text-white text-xs"
                      >
                        NO
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ギャラリー */}
            <div className="bg-green-900 border-8 border-green-500 p-4 relative">
              <div className="absolute -top-3 -left-3 w-6 h-6 bg-green-500"></div>
              <div className="absolute -top-3 -right-3 w-6 h-6 bg-green-500"></div>
              <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-green-500"></div>
              <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-green-500"></div>
              
              <div className="text-xs text-green-300 mb-4 text-center">
                PIXEL ART GALLERY
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-black border-4 border-gray-700 p-3 flex flex-col items-center">
                  <PixelCharacter walking={false} />
                  <div className="text-xs text-gray-400 mt-2">HERO</div>
                </div>
                <div className="bg-black border-4 border-gray-700 p-3 flex flex-col items-center justify-center">
                  <PixelCoin />
                  <div className="text-xs text-gray-400 mt-2">COIN</div>
                </div>
                <div className="bg-black border-4 border-gray-700 p-3 flex flex-col items-center justify-center">
                  <PixelHeart filled={true} />
                  <div className="text-xs text-gray-400 mt-2">HEART</div>
                </div>
                <div className="bg-black border-4 border-gray-700 p-3 flex flex-col items-center justify-center">
                  <div className="scale-75">
                    <PixelTreasure open={false} />
                  </div>
                  <div className="text-xs text-gray-400 mt-2">CHEST</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* フッター */}
      <div className="border-t-8 border-yellow-500 bg-gradient-to-r from-purple-900 to-blue-900 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <p className="text-yellow-400 text-xs">
            (C) 2024 COCOTY - PIXEL ART RPG
          </p>
          <p className="text-purple-300 text-xs mt-2">
            MADE WITH REACT + CSS PIXEL ART + FRAMER MOTION
          </p>
        </div>
      </div>
    </div>
  );
}
