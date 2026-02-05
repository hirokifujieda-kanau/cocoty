import React, { useState, useRef, useEffect } from 'react';
import { DrawnCardResult } from './types';

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
  const [selectedFeeling, setSelectedFeeling] = useState<Feeling>(savedFeeling);
  const [comment, setComment] = useState(savedComment);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  // 確認ページを表示
  if (showConfirmation) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          {/* space.png画像 + オーバーレイコンテンツ */}
          <div className="mb-6 relative mx-auto" style={{ marginTop: '24px', width: '332px', height: '301px' }}>
            {/* 背景画像 */}
            <img
              src="/tarot-material/space.png"
              alt="タロット結果"
              width={332}
              height={301}
              style={{ width: '332px', height: '301px', borderRadius: '10px' }}
              className="absolute inset-0"
            />
            
            {/* padding付きコンテナ - これがabsoluteの基準点 */}
            <div className="absolute inset-0 pointer-events-none" style={{ padding: '31px 16px 23px 16px' }}>
              {/* この中のrelativeコンテナがabsolute配置の基準 */}
              <div className="relative w-full h-full">
                {/* 左上: カード名 */}
                <div className="absolute" style={{ top: 0, left: 0 }}>
                  <h3 
                    style={{
                      fontFamily: 'Inter',
                      fontWeight: 500,
                      fontSize: '16px',
                      lineHeight: '130%',
                      textAlign: 'center',
                      color: '#C4C46D'
                    }}
                  >
                    ペンタクル クイーン
                  </h3>
                  <p
                    style={{
                      fontFamily: 'Noto Sans JP',
                      fontWeight: 700,
                      fontSize: '12px',
                      lineHeight: '20px',
                      textAlign: 'center',
                      color: '#C4C46D'
                    }}
                  >
                    (正位置)
                  </p>
                </div>

                {/* 左下: カード画像 */}
                <div className="absolute" style={{ bottom: 0, left: 0 }}>
                  <img
                    alt="カード"
                    width={114}
                    height={191}
                    src="/tarot-images/1-the-magician.svg"
                  />
                </div>

                {/* 右側: バッジ + タイトル + 説明 */}
                <div 
                  className="absolute"
                  style={{
                    right: 0,
                    top: 0,
                    bottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    maxWidth: '180px',
                    paddingLeft: '16px'
                  }}
                >
                  {/* バッジ */}
                  <div style={{ marginRight: '22px' }}>
                    <div className="bg-yellow-600 text-white px-3 py-1 rounded-full text-xs inline-block">
                      あなたに夢中！
                    </div>
                  </div>

                  {/* タイトル */}
                  <h4
                    style={{
                      fontFamily: 'Inter',
                      fontWeight: 500,
                      fontSize: '14px',
                      lineHeight: '130%',
                      textAlign: 'center',
                      color: '#FFFFFF',
                      marginTop: '8px',
                      marginBottom: '8px'
                    }}
                  >
                    欲望に正直に<br />突き進みたい
                  </h4>

                  {/* 説明文 */}
                  <p
                    style={{
                      fontFamily: 'Noto Sans JP',
                      fontWeight: 400,
                      fontSize: '10px',
                      lineHeight: '16px',
                      textAlign: 'center',
                      color: '#FFFFFF'
                    }}
                  >
                    誰に対してもフェアな態度でいたいと思っています。
                    知的で大人な対応ですが、
                    情があるとは言いがたいかも。
                    「人の気持ちがわからない」と
                    突き放し気味で、
                    ずかずかと土足で心に踏み込んでくるような人には激しく抵抗し、
                    嫌ってしまう。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 感想入力セクション */}
        <div>
          <div className="text-center">
            <h3
              style={{
                fontFamily: 'Noto Sans JP',
                fontWeight: 700,
                fontSize: '12px',
                lineHeight: '20px',
                textAlign: 'center',
                color: '#E9D9FD',
                boxShadow: '0px 1px 1px 0px #1A1045',
                background: '#2E206B',
                borderRadius: '8px 8px 0px 0px',
                padding: '12px'
              }}
            >
              占い結果の感想
            </h3>
          </div>
          <div
            style={{
              background: 'linear-gradient(180deg, rgba(145, 97, 196, 0.8) 0%, rgba(86, 76, 145, 0.8) 138.68%)',
              borderRadius: '0px 0px 10px 10px',
              padding: '16px'
            }}
          >
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              {/* 選択された感情アイコン */}
              <div
                style={{
                  width: '80px',
                  height: '63px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {selectedFeeling && (
                  <img
                    alt={selectedFeeling === 'good' ? '良い' : selectedFeeling === 'soso' ? '普通' : '悪い'}
                    src={`/tarot-material/${selectedFeeling}.svg`}
                    style={{ width: '80px', height: '63px' }}
                  />
                )}
              </div>

              {/* 感想テキスト */}
              <div
                style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '12px',
                  padding: '8px 10px',
                  height: '63px',
                  overflow: 'auto'
                }}
              >
                <p
                  style={{
                    fontFamily: 'Noto Sans JP',
                    fontWeight: 700,
                    fontSize: '10px',
                    lineHeight: '20px',
                    color: '#2F2B37',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}
                >
                  {comment}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
              <button
                onClick={onComment}
                style={{
                  width: '140px',
                  height: '48px',
                  borderRadius: '8px',
                  fontFamily: 'Noto Sans JP',
                  fontWeight: 700,
                  fontSize: '16px',
                  lineHeight: '16px',
                  textAlign: 'center',
                  color: '#FFFFFF',
                  background: 'linear-gradient(180deg, #E3AC66 0%, #89602B 100%)',
                  border: '1px solid #FFB370',
                  boxShadow: '0px 4px 0px 0px #5B3500',
                  cursor: 'pointer'
                }}
              >
                保存して終了
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        {/* space.png画像 + オーバーレイコンテンツ */}
        <div className="mb-6 relative mx-auto" style={{ marginTop: '24px', width: '332px', height: '301px' }}>
          {/* 背景画像 */}
          <img
            src="/tarot-material/space.png"
            alt="タロット結果"
            width={332}
            height={301}
            style={{ width: '332px', height: '301px', borderRadius: '10px' }}
            className="absolute inset-0"
          />
          
          {/* padding付きコンテナ - これがabsoluteの基準点 */}
          <div className="absolute inset-0 pointer-events-none" style={{ padding: '31px 16px 23px 16px' }}>
            {/* この中のrelativeコンテナがabsolute配置の基準 */}
            <div className="relative w-full h-full">
              {/* 左上: カード名 */}
              <div className="absolute" style={{ top: 0, left: 0 }}>
                <h3 
                  style={{
                    fontFamily: 'Inter',
                    fontWeight: 500,
                    fontSize: '16px',
                    lineHeight: '130%',
                    letterSpacing: '0%',
                    textAlign: 'center',
                    color: '#C4C46D'
                  }}
                >
                  ペンタクル クイーン
                </h3>
                <p 
                  style={{
                    fontFamily: 'Noto Sans JP',
                    fontWeight: 700,
                    fontSize: '12px',
                    lineHeight: '20px',
                    letterSpacing: '0%',
                    textAlign: 'center',
                    color: '#C4C46D'
                  }}
                >
                  (正位置)
                </p>
              </div>
              
              {/* 左下: カード画像 */}
              <div className="absolute" style={{ bottom: 0, left: 0 }}>
                <img
                  alt="カード"
                  src="/tarot-images/1-the-magician.svg"
                  width="114"
                  height="191"
                />
              </div>
              
              {/* 右側: バッジ、タイトル、テキストをまとめたコンテナ */}
              <div className="absolute" style={{ right: 0, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', maxWidth: '180px', paddingLeft: '16px' }}>
                {/* バッジ */}
                <div style={{ marginRight: '22px' }}>
                  <div className="bg-yellow-600 text-white px-3 py-1 rounded-full text-xs inline-block">
                    あなたに夢中！
                  </div>
                </div>
                
                {/* タイトル */}
                <h4 
                  style={{
                    fontFamily: 'Inter',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '130%',
                    letterSpacing: '0%',
                    textAlign: 'center',
                    color: '#FFFFFF',
                    marginTop: '8px',
                    marginBottom: '8px'
                  }}
                >
                  欲望に正直に<br />突き進みたい
                </h4>
                
                {/* テキスト */}
                <p 
                  style={{
                    fontFamily: 'Noto Sans JP',
                    fontWeight: 400,
                    fontSize: '10px',
                    lineHeight: '16px',
                    letterSpacing: '0%',
                    textAlign: 'center',
                    color: '#FFFFFF'
                  }}
                >
                  誰に対してもフェアな態度でいたいと思っています。
                  知的で大人な対応ですが、
                  情があるとは言いがたいかも。
                  「人の気持ちがわからない」と
                  突き放し気味で、
                  ずかずかと土足で心に踏み込んでくるような人には激しく抵抗し、
                  嫌ってしまう。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 感想入力欄 */}
      <div>
        <div className="text-center">
          <h3 
            style={{
              fontFamily: 'Noto Sans JP',
              fontWeight: 700,
              fontSize: '12px',
              lineHeight: '20px',
              letterSpacing: '0%',
              textAlign: 'center',
              color: '#E9D9FD',
              boxShadow: '0px 1px 1px 0px #1A1045',
              background: '#2E206B',
              borderRadius: '8px 8px 0 0',
              padding: '12px'
            }}
          >
            今の気持ちを少しだけ振り返ってみましょう
          </h3>
        </div>

        {/* グラデーション背景のコンテナ */}
        <div 
          style={{
            background: 'linear-gradient(180deg, rgba(145, 97, 196, 0.8) 0%, rgba(86, 76, 145, 0.8) 138.68%)',
            borderRadius: '0 0 10px 10px',
            padding: '16px'
          }}
        >
          <p 
            style={{
              fontFamily: 'Noto Sans JP',
              fontWeight: 700,
              fontSize: '12px',
              lineHeight: '20px',
              letterSpacing: '0%',
              color: '#FFFFFF',
              marginBottom: '12px',
              textAlign: 'center'
            }}
          >
            1.占いの結果はどう感じましたか？
          </p>

          {/* アイコン横並び */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '12px' }}>
            <button
              onClick={() => setSelectedFeeling('good')}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              <img 
                src="/tarot-material/good.svg" 
                alt="良い"
                style={{
                  display: 'block',
                  filter: selectedFeeling !== null && selectedFeeling !== 'good' 
                    ? 'brightness(0.3) saturate(0.5)' 
                    : 'none'
                }}
              />
            </button>
            <button
              onClick={() => setSelectedFeeling('soso')}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              <img 
                src="/tarot-material/soso.svg" 
                alt="普通"
                style={{
                  display: 'block',
                  filter: selectedFeeling !== null && selectedFeeling !== 'soso' 
                    ? 'brightness(0.3) saturate(0.5)' 
                    : 'none'
                }}
              />
            </button>
            <button
              onClick={() => setSelectedFeeling('bad')}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              <img 
                src="/tarot-material/bad.svg" 
                alt="悪い"
                style={{
                  display: 'block',
                  filter: selectedFeeling !== null && selectedFeeling !== 'bad' 
                    ? 'brightness(0.3) saturate(0.5)' 
                    : 'none'
                }}
              />
            </button>
          </div>

          <p 
            style={{
              fontFamily: 'Noto Sans JP',
              fontWeight: 700,
              fontSize: '12px',
              lineHeight: '20px',
              color: '#FFFFFF',
              marginBottom: '12px',
              textAlign: 'center'
            }}
          >
            2.占いの感想を記録しておきましょう！
          </p>

          <textarea
            ref={textareaRef}
            value={comment}
            onChange={handleCommentChange}
            placeholder="今の気持ちをそのまま書いてみてください。"
            className="px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            style={{
              width: '300px',
              minHeight: '88px',
              background: '#FFFFFF80',
              border: 'none',
              borderRadius: '12px',
              marginBottom: '12px',
              fontFamily: 'Noto Sans JP',
              fontWeight: 700,
              fontSize: '10px',
              lineHeight: '20px',
              letterSpacing: '0%',
              color: '#2F2B37',
              resize: 'none',
              overflow: 'hidden'
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
            <button
              onClick={() => {
                onSaveData?.(selectedFeeling, comment);
                setShowConfirmation(true);
              }}
              disabled={selectedFeeling === null || comment.trim() === ''}
              style={{
                width: '140px',
                height: '48px',
                borderRadius: '8px',
                fontFamily: 'Noto Sans JP',
                fontWeight: 700,
                fontSize: '16px',
                lineHeight: '16px',
                textAlign: 'center',
                color: '#FFFFFF',
                background: selectedFeeling === null || comment.trim() === ''
                  ? 'linear-gradient(180deg, #D0D0D0 0%, #848484 100%)'
                  : 'linear-gradient(180deg, #E3AC66 0%, #89602B 100%)',
                border: selectedFeeling === null || comment.trim() === ''
                  ? '1px solid #CECECE'
                  : '1px solid #FFB370',
                boxShadow: selectedFeeling === null || comment.trim() === ''
                  ? '0px 4px 0px 0px #676158'
                  : '0px 4px 0px 0px #5B3500',
                cursor: selectedFeeling === null || comment.trim() === '' ? 'not-allowed' : 'pointer'
              }}
            >
              感想を残す
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
