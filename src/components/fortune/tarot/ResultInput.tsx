import React, { useState, useRef, useEffect } from 'react';
import { DrawnCardResult } from './types';
import { FeelingSelector } from './FeelingSelector';

interface ResultInputProps {
  drawnCard: DrawnCardResult;
  interpretation: string;
  initialFeeling?: 'good' | 'soso' | 'bad' | null;
  initialComment?: string;
  onSave: (feeling: 'good' | 'soso' | 'bad' | null, comment: string) => void;
}

export const ResultInput: React.FC<ResultInputProps> = ({
  drawnCard,
  interpretation,
  initialFeeling = null,
  initialComment = '',
  onSave
}) => {
  const [selectedFeeling, setSelectedFeeling] = useState<'good' | 'soso' | 'bad' | null>(initialFeeling);
  const [comment, setComment] = useState(initialComment);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const cardName = drawnCard.card.name || 'カード';
  const position = drawnCard.isReversed ? '逆位置' : '正位置';

  // テキストエリアの高さを自動調整
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '88px';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.max(88, scrollHeight) + 'px';
    }
  }, [comment]);

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleSave = () => {
    console.log('🔘 [ResultInput] handleSave clicked - feeling:', selectedFeeling, 'comment:', comment);
    onSave(selectedFeeling, comment);
  };

  const isSaveDisabled = selectedFeeling === null || comment.trim() === '';
  
  // デバッグ: ボタンの状態を常に表示
  console.log('🎯 [ResultInput] Button state - disabled:', isSaveDisabled, 'feeling:', selectedFeeling, 'comment length:', comment.length);

  return (
    <div className="space-y-6">
      <div className="text-center">
        {/* カード情報表示エリア */}
        <div 
          className="mb-6 relative mx-auto rounded-xl overflow-hidden w-[332px] h-[301px] p-[31px_16px_23px_16px] flex mt-6"
          style={{ 
            backgroundImage: 'url(/tarot-material/space.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* 左側: カード名 + カード画像 */}
          <div>
            {/* カード名と位置 */}
            <div>
              <h3 className="font-medium text-base text-left m-0" style={{ fontFamily: 'Inter', lineHeight: '130%', color: '#C4C46D' }}>
                {cardName}
              </h3>
              <p className="font-bold text-xs text-center m-0" style={{ fontFamily: 'Noto Sans JP', lineHeight: '20px', color: '#C4C46D' }}>
                ({position})
              </p>
            </div>

            {/* カード画像 */}
            <div className="flex justify-center mt-2">
              <img
                alt={cardName}
                width={114}
                height={191}
                src={drawnCard.card.image_url}
              />
            </div>
          </div>

          {/* 右側: バッジ + タイトル + 説明 */}
          <div className="flex-1 flex flex-col gap-2">
            {/* バッジ */}
            <div>
              <div className="bg-yellow-600 text-white px-3 py-1 rounded-full text-xs inline-block">
                {drawnCard.isReversed ? drawnCard.card.reverse_meaning : drawnCard.card.meaning}
              </div>
            </div>

            {/* タイトル */}
            <h4 className="font-medium text-sm text-center text-white m-0" style={{ fontFamily: 'Inter', lineHeight: '130%' }}>
              {interpretation}
            </h4>

            {/* ボーダー */}
            <div className="mx-auto border-b w-[153px]" style={{ borderColor: '#73732F' }} />

            {/* 説明文 */}
            <p className="font-normal text-center text-white m-0" style={{ fontFamily: 'Noto Sans JP', fontSize: '10px', lineHeight: '16px' }}>
              {drawnCard.card.description}
            </p>
          </div>
        </div>

        {/* 感想入力欄 */}
        <div>
          <div className="text-center">
            <h3 
              className="font-bold text-xs text-center m-0 w-[332px] mx-auto rounded-t-lg py-3"
              style={{
                color: '#E9D9FD',
                boxShadow: '0px 1px 1px 0px #1A1045',
                background: '#2E206B'
              }}
            >
              今の気持ちを少しだけ振り返ってみましょう
            </h3>
          </div>

          {/* グラデーション背景のコンテナ */}
          <div 
            className="w-[332px] mx-auto rounded-b-lg p-4"
            style={{
              background: 'linear-gradient(180deg, rgba(145, 97, 196, 0.8) 0%, rgba(86, 76, 145, 0.8) 138.68%)'
            }}
          >
            <p className="font-bold text-xs text-center text-white mb-3" style={{ fontFamily: 'Noto Sans JP', lineHeight: '20px' }}>
              1.占いの結果はどう感じましたか？
            </p>

            {/* アイコン横並び */}
            <FeelingSelector 
              selectedFeeling={selectedFeeling}
              onSelect={setSelectedFeeling}
            />

            <p className="font-bold text-xs text-center text-white mb-3" style={{ fontFamily: 'Noto Sans JP', lineHeight: '20px' }}>
              2.占いの感想を記録しておきましょう！
            </p>

            <div className="flex justify-center">
              <textarea
                ref={textareaRef}
                value={comment}
                onChange={handleCommentChange}
                placeholder="今の気持ちをそのまま書いてみてください。"
                className="w-[300px] min-h-[88px] px-4 py-3 text-white rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none overflow-hidden"
                style={{
                  background: '#FFFFFF80',
                  fontFamily: 'Noto Sans JP',
                  fontWeight: 700,
                  fontSize: '10px',
                  lineHeight: '20px',
                  letterSpacing: '0%',
                  color: '#2F2B37'
                }}
              />
            </div>

            <div className="flex justify-center mt-4">
              <button
                onClick={handleSave}
                disabled={isSaveDisabled}
                className="font-bold text-base text-center text-white w-[140px] h-[48px] rounded-lg cursor-pointer disabled:cursor-not-allowed"
                style={{
                  fontFamily: 'Noto Sans JP',
                  lineHeight: '16px',
                  background: isSaveDisabled 
                    ? 'linear-gradient(180deg, #D0D0D0 0%, #848484 100%)'
                    : 'linear-gradient(180deg, #E3AC66 0%, #89602B 100%)',
                  border: isSaveDisabled ? '1px solid #CECECE' : '1px solid #FFB370',
                  boxShadow: isSaveDisabled ? '0px 4px 0px 0px #676158' : '0px 4px 0px 0px #5B3500'
                }}
              >
                記録する
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
