import { CLOUDINARY_CONFIG, UPLOAD_FOLDERS, TRANSFORMATIONS } from './config';

export interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
}

export interface UploadOptions {
  folder?: keyof typeof UPLOAD_FOLDERS;
  transformation?: keyof typeof TRANSFORMATIONS;
  publicId?: string;
}

/**
 * Cloudinaryに画像をアップロード（クライアントサイド）
 */
export async function uploadToCloudinary(
  file: File,
  options: UploadOptions = {}
): Promise<CloudinaryUploadResponse> {
  const { folder = 'avatars', transformation, publicId } = options;

  if (!CLOUDINARY_CONFIG.cloudName) {
    throw new Error('Cloudinary cloud name is missing');
  }

  // より簡単な方法：デフォルトの署名なしアップロード
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'ml_default'); // Cloudinaryのデフォルト署名なしPreset
  
  if (publicId) {
    formData.append('public_id', publicId);
  }
  
  // フォルダーを指定（optionsから取得）
  const folderPath = UPLOAD_FOLDERS[folder];
  formData.append('folder', folderPath);

  // 注意: 署名なしアップロード（upload_preset使用）では、
  // transformationパラメータは使用できません。
  // 変換が必要な場合は、アップロード後にURLで適用するか、
  // upload_presetに事前定義する必要があります。

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Upload failed');
    }

    const result: CloudinaryUploadResponse = await response.json();
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to upload image'
    );
  }
}

/**
 * Cloudinary画像を削除（サーバーサイド用）
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  if (!CLOUDINARY_CONFIG.apiKey || !CLOUDINARY_CONFIG.apiSecret) {
    throw new Error('Cloudinary API credentials are missing');
  }

  // この関数はサーバーサイドでのみ使用（API署名が必要）
  // フロントエンドからは直接呼び出さない
  console.warn('deleteFromCloudinary should only be called from server-side');
}

/**
 * 画像URLを変換付きで生成
 */
export function getTransformedUrl(
  publicId: string,
  transformation: keyof typeof TRANSFORMATIONS
): string {
  if (!CLOUDINARY_CONFIG.cloudName) {
    return '';
  }

  const transformConfig = TRANSFORMATIONS[transformation];
  const transformString = Object.entries(transformConfig)
    .map(([key, value]) => `${key}_${value}`)
    .join(',');

  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/${transformString}/${publicId}`;
}

/**
 * ファイルサイズとタイプを検証
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // ファイルサイズチェック (5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: 'ファイルサイズは5MB以下にしてください' };
  }

  // ファイルタイプチェック
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'JPEG、PNG、WebP、GIF形式のファイルのみ対応しています' };
  }

  return { valid: true };
}