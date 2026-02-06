import React from 'react';

// 戻るボタンアイコン
export const BackIcon: React.FC = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 18L9 12L15 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 決定ボタンコンポーネント
interface DecideButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export const DecideButton: React.FC<DecideButtonProps> = ({
  onClick,
  disabled,
}) => {
  const getButtonStyle = (isEnabled: boolean) => ({
    width: '140px',
    height: '48px',
    borderRadius: '8px',
    background: isEnabled
      ? 'linear-gradient(180deg, #E3AC66 0%, #89602B 100%)'
      : 'linear-gradient(180deg, #D0D0D0 0%, #848484 100%)',
    border: isEnabled ? '1px solid #FFB370' : '1px solid #CECECE',
    boxShadow: isEnabled
      ? '0px 4px 0px 0px #5B3500'
      : '0px 4px 0px 0px #676158',
    fontFamily: 'Noto Sans JP',
    fontWeight: 700,
    fontSize: '16px',
    lineHeight: '16px',
    textAlign: 'center' as const,
    color: '#FFFFFF',
    cursor: isEnabled ? 'pointer' : 'not-allowed',
  });

  return (
    <div className="flex justify-center" style={{ marginTop: '48px' }}>
      <button onClick={onClick} disabled={disabled} style={getButtonStyle(!disabled)}>
        決定
      </button>
    </div>
  );
};
