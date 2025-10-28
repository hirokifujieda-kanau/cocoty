'use client';

import React, { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, Activity, Calendar, BarChart3, Heart } from 'lucide-react';

interface MentalCheckHistory {
  date: string;
  score: number;
  level: 'excellent' | 'good' | 'normal' | 'low' | 'critical';
  message: string;
}

interface MentalStatsProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const MENTAL_CHECK_HISTORY_KEY = 'cocoty_mental_check_history';

const MentalStatsAdmin: React.FC<MentalStatsProps> = ({
  isOpen,
  onClose,
  userId
}) => {
  const [history, setHistory] = useState<MentalCheckHistory[]>([]);
  const [averageScore, setAverageScore] = useState(0);
  const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable');
  const [selectedPeriod, setSelectedPeriod] = useState<'7days' | '30days' | 'all'>('30days');

  useEffect(() => {
    if (!isOpen) return;
    loadMentalHistory();
  }, [isOpen, userId, selectedPeriod]);

  const loadMentalHistory = () => {
    try {
      const historyRaw = localStorage.getItem(`${MENTAL_CHECK_HISTORY_KEY}_${userId}`);
      if (historyRaw) {
        const allHistory: MentalCheckHistory[] = JSON.parse(historyRaw);
        
        // 期間でフィルタリング
        const filteredHistory = filterByPeriod(allHistory, selectedPeriod);
        setHistory(filteredHistory);

        // 平均スコアを計算
        if (filteredHistory.length > 0) {
          const avg = filteredHistory.reduce((sum, h) => sum + h.score, 0) / filteredHistory.length;
          setAverageScore(Math.round(avg));

          // トレンドを計算
          if (filteredHistory.length >= 2) {
            const recent = filteredHistory.slice(-3);
            const older = filteredHistory.slice(0, -3);
            
            if (older.length > 0) {
              const recentAvg = recent.reduce((sum, h) => sum + h.score, 0) / recent.length;
              const olderAvg = older.reduce((sum, h) => sum + h.score, 0) / older.length;
              
              if (recentAvg > olderAvg + 5) setTrend('up');
              else if (recentAvg < olderAvg - 5) setTrend('down');
              else setTrend('stable');
            }
          }
        }
      } else {
        // ダミーデータ
        const dummyHistory = generateDummyHistory();
        setHistory(dummyHistory);
        localStorage.setItem(`${MENTAL_CHECK_HISTORY_KEY}_${userId}`, JSON.stringify(dummyHistory));
      }
    } catch (e) {
      console.error('Failed to load mental history', e);
    }
  };

  const filterByPeriod = (data: MentalCheckHistory[], period: string) => {
    const today = new Date();
    const cutoffDate = new Date();
    
    if (period === '7days') {
      cutoffDate.setDate(today.getDate() - 7);
    } else if (period === '30days') {
      cutoffDate.setDate(today.getDate() - 30);
    } else {
      return data;
    }

    return data.filter(h => new Date(h.date) >= cutoffDate);
  };

  const generateDummyHistory = (): MentalCheckHistory[] => {
    const history: MentalCheckHistory[] = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      // ランダムなスコア生成（トレンドを持たせる）
      const baseScore = 60 + Math.sin(i / 5) * 20;
      const randomVariation = (Math.random() - 0.5) * 10;
      const score = Math.max(20, Math.min(100, Math.round(baseScore + randomVariation)));

      let level: MentalCheckHistory['level'];
      if (score >= 85) level = 'excellent';
      else if (score >= 70) level = 'good';
      else if (score >= 50) level = 'normal';
      else if (score >= 30) level = 'low';
      else level = 'critical';

      history.push({
        date: date.toISOString(),
        score,
        level,
        message: getLevelMessage(level)
      });
    }

    return history;
  };

  const getLevelMessage = (level: MentalCheckHistory['level']) => {
    switch (level) {
      case 'excellent': return '素晴らしい！';
      case 'good': return '良好です';
      case 'normal': return '普通です';
      case 'low': return '少し疲れ気味';
      case 'critical': return '休息が必要';
      default: return '';
    }
  };

  const getLevelColor = (level: MentalCheckHistory['level']) => {
    switch (level) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'normal': return 'bg-yellow-500';
      case 'low': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getLevelBgColor = (level: MentalCheckHistory['level']) => {
    switch (level) {
      case 'excellent': return 'bg-green-50 border-green-200';
      case 'good': return 'bg-blue-50 border-blue-200';
      case 'normal': return 'bg-yellow-50 border-yellow-200';
      case 'low': return 'bg-orange-50 border-orange-200';
      case 'critical': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    if (score >= 30) return 'text-orange-600';
    return 'text-red-600';
  };

  const getLevelDistribution = () => {
    const distribution = {
      excellent: 0,
      good: 0,
      normal: 0,
      low: 0,
      critical: 0
    };

    history.forEach(h => {
      distribution[h.level]++;
    });

    return distribution;
  };

  if (!isOpen) return null;

  const distribution = getLevelDistribution();
  const maxScore = Math.max(...history.map(h => h.score), 0);
  const minScore = Math.min(...history.map(h => h.score), 100);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60 p-4">
      <div className="w-full max-w-6xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* ヘッダー */}
        <div className="p-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity size={32} />
              <div>
                <h2 className="text-2xl font-bold">メンタル状態 統計</h2>
                <p className="text-sm opacity-90">あなたの心の健康トレンド</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* コンテンツ */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 期間選択 */}
          <div className="flex gap-2 justify-center">
            {(['7days', '30days', 'all'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  selectedPeriod === period
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {period === '7days' ? '過去7日間' : period === '30days' ? '過去30日間' : '全期間'}
              </button>
            ))}
          </div>

          {/* サマリーカード */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* 平均スコア */}
            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg border-2 border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="text-purple-600" size={20} />
                <h3 className="font-bold text-gray-700 text-sm">平均スコア</h3>
              </div>
              <div className={`text-4xl font-bold ${getScoreColor(averageScore)}`}>
                {averageScore}
              </div>
              <div className="text-xs text-gray-600 mt-1">/ 100</div>
            </div>

            {/* トレンド */}
            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                {trend === 'up' ? (
                  <TrendingUp className="text-green-600" size={20} />
                ) : trend === 'down' ? (
                  <TrendingDown className="text-red-600" size={20} />
                ) : (
                  <Activity className="text-blue-600" size={20} />
                )}
                <h3 className="font-bold text-gray-700 text-sm">トレンド</h3>
              </div>
              <div className="text-2xl font-bold text-gray-800">
                {trend === 'up' ? '上昇中 📈' : trend === 'down' ? '下降中 📉' : '安定 →'}
              </div>
            </div>

            {/* 最高スコア */}
            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg border-2 border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="text-green-600" size={20} />
                <h3 className="font-bold text-gray-700 text-sm">最高スコア</h3>
              </div>
              <div className="text-4xl font-bold text-green-600">
                {maxScore}
              </div>
            </div>

            {/* 最低スコア */}
            <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl shadow-lg border-2 border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="text-orange-600" size={20} />
                <h3 className="font-bold text-gray-700 text-sm">最低スコア</h3>
              </div>
              <div className="text-4xl font-bold text-orange-600">
                {minScore}
              </div>
            </div>
          </div>

          {/* レベル分布 */}
          <div className="p-6 bg-white rounded-2xl shadow-lg border-2 border-gray-200">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BarChart3 size={20} />
              コンディションレベルの分布
            </h3>
            <div className="space-y-3">
              {Object.entries(distribution).map(([level, count]) => {
                const percentage = history.length > 0 ? (count / history.length) * 100 : 0;
                return (
                  <div key={level}>
                    <div className="flex items-center justify-between mb-1 text-sm">
                      <span className="font-medium text-gray-700">
                        {level === 'excellent' ? '素晴らしい' :
                         level === 'good' ? '良好' :
                         level === 'normal' ? '普通' :
                         level === 'low' ? '低調' : '要注意'}
                      </span>
                      <span className="text-gray-600">
                        {count}回 ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${getLevelColor(level as MentalCheckHistory['level'])}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* グラフ（簡易版） */}
          <div className="p-6 bg-white rounded-2xl shadow-lg border-2 border-gray-200">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Activity size={20} />
              スコアの推移
            </h3>
            <div className="flex items-end justify-between h-48 gap-1">
              {history.slice(-30).map((h, idx) => {
                const height = (h.score / 100) * 100;
                return (
                  <div
                    key={idx}
                    className="flex-1 relative group cursor-pointer"
                    title={`${new Date(h.date).toLocaleDateString('ja-JP')}: ${h.score}点`}
                  >
                    <div
                      className={`w-full rounded-t transition-all ${getLevelColor(h.level)} hover:opacity-80`}
                      style={{ height: `${height}%` }}
                    ></div>
                    {/* ツールチップ */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {new Date(h.date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}: {h.score}点
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>0点</span>
              <span>50点</span>
              <span>100点</span>
            </div>
          </div>

          {/* 履歴一覧 */}
          <div className="p-6 bg-white rounded-2xl shadow-lg border-2 border-gray-200">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar size={20} />
              チェック履歴
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {history.slice().reverse().map((h, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border-2 ${getLevelBgColor(h.level)} flex items-center justify-between`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getLevelColor(h.level)}`}></div>
                    <div>
                      <div className="font-medium text-gray-800">
                        {new Date(h.date).toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          weekday: 'short'
                        })}
                      </div>
                      <div className="text-sm text-gray-600">{h.message}</div>
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${getScoreColor(h.score)}`}>
                    {h.score}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* アドバイス */}
          <div className="p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-2xl shadow-lg border-2 border-purple-200">
            <h3 className="font-bold text-gray-800 mb-3">📊 統計から見たアドバイス</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {averageScore >= 70 && (
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>良好な心の状態が続いています。この調子で活動を続けましょう！</span>
                </li>
              )}
              {averageScore < 70 && averageScore >= 50 && (
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-1">!</span>
                  <span>少し疲れが溜まっているかもしれません。適度な休息を心がけましょう。</span>
                </li>
              )}
              {averageScore < 50 && (
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">⚠</span>
                  <span>心のケアが必要です。無理をせず、十分な休息を取ってください。</span>
                </li>
              )}
              {trend === 'up' && (
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">↗</span>
                  <span>最近、調子が上向きですね！良い習慣を継続しましょう。</span>
                </li>
              )}
              {trend === 'down' && (
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">↘</span>
                  <span>最近、少し下降傾向です。ストレス源を見つけて対処しましょう。</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentalStatsAdmin;
