'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Lock, Unlock, Sparkles, Heart, Zap, Star } from 'lucide-react';

interface SeasonalDiagnosis {
  id: string;
  title: string;
  description: string;
  icon: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  category: 'mbti' | 'rpg' | 'color' | 'animal' | 'flower';
}

interface DiagnosisResult {
  type: string;
  title: string;
  description: string;
  characteristics: string[];
  advice: string;
  compatibility: string[];
  icon: string;
}

interface SeasonalDiagnosisHubProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const SEASONAL_DIAGNOSIS_KEY = 'cocoty_seasonal_diagnosis_v1';

const SeasonalDiagnosisHub: React.FC<SeasonalDiagnosisHubProps> = ({
  isOpen,
  onClose,
  userId
}) => {
  const [availableDiagnoses, setAvailableDiagnoses] = useState<SeasonalDiagnosis[]>([]);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<SeasonalDiagnosis | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'diagnosis' | 'result'>('list');

  useEffect(() => {
    if (!isOpen) return;
    loadSeasonalDiagnoses();
  }, [isOpen]);

  const loadSeasonalDiagnoses = () => {
    const today = new Date();
    
    const diagnoses: SeasonalDiagnosis[] = [
      {
        id: 'winter_mbti_2025',
        title: '冬のMBTI診断 2025',
        description: '16タイプの性格診断で、冬のあなたを発見！',
        icon: '❄️',
        startDate: '2024-12-01',
        endDate: '2025-02-28',
        isActive: isDateInRange(today, '2024-12-01', '2025-02-28'),
        category: 'mbti'
      },
      {
        id: 'spring_rpg_2025',
        title: '春のRPG診断 2025',
        description: 'あなたはどんな勇者？ファンタジー世界でのクラスを診断！',
        icon: '🌸',
        startDate: '2025-03-01',
        endDate: '2025-05-31',
        isActive: isDateInRange(today, '2025-03-01', '2025-05-31'),
        category: 'rpg'
      },
      {
        id: 'summer_color_2025',
        title: '夏のカラー診断 2025',
        description: 'あなたのパーソナルカラーを診断！夏にぴったりの色は？',
        icon: '🌺',
        startDate: '2025-06-01',
        endDate: '2025-08-31',
        isActive: isDateInRange(today, '2025-06-01', '2025-08-31'),
        category: 'color'
      },
      {
        id: 'autumn_animal_2025',
        title: '秋のアニマル診断 2025',
        description: 'あなたを動物に例えると？秋の動物診断',
        icon: '🍂',
        startDate: '2025-09-01',
        endDate: '2025-11-30',
        isActive: isDateInRange(today, '2025-09-01', '2025-11-30'),
        category: 'animal'
      },
      {
        id: 'newyear_flower_2025',
        title: '新春フラワー診断 2025',
        description: 'あなたを花に例えると？新年の花言葉診断',
        icon: '🎍',
        startDate: '2025-01-01',
        endDate: '2025-01-31',
        isActive: isDateInRange(today, '2025-01-01', '2025-01-31'),
        category: 'flower'
      },
      {
        id: 'halloween_rpg_2025',
        title: 'ハロウィンRPG診断 2024',
        icon: '🎃',
        description: 'あなたはどんなモンスター？ハロウィン限定診断！',
        startDate: '2024-10-15',
        endDate: '2024-10-31',
        isActive: isDateInRange(today, '2024-10-15', '2024-10-31'),
        category: 'rpg'
      }
    ];

    setAvailableDiagnoses(diagnoses);
  };

  const isDateInRange = (date: Date, start: string, end: string) => {
    const currentDate = date.getTime();
    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();
    return currentDate >= startDate && currentDate <= endDate;
  };

  const getMBTIQuestions = () => [
    {
      question: '週末の過ごし方は？',
      options: [
        { text: '友達と外出して楽しく過ごす', type: 'E' },
        { text: '一人で静かに過ごす', type: 'I' }
      ]
    },
    {
      question: '新しい情報を得たとき、まず何を考える？',
      options: [
        { text: '具体的な事実やデータ', type: 'S' },
        { text: '可能性や未来の展望', type: 'N' }
      ]
    },
    {
      question: '決断を下すとき、重視するのは？',
      options: [
        { text: '論理的な分析', type: 'T' },
        { text: '人の気持ちや価値観', type: 'F' }
      ]
    },
    {
      question: '計画を立てるとき、あなたは？',
      options: [
        { text: 'しっかり計画を立てて実行', type: 'J' },
        { text: '柔軟に対応しながら進める', type: 'P' }
      ]
    }
  ];

  const getRPGQuestions = () => [
    {
      question: 'パーティーでの役割は？',
      options: [
        { text: '最前線で戦う', type: 'warrior' },
        { text: '魔法で支援する', type: 'mage' },
        { text: '回復や補助をする', type: 'healer' },
        { text: '罠を使って攻撃', type: 'rogue' }
      ]
    },
    {
      question: '冒険で大切なのは？',
      options: [
        { text: '勇気と力', type: 'warrior' },
        { text: '知識と戦略', type: 'mage' },
        { text: '仲間との絆', type: 'healer' },
        { text: '機転と素早さ', type: 'rogue' }
      ]
    },
    {
      question: '宝箱を見つけたら？',
      options: [
        { text: 'すぐに開ける', type: 'warrior' },
        { text: '罠を確認してから開ける', type: 'rogue' },
        { text: '魔法で中身を調べる', type: 'mage' },
        { text: '仲間と相談する', type: 'healer' }
      ]
    }
  ];

  const getQuestions = () => {
    if (!selectedDiagnosis) return [];
    switch (selectedDiagnosis.category) {
      case 'mbti': return getMBTIQuestions();
      case 'rpg': return getRPGQuestions();
      default: return [];
    }
  };

  const calculateResult = () => {
    if (!selectedDiagnosis) return;

    if (selectedDiagnosis.category === 'mbti') {
      // MBTI結果の計算
      const mbtiTypes = {
        'ENFP': {
          type: 'ENFP',
          title: '広報運動家',
          description: '情熱的で創造的、社交的な自由人',
          characteristics: ['社交的で友好的', '創造力豊か', '好奇心旺盛', '柔軟性がある'],
          advice: '冬は新しい人との出会いを大切にしましょう',
          compatibility: ['INFJ', 'INTJ'],
          icon: '🎨'
        },
        'INTJ': {
          type: 'INTJ',
          title: '建築家',
          description: '独創的で戦略的な完璧主義者',
          characteristics: ['独立心が強い', '論理的思考', '長期的な計画性', '決断力がある'],
          advice: '冬は計画を立てて実行する最適な時期',
          compatibility: ['ENFP', 'ENTP'],
          icon: '🏛️'
        },
        'ESFJ': {
          type: 'ESFJ',
          title: '領事官',
          description: '思いやりがあり、協調性の高い世話好き',
          characteristics: ['社交的', '協調性が高い', '責任感が強い', '伝統を重んじる'],
          advice: '冬は人との繋がりを深める季節',
          compatibility: ['ISFP', 'ISTP'],
          icon: '🤝'
        },
        'ISTP': {
          type: 'ISTP',
          title: '巨匠',
          description: '大胆で実践的な実験者',
          characteristics: ['実践的', '冷静', '柔軟性がある', '問題解決能力'],
          advice: '冬は新しいスキルを習得する時期',
          compatibility: ['ESFJ', 'ESTJ'],
          icon: '🔧'
        }
      };

      // ランダムにタイプを選択（実際はanswerに基づいて計算）
      const types = Object.keys(mbtiTypes);
      const randomType = types[Math.floor(Math.random() * types.length)] as keyof typeof mbtiTypes;
      setResult(mbtiTypes[randomType]);

    } else if (selectedDiagnosis.category === 'rpg') {
      // RPG結果の計算
      const rpgClasses = {
        'warrior': {
          type: 'WARRIOR',
          title: '戦士',
          description: '勇敢で力強い最前線の守護者',
          characteristics: ['高い体力', '強力な攻撃力', 'リーダーシップ', '正義感'],
          advice: '困難に立ち向かう勇気を持ちましょう',
          compatibility: ['ヒーラー', 'メイジ'],
          icon: '⚔️'
        },
        'mage': {
          type: 'MAGE',
          title: '魔法使い',
          description: '知恵と魔力を操る神秘の探求者',
          characteristics: ['高い知能', '魔法攻撃', '戦略的思考', '好奇心'],
          advice: '知識を深め、新しい魔法を学びましょう',
          compatibility: ['戦士', 'ローグ'],
          icon: '🔮'
        },
        'healer': {
          type: 'HEALER',
          title: 'ヒーラー',
          description: '癒しの力で仲間を支える慈愛の使徒',
          characteristics: ['回復能力', '共感力', 'サポート力', '献身的'],
          advice: '自分と他者のケアを大切にしましょう',
          compatibility: ['戦士', 'メイジ'],
          icon: '✨'
        },
        'rogue': {
          type: 'ROGUE',
          title: 'ローグ',
          description: '機敏で狡猾な影の使い手',
          characteristics: ['高い素早さ', '隠密行動', '器用さ', '臨機応変'],
          advice: '柔軟な思考で問題を解決しましょう',
          compatibility: ['メイジ', 'ヒーラー'],
          icon: '🗡️'
        }
      };

      // 回答から最も多いタイプを選択
      const typeCounts: { [key: string]: number } = {};
      answers.forEach(answer => {
        typeCounts[answer] = (typeCounts[answer] || 0) + 1;
      });
      
      const dominantType = Object.keys(typeCounts).reduce((a, b) => 
        typeCounts[a] > typeCounts[b] ? a : b
      ) as keyof typeof rpgClasses;

      setResult(rpgClasses[dominantType] || rpgClasses['warrior']);
    }

    setViewMode('result');
    saveResult();
  };

  const saveResult = () => {
    if (!selectedDiagnosis || !result) return;

    try {
      const history = JSON.parse(
        localStorage.getItem(`${SEASONAL_DIAGNOSIS_KEY}_${userId}`) || '[]'
      );
      
      history.push({
        diagnosisId: selectedDiagnosis.id,
        diagnosisTitle: selectedDiagnosis.title,
        result: result,
        date: new Date().toISOString()
      });

      localStorage.setItem(`${SEASONAL_DIAGNOSIS_KEY}_${userId}`, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save diagnosis result', e);
    }
  };

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    const questions = getQuestions();
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult();
    }
  };

  const startDiagnosis = (diagnosis: SeasonalDiagnosis) => {
    if (!diagnosis.isActive) {
      alert('この診断は現在利用できません');
      return;
    }

    // カテゴリがサポートされているかチェック
    if (diagnosis.category !== 'mbti' && diagnosis.category !== 'rpg') {
      alert('この診断タイプは現在準備中です');
      return;
    }

    setSelectedDiagnosis(diagnosis);
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
    setViewMode('diagnosis');
  };

  const resetDiagnosis = () => {
    setSelectedDiagnosis(null);
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
    setViewMode('list');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'mbti': return <Heart className="text-pink-500" />;
      case 'rpg': return <Zap className="text-purple-500" />;
      case 'color': return <Sparkles className="text-blue-500" />;
      case 'animal': return <Star className="text-orange-500" />;
      case 'flower': return <Sparkles className="text-green-500" />;
      default: return <Sparkles />;
    }
  };

  if (!isOpen) return null;

  const questions = getQuestions();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60 p-4">
      <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* ヘッダー */}
        <div className="p-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar size={32} />
              <div>
                <h2 className="text-2xl font-bold">季節限定診断</h2>
                <p className="text-sm opacity-90">期間限定で楽しめる特別な診断</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* コンテンツ */}
        <div className="flex-1 overflow-y-auto p-6">
          {viewMode === 'list' ? (
            /* 診断一覧 */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableDiagnoses.map((diagnosis) => (
                <div
                  key={diagnosis.id}
                  className={`relative p-6 rounded-2xl shadow-lg transition-all ${
                    diagnosis.isActive
                      ? 'bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-xl hover:scale-105 cursor-pointer border-2 border-purple-200'
                      : 'bg-gray-100 opacity-60 cursor-not-allowed border-2 border-gray-300'
                  }`}
                  onClick={() => diagnosis.isActive && startDiagnosis(diagnosis)}
                >
                  {/* ステータスバッジ */}
                  <div className="absolute top-4 right-4">
                    {diagnosis.isActive ? (
                      <div className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold">
                        <Unlock size={12} />
                        <span>開催中</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 px-3 py-1 bg-gray-400 text-white rounded-full text-xs font-bold">
                        <Lock size={12} />
                        <span>終了</span>
                      </div>
                    )}
                  </div>

                  {/* アイコン */}
                  <div className="text-6xl mb-4">{diagnosis.icon}</div>

                  {/* タイトル */}
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{diagnosis.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{diagnosis.description}</p>

                  {/* 期間 */}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar size={14} />
                    <span>
                      {new Date(diagnosis.startDate).toLocaleDateString('ja-JP')} 〜 {new Date(diagnosis.endDate).toLocaleDateString('ja-JP')}
                    </span>
                  </div>

                  {/* カテゴリバッジ */}
                  <div className="mt-4 flex items-center gap-2">
                    {getCategoryIcon(diagnosis.category)}
                    <span className="text-xs font-medium text-gray-600 uppercase">{diagnosis.category}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : viewMode === 'diagnosis' && selectedDiagnosis && questions.length > 0 ? (
            /* 診断中 */
            <div className="max-w-2xl mx-auto">
              {/* 進捗バー */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>質問 {currentQuestion + 1} / {questions.length}</span>
                  <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* 質問 */}
              {questions[currentQuestion] && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 shadow-xl mb-6">
                  <div className="text-6xl mb-6 text-center">{selectedDiagnosis.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
                    {questions[currentQuestion].question}
                  </h3>

                  <div className="space-y-4">
                    {questions[currentQuestion].options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(option.type)}
                        className="w-full p-4 bg-white hover:bg-purple-50 border-2 border-purple-200 hover:border-purple-400 rounded-xl text-left transition-all hover:scale-105 hover:shadow-lg"
                      >
                        <span className="font-medium text-gray-800">{option.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={resetDiagnosis}
                className="w-full py-3 text-gray-600 hover:text-gray-800 transition-colors"
              >
                診断一覧に戻る
              </button>
            </div>
          ) : viewMode === 'result' && result ? (
            /* 結果表示 */
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center p-8 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-2xl shadow-xl">
                <div className="text-8xl mb-6">{result.icon}</div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">{result.title}</h3>
                <p className="text-xl text-gray-600 mb-6">{result.description}</p>

                <div className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-lg font-bold shadow-lg">
                  {result.type}
                </div>
              </div>

              {/* 特徴 */}
              <div className="p-6 bg-white rounded-2xl shadow-lg">
                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Star className="text-yellow-500" size={20} />
                  あなたの特徴
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {result.characteristics.map((char, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                      <span className="text-purple-500">✓</span>
                      <span className="text-sm text-gray-700">{char}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* アドバイス */}
              <div className="p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl shadow-lg border-2 border-pink-200">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Sparkles className="text-pink-500" size={20} />
                  今季のアドバイス
                </h4>
                <p className="text-gray-700">{result.advice}</p>
              </div>

              {/* 相性 */}
              <div className="p-6 bg-blue-50 rounded-2xl shadow-lg border-2 border-blue-200">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Heart className="text-blue-500" size={20} />
                  相性の良いタイプ
                </h4>
                <div className="flex gap-2">
                  {result.compatibility.map((type, idx) => (
                    <span key={idx} className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-gray-700 shadow-sm">
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              {/* ボタン */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={resetDiagnosis}
                  className="py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors"
                >
                  診断一覧に戻る
                </button>
                <button
                  onClick={onClose}
                  className="py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold shadow-lg transition-all"
                >
                  結果を保存して閉じる
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SeasonalDiagnosisHub;
