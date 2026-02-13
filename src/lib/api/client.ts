/**
 * Cocoty API Client
 * バックエンドAPIとの通信を担当
 */

import { auth } from '@/lib/firebaseConfig';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

/**
 * Firebase ID Tokenを取得
 */
async function getIdToken(): Promise<string | null> {
  const user = auth.currentUser;
  
  if (!user) {
    console.error('❌ auth.currentUser が null です！');
    return null;
  }
  
  try {
    const token = await user.getIdToken(true); // 強制的に最新のトークンを取得
    
    // localStorage に保存（バックエンドの確認用）
    if (typeof window !== 'undefined') {
      localStorage.setItem('firebaseIdToken', token);
    }
    
    return token;
  } catch (error) {
    console.error('❌ getIdToken() エラー:', error);
    return null;
  }
}

/**
 * APIリクエストのヘッダーを生成
 */
async function getHeaders(requireAuth: boolean = false): Promise<HeadersInit> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (requireAuth) {
    const token = await getIdToken();
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.error('❌ Token が null のため、認証エラーをスロー');
      throw new Error('Firebase authentication required. Please log in again.');
    }
  }
  
  return headers;
}

/**
 * APIリクエストのラッパー
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit & { requireAuth?: boolean } = {}
): Promise<T> {
  const { requireAuth = false, ...fetchOptions } = options;
  
  const headers = await getHeaders(requireAuth);
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        ...headers,
        ...fetchOptions.headers,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error(`❌ [API] Error ${response.status}:`, errorData);
      throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error: any) {
    // ネットワークエラーの場合
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      console.error(`❌ [API] Network error:`, error);
      throw new Error(`Rails APIサーバーに接続できません。${url} が起動しているか確認してください。`);
    }
    
    console.error(`❌ [API] Request failed for ${endpoint}:`, error);
    throw error;
  }
}

// ========================================
// Authentication API
// ========================================

export interface User {
  id: number;
  email: string;
  firebase_uid: string;
  created_at: string;
}

export interface Profile {
  id: number;
  user_id: number;
  firebase_uid: string;
  nickname: string;
  name: string;
  bio: string;
  avatar_url?: string;
  cover_url?: string;
  birthday?: string;
  age?: number;
  birthplace?: string;
  blood_type?: 'A' | 'B' | 'O' | 'AB';
  hobbies: string[];
  favorite_food: string[];
  mbti_type?: string;
  goal?: string;
  goal_progress?: number;
  skills?: string;
  social_link?: string;
  posts_count: number;
  albums_count: number;
  friends_count: number;
  mandala_thumbnail_url?: string;  // 曼荼羅サムネイル画像URL
  mandala_detail_url?: string;     // 曼荼羅詳細画像URL
  mandala_uploaded_at?: string;
  diagnosis?: string;
  gender?: '男性' | '女性' | 'その他';  // 性別
  // タロット占い
  tarot_last_drawn?: string;
  tarot_last_drawn_at?: string;  // タロット最終実施日時
  // RPG診断結果
  rpg_fencer?: number;    // 狩猟本能
  rpg_shielder?: number;  // 警戒本能
  rpg_gunner?: number;    // 職人魂
  rpg_healer?: number;    // 共感本能
  rpg_schemer?: number;   // 飛躍本能
  rpg_diagnosed_at?: string;
  rpg_diagnosis_completed_at?: string;  // RPG診断完了日時
  mental_stats?: {
    happiness: number;
    stress: number;
    energy: number;
    focus: number;
  };
  created_at: string;
  updated_at: string;
}

export interface MeResponse {
  user: User;
  profile: Profile | null;
}

/**
 * 現在のユーザー情報を取得
 */
export async function getCurrentUser(): Promise<MeResponse> {
  return apiRequest<MeResponse>('/auth/me', { requireAuth: true });
}

// ========================================
// Profiles API
// ========================================

