import React from 'react';

// キラキラの配置設定
const SPARKLE_POSITIONS = [
  { top: '15%', left: '20%', delay: 0, size: 'large' as const },
  { top: '20%', left: '75%', delay: 0.3, size: 'medium' as const },
  { top: '30%', left: '85%', delay: 0.6, size: 'large' as const },
  { top: '50%', left: '10%', delay: 0.9, size: 'small' as const },
  { top: '70%', left: '25%', delay: 1.2, size: 'medium' as const },
  { top: '75%', left: '80%', delay: 1.5, size: 'large' as const },
];

const SPARKLE_SIZES = {
  large: 48,
  medium: 36,
  small: 24,
} as const;

// ホワイトアウト演出コンポーネント
export const WhiteoutAnimation: React.FC = () => {
  return (
    <>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{
          background: 'white',
          animation: 'fadeIn 0.3s ease-in'
        }}
      >
        {/* 中央の光線グラデーション */}
        <RadialGradient />
        
        {/* 周りのキラキラ */}
        <SparkleEffects />
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes gradientPulse {
          0% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.2);
          }
          100% {
            opacity: 0.6;
            transform: scale(1);
          }
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
          }
        }
      `}</style>
    </>
  );
};

// 中央の光線グラデーション
const RadialGradient: React.FC = () => {
  return (
    <div
      className="absolute"
      style={{
        width: '800px',
        height: '800px',
        background: 'radial-gradient(circle, rgba(255,215,0,0.3) 0%, rgba(255,255,255,0) 70%)',
        animation: 'gradientPulse 2s ease-out',
      }}
    />
  );
};

// キラキラエフェクト全体
const SparkleEffects: React.FC = () => {
  return (
    <div className="absolute inset-0">
      {SPARKLE_POSITIONS.map((sparkle, i) => (
        <Sparkle
          key={i}
          top={sparkle.top}
          left={sparkle.left}
          size={sparkle.size}
          delay={sparkle.delay}
        />
      ))}
    </div>
  );
};

// 個別のキラキラコンポーネント
interface SparkleProps {
  top: string;
  left: string;
  size: 'large' | 'medium' | 'small';
  delay: number;
}

const Sparkle: React.FC<SparkleProps> = ({ top, left, size, delay }) => {
  const sparkleSize = SPARKLE_SIZES[size];
  
  return (
    <div
      className="absolute"
      style={{
        top,
        left,
        animation: `sparkle 2s ease-in-out ${delay}s`,
      }}
    >
      <svg
        width={sparkleSize}
        height={sparkleSize}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 縦線 */}
        <path
          d="M12 2 L12 22"
          stroke="#FFA500"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* 横線 */}
        <path
          d="M2 12 L22 12"
          stroke="#FFA500"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* 中央のダイヤ */}
        <circle
          cx="12"
          cy="12"
          r="3"
          fill="#FFD700"
        />
      </svg>
    </div>
  );
};
