import React from 'react';
import { DrawnCardResult } from './types';

interface ResultStepProps {
  drawnCard: DrawnCardResult;
  interpretation: string;
  onComment: () => void;
  onClose: () => void;
}

export const ResultStep: React.FC<ResultStepProps> = ({
  drawnCard,
  interpretation,
  onComment,
  onClose
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-block p-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-2xl mb-6">
          <div className="text-6xl mb-4">{drawnCard.isReversed ? '🔄' : '✨'}</div>
          <h3 className="text-3xl font-bold text-white">{drawnCard.card.name}</h3>
          <p className="text-sm text-yellow-100 mt-2">{drawnCard.card.name_en}</p>
          {drawnCard.isReversed && (
            <div className="mt-3 px-4 py-2 bg-white/20 rounded-lg">
              <span className="text-sm text-white font-semibold">逆位置</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <h4 className="text-lg font-bold text-white mb-3">🔮 カードの意味</h4>
        <p className="text-purple-100 leading-relaxed whitespace-pre-line">
          {interpretation}
        </p>
      </div>

      <div className="bg-gradient-to-r from-purple-600/50 to-pink-600/50 rounded-xl p-6">
        <h4 className="text-lg font-bold text-white mb-3">💡 キーワード</h4>
        <p className="text-white">
          {drawnCard.isReversed ? drawnCard.card.reverse_meaning : drawnCard.card.meaning}
        </p>
      </div>

      <div className="text-center space-y-4">
        <button
          onClick={onComment}
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all"
        >
          感想を残す
        </button>
        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all"
        >
          終了する
        </button>
      </div>
    </div>
  );
};
