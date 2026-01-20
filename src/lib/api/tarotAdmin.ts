/**
 * タロットカード管理用APIクライアント
 */

import { apiRequest } from './client';

/**
 * タロットカードの画像URLを更新
 */
export const updateTarotCardImage = async (
  cardId: number,
  imageUrl: string
): Promise<{ success: boolean; message: string }> => {
  const response = await apiRequest<{ success: boolean; message: string }>(
    `/api/v1/tarot/cards/${cardId}/update_image`,
    {
      method: 'PATCH',
      body: JSON.stringify({ image_url: imageUrl }),
    }
  );

  return response;
};
