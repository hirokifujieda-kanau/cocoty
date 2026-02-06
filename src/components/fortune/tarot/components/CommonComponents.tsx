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
  return (
    <div className="flex justify-center mt-12">
      <button 
        onClick={onClick} 
        disabled={disabled}
        className={`w-[140px] h-12 rounded-lg border font-bold text-base leading-4 text-center text-white font-noto-sans-jp ${
          !disabled 
            ? 'bg-gradient-to-b from-[#E3AC66] to-[#89602B] border-[#FFB370] shadow-[0_4px_0_0_#5B3500] cursor-pointer hover:opacity-90' 
            : 'bg-gradient-to-b from-[#D0D0D0] to-[#848484] border-[#CECECE] shadow-[0_4px_0_0_#676158] cursor-not-allowed'
        }`}
      >
        決定
      </button>
    </div>
  );
};
