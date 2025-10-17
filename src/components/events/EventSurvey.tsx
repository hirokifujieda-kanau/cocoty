'use client';

import React, { useState } from 'react';
import { Plus, Trash2, BarChart3, MessageSquare, Calendar, MapPin } from 'lucide-react';

interface SurveyOption {
  id: string;
  text: string;
  votes: number;
}

interface Survey {
  id: string;
  title: string;
  description: string;
  type: 'multiple_choice' | 'single_choice' | 'text' | 'date_poll' | 'location_poll';
  options?: SurveyOption[];
  responses?: string[];
  createdAt: string;
  createdBy: string;
  community: string;
  status: 'active' | 'closed';
  totalResponses: number;
}

interface EventSurveyProps {
  surveys: Survey[];
  onCreateSurvey: (survey: Partial<Survey>) => void;
  onVote: (surveyId: string, optionId: string) => void;
  onCloseSurvey: (surveyId: string) => void;
}

const EventSurvey: React.FC<EventSurveyProps> = ({
  surveys,
  onCreateSurvey,
  onVote,
  onCloseSurvey
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSurvey, setNewSurvey] = useState({
    title: '',
    description: '',
    type: 'multiple_choice' as Survey['type'],
    options: [{ id: '1', text: '', votes: 0 }, { id: '2', text: '', votes: 0 }]
  });

  const addOption = () => {
    setNewSurvey({
      ...newSurvey,
      options: [
        ...newSurvey.options,
        { id: Date.now().toString(), text: '', votes: 0 }
      ]
    });
  };

  const removeOption = (optionId: string) => {
    setNewSurvey({
      ...newSurvey,
      options: newSurvey.options.filter(opt => opt.id !== optionId)
    });
  };

  const updateOption = (optionId: string, text: string) => {
    setNewSurvey({
      ...newSurvey,
      options: newSurvey.options.map(opt =>
        opt.id === optionId ? { ...opt, text } : opt
      )
    });
  };

  const handleCreateSurvey = () => {
    if (newSurvey.title.trim() && newSurvey.options.every(opt => opt.text.trim())) {
      onCreateSurvey({
        ...newSurvey,
        id: Date.now().toString(),
        createdAt: new Date().toLocaleDateString(),
        createdBy: 'Current User',
        community: 'Default Community',
        status: 'active',
        totalResponses: 0
      });
      setNewSurvey({
        title: '',
        description: '',
        type: 'multiple_choice',
        options: [{ id: '1', text: '', votes: 0 }, { id: '2', text: '', votes: 0 }]
      });
      setShowCreateModal(false);
    }
  };

  const getTypeIcon = (type: Survey['type']) => {
    switch (type) {
      case 'date_poll': return <Calendar className="h-5 w-5" />;
      case 'location_poll': return <MapPin className="h-5 w-5" />;
      case 'text': return <MessageSquare className="h-5 w-5" />;
      default: return <BarChart3 className="h-5 w-5" />;
    }
  };

  const getTypeLabel = (type: Survey['type']) => {
    switch (type) {
      case 'multiple_choice': return '複数選択';
      case 'single_choice': return '単一選択';
      case 'text': return '自由記述';
      case 'date_poll': return '日程調整';
      case 'location_poll': return '場所投票';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              イベント企画アンケート
            </h1>
            <p className="text-gray-600">
              メンバーの意見を収集して、みんなが参加したいイベントを企画しましょう
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>アンケート作成</span>
          </button>
        </div>

        {/* Surveys List */}
        <div className="space-y-6">
          {surveys.map((survey) => (
            <div key={survey.id} className="bg-white rounded-lg shadow-md p-6">
              {/* Survey Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {getTypeIcon(survey.type)}
                    <h2 className="text-xl font-semibold text-gray-900">
                      {survey.title}
                    </h2>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      survey.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {survey.status === 'active' ? '募集中' : '終了'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{survey.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>タイプ: {getTypeLabel(survey.type)}</span>
                    <span>•</span>
                    <span>作成者: {survey.createdBy}</span>
                    <span>•</span>
                    <span>{survey.createdAt}</span>
                    <span>•</span>
                    <span>{survey.totalResponses}件の回答</span>
                  </div>
                </div>
                {survey.status === 'active' && (
                  <button
                    onClick={() => onCloseSurvey(survey.id)}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    募集終了
                  </button>
                )}
              </div>

              {/* Survey Content */}
              {survey.type === 'text' ? (
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900 mb-3">回答一覧:</h3>
                  {survey.responses && survey.responses.length > 0 ? (
                    <div className="space-y-2">
                      {survey.responses.map((response, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-gray-800">{response}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">まだ回答がありません</p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {survey.options?.map((option) => {
                    const percentage = survey.totalResponses > 0 
                      ? (option.votes / survey.totalResponses) * 100 
                      : 0;
                    
                    return (
                      <div key={option.id} className="relative">
                        <div 
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                          onClick={() => survey.status === 'active' && onVote(survey.id, option.id)}
                        >
                          <span className="font-medium text-gray-900">
                            {option.text}
                          </span>
                          <div className="flex items-center space-x-3">
                            <span className="text-sm text-gray-600">
                              {option.votes}票 ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                        {survey.totalResponses > 0 && (
                          <div 
                            className="absolute bottom-0 left-0 h-1 bg-blue-500 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Create Survey Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                新しいアンケートを作成
              </h2>

              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    タイトル *
                  </label>
                  <input
                    type="text"
                    value={newSurvey.title}
                    onChange={(e) => setNewSurvey({ ...newSurvey, title: e.target.value })}
                    placeholder="例: 次の活動で何をしたいですか？"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    説明
                  </label>
                  <textarea
                    value={newSurvey.description}
                    onChange={(e) => setNewSurvey({ ...newSurvey, description: e.target.value })}
                    placeholder="アンケートの詳細や背景を説明してください..."
                    rows={3}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    アンケートタイプ
                  </label>
                  <select
                    value={newSurvey.type}
                    onChange={(e) => setNewSurvey({ ...newSurvey, type: e.target.value as Survey['type'] })}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="multiple_choice">複数選択可能</option>
                    <option value="single_choice">単一選択のみ</option>
                    <option value="text">自由記述</option>
                    <option value="date_poll">日程調整</option>
                    <option value="location_poll">場所投票</option>
                  </select>
                </div>

                {/* Options */}
                {newSurvey.type !== 'text' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      選択肢
                    </label>
                    <div className="space-y-3">
                      {newSurvey.options.map((option, index) => (
                        <div key={option.id} className="flex items-center space-x-3">
                          <input
                            type="text"
                            value={option.text}
                            onChange={(e) => updateOption(option.id, e.target.value)}
                            placeholder={`選択肢 ${index + 1}`}
                            className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          {newSurvey.options.length > 2 && (
                            <button
                              onClick={() => removeOption(option.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={addOption}
                        className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        <span>選択肢を追加</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleCreateSurvey}
                    className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    アンケートを作成
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventSurvey;