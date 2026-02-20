'use client';

import React from 'react';

interface UnderConstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 実装中機能を表示するモーダル
 * 
 * 使い方:
 * 1. このモーダルを非表示にして実際の機能を表示したい場合：
 *    - SHOW_UNDER_CONSTRUCTION を false に変更
 * 2. 完全に削除したい場合：
 *    - このファイルを削除
 *    - 呼び出し元から UnderConstructionModal の import と使用箇所を削除
 */

// この定数を false にすると「実装中」モーダルが非表示になり、実際の機能が使えるようになります
export const SHOW_UNDER_CONSTRUCTION = true;

export const UnderConstructionModal: React.FC<UnderConstructionModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-[90%] max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="閉じる"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* コンテンツ */}
        <div className="text-center">
          {/* アイコン */}
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
          </div>

          {/* タイトル */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            実装中
          </h2>

          {/* メッセージ */}
          <p className="text-gray-600 mb-8">
            この機能は現在開発中です。<br />
            近日公開予定ですので、<br />
            もうしばらくお待ちください。
          </p>

          {/* ボタン */}
          <button
            onClick={onClose}
            className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
