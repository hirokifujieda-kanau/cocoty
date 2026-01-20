import React from 'react';
import { History } from 'lucide-react';

interface AlreadyDrawnStepProps {
  onViewHistory: () => void;
}

export const AlreadyDrawnStep: React.FC<AlreadyDrawnStepProps> = ({ onViewHistory }) => {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-6">🔮</div>
      <h3 className="text-2xl font-bold text-white mb-4">本日の占いは終了しました</h3>
      <p className="text-purple-200 mb-8">
        タロット占いは1日1回までです。<br />
        明日また新しい運勢を占いましょう。
      </p>
      <button
        onClick={onViewHistory}
        className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
      >
        <History className="h-5 w-5" />
        過去の占い結果を見る
      </button>
    </div>
  );
};
