/**
 * 画像アップロードバリデーション
 */

export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
  width?: number;
  height?: number;
  size?: number;
}

export interface ImageValidationOptions {
  maxSizeMB?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  aspectRatio?: { width: number; height: number };
  allowedTypes?: string[];
}

/**
 * 画像ファイルのバリデーション
 */
export async function validateImageFile(
  file: File,
  options: ImageValidationOptions = {}
): Promise<ImageValidationResult> {
  const {
    maxSizeMB = 10,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    aspectRatio,
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  } = options;

  // ファイルタイプチェック
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `対応していないファイル形式です。${allowedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')}のみ対応しています。`
    };
  }

  // ファイルサイズチェック
  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > maxSizeMB) {
    return {
      isValid: false,
      error: `ファイルサイズが大きすぎます（最大${maxSizeMB}MB）。現在のサイズ: ${sizeMB.toFixed(2)}MB`
    };
  }

  // 画像の寸法チェック
  try {
    const dimensions = await getImageDimensions(file);
    const { width, height } = dimensions;

    // 最小サイズチェック
    if (minWidth && width < minWidth) {
      return {
        isValid: false,
        error: `画像の幅が小さすぎます（最小${minWidth}px）。現在: ${width}px`,
        width,
        height,
        size: file.size
      };
    }

    if (minHeight && height < minHeight) {
      return {
        isValid: false,
        error: `画像の高さが小さすぎます（最小${minHeight}px）。現在: ${height}px`,
        width,
        height,
        size: file.size
      };
    }

    // 最大サイズチェック
    if (maxWidth && width > maxWidth) {
      return {
        isValid: false,
        error: `画像の幅が大きすぎます（最大${maxWidth}px）。現在: ${width}px`,
        width,
        height,
        size: file.size
      };
    }

    if (maxHeight && height > maxHeight) {
      return {
        isValid: false,
        error: `画像の高さが大きすぎます（最大${maxHeight}px）。現在: ${height}px`,
        width,
        height,
        size: file.size
      };
    }

    // アスペクト比チェック
    if (aspectRatio) {
      const targetRatio = aspectRatio.width / aspectRatio.height;
      const actualRatio = width / height;
      const tolerance = 0.05; // 5%の許容誤差

      if (Math.abs(targetRatio - actualRatio) > tolerance) {
        return {
          isValid: false,
          error: `画像のアスペクト比が正しくありません。${aspectRatio.width}:${aspectRatio.height}の比率にしてください。`,
          width,
          height,
          size: file.size
        };
      }
    }

    return {
      isValid: true,
      width,
      height,
      size: file.size
    };
  } catch (error) {
    return {
      isValid: false,
      error: '画像の読み込みに失敗しました。'
    };
  }
}

/**
 * 画像の寸法を取得
 */
function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('画像の読み込みに失敗しました'));
    };

    img.src = url;
  });
}

/**
 * 曼荼羅画像用のバリデーション設定
 */
export const MANDALA_VALIDATION_OPTIONS: ImageValidationOptions = {
  maxSizeMB: 5,
  minWidth: 300,
  minHeight: 300,
  maxWidth: 4000,
  maxHeight: 4000,
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
};

/**
 * アバター画像用のバリデーション設定
 */
export const AVATAR_VALIDATION_OPTIONS: ImageValidationOptions = {
  maxSizeMB: 2,
  minWidth: 100,
  minHeight: 100,
  maxWidth: 2000,
  maxHeight: 2000,
  aspectRatio: { width: 1, height: 1 }, // 正方形
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
};

/**
 * カバー画像用のバリデーション設定
 */
export const COVER_VALIDATION_OPTIONS: ImageValidationOptions = {
  maxSizeMB: 5,
  minWidth: 800,
  minHeight: 200,
  maxWidth: 4000,
  maxHeight: 2000,
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
};
