import { useState, useCallback } from 'react';
import { uploadToCloudinary, validateImageFile, type CloudinaryUploadResponse } from '@/lib/cloudinary/upload';
import { uploadAvatar } from '@/lib/api/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UseAvatarUploadReturn {
  uploadAvatar: (file: File, profileId?: number) => Promise<string>;
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
  clearError: () => void;
}

/**
 * アバターアップロード用カスタムフック
 */
export function useAvatarUpload(): UseAvatarUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth(); // Firebase認証のユーザー情報を取得

  const handleUploadAvatar = useCallback(async (file: File, profileId?: number): Promise<string> => {
    try {
      setIsUploading(true);
      setError(null);
      setUploadProgress(0);

      // 認証確認（Firebaseのみ）
      if (!user) {
        console.error('❌ No authenticated Firebase user found');
        throw new Error('認証が必要です。ログインしてください。');
      }

      // ファイル検証
      const validation = validateImageFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      setUploadProgress(20);

      // Cloudinaryにアップロード（メインの重い処理）
      const cloudinaryResponse: CloudinaryUploadResponse = await uploadToCloudinary(file, {
        publicId: `user_${user.uid}_avatar_${Date.now()}`
      });

      setUploadProgress(70); // Cloudinary完了で70%

      // Rails APIに保存
      if (!profileId) {
        throw new Error('プロフィールIDが指定されていません');
      }
      
      try {
        await uploadAvatar(profileId, cloudinaryResponse.secure_url);
        setUploadProgress(100);
      } catch (apiError: any) {
        console.error('❌ Rails API save failed:', apiError);
        throw new Error(`アバター画像の保存に失敗しました: ${apiError.message}`);
      }

      return cloudinaryResponse.secure_url;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'アップロードに失敗しました';
      setError(errorMessage);
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    uploadAvatar: handleUploadAvatar,
    isUploading,
    uploadProgress,
    error,
    clearError,
  };
}