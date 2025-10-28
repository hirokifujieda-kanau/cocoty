 'use client';

import React, { useState } from 'react';

interface DiagnosisProps {
  onClose: () => void;
  onComplete: (result: string) => void;
}

// A small MBTI-like questionnaire (4 dichotomies: E/I, S/N, T/F, J/P)
const questions: Array<{ id: number; q: string; a: [string, string]; dim: 'E/I' | 'S/N' | 'T/F' | 'J/P' }> = [
  { id: 1, q: 'パーティーであなたはエネルギーを得るのは？', a: ['人と話して元気になる (E)', '少人数や一人で落ち着く (I)'], dim: 'E/I' },
  { id: 2, q: '新しい情報に対してあなたは？', a: ['現実的・事実重視 (S)', '可能性や全体像を見る (N)'], dim: 'S/N' },
  { id: 3, q: '意思決定の際、あなたは？', a: ['論理と基準で判断する (T)', '人の気持ちや関係を重視する (F)'], dim: 'T/F' },
  { id: 4, q: '計画はどうする？', a: ['スケジュールに沿って進める (J)', '臨機応変に対応する (P)'], dim: 'J/P' },
  { id: 5, q: '学ぶとき、あなたは？', a: ['実践して覚える (S)', '理論やパターンを探る (N)'], dim: 'S/N' },
  { id: 6, q: '話し方は？', a: ['ザックリと要点を言う (T)', '気持ち・雰囲気を大切にする (F)'], dim: 'T/F' },
  { id: 7, q: '休みの過ごし方は？', a: ['外出して活動的に過ごす (E)', '家でゆっくり過ごす (I)'], dim: 'E/I' },
  { id: 8, q: '仕事の進め方は？', a: ['計画→実行を好む (J)', '状況に合わせて変える (P)'], dim: 'J/P' }
];

const TYPE_DESCRIPTIONS: Record<string, string> = {
  INTJ: '戦略家。構想を立て、計画的に動くタイプ。',
  INTP: '分析者。理論やアイデアを深掘りするのが得意。',
  ENTJ: '指導者。目的達成のために行動を促す。',
  ENTP: '発明家。新しい発想で周りを刺激する。',
  INFJ: '提唱者。人の成長や価値観に敏感。',
  INFP: '仲介者。価値観に基づいて行動する。',
  ENFJ: '主人公。人を巻き込みまとめる力がある。',
  ENFP: '闘志あるアイデアマン。人とつながるのが得意。',
  ISTJ: '管理者。責任感が強く安定を好む。',
  ISFJ: '守護者。支援や気配りを大切にする。',
  ESTJ: '実行者。リーダーシップと現実的判断に優れる。',
  ESFJ: '仲間思い。協調性があり縁の下の力持ち。',
  ISTP: '職人。柔軟で実務的な問題解決が得意。',
  ISFP: '芸術家。感性を大切に静かに行動する。',
  ESTP: '起業家。行動力がありチャンスを掴む。',
  ESFP: 'エンターテイナー。場を盛り上げる才能がある。'
};

const Diagnosis: React.FC<DiagnosisProps> = ({ onClose, onComplete }) => {
  const [answers, setAnswers] = useState<Record<number, 0 | 1>>({});
  const [step, setStep] = useState(0);

  const select = (qid: number, val: 0 | 1) => {
    setAnswers((s) => ({ ...s, [qid]: val }));
  };

  const handleNext = () => {
    if (step < questions.length - 1) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleFinish = () => {
    // Count per dichotomy
    const counts: Record<string, number> = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    questions.forEach((q) => {
      const a = answers[q.id];
      if (typeof a === 'undefined') return;
      const [left, right] = q.a;
      // convention: option 0 => left (first char), option 1 => right
      const leftKey = q.dim.split('/')[0].charAt(0);
      const rightKey = q.dim.split('/')[1].charAt(0);
      if (a === 0) counts[leftKey]++;
      else counts[rightKey]++;
    });

    const letter = (a: string, b: string) => (counts[a] >= counts[b] ? a : b);
    const type = `${letter('E', 'I')}${letter('S', 'N')}${letter('T', 'F')}${letter('J', 'P')}`;
    const desc = TYPE_DESCRIPTIONS[type] ? `${type} - ${TYPE_DESCRIPTIONS[type]}` : type;
    onComplete(desc);
    onClose();
  };

  const q = questions[step];

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">性格診断（MBTI風）</h3>
          <button onClick={onClose} className="text-sm text-gray-500">閉じる</button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="font-medium">{q.q}</p>
            <div className="mt-3 flex gap-3">
              <button onClick={() => select(q.id, 0)} className={`flex-1 px-4 py-3 rounded-lg border text-left ${answers[q.id] === 0 ? 'bg-slate-600 text-white border-slate-600' : 'bg-white text-gray-700'}`}>
                {q.a[0]}
              </button>
              <button onClick={() => select(q.id, 1)} className={`flex-1 px-4 py-3 rounded-lg border text-left ${answers[q.id] === 1 ? 'bg-slate-600 text-white border-slate-600' : 'bg-white text-gray-700'}`}>
                {q.a[1]}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">{step + 1}/{questions.length}</div>
            <div className="flex items-center gap-2">
              <button onClick={handlePrev} disabled={step === 0} className="px-3 py-2 bg-stone-100 text-stone-700 rounded-md disabled:opacity-50">戻る</button>
              {step < questions.length - 1 ? (
                <button onClick={handleNext} className="px-4 py-2 bg-slate-600 text-white rounded-md">次へ</button>
              ) : (
                <button onClick={handleFinish} className="px-4 py-2 bg-amber-600 text-white rounded-md">診断を完了</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diagnosis;
