import React from 'react';

interface CommentStepProps {
  comment: string;
  onChange: (comment: string) => void;
  onSave: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export const CommentStep: React.FC<CommentStepProps> = ({
  comment,
  onChange,
  onSave,
  onBack,
  isLoading = false
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-4">この占いの感想を教えてください</h3>
        <p className="text-purple-200">
          あなたの気持ちを記録しておきましょう
        </p>
      </div>

      <textarea
        value={comment}
        onChange={(e) => onChange(e.target.value)}
        placeholder="占い結果について感じたこと、考えたことを自由に書いてください..."
        className="w-full h-40 px-4 py-3 bg-white/10 backdrop-blur-sm border border-purple-400 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
        disabled={isLoading}
      />

      <div className="flex gap-4">
        <button
          onClick={onSave}
          disabled={isLoading}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              保存中...
            </>
          ) : (
            '保存して終了'
          )}
        </button>
        <button
          onClick={onBack}
          disabled={isLoading}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          戻る
        </button>
      </div>
    </div>
  );
};
