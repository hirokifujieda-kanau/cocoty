import React, { useState } from 'react';
import { DrawnCardResult } from './types';
import { ResultConfirmation } from './ResultConfirmation';
import { ResultInput } from './ResultInput';

interface ResultStepProps {
  drawnCard: DrawnCardResult;
  interpretation: string;
  onComment: () => void;
  onClose: () => void;
  initialShowConfirmation?: boolean;
  savedFeeling?: 'good' | 'soso' | 'bad' | null;
  savedComment?: string;
  onSaveData?: (feeling: 'good' | 'soso' | 'bad' | null, comment: string) => void;
  target?: 'self' | 'partner' | null;
}

type Feeling = 'good' | 'soso' | 'bad' | null;

export const ResultStep: React.FC<ResultStepProps> = ({
  drawnCard,
  interpretation,
  onComment,
  onClose,
  initialShowConfirmation = false,
  savedFeeling = null,
  savedComment = '',
  onSaveData,
  target = null
}) => {
  const [showConfirmation, setShowConfirmation] = useState(initialShowConfirmation);
  const [feeling, setFeeling] = useState<Feeling>(savedFeeling);
  const [comment, setComment] = useState(savedComment);

  const handleSave = (newFeeling: Feeling, newComment: string) => {
    console.log('📝 [ResultStep] handleSave called - feeling:', newFeeling, 'comment:', newComment);
    setFeeling(newFeeling);
    setComment(newComment);
    console.log('📝 [ResultStep] Calling onSaveData...');
    onSaveData?.(newFeeling, newComment);
    console.log('📝 [ResultStep] onSaveData called, showing confirmation');
    setShowConfirmation(true);
  };

  // 確認ページを表示
  if (showConfirmation) {
    return (
      <ResultConfirmation
        drawnCard={drawnCard}
        interpretation={interpretation}
        feeling={feeling}
        comment={comment}
        onComplete={onComment}
      />
    );
  }

  // 入力ページを表示
  return (
    <ResultInput
      drawnCard={drawnCard}
      interpretation={interpretation}
      initialFeeling={savedFeeling}
      initialComment={savedComment}
      onSave={handleSave}
    />
  );
};
