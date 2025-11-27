'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { useSpring as useReactSpring, animated, config } from 'react-spring';
import gsap from 'gsap';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Stars } from '@react-three/drei';
import ParticlesBg from 'particles-bg';
import * as THREE from 'three';
import { 
  GiSwordman, 
  GiTreasureMap, 
  GiCrystalBall, 
  GiCrossedSwords,
  GiSparkles,
  GiHeartPlus,
  GiHealthPotion,
  GiShield,
  GiMagicSwirl,
  GiDragonOrb,
  GiFireRing,
  GiIceBolt,
  GiLightningStorm,
  GiTornado
} from 'react-icons/gi';
import './rpg.css';

// 3D回転する魔法陣
const MagicCircle = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.3;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 100, 100]} scale={2}>
      <MeshDistortMaterial
        color="#9b59b6"
        attach="material"
        distort={0.5}
        speed={2}
        roughness={0.2}
      />
    </Sphere>
  );
};

// 3D浮遊する宝石
const FloatingGem = ({ position }: { position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 2) * 0.5;
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <octahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
    </mesh>
  );
};

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
  const [mp, setMp] = useState(100);
  const [exp, setExp] = useState(450);
  const [level, setLevel] = useState(5);
  const [gold, setGold] = useState(3250);
  const [showBattle, setShowBattle] = useState(false);
  const [enemyHp, setEnemyHp] = useState(100);
  const [showDamage, setShowDamage] = useState<{x: number, y: number, damage: number} | null>(null);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number}>>([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [combo, setCombo] = useState(0);
  const [shake, setShake] = useState(false);
  const [skillEffect, setSkillEffect] = useState<string | null>(null);
  const [show3DScene, setShow3DScene] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 200, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 200, damping: 30 });

  const battleRef = useRef<HTMLDivElement>(null);
  const expBarRef = useRef<HTMLDivElement>(null);

  // マウス追従
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // パーティクル生成
  const createParticles = (x: number, y: number) => {
    const newParticles = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: x + (Math.random() - 0.5) * 100,
      y: y + (Math.random() - 0.5) * 100
    }));
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1000);
  };

  // 攻撃アニメーション
  const attack = () => {
    if (!battleRef.current) return;
    
    const damage = Math.floor(Math.random() * 30) + 20;
    setEnemyHp(prev => Math.max(0, prev - damage));
    setCombo(prev => prev + 1);
    
    // ダメージ表示
    setShowDamage({
      x: Math.random() * 200 + 100,
      y: Math.random() * 100 + 50,
      damage
    });
    setTimeout(() => setShowDamage(null), 1000);

    // パーティクル
    createParticles(300, 200);

    // シェイク
    setShake(true);
    setTimeout(() => setShake(false), 200);

    // GSAP アニメーション
    gsap.fromTo(battleRef.current, 
      { scale: 1 },
      { scale: 1.05, duration: 0.1, yoyo: true, repeat: 1 }
    );

    // 経験値
    setExp(prev => {
      const newExp = prev + 50;
      if (newExp >= 1000) {
        setShowLevelUp(true);
        setLevel(prev => prev + 1);
        setTimeout(() => setShowLevelUp(false), 2000);
        return 0;
      }
      return newExp;
    });
  };

  // スキルアニメーション
  const useSkill = () => {
    if (mp < 30) return;
    setMp(prev => prev - 30);
    
    const damage = Math.floor(Math.random() * 50) + 50;
    setEnemyHp(prev => Math.max(0, prev - damage));
    
    setShowDamage({
      x: 150,
      y: 100,
      damage
    });
    setTimeout(() => setShowDamage(null), 1000);

    createParticles(300, 200);
    
    if (expBarRef.current) {
      gsap.fromTo(expBarRef.current,
        { opacity: 0.5 },
        { opacity: 1, duration: 0.3, yoyo: true, repeat: 3 }
      );
    }
  };

  // 新しい魔法スキル
  const useMagicSkill = (skillType: string) => {
    if (mp < 50) return;
    setMp(prev => prev - 50);
    setSkillEffect(skillType);
    
    const damage = Math.floor(Math.random() * 80) + 70;
    setEnemyHp(prev => Math.max(0, prev - damage));
    
    setShowDamage({
      x: 150,
      y: 100,
      damage
    });
    
    // GSAP タイムライン
    const tl = gsap.timeline();
    tl.to(battleRef.current, { scale: 1.1, duration: 0.2 })
      .to(battleRef.current, { scale: 1, duration: 0.2 });
    
    createParticles(300, 200);
    
    setTimeout(() => setSkillEffect(null), 2000);
  };

  // React Spring アニメーション
  const hpBarSpring = useReactSpring({
    width: `${(hp / 5) * 100}%`,
    config: config.wobbly
  });

  const mpBarSpring = useReactSpring({
    width: `${mp}%`,
    config: config.molasses
  });

  const expBarSpring = useReactSpring({
    width: `${(exp / 1000) * 100}%`,
    config: config.slow
  });

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
      {/* パーティクル背景 */}
      <div className="fixed inset-0 z-0">
        <ParticlesBg type="cobweb" bg={true} color="#9b59b6" num={50} />
      </div>

      {/* 3Dシーン */}
      <AnimatePresence>
        {show3DScene && (
          <motion.div
            className="fixed inset-0 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Canvas>
              <Suspense fallback={null}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <MagicCircle />
                <FloatingGem position={[-3, 0, 0]} />
                <FloatingGem position={[3, 0, 0]} />
                <FloatingGem position={[0, 3, 0]} />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <OrbitControls enableZoom={false} />
              </Suspense>
            </Canvas>
            <button
              onClick={() => setShow3DScene(false)}
              className="absolute top-4 right-4 px-4 py-2 bg-red-600 border-4 border-red-700 text-white text-xs z-40"
            >
              CLOSE 3D
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* スキルエフェクト */}
      <AnimatePresence>
        {skillEffect && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {skillEffect === 'fire' && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-red-500 to-orange-500 mix-blend-screen"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.5, repeat: 3 }}
              />
            )}
            {skillEffect === 'ice' && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-blue-300 to-cyan-500 mix-blend-screen"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.5, repeat: 3 }}
              />
            )}
            {skillEffect === 'lightning' && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-yellow-300 to-purple-500 mix-blend-screen"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 0.1, repeat: 10 }}
              />
            )}
            {skillEffect === 'tornado' && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-400 to-teal-500 mix-blend-screen"
                animate={{ rotate: 360 }}
                transition={{ duration: 2 }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {/* パーティクルエフェクト */}
      <AnimatePresence>
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full pointer-events-none"
            initial={{ x: particle.x, y: particle.y, scale: 1, opacity: 1 }}
            animate={{ 
              y: particle.y - 100,
              scale: 0,
              opacity: 0
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{ left: particle.x, top: particle.y }}
          />
        ))}
      </AnimatePresence>

      {/* レベルアップエフェクト */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-6xl font-bold text-yellow-400"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: [0, 1.5, 1], rotate: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-4">
                <GiSparkles className="animate-spin" />
                LEVEL UP!
                <GiSparkles className="animate-spin" />
              </div>
              <motion.div
                className="text-2xl text-center mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Lv.{level} → Lv.{level + 1}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* マウス追従カーソル */}
      <motion.div
        className="fixed w-8 h-8 pointer-events-none z-50"
        style={{
          x: springX,
          y: springY,
          left: '50%',
          top: '50%'
        }}
      >
        <GiMagicSwirl className="w-full h-full text-purple-400 animate-spin" />
      </motion.div>
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
                <span className="text-yellow-400 text-xs">{gold}G</span>
              </div>
              <div className="bg-black border-4 border-purple-500 px-3 py-2 flex items-center gap-2">
                <GiSwordman className="text-purple-400" />
                <span className="text-purple-400 text-xs">Lv.{level}</span>
              </div>
            </div>
          </div>

          {/* 新しいステータスバー */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
            {/* HP Bar */}
            <div className="bg-black/70 border-2 border-red-500 p-2 rounded">
              <div className="flex items-center justify-between mb-1">
                <span className="text-red-400">❤ HP</span>
                <span className="text-white">{hp * 20}/100</span>
              </div>
              <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">
                <animated.div 
                  className="bg-gradient-to-r from-red-600 to-red-400 h-full"
                  style={hpBarSpring}
                />
              </div>
            </div>

            {/* MP Bar */}
            <div className="bg-black/70 border-2 border-blue-500 p-2 rounded">
              <div className="flex items-center justify-between mb-1">
                <span className="text-blue-400">✦ MP</span>
                <span className="text-white">{mp}/100</span>
              </div>
              <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">
                <animated.div 
                  className="bg-gradient-to-r from-blue-600 to-blue-400 h-full"
                  style={mpBarSpring}
                />
              </div>
            </div>

            {/* EXP Bar */}
            <div className="bg-black/70 border-2 border-green-500 p-2 rounded">
              <div className="flex items-center justify-between mb-1">
                <span className="text-green-400">⭐ EXP</span>
                <span className="text-white">{exp}/1000</span>
              </div>
              <div ref={expBarRef} className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">
                <animated.div 
                  className="bg-gradient-to-r from-green-600 to-green-400 h-full"
                  style={expBarSpring}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* バトルシステム */}
      <AnimatePresence>
        {showBattle && (
          <motion.div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="max-w-4xl w-full px-4">
              <motion.div
                ref={battleRef}
                className={`bg-gradient-to-br from-purple-900 to-red-900 border-8 border-yellow-500 p-8 relative ${shake ? 'animate-shake' : ''}`}
                initial={{ scale: 0.8, rotateY: 180 }}
                animate={{ scale: 1, rotateY: 0 }}
                transition={{ type: "spring", duration: 0.8 }}
              >
                {/* コンボ表示 */}
                {combo > 0 && (
                  <motion.div
                    className="absolute -top-8 right-4 text-4xl font-bold text-yellow-400"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.5, 1] }}
                  >
                    {combo} COMBO!
                  </motion.div>
                )}

                {/* ダメージ表示 */}
                <AnimatePresence>
                  {showDamage && (
                    <motion.div
                      className="absolute text-6xl font-bold text-red-500"
                      style={{ left: showDamage.x, top: showDamage.y }}
                      initial={{ opacity: 1, scale: 0, y: 0 }}
                      animate={{ opacity: 0, scale: 2, y: -100 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1 }}
                    >
                      -{showDamage.damage}
                    </motion.div>
                  )}
                </AnimatePresence>

                <h2 className="text-2xl text-yellow-400 text-center mb-6 flex items-center justify-center gap-3">
                  <GiCrossedSwords />
                  BATTLE MODE
                  <GiCrossedSwords />
                </h2>

                <div className="grid grid-cols-2 gap-8 mb-8">
                  {/* プレイヤー */}
                  <div className="text-center">
                    <motion.div
                      className="text-6xl mb-4"
                      animate={{ 
                        rotate: [0, -10, 10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <GiSwordman className="inline-block text-blue-400" />
                    </motion.div>
                    <div className="text-sm text-blue-300">HERO</div>
                    <div className="text-xs text-white mt-2">HP: {hp * 20}/100</div>
                    <div className="text-xs text-white">MP: {mp}/100</div>
                  </div>

                  {/* 敵 */}
                  <div className="text-center">
                    <motion.div
                      className="text-6xl mb-4"
                      animate={enemyHp > 0 ? { 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.05, 1]
                      } : {
                        opacity: 0,
                        scale: 0,
                        rotate: 360
                      }}
                      transition={{ repeat: enemyHp > 0 ? Infinity : 0, duration: 1.5 }}
                    >
                      <GiCrystalBall className="inline-block text-red-400" />
                    </motion.div>
                    <div className="text-sm text-red-300">ENEMY</div>
                    <div className="text-xs text-white mt-2">HP: {enemyHp}/100</div>
                    <div className="w-full bg-gray-800 h-2 rounded-full mt-2">
                      <motion.div
                        className="bg-red-500 h-full rounded-full"
                        initial={{ width: '100%' }}
                        animate={{ width: `${enemyHp}%` }}
                        transition={{ type: "spring" }}
                      />
                    </div>
                  </div>
                </div>

                {/* バトルコマンド */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <motion.button
                    onClick={attack}
                    className="bg-red-600 border-4 border-red-700 p-3 text-white text-xs hover:bg-red-500 relative overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={enemyHp <= 0}
                  >
                    <GiCrossedSwords className="inline mr-1" />
                    ATTACK
                  </motion.button>

                  <motion.button
                    onClick={useSkill}
                    className={`border-4 p-3 text-white text-xs relative overflow-hidden ${
                      mp >= 30 ? 'bg-blue-600 border-blue-700 hover:bg-blue-500' : 'bg-gray-600 border-gray-700 cursor-not-allowed'
                    }`}
                    whileHover={mp >= 30 ? { scale: 1.05 } : {}}
                    whileTap={mp >= 30 ? { scale: 0.95 } : {}}
                    disabled={mp < 30 || enemyHp <= 0}
                  >
                    <GiMagicSwirl className="inline mr-1" />
                    SKILL
                    <span className="block text-xs">(30MP)</span>
                  </motion.button>

                  <motion.button
                    onClick={() => {
                      setHp(prev => Math.min(5, prev + 1));
                      setMp(prev => Math.min(100, prev + 20));
                    }}
                    className="bg-green-600 border-4 border-green-700 p-3 text-white text-xs hover:bg-green-500"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <GiHealthPotion className="inline mr-1" />
                    POTION
                  </motion.button>

                  <motion.button
                    onClick={() => {
                      setShowBattle(false);
                      setEnemyHp(100);
                      setCombo(0);
                    }}
                    className="bg-gray-600 border-4 border-gray-700 p-3 text-white text-xs hover:bg-gray-500"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <GiShield className="inline mr-1" />
                    {enemyHp <= 0 ? 'VICTORY!' : 'FLEE'}
                  </motion.button>
                </div>

                {/* 魔法スキル */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <motion.button
                    onClick={() => useMagicSkill('fire')}
                    className={`border-4 p-2 text-white text-xs relative ${
                      mp >= 50 ? 'bg-red-700 border-red-800 hover:bg-red-600' : 'bg-gray-700 border-gray-800 cursor-not-allowed'
                    }`}
                    whileHover={mp >= 50 ? { scale: 1.05 } : {}}
                    whileTap={mp >= 50 ? { scale: 0.95 } : {}}
                    disabled={mp < 50 || enemyHp <= 0}
                  >
                    <GiFireRing className="inline mr-1 animate-pulse" />
                    FIRE
                  </motion.button>

                  <motion.button
                    onClick={() => useMagicSkill('ice')}
                    className={`border-4 p-2 text-white text-xs relative ${
                      mp >= 50 ? 'bg-cyan-700 border-cyan-800 hover:bg-cyan-600' : 'bg-gray-700 border-gray-800 cursor-not-allowed'
                    }`}
                    whileHover={mp >= 50 ? { scale: 1.05 } : {}}
                    whileTap={mp >= 50 ? { scale: 0.95 } : {}}
                    disabled={mp < 50 || enemyHp <= 0}
                  >
                    <GiIceBolt className="inline mr-1" />
                    ICE
                  </motion.button>

                  <motion.button
                    onClick={() => useMagicSkill('lightning')}
                    className={`border-4 p-2 text-white text-xs relative ${
                      mp >= 50 ? 'bg-yellow-600 border-yellow-700 hover:bg-yellow-500' : 'bg-gray-700 border-gray-800 cursor-not-allowed'
                    }`}
                    whileHover={mp >= 50 ? { scale: 1.05 } : {}}
                    whileTap={mp >= 50 ? { scale: 0.95 } : {}}
                    disabled={mp < 50 || enemyHp <= 0}
                  >
                    <GiLightningStorm className="inline mr-1 animate-bounce" />
                    THUNDER
                  </motion.button>

                  <motion.button
                    onClick={() => useMagicSkill('tornado')}
                    className={`border-4 p-2 text-white text-xs relative ${
                      mp >= 50 ? 'bg-green-700 border-green-800 hover:bg-green-600' : 'bg-gray-700 border-gray-800 cursor-not-allowed'
                    }`}
                    whileHover={mp >= 50 ? { scale: 1.05 } : {}}
                    whileTap={mp >= 50 ? { scale: 0.95 } : {}}
                    disabled={mp < 50 || enemyHp <= 0}
                  >
                    <GiTornado className="inline mr-1 animate-spin" />
                    WIND
                  </motion.button>
                </div>

                {enemyHp <= 0 && (
                  <motion.div
                    className="mt-6 text-center text-yellow-400 text-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <GiSparkles className="inline mr-2" />
                    VICTORY!
                    <GiSparkles className="inline ml-2" />
                    <div className="text-sm mt-2">
                      獲得: +200 EXP, +150 GOLD
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 新しいアクションボタンセクション */}
        <motion.div
          className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.button
            onClick={() => setShowBattle(true)}
            className="bg-gradient-to-r from-red-600 to-orange-600 border-4 border-red-700 p-4 text-white text-xs hover:from-red-500 hover:to-orange-500 relative overflow-hidden"
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,0,0,0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-white opacity-20"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            />
            <GiCrossedSwords className="inline text-2xl mb-2" />
            <div>START BATTLE</div>
          </motion.button>

          <motion.button
            onClick={() => setShow3DScene(!show3DScene)}
            className="bg-gradient-to-r from-purple-700 to-indigo-700 border-4 border-purple-800 p-4 text-white text-xs hover:from-purple-600 hover:to-indigo-600 relative overflow-hidden"
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(147,51,234,0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            <GiCrystalBall className="inline text-2xl mb-2 animate-pulse" />
            <div>{show3DScene ? 'HIDE 3D' : 'SHOW 3D'}</div>
          </motion.button>

          <motion.button
            onClick={() => {
              setHp(5);
              setMp(100);
              createParticles(200, 200);
            }}
            className="bg-gradient-to-r from-green-600 to-emerald-600 border-4 border-green-700 p-4 text-white text-xs hover:from-green-500 hover:to-emerald-500"
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0,255,0,0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            <GiHeartPlus className="inline text-2xl mb-2" />
            <div>FULL HEAL</div>
          </motion.button>

          <motion.button
            onClick={() => {
              const newGold = gold + 500;
              setGold(newGold);
              createParticles(400, 200);
            }}
            className="bg-gradient-to-r from-yellow-600 to-amber-600 border-4 border-yellow-700 p-4 text-white text-xs hover:from-yellow-500 hover:to-amber-500"
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,215,0,0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            <PixelCoin />
            <div className="mt-2">GET GOLD</div>
          </motion.button>

          <motion.button
            onClick={() => {
              const newExp = exp + 200;
              if (newExp >= 1000) {
                setShowLevelUp(true);
                setLevel(prev => prev + 1);
                setTimeout(() => setShowLevelUp(false), 2000);
                setExp(newExp - 1000);
              } else {
                setExp(newExp);
              }
            }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 border-4 border-purple-700 p-4 text-white text-xs hover:from-purple-500 hover:to-pink-500"
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(128,0,128,0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            <GiSparkles className="inline text-2xl mb-2 animate-spin" />
            <div>GAIN EXP</div>
          </motion.button>
        </motion.div>
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
