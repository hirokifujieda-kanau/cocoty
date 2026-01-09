import React from 'react';

export const ShuffleStep: React.FC = () => {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-6 animate-spin">🔮</div>
      <h3 className="text-2xl font-bold text-white mb-4">カードをシャッフル中...</h3>
      <p className="text-purple-200">
        心を落ち着けて、カードの声に耳を傾けましょう
      </p>
    </div>
  );
};
