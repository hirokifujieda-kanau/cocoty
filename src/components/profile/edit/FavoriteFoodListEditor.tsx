'use client';

import React from 'react';

const MAXIMUM_FAVORITE_FOOD_COUNT = 10;

interface FavoriteFoodListEditorProps {
  currentFavoriteFoodList: string[];
  onFoodTextChange: (foodIndex: number, newFoodText: string) => void;
  onAddNewFoodField: () => void;
  onRemoveFoodField: (foodIndexToRemove: number) => void;
}

/**
 * 好きな食べ物リスト編集コンポーネント
 * ユーザーの好きな食べ物を最大10個まで追加・編集・削除できる入力フィールドリストを提供
 */
export const FavoriteFoodListEditor: React.FC<FavoriteFoodListEditorProps> = ({
  currentFavoriteFoodList,
  onFoodTextChange,
  onAddNewFoodField,
  onRemoveFoodField,
}) => {
  const hasReachedMaximumFoodCount = currentFavoriteFoodList.length >= MAXIMUM_FAVORITE_FOOD_COUNT;

  return (
    <div className="space-y-4">
      <h2 className="font-noto font-bold text-xs leading-5 text-[#1A1A1A]">
        好きな食べ物
        <span className="font-noto font-bold text-[10px] leading-3 text-[#828282] ml-3">
          最大{MAXIMUM_FAVORITE_FOOD_COUNT}個まで
        </span>
      </h2>
      
      <div className="flex flex-col gap-4">
        {currentFavoriteFoodList.map((foodText, foodIndex) => (
          <div key={foodIndex} className="flex items-center gap-2">
            <input
              type="text"
              value={foodText}
              onChange={(e) => onFoodTextChange(foodIndex, e.target.value)}
              className="flex-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 py-[5px] px-2 font-inter font-medium text-sm leading-[130%] text-[#1A1A1A] bg-[#E6E6E6] border border-[#E0E0E0]"
              placeholder="好きな食べ物を入力"
            />
            <button
              type="button"
              onClick={() => onRemoveFoodField(foodIndex)}
              className="hover:opacity-70 transition-opacity ml-4 text-[#828282]"
              aria-label="好きな食べ物を削除"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        ))}
        
        {!hasReachedMaximumFoodCount && (
          <button
            type="button"
            onClick={onAddNewFoodField}
            className="w-10 h-10 flex items-center justify-center"
            aria-label="好きな食べ物を追加"
          >
            <img src="/plus.svg" alt="追加" className="w-8 h-8" />
          </button>
        )}
      </div>
    </div>
  );
};
