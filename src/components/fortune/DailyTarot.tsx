'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Heart, Users, TrendingUp, Zap } from 'lucide-react';

interface TarotResult {
  cardName: string;
  cardImage: string;
  cardMeaning: string;
  advice: string;
  luckyItem: string;
  luckyColor: string;
}

interface MentalCheckResult {
  score: number;
  level: 'excellent' | 'good' | 'normal' | 'low' | 'critical';
  message: string;
  suggestions: string[];
}

interface DailyTarotProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

const DAILY_TAROT_KEY = 'cocoty_daily_tarot_v1';
const MENTAL_CHECK_KEY = 'cocoty_mental_check_v1';
const LAST_DRAW_DATE_KEY = 'cocoty_last_draw_date_v1';

const DailyTarot: React.FC<DailyTarotProps> = ({
  isOpen,
  onClose,
  userId,
  userName
}) => {
  const [step, setStep] = useState<'select' | 'mental' | 'drawing' | 'result'>('select');
  const [selectedMode, setSelectedMode] = useState<'self' | 'relationship' | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<string>('');
  const [mentalAnswers, setMentalAnswers] = useState<number[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tarotResult, setTarotResult] = useState<TarotResult | null>(null);
  const [mentalResult, setMentalResult] = useState<MentalCheckResult | null>(null);
  const [canDraw, setCanDraw] = useState(true);

  const tarotCards = [
    { name: '太陽', emoji: '☀️', meaning: '成功と幸福の予兆', advice: '自信を持って前進しましょう', color: '#FFD700' },
    { name: '月', emoji: '🌙', meaning: '直感と内省の時', advice: '心の声に耳を傾けて', color: '#C0C0C0' },
    { name: '星', emoji: '⭐', meaning: '希望と可能性', advice: '夢を諦めないで', color: '#87CEEB' },
    { name: '恋人', emoji: '❤️', meaning: '愛と調和', advice: '人との絆を大切に', color: '#FF69B4' },
    { name: '力', emoji: '💪', meaning: '内なる強さ', advice: '困難を乗り越える力がある', color: '#FF6347' },
    { name: '正義', emoji: '⚖️', meaning: 'バランスと公正', advice: '冷静な判断を', color: '#4169E1' },
    { name: '運命の輪', emoji: '🎡', meaning: '変化のサイン', advice: '流れに身を任せて', color: '#9370DB' },
    { name: '隠者', emoji: '🕯️', meaning: '知恵と洞察', advice: '一人の時間を大切に', color: '#8B4513' },
    { name: '魔術師', emoji: '🎩', meaning: '創造と実現', advice: 'アイデアを形にする時', color: '#FF4500' },
    { name: '女帝', emoji: '👑', meaning: '豊かさと愛情', advice: '感性を信じて', color: '#DA70D6' }
  ];

  const mentalQuestions = [
    '今日の気分はどうですか？',
    '最近よく眠れていますか？',
    '人と話すことを楽しめていますか？',
    '趣味や好きなことに時間を使えていますか？',
    '将来に対して前向きな気持ちですか？'
  ];

  const partners = [
    { id: 'user_002', name: '田中 太郎' },
    { id: 'user_003', name: '佐藤 美咲' },
    { id: 'user_004', name: '鈴木 健太' },
    { id: 'user_005', name: '高橋 さくら' }
  ];

  useEffect(() => {
    if (!isOpen) return;
    checkLastDrawDate();
  }, [isOpen]);

  const checkLastDrawDate = () => {
    try {
      const lastDrawRaw = localStorage.getItem(`${LAST_DRAW_DATE_KEY}_${userId}`);
      if (lastDrawRaw) {
        const lastDraw = JSON.parse(lastDrawRaw);
        const today = new Date().toDateString();
        if (lastDraw.date === today) {
          setCanDraw(false);
          // 今日すでに引いた結果を表示
          loadTodayResult();
        }
      }
    } catch (e) {
      console.error('Failed to check last draw date', e);
    }
  };

  const loadTodayResult = () => {
    try {
      const tarotRaw = localStorage.getItem(`${DAILY_TAROT_KEY}_${userId}`);
      const mentalRaw = localStorage.getItem(`${MENTAL_CHECK_KEY}_${userId}`);
      
      if (tarotRaw) {
        setTarotResult(JSON.parse(tarotRaw));
        setStep('result');
      }
      if (mentalRaw) {
        setMentalResult(JSON.parse(mentalRaw));
      }
    } catch (e) {
      console.error('Failed to load today result', e);
    }
  };

  const handleModeSelect = (mode: 'self' | 'relationship') => {
    setSelectedMode(mode);
    setStep('mental');
  };

  const handleMentalAnswer = (questionIndex: number, score: number) => {
    const newAnswers = [...mentalAnswers];
    newAnswers[questionIndex] = score;
    setMentalAnswers(newAnswers);

    // すべての質問に回答したら次へ
    if (newAnswers.filter(a => a !== undefined).length === mentalQuestions.length) {
      calculateMentalResult(newAnswers);
      // メンタルチェック完了後、1秒待ってから自動的にカードを引く
      setTimeout(() => {
        setStep('drawing');
        // さらに0.5秒後に自動的にカード抽選を開始
        setTimeout(() => {
          drawTarotCard();
        }, 500);
      }, 1000);
    }
  };

  const calculateMentalResult = (answers: number[]) => {
    const totalScore = answers.reduce((sum, score) => sum + score, 0);
    const averageScore = totalScore / answers.length;

    let level: MentalCheckResult['level'];
    let message: string;
    let suggestions: string[];

    if (averageScore >= 4.5) {
      level = 'excellent';
      message = '素晴らしい！心のコンディションは最高です✨';
      suggestions = ['この調子で活動を続けましょう', '良い習慣を維持してください'];
    } else if (averageScore >= 3.5) {
      level = 'good';
      message = '良好です！心は健康な状態ですね😊';
      suggestions = ['引き続きバランスを保ちましょう', '適度な休息も大切に'];
    } else if (averageScore >= 2.5) {
      level = 'normal';
      message = '普通です。少し疲れているかもしれません';
      suggestions = ['好きなことをする時間を増やしてみて', '十分な睡眠を心がけましょう'];
    } else if (averageScore >= 1.5) {
      level = 'low';
      message = '少し元気がないようです。無理しないでくださいね';
      suggestions = ['休息を優先してください', '信頼できる人に話を聞いてもらいましょう', '軽い運動もおすすめです'];
    } else {
      level = 'critical';
      message = 'かなり疲れているようです。自分を大切にしてください';
      suggestions = ['十分な休息が必要です', '専門家に相談することも検討してください', '一人で抱え込まないでください'];
    }

    const result: MentalCheckResult = {
      score: Math.round(averageScore * 20), // 0-100スケールに変換
      level,
      message,
      suggestions
    };

    setMentalResult(result);

    // 保存
    try {
      const today = new Date().toISOString().split('T')[0];
      const history = JSON.parse(localStorage.getItem(`${MENTAL_CHECK_KEY}_history_${userId}`) || '[]');
      history.push({ date: today, ...result });
      localStorage.setItem(`${MENTAL_CHECK_KEY}_history_${userId}`, JSON.stringify(history));
      localStorage.setItem(`${MENTAL_CHECK_KEY}_${userId}`, JSON.stringify(result));
    } catch (e) {
      console.error('Failed to save mental check result', e);
    }
  };

  const drawTarotCard = () => {
    // 既にdrawingステップにいない場合のみステップを変更
    if (step !== 'drawing') {
      setStep('drawing');
    }
    setIsDrawing(true);

    // カード抽選アニメーション
    setTimeout(() => {
      const randomCard = tarotCards[Math.floor(Math.random() * tarotCards.length)];
      const luckyItems = ['ペン', '手帳', 'コーヒー', '音楽', '花', '本', '写真', 'キャンドル'];
      const luckyItem = luckyItems[Math.floor(Math.random() * luckyItems.length)];

      const result: TarotResult = {
        cardName: randomCard.name,
        cardImage: randomCard.emoji,
        cardMeaning: randomCard.meaning,
        advice: randomCard.advice,
        luckyItem: luckyItem,
        luckyColor: randomCard.color
      };

      setTarotResult(result);

      // 保存
      try {
        localStorage.setItem(`${DAILY_TAROT_KEY}_${userId}`, JSON.stringify(result));
        const today = new Date().toDateString();
        localStorage.setItem(`${LAST_DRAW_DATE_KEY}_${userId}`, JSON.stringify({ date: today }));
      } catch (e) {
        console.error('Failed to save tarot result', e);
      }

      setIsDrawing(false);
      setStep('result');
    }, 3000);
  };

  const getMentalColor = () => {
    if (!mentalResult) return 'bg-gray-100';
    switch (mentalResult.level) {
      case 'excellent': return 'bg-green-100 border-green-300';
      case 'good': return 'bg-blue-100 border-blue-300';
      case 'normal': return 'bg-yellow-100 border-yellow-300';
      case 'low': return 'bg-orange-100 border-orange-300';
      case 'critical': return 'bg-red-100 border-red-300';
      default: return 'bg-gray-100';
    }
  };

  const getMentalIcon = () => {
    if (!mentalResult) return '😐';
    switch (mentalResult.level) {
      case 'excellent': return '🌟';
      case 'good': return '😊';
      case 'normal': return '😌';
      case 'low': return '😔';
      case 'critical': return '😰';
      default: return '😐';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* ヘッダー */}
        <div className="p-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles size={32} />
              <div>
                <h2 className="text-2xl font-bold">今日のタロット占い</h2>
                <p className="text-sm opacity-90">1日1回、あなたの運勢を占います</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* コンテンツ */}
        <div className="p-8 overflow-y-auto flex-1">
          {!canDraw && step === 'result' ? (
            /* すでに今日引いている場合 */
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🌙</div>
              <p className="text-lg text-gray-600 mb-4">
                今日はすでにカードを引いています
              </p>
              <p className="text-sm text-gray-500">
                また明日お越しください
              </p>
            </div>
          ) : step === 'select' ? (
            /* ステップ1: モード選択 */
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">何を占いますか？</h3>
                <p className="text-gray-600">カードを選んでください</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleModeSelect('self')}
                  className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2 border-purple-200 hover:border-purple-400"
                >
                  <div className="text-6xl mb-4">🌟</div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">自分の運勢</h4>
                  <p className="text-sm text-gray-600">今日のあなたの運勢を占います</p>
                </button>

                <button
                  onClick={() => handleModeSelect('relationship')}
                  className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2 border-pink-200 hover:border-pink-400"
                >
                  <div className="text-6xl mb-4">💕</div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">相手との関係</h4>
                  <p className="text-sm text-gray-600">特定の人との関係を占います</p>
                </button>
              </div>

              {selectedMode === 'relationship' && (
                <div className="mt-6 p-6 bg-white rounded-2xl shadow-lg">
                  <h4 className="font-bold text-gray-800 mb-4">相手を選択してください</h4>
                  <div className="space-y-2">
                    {partners.map((partner) => (
                      <button
                        key={partner.id}
                        onClick={() => setSelectedPartner(partner.name)}
                        className={`w-full p-3 rounded-lg text-left transition-colors ${
                          selectedPartner === partner.name
                            ? 'bg-pink-100 border-2 border-pink-400'
                            : 'bg-gray-50 hover:bg-gray-100 border-2 border-gray-200'
                        }`}
                      >
                        {partner.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : step === 'mental' ? (
            /* ステップ2: メンタルチェック */
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Heart className="mx-auto text-pink-500 mb-4" size={48} />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">心の状態チェック</h3>
                <p className="text-gray-600">各質問に5段階で答えてください</p>
              </div>

              <div className="space-y-6">
                {mentalQuestions.map((question, index) => (
                  <div key={index} className="p-6 bg-white rounded-xl shadow-md">
                    <p className="font-medium text-gray-800 mb-4">
                      {index + 1}. {question}
                    </p>
                    <div className="flex justify-between gap-2">
                      {[1, 2, 3, 4, 5].map((score) => (
                        <button
                          key={score}
                          onClick={() => handleMentalAnswer(index, score)}
                          className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                            mentalAnswers[index] === score
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          {score}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <span>とても悪い</span>
                      <span>とても良い</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center text-sm text-gray-600">
                {mentalAnswers.filter(a => a !== undefined).length} / {mentalQuestions.length} 回答済み
              </div>
            </div>
          ) : step === 'drawing' ? (
            /* ステップ3: カード抽選中 */
            <div className="text-center py-12">
              <div className="relative mb-8">
                <div className="text-9xl animate-bounce">🎴</div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="text-yellow-400 animate-spin" size={64} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">カードを引いています...</h3>
              <p className="text-gray-600">あなたの運命のカードは...</p>
              
              {!isDrawing && (
                <button
                  onClick={drawTarotCard}
                  className="mt-8 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                >
                  カードを引く
                </button>
              )}
            </div>
          ) : step === 'result' && tarotResult ? (
            /* ステップ4: 結果表示 */
            <div className="space-y-6">
              {/* メンタルチェック結果 */}
              {mentalResult && (
                <div className={`p-6 rounded-2xl shadow-lg border-2 ${getMentalColor()}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-4xl">{getMentalIcon()}</div>
                    <div>
                      <h4 className="font-bold text-gray-800">心の状態スコア</h4>
                      <div className="flex items-center gap-2">
                        <div className="text-3xl font-bold text-gray-800">{mentalResult.score}</div>
                        <div className="text-sm text-gray-600">/ 100</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 font-medium mb-3">{mentalResult.message}</p>
                  <div className="space-y-2">
                    {mentalResult.suggestions.map((suggestion, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-purple-500">•</span>
                        <span>{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* タロットカード結果 */}
              <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
                <div className="text-9xl mb-6 animate-pulse">{tarotResult.cardImage}</div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">{tarotResult.cardName}</h3>
                <p className="text-lg text-gray-600 mb-6">{tarotResult.cardMeaning}</p>

                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="text-purple-600" size={20} />
                      <h4 className="font-bold text-gray-800">今日のアドバイス</h4>
                    </div>
                    <p className="text-gray-700">{tarotResult.advice}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-pink-50 rounded-xl">
                      <h4 className="font-bold text-gray-800 mb-2 text-sm">ラッキーアイテム</h4>
                      <p className="text-xl">✨ {tarotResult.luckyItem}</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <h4 className="font-bold text-gray-800 mb-2 text-sm">ラッキーカラー</h4>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-full shadow-md"
                          style={{ backgroundColor: tarotResult.luckyColor }}
                        ></div>
                        <span className="text-sm text-gray-600">{tarotResult.luckyColor}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedMode === 'relationship' && selectedPartner && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl">
                    <h4 className="font-bold text-gray-800 mb-2">
                      {selectedPartner}さんとの関係
                    </h4>
                    <p className="text-gray-700">{tarotResult.advice}</p>
                  </div>
                )}
              </div>

              <button
                onClick={onClose}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                閉じる
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default DailyTarot;
