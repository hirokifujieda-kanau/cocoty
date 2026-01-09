'use client';

import { useState } from 'react';
import { uploadToCloudinary } from '@/lib/cloudinary/upload';
import { apiRequest } from '@/lib/api/client';
import { validateImageFile, MANDALA_VALIDATION_OPTIONS } from '@/lib/utils/imageValidation';
import { ValidationErrorModal } from '@/components/common/ValidationErrorModal';

interface MandalaUploadProps {
  userId: number;
  currentThumbnail?: string;
  currentDetail?: string;
  onUploadComplete?: () => void;
}

export default function MandalaUpload({
  userId,
  currentThumbnail,
  currentDetail,
  onUploadComplete,
}: MandalaUploadProps) {
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    currentThumbnail || null
  );
  const [detailPreview, setDetailPreview] = useState<string | null>(
    currentDetail || null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    thumbnail: number;
    detail: number;
  }>({ thumbnail: 0, detail: 0 });
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'thumbnail' | 'detail'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 画像バリデーション
    const validation = await validateImageFile(file, MANDALA_VALIDATION_OPTIONS);
    
    if (!validation.isValid) {
      setValidationError(validation.error || '画像のバリデーションに失敗しました');
      e.target.value = ''; // inputをリセット
      return;
    }

    console.log(`✅ Mandala validation passed: ${validation.width}x${validation.height}px, ${(validation.size! / 1024 / 1024).toFixed(2)}MB`);

    setError(null);

    // プレビュー表示
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'thumbnail') {
        setThumbnailPreview(reader.result as string);
      } else {
        setDetailPreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    const thumbnailInput = document.getElementById(
      'mandala-thumbnail'
    ) as HTMLInputElement;
    const detailInput = document.getElementById(
      'mandala-detail'
    ) as HTMLInputElement;

    const thumbnailFile = thumbnailInput?.files?.[0];
    const detailFile = detailInput?.files?.[0];

    if (!thumbnailFile && !detailFile && !currentThumbnail && !currentDetail) {
      setError('少なくとも1枚の画像を選択してください');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress({ thumbnail: 0, detail: 0 });

    try {
      let thumbnailUrl = currentThumbnail || '';
      let detailUrl = currentDetail || '';

      // サムネイル画像のアップロード
      if (thumbnailFile) {
        setUploadProgress((prev) => ({ ...prev, thumbnail: 30 }));
        const thumbnailResult = await uploadToCloudinary(thumbnailFile, {
          folder: 'mandala_thumbnails',
          transformation: 'mandala_thumbnail',
        });
        thumbnailUrl = thumbnailResult.secure_url;
        setUploadProgress((prev) => ({ ...prev, thumbnail: 100 }));
      }

      // 詳細画像のアップロード
      if (detailFile) {
        setUploadProgress((prev) => ({ ...prev, detail: 30 }));
        const detailResult = await uploadToCloudinary(detailFile, {
          folder: 'mandala_details',
          transformation: 'mandala_detail',
        });
        detailUrl = detailResult.secure_url;
        setUploadProgress((prev) => ({ ...prev, detail: 100 }));
      }

      // プロフィール更新API呼び出し
      await apiRequest<{ profile: any }>(`/profiles/${userId}`, {
        method: 'PUT',
        requireAuth: true,
        body: JSON.stringify({
          profile: {
            mandala_thumbnail_url: thumbnailUrl,
            mandala_detail_url: detailUrl,
          },
        }),
      });

      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'アップロードに失敗しました'
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <ValidationErrorModal
        isOpen={!!validationError}
        error={validationError || ''}
        onClose={() => setValidationError(null)}
      />

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">曼荼羅画像アップロード</h3>
          <p className="text-sm text-gray-600 mb-4">
            サムネイル画像（一覧表示用）と詳細画像（クリック時表示用）をアップロードできます
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* サムネイル画像 */}
        <div>
          <label
            htmlFor="mandala-thumbnail"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            サムネイル画像
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
            {thumbnailPreview ? (
              <div className="space-y-2">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="w-full h-48 object-cover rounded"
                />
                <label
                  htmlFor="mandala-thumbnail"
                  className="cursor-pointer text-sm text-blue-600 hover:text-blue-700"
                >
                  画像を変更
                </label>
              </div>
            ) : (
              <label
                htmlFor="mandala-thumbnail"
                className="cursor-pointer block"
              >
                <div className="text-gray-500">
                  <svg
                    className="mx-auto h-12 w-12 mb-2"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-sm">クリックして画像を選択</span>
                </div>
              </label>
            )}
            <input
              id="mandala-thumbnail"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'thumbnail')}
              className="hidden"
              disabled={isUploading}
            />
          </div>
          {uploadProgress.thumbnail > 0 && uploadProgress.thumbnail < 100 && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress.thumbnail}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* 詳細画像 */}
        <div>
          <label
            htmlFor="mandala-detail"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            詳細画像
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
            {detailPreview ? (
              <div className="space-y-2">
                <img
                  src={detailPreview}
                  alt="Detail preview"
                  className="w-full h-48 object-cover rounded"
                />
                <label
                  htmlFor="mandala-detail"
                  className="cursor-pointer text-sm text-blue-600 hover:text-blue-700"
                >
                  画像を変更
                </label>
              </div>
            ) : (
              <label htmlFor="mandala-detail" className="cursor-pointer block">
                <div className="text-gray-500">
                  <svg
                    className="mx-auto h-12 w-12 mb-2"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-sm">クリックして画像を選択</span>
                </div>
              </label>
            )}
            <input
              id="mandala-detail"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'detail')}
              className="hidden"
              disabled={isUploading}
            />
          </div>
          {uploadProgress.detail > 0 && uploadProgress.detail < 100 && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress.detail}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            isUploading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isUploading ? 'アップロード中...' : 'アップロード'}
        </button>
      </div>
    </div>
    </>
  );
}
