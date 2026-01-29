import React from 'react';
import { TarotReading } from '@/lib/api/tarot';
import { ArrowLeft } from 'lucide-react';

interface HistoryDetailStepProps {
  reading: TarotReading;
  onBack: () => void;
}

export const HistoryDetailStep: React.FC<HistoryDetailStepProps> = ({ reading, onBack }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMentalStateLabel = (state: string) => {
    const labels = {
      sunny: '☀️ 晴れ',
      cloudy: '☁️ 曇り',
      rainy: '🌧️ 雨'
    };
    return labels[state as keyof typeof labels] || state;
  };

  const getTargetLabel = (target: string) => {
    return target === 'self' ? '自分' : '相手';
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>
        <div>
          <h3 className="text-xl font-bold text-white">占い結果の詳細</h3>
          <p className="text-sm text-purple-200">{formatDate(reading.created_at)}</p>
        </div>
      </div>

      {/* カード情報 */}
      <div className="text-center">
        <div className="inline-block p-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-2xl mb-4">
          <div className="text-6xl mb-4">{reading.is_reversed ? '🔄' : '✨'}</div>
          <h3 className="text-3xl font-bold text-white">{reading.card.name}</h3>
          <p className="text-sm text-yellow-100 mt-2">{reading.card.name_en}</p>
          {reading.is_reversed && (
            <div className="mt-3 px-4 py-2 bg-white/20 rounded-lg">
              <span className="text-sm text-white font-semibold">逆位置</span>
            </div>
          )}
        </div>
      </div>

      {/* 占いの状況 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl">
          <p className="text-sm text-purple-200 mb-1">対象</p>
          <p className="text-lg font-bold text-white">{getTargetLabel(reading.target)}</p>
        </div>
        <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl">
          <p className="text-sm text-purple-200 mb-1">その時の気分</p>
          <p className="text-lg font-bold text-white">{getMentalStateLabel(reading.mental_state)}</p>
        </div>
      </div>

      {/* 解釈 */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <h4 className="text-lg font-bold text-white mb-3">🔮 当時の解釈</h4>
        <p className="text-purple-100 leading-relaxed whitespace-pre-line">
          {reading.interpretation}
        </p>
      </div>

      {/* キーワード */}
      <div className="bg-gradient-to-r from-purple-600/50 to-pink-600/50 rounded-xl p-6">
        <h4 className="text-lg font-bold text-white mb-3">💡 キーワード</h4>
        <p className="text-white">
          {reading.is_reversed ? reading.card.reverse_meaning : reading.card.meaning}
        </p>
      </div>

      {/* カードの説明 */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <h4 className="text-lg font-bold text-white mb-3">📖 カードの説明</h4>
        <p className="text-purple-100 leading-relaxed">
          {reading.card.description}
        </p>
      </div>

      {/* ユーザーの感想 */}
      {reading.user_comment && (
        <div className="bg-gradient-to-r from-blue-600/50 to-indigo-600/50 rounded-xl p-6">
          <h4 className="text-lg font-bold text-white mb-3">💭 あなたの感想</h4>
          <p className="text-white leading-relaxed italic">
            {reading.user_comment}
          </p>
        </div>
      )}

      {/* 戻るボタン */}
      <button
        onClick={onBack}
        className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all"
      >
        履歴一覧に戻る
      </button>
    </div>
  );
};