export interface ProfilesResponse {
  profiles: Profile[];
  pagination: {
    total_count: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
}

/**
 * プロフィール一覧を取得
 */
export async function getProfiles(page: number = 1, perPage: number = 20): Promise<ProfilesResponse> {
  return apiRequest<ProfilesResponse>(`/profiles?page=${page}&per_page=${perPage}`, { requireAuth: true });
}

/**
 * プロフィール詳細を取得
 * @param id プロフィールID
 * @param requireAuth 認証が必要な場合はtrue（デフォルト: true）
 */
export async function getProfile(id: number, requireAuth: boolean = true): Promise<Profile> {
  return apiRequest<Profile>(`/profiles/${id}`, { requireAuth });
}

export interface UpdateProfileParams {
  name?: string;
  nickname?: string;
  bio?: string;
  avatar_url?: string;
  cover_url?: string;
  hobbies?: string[];
  favorite_food?: string[];
  mbti_type?: string;
  blood_type?: 'A' | 'B' | 'O' | 'AB';
  birthday?: string;
  birthplace?: string;
  goal?: string;
  goal_progress?: number;
  skills?: string;
  social_link?: string;
  mandala_thumbnail_url?: string;
  mandala_detail_url?: string;
}

export interface UpdateProfileResponse {
  message: string;
  profile: Profile;
}

/**
 * プロフィールを更新
 */
export async function updateProfile(id: number, params: UpdateProfileParams): Promise<UpdateProfileResponse> {
  return apiRequest<UpdateProfileResponse>(`/profiles/${id}`, {
    method: 'PUT',
    requireAuth: true,
    body: JSON.stringify({ profile: params }),
  });
}

// ========================================
// Image Management API
// ========================================

export interface ImageUploadResponse {
  avatar_url?: string;
  cover_url?: string;
  message: string;
}

/**
 * アバター画像をアップロード
 */
export async function uploadAvatar(profileId: number, avatarUrl: string): Promise<ImageUploadResponse> {
  return apiRequest<ImageUploadResponse>(`/avatars/${profileId}`, {
    method: 'POST',
    requireAuth: true,
    body: JSON.stringify({ avatar_url: avatarUrl }),
  });
}

/**
 * アバター画像を削除
 */
export async function deleteAvatar(profileId: number): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/avatars/${profileId}`, {
    method: 'DELETE',
    requireAuth: true,
  });
}

/**
 * カバー画像をアップロード
 */
export async function uploadCover(profileId: number, coverUrl: string): Promise<ImageUploadResponse> {
  return apiRequest<ImageUploadResponse>(`/covers/${profileId}`, {
    method: 'POST',
    requireAuth: true,
    body: JSON.stringify({ cover_url: coverUrl }),
  });
}

/**
 * カバー画像を削除
 */
export async function deleteCover(profileId: number): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/covers/${profileId}`, {
    method: 'DELETE',
    requireAuth: true,
  });
}

// ========================================
// Mandala Art API
// ========================================

export interface MandalaUploadResponse {
  mandala_image_url: string;
  uploaded_at: string;
  message: string;
}

/**
 * 曼荼羅アートをアップロード
 */
export async function uploadMandala(profileId: number, mandalaImageUrl: string): Promise<MandalaUploadResponse> {
  return apiRequest<MandalaUploadResponse>(`/mandalas/${profileId}`, {
    method: 'POST',
    requireAuth: true,
    body: JSON.stringify({ mandala_image_url: mandalaImageUrl }),
  });
}

/**
 * 曼荼羅アートを削除
 */
