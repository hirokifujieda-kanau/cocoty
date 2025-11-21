'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface MandalaImage {
  id: string;
  url: string;
  timestamp: number;
}

interface MandalaGalleryProps {
  userId: string;
  isOwner: boolean;
}

const MandalaGallery: React.FC<MandalaGalleryProps> = ({ userId, isOwner }) => {
  const [images, setImages] = useState<MandalaImage[]>(() => {
    // localStorageから画像を読み込み
    const stored = localStorage.getItem(`mandala_${userId}`);
    return stored ? JSON.parse(stored) : [];
  });
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveImages = (newImages: MandalaImage[]) => {
    localStorage.setItem(`mandala_${userId}`, JSON.stringify(newImages));
    setImages(newImages);
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    // 最初の1枚のみを処理
    const file = files[0];
    
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage: MandalaImage = {
          id: `img_${Date.now()}_${Math.random()}`,
          url: e.target?.result as string,
          timestamp: Date.now()
        };
        
        // 既存の画像を置き換える（1枚のみ保存）
        saveImages([newImage]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = (imageId: string) => {
    if (confirm('この画像を削除しますか？')) {
      const newImages = images.filter(img => img.id !== imageId);
      saveImages(newImages);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  if (images.length === 0 && !isOwner) {
    return null; // 他人のプロフィールで画像がない場合は何も表示しない
  }

  return (
    <div>
      {/* 画像が未登録の場合のみアップロードエリアを表示（オーナーのみ） */}
      {isOwner && images.length === 0 && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`w-[300px] h-[300px] border-2 border-dashed rounded-xl cursor-pointer transition-all ${
            isDragging
              ? 'border-purple-500 bg-purple-100'
              : 'border-purple-300 bg-purple-50/50 hover:bg-purple-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center h-full gap-2 text-center p-4">
            <Upload className={`h-8 w-8 ${isDragging ? 'text-purple-600' : 'text-gray-400'}`} />
            <p className="text-xs font-medium text-gray-700">
              曼荼羅アート
            </p>
            <p className="text-xs text-gray-500">
              クリックして画像をアップロード
            </p>
          </div>
        </div>
      )}

      {/* 画像表示 */}
      {images.length > 0 && (
        <div className="relative w-[300px] h-[300px]">
          <div
            className="relative w-full h-full group cursor-pointer rounded-xl overflow-hidden shadow-md"
            onClick={() => setSelectedImage(images[0].url)}
          >
            <img
              src={images[0].url}
              alt="Mandala art"
              className="w-full h-full object-cover"
            />
            {isOwner && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(images[0].id);
                }}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all" />
          </div>
        </div>
      )}

      {/* 画像拡大表示モーダル */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="h-8 w-8" />
            </button>
            <img
              src={selectedImage}
              alt="Mandala art"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MandalaGallery;
