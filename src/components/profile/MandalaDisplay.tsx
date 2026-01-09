'use client';

import { useState } from 'react';

interface MandalaDisplayProps {
  thumbnailUrl?: string;
  detailUrl?: string;
  userName?: string;
}

export default function MandalaDisplay({
  thumbnailUrl,
  detailUrl,
  userName,
}: MandalaDisplayProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 画像がない場合は何も表示しない
  if (!thumbnailUrl && !detailUrl) {
    return null;
  }

  // サムネイルがない場合は詳細画像をサムネイルとして使う
  const displayThumbnail = thumbnailUrl || detailUrl;
  // 詳細画像がない場合はサムネイルを詳細画像として使う
  const displayDetail = detailUrl || thumbnailUrl;

  const handleClick = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  // モーダル外をクリックした時の処理
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <>
      {/* サムネイル表示 */}
      <div className="mandala-container w-full">
        <div
          className="cursor-pointer rounded-lg shadow-md w-full h-full"
          onClick={handleClick}
        >
          <img
            src={displayThumbnail}
            alt={`${userName || 'ユーザー'}の曼荼羅`}
            className="w-full h-auto object-contain rounded-lg"
          />
        </div>
      </div>

      {/* モーダル表示 */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
          onClick={handleBackdropClick}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full">
            {/* 閉じるボタン */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              aria-label="閉じる"
            >
              <svg
                className="w-6 h-6 text-gray-700"
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

            {/* 詳細画像 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
              <img
                src={displayDetail}
                alt={`${userName || 'ユーザー'}の曼荼羅（詳細）`}
                className="w-full h-full object-contain max-h-[85vh]"
              />
            </div>

            {/* 画像情報 */}
            {userName && (
              <div className="mt-4 text-center text-white">
                <p className="text-lg font-semibold">{userName}の曼荼羅</p>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .mandala-container {
          width: 100%;
          aspect-ratio: 1 / 1;
          max-width: 400px;
        }
      `}</style>
    </>
  );
}