export async function deleteMandala(profileId: number): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/mandalas/${profileId}`, {
    method: 'DELETE',
    requireAuth: true,
  });
}

// ========================================
// Diagnosis API
// ========================================

export interface DiagnosisResponse {
  diagnosis: string;
  message: string;
}

/**
 * 診断結果を保存
 */
export async function saveDiagnosis(profileId: number, diagnosis: string): Promise<DiagnosisResponse> {
  return apiRequest<DiagnosisResponse>(`/diagnoses/${profileId}`, {
    method: 'POST',
    requireAuth: true,
    body: JSON.stringify({ diagnosis }),
  });
}

/**
 * 診断結果を更新
 */
export async function updateDiagnosis(profileId: number, diagnosis: string): Promise<DiagnosisResponse> {
  return apiRequest<DiagnosisResponse>(`/diagnoses/${profileId}`, {
    method: 'PUT',
    requireAuth: true,
    body: JSON.stringify({ diagnosis }),
  });
}

/**
 * 診断結果を削除
 */
export async function deleteDiagnosis(profileId: number): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/diagnoses/${profileId}`, {
    method: 'DELETE',
    requireAuth: true,
  });
}

// ========================================
// RPG Diagnosis API
// ========================================

export interface RpgQuestion {
  id: number;
  text: string;
  factor: 'fencer' | 'shielder' | 'gunner' | 'healer' | 'schemer';
  is_reversed: boolean;
  order: number;
}

export interface RpgQuestionsResponse {
  questions: RpgQuestion[];
}

/**
 * RPG診断の質問一覧を取得
 */
export async function getRpgQuestions(): Promise<RpgQuestionsResponse> {
  return apiRequest<RpgQuestionsResponse>('/rpg_questions', {
    requireAuth: false,
  });
}

export interface RpgDiagnosisData {
  fencer: number;    // 狩猟本能
  shielder: number;  // 警戒本能
  gunner: number;    // 職人魂
  healer: number;    // 共感本能
  schemer: number;   // 飛躍本能
}

export interface RpgDiagnosisResponse {
  rpg_diagnosis: RpgDiagnosisData;
  message: string;
}

/**
 * RPG診断結果を保存
 * 認証されたユーザーのプロフィールに自動的に保存されます
 */
export async function saveRpgDiagnosis(diagnosisData: RpgDiagnosisData): Promise<RpgDiagnosisResponse> {
  return apiRequest<RpgDiagnosisResponse>('/rpg_diagnoses', {
    method: 'POST',
    requireAuth: true,
    body: JSON.stringify({ rpg_diagnosis: diagnosisData }),
  });
}

// ========================================
// Search API
// ========================================

export interface SearchResponse {
  profiles: Profile[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
}

/**
 * プロフィールを検索
 */
export async function searchProfiles(query: string, page: number = 1, per: number = 20): Promise<SearchResponse> {
  return apiRequest<SearchResponse>(`/search/profiles?q=${encodeURIComponent(query)}&page=${page}&per=${per}`);
}

/**
 * タグでプロフィールを検索
 */
export async function searchByTag(tag: string, page: number = 1, per: number = 20): Promise<SearchResponse> {
  return apiRequest<SearchResponse>(`/search/tags?q=${encodeURIComponent(tag)}&page=${page}&per=${per}`);
}

// ========================================
// Attribute Search API
// ========================================

export type AttributeType = 'age' | 'birthplace' | 'blood_type' | 'mbti_type' | 'hobbies';
export type SortType = 'relevance' | 'recent' | 'followers';

export interface SearchByAttributeParams {
  attribute: AttributeType;
  value: string;
  page?: number;
  per_page?: number;
  sort?: SortType;
}

export interface SearchByAttributeResponse {
  profiles: Profile[];
  meta: {
    total_count: number;
    page: number;
    per_page: number;
    total_pages: number;
    attribute: string;
    value: string;
  };
}

/**
 * 属性でプロフィール検索
 */
export async function searchByAttribute(
  params: SearchByAttributeParams
): Promise<SearchByAttributeResponse> {
  const queryParams = new URLSearchParams({
    attribute: params.attribute,
    value: params.value,
    page: (params.page || 1).toString(),
    per_page: (params.per_page || 20).toString(),
    sort: params.sort || 'relevance',
  });
  
  return apiRequest<SearchByAttributeResponse>(
    `/search/by_attribute?${queryParams.toString()}`
  );
}
