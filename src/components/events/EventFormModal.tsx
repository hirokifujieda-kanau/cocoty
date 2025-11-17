import React, { useState } from 'react';
import { Event, createEvent, updateEvent } from '@/lib/mock/mockEvents';

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editEvent?: Event | null;
  currentUserId: string;
  currentUserName: string;
}

export const EventFormModal: React.FC<EventFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editEvent,
  currentUserId,
  currentUserName
}) => {
  const [formData, setFormData] = useState({
    title: editEvent?.title || '',
    description: editEvent?.description || '',
    date: editEvent?.date || '',
    time: editEvent?.time || '',
    location: editEvent?.location || '',
    community: editEvent?.community || '',
    category: editEvent?.category || 'workshop' as Event['category'],
    capacity: editEvent?.capacity || 20,
    tags: editEvent?.tags.join(', ') || '',
    price: editEvent?.price || 0,
    coverImage: editEvent?.coverImage || '',
    requiresApproval: editEvent?.requiresApproval || false,
    minAge: editEvent?.participantRestrictions?.minAge || undefined,
    maxAge: editEvent?.participantRestrictions?.maxAge || undefined,
    memberOnly: editEvent?.participantRestrictions?.memberOnly || false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' || name === 'price' ? Number(value) : value
    }));
    // エラーをクリア
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'タイトルは必須です';
    if (!formData.description.trim()) newErrors.description = '説明は必須です';
    if (!formData.date) newErrors.date = '日付は必須です';
    if (!formData.time) newErrors.time = '時間は必須です';
    if (!formData.location.trim()) newErrors.location = '場所は必須です';
    if (!formData.community.trim()) newErrors.community = 'コミュニティ名は必須です';
    if (formData.capacity < 1) newErrors.capacity = '定員は1以上で入力してください';
    if (formData.price < 0) newErrors.price = '参加費は0以上で入力してください';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const eventData = {
      title: formData.title,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      organizer: currentUserName,
      organizerId: currentUserId,
      community: formData.community,
      category: formData.category,
      capacity: formData.capacity,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      price: formData.price,
      status: 'open' as const,
      coverImage: formData.coverImage,
      requiresApproval: formData.requiresApproval,
      participantRestrictions: formData.requiresApproval ? {
        minAge: formData.minAge,
        maxAge: formData.maxAge,
        memberOnly: formData.memberOnly
      } : undefined
    };

    try {
      if (editEvent) {
        // 更新
        updateEvent(editEvent.id, eventData);
      } else {
        // 新規作成
        createEvent(eventData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save event:', error);
      alert('イベントの保存に失敗しました');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {editEvent ? 'イベント編集' : '新規イベント作成'}
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* タイトル */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              イベントタイトル <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="例: 春の撮影会 in 上野公園"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* 説明 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              イベント説明 <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="イベントの詳細を入力してください"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* 日付・時間 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                日付 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                時間 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.time ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="例: 10:00-16:00"
              />
              {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
            </div>
          </div>

          {/* 場所 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              場所 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="例: 上野公園"
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
          </div>

          {/* コミュニティ・カテゴリー */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                コミュニティ名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="community"
                value={formData.community}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.community ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="例: 写真部"
              />
              {errors.community && <p className="text-red-500 text-sm mt-1">{errors.community}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                カテゴリー <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="workshop">ワークショップ</option>
                <option value="online">オンライン</option>
                <option value="social">交流会</option>
                <option value="competition">コンテスト</option>
                <option value="exhibition">展示会</option>
              </select>
            </div>
          </div>

          {/* 定員・参加費 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                定員 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                min="1"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.capacity ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                参加費（円）
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>
          </div>

          {/* タグ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              タグ（カンマ区切り）
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="例: 撮影, 初心者歓迎, 屋外"
            />
          </div>

          {/* カバー画像 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              カバー画像URL
            </label>
            <input
              type="url"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">イベントのカバー画像URLを入力してください</p>
          </div>

          {/* 承認制 */}
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.requiresApproval}
                onChange={(e) => setFormData(prev => ({ ...prev, requiresApproval: e.target.checked }))}
                className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
              />
              <div>
                <div className="font-medium text-gray-900">承認制イベント</div>
                <div className="text-xs text-gray-600">主催者が参加者を承認する必要があります</div>
              </div>
            </label>

            {/* 参加条件（承認制の場合のみ表示） */}
            {formData.requiresApproval && (
              <div className="mt-4 space-y-3 pt-3 border-t border-purple-200">
                <div className="text-sm font-semibold text-gray-700">参加条件</div>
                
                {/* 年齢制限 */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">最小年齢</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.minAge || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, minAge: e.target.value ? Number(e.target.value) : undefined }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="制限なし"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">最大年齢</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.maxAge || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxAge: e.target.value ? Number(e.target.value) : undefined }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="制限なし"
                    />
                  </div>
                </div>

                {/* メンバー限定 */}
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.memberOnly}
                    onChange={(e) => setFormData(prev => ({ ...prev, memberOnly: e.target.checked }))}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">コミュニティメンバー限定</span>
                </label>
              </div>
            )}
          </div>

          {/* ボタン */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
            >
              {editEvent ? '更新' : '作成'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
