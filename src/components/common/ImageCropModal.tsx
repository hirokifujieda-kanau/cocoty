'use client';

import React, { useState, useCallback } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { X } from 'lucide-react';

interface ImageCropModalProps {
  isOpen: boolean;
  imageUrl: string;
  aspectRatio?: { width: number; height: number };
  onClose: () => void;
  onCropComplete: (croppedBlob: Blob) => void;
}

/**
 * 画像トリミングモーダル
 */
export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  imageUrl,
  aspectRatio = { width: 1, height: 1 },
  onClose,
  onCropComplete,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropCompleteInternal = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleSave = async () => {
    if (!croppedAreaPixels) return;

    setIsProcessing(true);
    try {
      const croppedBlob = await getCroppedImg(imageUrl, croppedAreaPixels);
      onCropComplete(croppedBlob);
    } catch (error) {
      console.error('❌ トリミングエラー:', error);
      alert('画像のトリミングに失敗しました');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-2 sm:p-4"
      onClick={(e) => {
        // モーダルの背景をクリックしても閉じない（誤操作防止）
        e.stopPropagation();
      }}
    >
      <div 
        className="bg-white rounded-xl sm:rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh] relative z-[10000]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900">画像をトリミング</h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        {/* Cropper */}
        <div className="relative flex-1 bg-gray-900" style={{ minHeight: '400px' }}>
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio.width / aspectRatio.height}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteInternal}
          />
        </div>

        {/* Controls */}
        <div className="p-3 sm:p-6 border-t border-gray-200 space-y-3 sm:space-y-4">
          {/* Zoom Slider */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
              ズーム
            </label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full xs:w-auto px-4 sm:px-6 py-2 text-sm sm:text-base text-gray-700 hover:bg-gray-100 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isProcessing}
            >
              キャンセル
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isProcessing}
              className="w-full xs:w-auto px-4 sm:px-6 py-2 text-sm sm:text-base bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isProcessing ? '処理中...' : 'トリミング完了'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 画像をトリミングしてBlobを返す
 * トリミング後の画像は最小800x800pxにリサイズされる
 */
async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas context not available');
  }

  // トリミング後の画像を最小800x800pxにリサイズ
  const minSize = 800;
  const aspectRatio = pixelCrop.width / pixelCrop.height;
  
  let outputWidth = pixelCrop.width;
  let outputHeight = pixelCrop.height;
  
  // 幅または高さが最小サイズより小さい場合、アスペクト比を維持してリサイズ
  if (outputWidth < minSize || outputHeight < minSize) {
    if (aspectRatio > 1) {
      // 横長
      outputHeight = minSize;
      outputWidth = minSize * aspectRatio;
    } else {
      // 縦長または正方形
      outputWidth = minSize;
      outputHeight = minSize / aspectRatio;
    }
  }

  canvas.width = outputWidth;
  canvas.height = outputHeight;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outputWidth,
    outputHeight
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Canvas is empty'));
      }
    }, 'image/jpeg', 0.95);
  });
}

/**
 * 画像をロードしてHTMLImageElementを返す
 */
function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });
}
