import React from 'react';
import { DrawnCardResult } from './types';

interface ResultConfirmationProps {
  drawnCard: DrawnCardResult;
  interpretation: string;
  feeling: 'good' | 'soso' | 'bad' | null;
  comment: string;
  onComplete: () => void;
}

export const ResultConfirmation: React.FC<ResultConfirmationProps> = ({
  drawnCard,
  interpretation,
  feeling,
  comment,
  onComplete
}) => {
  const cardName = drawnCard.card.name || 'カード';
  const position = drawnCard.isReversed ? '逆位置' : '正位置';

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
                あなたに夢中！
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
              {interpretation}
            </p>
          </div>
        </div>

        {/* 感想入力セクション */}
        <div>
          <div className="text-center">
            <h3 
              className="font-bold text-xs text-center m-0 w-[343px] mx-auto rounded-t-lg py-3 px-0"
              style={{
                color: '#E9D9FD',
                boxShadow: '0px 1px 1px 0px #1A1045',
                background: '#2E206B'
              }}
            >
              占い結果の感想
            </h3>
          </div>
          <div
            className="w-[343px] mx-auto rounded-b-lg p-4"
            style={{
              background: 'linear-gradient(180deg, rgba(145, 97, 196, 0.8) 0%, rgba(86, 76, 145, 0.8) 138.68%)'
            }}
          >
            <div className="flex gap-4 items-start">
              {/* 選択された感情アイコン */}
              <div className="flex items-center justify-center flex-shrink-0 w-[80px] h-[63px]">
                {feeling && (
                  <img
                    alt={feeling === 'good' ? '良い' : feeling === 'soso' ? '普通' : '悪い'}
                    src={`/tarot-material/${feeling}.svg`}
                    className="w-[80px] h-[63px]"
                  />
                )}
              </div>

              {/* 感想テキスト */}
              <div className="flex-1 rounded-xl overflow-auto p-2 h-[63px]" style={{ background: 'rgba(255, 255, 255, 0.8)' }}>
                <p className="font-bold text-xs m-0 whitespace-pre-wrap break-words" style={{ fontFamily: 'Noto Sans JP', lineHeight: '20px', color: '#2F2B37' }}>
                  {comment}
                </p>
              </div>
            </div>
          </div>

          {/* 過去の占い結果ボタン */}
          <div className="flex justify-center mt-10">
            <button
              onClick={onComplete}
              className="font-bold text-base text-center text-white w-[140px] h-[48px] rounded-lg cursor-pointer"
              style={{
                fontFamily: 'Noto Sans JP',
                lineHeight: '16px',
                background: 'linear-gradient(180deg, #E3AC66 0%, #89602B 100%)',
                border: '1px solid #FFB370',
                boxShadow: '0px 4px 0px 0px #5B3500'
              }}
            >
              過去の占い結果
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
