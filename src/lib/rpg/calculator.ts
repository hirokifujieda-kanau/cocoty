/**
 * RPG診断の計算ロジック
 * 
 * 仕様書: /docs/rpg-diagnosis-specification.md
 */

export type FactorType = 'fencer' | 'healer' | 'schemer' | 'gunner' | 'shielder';

export interface RpgAnswer {
  questionId: number;
  score: number;
}

export interface FactorScores {
  fencer: number;
  healer: number;
  schemer: number;
  gunner: number;
  shielder: number;
}

export interface InstinctLevels {
  狩猟本能: number;
  共感本能: number;
  飛躍本能: number;
  職人魂: number;
  警戒本能: number;
}

export const reverseScore = (score: number): number => {
  return 6 - score;
};

export const calculateFactorScores = (answers: RpgAnswer[]): FactorScores => {
  const answerMap = new Map<number, number>();
  answers.forEach(answer => {
    answerMap.set(answer.questionId, answer.score);
  });

  const fencer = (answerMap.get(1) || 0) + (answerMap.get(6) || 0);
  const healer = (answerMap.get(2) || 0) + reverseScore(answerMap.get(7) || 3) + (answerMap.get(12) || 0);
  const schemer = (answerMap.get(3) || 0) + (answerMap.get(8) || 0) + (answerMap.get(11) || 0);
  const gunner = (answerMap.get(4) || 0) + reverseScore(answerMap.get(9) || 3);
  const shielder = (answerMap.get(5) || 0) + (answerMap.get(10) || 0);

  return { fencer, healer, schemer, gunner, shielder };
};

export const calculateInstinctLevel = (factorScore: number, factorType: FactorType = 'fencer'): number => {
  if (factorType === 'schemer') {
    if (factorScore >= 13) return 4;
    if (factorScore >= 11) return 3;
    if (factorScore >= 9) return 2;
    return 1;
  }
  
  if (factorScore >= 9) return 4;
  if (factorScore >= 7) return 3;
  if (factorScore >= 5) return 2;
  return 1;
};

export const calculateHealerLevel = (healerScore: number, gender?: string): number => {
  if (gender === '女性') {
    if (healerScore >= 15) return 4;
    if (healerScore >= 14) return 3;
    if (healerScore >= 12) return 2;
    return 1;
  }
  
  if (healerScore >= 14) return 4;
  if (healerScore >= 12) return 3;
  if (healerScore >= 10) return 2;
  return 1;
};

export const calculateInstinctLevels = (factorScores: FactorScores, gender?: string): InstinctLevels => {
  return {
    狩猟本能: calculateInstinctLevel(factorScores.fencer, 'fencer'),
    共感本能: calculateHealerLevel(factorScores.healer, gender),
    飛躍本能: calculateInstinctLevel(factorScores.schemer, 'schemer'),
    職人魂: calculateInstinctLevel(factorScores.gunner, 'gunner'),
    警戒本能: calculateInstinctLevel(factorScores.shielder, 'shielder'),
  };
};

export const calculateRpgDiagnosis = (answers: RpgAnswer[], gender?: string) => {
  const factorScores = calculateFactorScores(answers);
  const instinctLevels = calculateInstinctLevels(factorScores, gender);
  return { factorScores, instinctLevels };
};
