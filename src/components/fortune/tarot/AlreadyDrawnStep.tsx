import React from 'react';
import { History, Sparkles } from 'lucide-react';

interface AlreadyDrawnStepProps {
  onViewHistory: () => void;
  lastDrawnCard?: {
    card_name?: string;
    card_number?: number;
    interpretation?: string;
  } | null;
}

export const AlreadyDrawnStep: React.FC<AlreadyDrawnStepProps> = ({ 
  onViewHistory,
  lastDrawnCard 
}) => {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-6">🔮</div>
      <h3 className="text-2xl font-bold text-white mb-4">本日の占い結果</h3>
      
      {lastDrawnCard?.card_name ? (
        <div className="mb-8">
          <div className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl mb-4">
            <p className="text-white text-lg font-semibold">
              {lastDrawnCard.card_name}
            </p>
          </div>
          {lastDrawnCard.interpretation && (
            <p className="text-purple-200 max-w-md mx-auto">
              {lastDrawnCard.interpretation}
            </p>
          )}
        </div>
      ) : (
        <p className="text-purple-200 mb-8">
          本日の占い結果を表示中<br />
          次回は明日0:00から占えます
        </p>
      )}
      
      <p className="text-purple-300 text-sm mb-6">
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
