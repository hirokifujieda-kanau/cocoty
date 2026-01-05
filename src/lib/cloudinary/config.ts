// Cloudinary設定
export const CLOUDINARY_CONFIG = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
  apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '',
  apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'avatar_uploads',
};

// アップロード先フォルダ
export const UPLOAD_FOLDERS = {
  avatars: 'community-platform/avatars',
  covers: 'community-platform/covers',
  posts: 'community-platform/posts',
  mandala_thumbnails: 'community-platform/mandala/thumbnails',
  mandala_details: 'community-platform/mandala/details',
} as const;

// 画像変換設定
export const TRANSFORMATIONS = {
  avatar: {
    width: 300,
    height: 300,
    crop: 'fill',
    gravity: 'face',
    quality: 'auto',
    format: 'auto',
  },
  cover: {
    width: 1200,
    height: 400,
    crop: 'fill',
    quality: 'auto',
    format: 'auto',
  },
  mandala_thumbnail: {
    width: 400,
    height: 400,
    crop: 'fill',
    quality: 'auto',
    format: 'auto',
  },
  mandala_detail: {
    width: 1200,
    height: 1200,
    crop: 'limit',
    quality: 'auto',
    format: 'auto',
  },
} as const;