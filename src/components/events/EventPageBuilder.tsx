'use client';

import React, { useState } from 'react';
import { Calendar, MapPin, Users, DollarSign, Camera, Info, Edit } from 'lucide-react';

interface EventDetails {
  id?: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  address?: string;
  capacity: number;
  fee?: number;
  requirements: string[];
  highlights: string[];
  images: string[];
  organizer: string;
  community: string;
  status: 'draft' | 'published' | 'full' | 'cancelled';
}

interface EventPageBuilderProps {
  event?: EventDetails;
  onSave: (event: EventDetails) => void;
  onPublish: (event: EventDetails) => void;
  onPreview: (event: EventDetails) => void;
}

const EventPageBuilder: React.FC<EventPageBuilderProps> = ({
  event,
  onSave,
  onPublish,
  onPreview
}) => {
  const [eventData, setEventData] = useState<EventDetails>(event || {
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    address: '',
    capacity: 10,
    fee: 0,
    requirements: [''],
    highlights: [''],
    images: [],
    organizer: '',
    community: '',
    status: 'draft'
  });

  const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'preview'>('basic');

  const updateField = (field: keyof EventDetails, value: string | number) => {
    setEventData({ ...eventData, [field]: value });
  };

  const updateArrayField = (field: 'requirements' | 'highlights', index: number, value: string) => {
    const newArray = [...eventData[field]];
    newArray[index] = value;
    setEventData({ ...eventData, [field]: newArray });
  };

  const addArrayItem = (field: 'requirements' | 'highlights') => {
    setEventData({ ...eventData, [field]: [...eventData[field], ''] });
  };

  const removeArrayItem = (field: 'requirements' | 'highlights', index: number) => {
    const newArray = eventData[field].filter((_, i) => i !== index);
    setEventData({ ...eventData, [field]: newArray });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              イベント告知ページ作成
            </h1>
            <p className="text-gray-600">
              魅力的なイベントページを作成して参加者を募集しましょう
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => onSave(eventData)}
              className="px-6 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              下書き保存
            </button>
            <button
              onClick={() => onPreview(eventData)}
              className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              プレビュー
            </button>
            <button
              onClick={() => onPublish(eventData)}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              公開する
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              {/* Tabs */}
              <div className="border-b border-gray-200 px-6 pt-6">
                <div className="flex space-x-1">
                  {[
                    { id: 'basic', label: '基本情報', icon: Info },
                    { id: 'details', label: '詳細設定', icon: Edit },
                    { id: 'preview', label: 'プレビュー', icon: Camera }
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id as 'basic' | 'details' | 'preview')}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg border-b-2 transition-colors ${
                        activeTab === id
                          ? 'border-blue-500 text-blue-600 bg-blue-50'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'basic' && (
                  <div className="space-y-6">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        イベント名 *
                      </label>
                      <input
                        type="text"
                        value={eventData.title}
                        onChange={(e) => updateField('title', e.target.value)}
                        placeholder="魅力的なイベント名を入力してください"
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        イベント説明 *
                      </label>
                      <textarea
                        value={eventData.description}
                        onChange={(e) => updateField('description', e.target.value)}
                        placeholder="イベントの内容や魅力を詳しく説明してください..."
                        rows={4}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Date and Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          開催日 *
                        </label>
                        <input
                          type="date"
                          value={eventData.date}
                          onChange={(e) => updateField('date', e.target.value)}
                          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          開始時刻 *
                        </label>
                        <input
                          type="time"
                          value={eventData.time}
                          onChange={(e) => updateField('time', e.target.value)}
                          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        会場名 *
                      </label>
                      <input
                        type="text"
                        value={eventData.location}
                        onChange={(e) => updateField('location', e.target.value)}
                        placeholder="会場名または場所を入力してください"
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        住所・アクセス
                      </label>
                      <input
                        type="text"
                        value={eventData.address || ''}
                        onChange={(e) => updateField('address', e.target.value)}
                        placeholder="詳しい住所やアクセス方法を入力してください"
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Capacity and Fee */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          定員 *
                        </label>
                        <input
                          type="number"
                          value={eventData.capacity}
                          onChange={(e) => updateField('capacity', parseInt(e.target.value))}
                          min="1"
                          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          参加費（円）
                        </label>
                        <input
                          type="number"
                          value={eventData.fee || 0}
                          onChange={(e) => updateField('fee', parseInt(e.target.value))}
                          min="0"
                          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'details' && (
                  <div className="space-y-6">
                    {/* Requirements */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        持ち物・準備するもの
                      </label>
                      {eventData.requirements.map((req, index) => (
                        <div key={index} className="flex items-center space-x-3 mb-3">
                          <input
                            type="text"
                            value={req}
                            onChange={(e) => updateArrayField('requirements', index, e.target.value)}
                            placeholder="持ち物を入力してください"
                            className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          {eventData.requirements.length > 1 && (
                            <button
                              onClick={() => removeArrayItem('requirements', index)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              削除
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => addArrayItem('requirements')}
                        className="text-blue-500 hover:text-blue-600 text-sm"
                      >
                        + 持ち物を追加
                      </button>
                    </div>

                    {/* Highlights */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        イベントの見どころ・魅力
                      </label>
                      {eventData.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-center space-x-3 mb-3">
                          <input
                            type="text"
                            value={highlight}
                            onChange={(e) => updateArrayField('highlights', index, e.target.value)}
                            placeholder="見どころや魅力を入力してください"
                            className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          {eventData.highlights.length > 1 && (
                            <button
                              onClick={() => removeArrayItem('highlights', index)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              削除
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => addArrayItem('highlights')}
                        className="text-blue-500 hover:text-blue-600 text-sm"
                      >
                        + 見どころを追加
                      </button>
                    </div>

                    {/* Organizer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          主催者
                        </label>
                        <input
                          type="text"
                          value={eventData.organizer}
                          onChange={(e) => updateField('organizer', e.target.value)}
                          placeholder="主催者名"
                          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          コミュニティ
                        </label>
                        <input
                          type="text"
                          value={eventData.community}
                          onChange={(e) => updateField('community', e.target.value)}
                          placeholder="コミュニティ名"
                          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'preview' && (
                  <EventPreview event={eventData} />
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                作成のヒント
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">📝 魅力的なタイトル</h4>
                  <p className="text-gray-600">
                    具体的で興味を引くタイトルにしましょう。「楽しい」「面白い」などの形容詞よりも、活動内容が分かる言葉を使いましょう。
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">🎯 ターゲット明確化</h4>
                  <p className="text-gray-600">
                    誰に向けたイベントかを明確にし、参加者のレベルや経験を考慮した説明にしましょう。
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">📸 過去の写真活用</h4>
                  <p className="text-gray-600">
                    過去のイベント写真を使って、参加者が活動をイメージしやすくしましょう。
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">⏰ 詳細な情報</h4>
                  <p className="text-gray-600">
                    開始・終了時間、集合場所、持ち物など、参加に必要な情報を漏れなく記載しましょう。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Event Preview Component
interface EventPreviewProps {
  event: EventDetails;
}

const EventPreview: React.FC<EventPreviewProps> = ({ event }) => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-lg mb-6">
        <h1 className="text-3xl font-bold mb-4">{event.title || 'イベントタイトル'}</h1>
        <p className="text-xl opacity-90">{event.description || 'イベントの説明がここに表示されます'}</p>
      </div>

      {/* Event Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Calendar className="h-6 w-6 text-blue-500" />
            <div>
              <div className="font-semibold">開催日時</div>
              <div className="text-gray-600">
                {event.date || 'YYYY-MM-DD'} {event.time || '00:00'}〜
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <MapPin className="h-6 w-6 text-red-500" />
            <div>
              <div className="font-semibold">会場</div>
              <div className="text-gray-600">{event.location || '会場名'}</div>
              {event.address && (
                <div className="text-sm text-gray-500">{event.address}</div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Users className="h-6 w-6 text-green-500" />
            <div>
              <div className="font-semibold">定員</div>
              <div className="text-gray-600">{event.capacity}名</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <DollarSign className="h-6 w-6 text-yellow-500" />
            <div>
              <div className="font-semibold">参加費</div>
              <div className="text-gray-600">
                {event.fee ? `¥${event.fee}` : '無料'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Highlights */}
      {event.highlights.some(h => h.trim()) && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">🌟 イベントの見どころ</h3>
          <ul className="space-y-2">
            {event.highlights.filter(h => h.trim()).map((highlight, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Requirements */}
      {event.requirements.some(r => r.trim()) && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">🎒 持ち物・準備するもの</h3>
          <ul className="space-y-2">
            {event.requirements.filter(r => r.trim()).map((requirement, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-orange-500 mt-1">•</span>
                <span>{requirement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA Button */}
      <div className="text-center">
        <button className="bg-blue-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors">
          このイベントに参加する
        </button>
      </div>
    </div>
  );
};

export default EventPageBuilder;