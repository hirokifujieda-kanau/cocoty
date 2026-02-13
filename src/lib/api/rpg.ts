import { apiRequest } from './client';

// RPGロールの日本語ラベルマッピング
export const RPG_ROLE_LABELS: Record<string, string> = {
  'Fencer': '狩猟本能',
  'Healer': '共感本能',
  'Schemer': '飛躍本能',
  'Gunner': '職人魂',
  'Shielder': '防衛本能',
  'fencer': '狩猟本能',
  'healer': '共感本能',
  'schemer': '飛躍本能',
  'gunner': '職人魂',
  'shielder': '防衛本能',
};

export interface RpgDiagnosis {
  fencer: number;
  healer: number;
  schemer: number;
  gunner: number;
  shielder: number;
  diagnosed_at: string;
}

export interface RpgUser {
  id: number;
  name: string;
  nickname?: string;
  avatar_url: string | null;
  gender: string | null;
  rpg_diagnosis: RpgDiagnosis;
}

export interface RpgUsersResponse {
  users: RpgUser[];
  pagination?: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
}

export interface RpgChartData {
  labels: string[];
  values: number[];
  max_value: number;
  primary_role: string;
  role_descriptions: {
    fencer: string;
    healer: string;
    schemer: string;
    gunner: string;
    shielder: string;
  };
}

export interface RpgUserDetail {
  id: number;
  user_id: number;
  name: string;
  nickname: string;
  avatar_url: string | null;
  gender: string | null;
  bio: string | null;
  rpg_diagnosis: RpgDiagnosis;
  rpg_chart_data: RpgChartData;
}

export interface MyRpgResult extends RpgUserDetail {
  birthday: string | null;
  blood_type: string | null;
  mbti_type: string | null;
}

export interface MyRpgResultResponse {
  user: MyRpgResult;
  diagnosed: boolean;
}

export interface RpgUserDetailResponse {
  user: RpgUserDetail;
}

/**
 * RPG診断完了済みのユーザー一覧を取得
 */
export async function getRpgDiagnosedUsers(
  page: number = 1,
  perPage: number = 20,
  sortBy: string = 'diagnosed_at',
  order: 'asc' | 'desc' = 'desc'
): Promise<RpgUsersResponse> {
  return apiRequest<RpgUsersResponse>(
    `/rpg_diagnoses?page=${page}&per_page=${perPage}&sort_by=${sortBy}&order=${order}`,
    {
      method: 'GET',
      requireAuth: false,
      requireBasicAuth: true, // Basic認証を使用
    }
  );
}

/**
 * RPG診断済みユーザーを名前で検索
 */
export async function searchRpgUsers(name: string): Promise<RpgUsersResponse> {
  return apiRequest<RpgUsersResponse>(
    `/rpg_diagnoses/search?name=${encodeURIComponent(name)}`,
    {
      method: 'GET',
      requireAuth: false,
      requireBasicAuth: true, // Basic認証を使用
    }
  );
}

/**
 * 自分のRPG診断結果を取得
 */
export async function getMyRpgResult(): Promise<MyRpgResultResponse> {
  return apiRequest<MyRpgResultResponse>('/rpg_diagnoses/me', {
    method: 'GET',
    requireAuth: true,
  });
}

/**
 * 特定ユーザーのRPG診断結果を取得
 */
export async function getRpgUserDetail(id: number): Promise<RpgUserDetailResponse> {
  return apiRequest<RpgUserDetailResponse>(`/rpg_diagnoses/${id}`, {
    method: 'GET',
    requireAuth: false,
    requireBasicAuth: true, // Basic認証を使用
  });
}
