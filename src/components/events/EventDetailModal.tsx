import React from 'react';
import { Event, attendEvent, cancelAttendance, deleteEvent, isAttending } from '@/lib/mock/mockEvents';

interface EventDetailModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (event: Event) => void;
  onRefresh: () => void;
  currentUserId: string;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  isOpen,
  onClose,
  onEdit,
  onRefresh,
  currentUserId
}) => {
  if (!isOpen || !event) return null;

  const isOrganizer = event.organizerId === currentUserId;
  const isUserAttending = isAttending(event.id, currentUserId);
  const isFull = event.attendees.length >= event.capacity;
  const canAttend = !isUserAttending && !isFull && event.status === 'open';

  const handleAttend = () => {
    const result = attendEvent(event.id, currentUserId);
    if (result) {
      alert('参加登録しました！');
      onRefresh();
    } else {
      alert('定員に達しているため参加できません');
    }
  };

  const handleCancelAttendance = () => {
    if (confirm('参加をキャンセルしますか？')) {
      cancelAttendance(event.id, currentUserId);
      alert('参加をキャンセルしました');
      onRefresh();
    }
  };

  const handleDelete = () => {
    if (confirm('このイベントを削除しますか？この操作は取り消せません。')) {
      deleteEvent(event.id);
      alert('イベントを削除しました');
      onClose();
      onRefresh();
    }
  };

  const getCategoryBadge = (category: string) => {
    const badges = {
      workshop: { text: 'ワークショップ', color: 'bg-blue-100 text-blue-800' },
      online: { text: 'オンライン', color: 'bg-green-100 text-green-800' },
      social: { text: '交流会', color: 'bg-yellow-100 text-yellow-800' },
      competition: { text: 'コンテスト', color: 'bg-red-100 text-red-800' },
      exhibition: { text: '展示会', color: 'bg-purple-100 text-purple-800' }
    };
    return badges[category as keyof typeof badges] || badges.workshop;
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      open: { text: '募集中', color: 'bg-green-100 text-green-800' },
      closed: { text: '締切', color: 'bg-gray-100 text-gray-800' },
      cancelled: { text: '中止', color: 'bg-red-100 text-red-800' },
      full: { text: '満員', color: 'bg-orange-100 text-orange-800' }
    };
    return badges[status as keyof typeof badges] || badges.open;
  };

  const categoryBadge = getCategoryBadge(event.category);
  const statusBadge = getStatusBadge(event.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-6 rounded-t-2xl">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryBadge.color}`}>
                  {categoryBadge.text}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                  {statusBadge.text}
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-1">{event.title}</h2>
              <p className="text-white/80 text-sm">{event.community}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors flex-shrink-0"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* コンテンツ */}
        <div className="p-6 space-y-6">
          {/* 基本情報 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">日時</p>
                <p className="font-medium">{event.date}</p>
                <p className="text-sm text-gray-600">{event.time}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">場所</p>
                <p className="font-medium">{event.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">主催者</p>
                <p className="font-medium">{event.organizer}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">参加者</p>
                <p className="font-medium">{event.attendees.length} / {event.capacity}名</p>
              </div>
            </div>
          </div>

          {/* 参加費 */}
          {event.price > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium text-yellow-900">参加費: ¥{event.price.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* 説明 */}
          <div>
            <h3 className="font-bold text-gray-900 mb-2">イベント概要</h3>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{event.description}</p>
          </div>

          {/* タグ */}
          {event.tags.length > 0 && (
            <div>
              <h3 className="font-bold text-gray-900 mb-2">タグ</h3>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* アクションボタン */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            {isOrganizer ? (
              // 主催者の場合
              <>
                <button
                  onClick={() => onEdit(event)}
                  className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  編集
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  削除
                </button>
              </>
            ) : (
              // 参加者の場合
              <>
                {isUserAttending ? (
                  <button
                    onClick={handleCancelAttendance}
                    className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    参加をキャンセル
                  </button>
                ) : (
                  <button
                    onClick={handleAttend}
                    disabled={!canAttend}
                    className={`flex-1 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                      canAttend
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {isFull ? '満員' : event.status !== 'open' ? '募集終了' : '参加する'}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
