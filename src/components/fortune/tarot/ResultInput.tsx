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
          className="mb-6 relative mx-auto rounded-xl overflow-hidden w-[332px] h-[301px] p-[31px_16px_23px_16px] flex mt-6 bg-cover bg-center bg-[url(/tarot-material/space.png)]"
        >
          {/* 左側: カード名 + カード画像 */}
          <div>
            {/* カード名と位置 */}
            <div>
              <h3 className="font-medium text-base text-left m-0 font-inter leading-[130%] text-[#C4C46D]">
                {cardName}
              </h3>
              <p className="font-bold text-xs text-center m-0 font-noto-sans-jp leading-5 text-[#C4C46D]">
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
            <h4 className="font-medium text-sm text-center text-white m-0 font-inter leading-[130%]">
              {interpretation}
            </h4>

            {/* ボーダー */}
            <div className="mx-auto border-b w-[153px] border-[#73732F]" />

            {/* 説明文 */}
            <p className="font-normal text-center text-white m-0 font-noto-sans-jp text-[10px] leading-4">
              {drawnCard.card.description}
            </p>
          </div>
        </div>

        {/* 感想入力欄 */}
        <div>
          <div className="text-center">
            <h3 
              className="font-bold text-xs text-center m-0 w-[332px] mx-auto rounded-t-lg py-3 text-[#E9D9FD] shadow-[0px_1px_1px_0px_#1A1045] bg-[#2E206B]"
            >
              今の気持ちを少しだけ振り返ってみましょう
            </h3>
          </div>

          {/* グラデーション背景のコンテナ */}
          <div 
            className="w-[332px] mx-auto rounded-b-lg p-4 bg-gradient-to-b from-[rgba(145,97,196,0.8)] to-[rgba(86,76,145,0.8)]"
          >
            <p className="font-bold text-xs text-center text-white mb-3 font-noto-sans-jp leading-5">
              1.占いの結果はどう感じましたか？
            </p>

            {/* アイコン横並び */}
            <FeelingSelector 
              selectedFeeling={selectedFeeling}
              onSelect={setSelectedFeeling}
            />

            <p className="font-bold text-xs text-center text-white mb-3 font-noto-sans-jp leading-5">
              2.占いの感想を記録しておきましょう！
            </p>

            <div className="flex justify-center">
              <textarea
                ref={textareaRef}
                value={comment}
                onChange={handleCommentChange}
                placeholder="今の気持ちをそのまま書いてみてください。"
                className="w-[300px] min-h-[88px] px-4 py-3 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none overflow-hidden bg-[#FFFFFF80] font-noto-sans-jp font-bold text-[10px] leading-5 text-[#2F2B37]"
              />
            </div>

            <div className="flex justify-center mt-4">
              <button
                onClick={handleSave}
                disabled={isSaveDisabled}
                className={`font-bold text-base text-center text-white w-[140px] h-[48px] rounded-lg cursor-pointer disabled:cursor-not-allowed font-noto-sans-jp leading-4 ${
                  isSaveDisabled
                    ? 'bg-gradient-to-b from-[#D0D0D0] to-[#848484] border border-[#CECECE] shadow-[0px_4px_0px_0px_#676158]'
                    : 'bg-gradient-to-b from-[#E3AC66] to-[#89602B] border border-[#FFB370] shadow-[0px_4px_0px_0px_#5B3500]'
                }`}
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
