'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Settings, Grid, Bookmark, Sparkles, TrendingUp, Heart as HeartIcon, Users, Calendar, BookOpen, CheckCircle2, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { PH1, PH2, PH3 } from '@/lib/placeholders';
import DailyTarot from '@/components/fortune/DailyTarot';
import SeasonalDiagnosisHub from '@/components/fortune/SeasonalDiagnosisHub';
import MentalStatsAdmin from '@/components/fortune/MentalStatsAdmin';
import ProfileSettings from '@/components/profile/ProfileSettings';
import ProfileEditModal from '@/components/profile/ProfileEditModal';
import ShareProfileModal from '@/components/profile/ShareProfileModal';
import MandalaGallery from '@/components/profile/MandalaGallery';
import { getUserTasks, getTaskStats } from '@/lib/mock/mockLearningTasks';
import { getUserCourseProgress } from '@/lib/mock/mockLearningCourses';
import { getCurrentUser, getProfile, Profile } from '@/lib/api/client';

const InstagramProfilePage: React.FC<{ userId?: string }> = ({ userId: userIdProp }) => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // プロフィールデータの状態
  const [displayUser, setDisplayUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  
  // propsからuserIdを取得、なければURLパラメータを確認
  const userIdFromUrl = searchParams.get('userId');
  const userId = userIdProp || userIdFromUrl;
  
  // URLパラメータがない場合は自分のプロフィール（オーナー）として扱う
  const isOwner = !userId;
  
  console.log('=== InstagramProfilePage Debug ===');
  console.log('Firebase user:', user?.email);
  console.log('userId from props/URL:', userId);
  console.log('isOwner:', isOwner);
  console.log('===================================');
  
  // プロフィールデータを再取得する関数
  const refetchProfile = async () => {
    console.log('🔄 refetchProfile called!');
    
    if (!user) {
      console.log('⚠️ No Firebase user found, skipping profile fetch');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (isOwner) {
        // 自分のプロフィールを取得
        console.log('🔍 Refetching my profile...');
        const response = await getCurrentUser();
        console.log('API response:', response);
        
        if (response.profile) {
          setDisplayUser(response.profile);
          console.log('✅ My profile reloaded:', response.profile);
        } else {
          console.warn('⚠️ Profile not found in response');
          setError('プロフィールが見つかりません。初回ログインの場合は、プロフィールを作成してください。');
        }
      } else if (userId) {
        // 他のユーザーのプロフィールを取得
        console.log('🔍 Refetching profile for user:', userId);
        const profile = await getProfile(Number(userId));
        setDisplayUser(profile);
        console.log('✅ Profile reloaded:', profile);
      }
    } catch (err: any) {
      console.error('❌ Failed to fetch profile:', err);
      
      // エラーの詳細をログ出力
      if (err.message) {
        console.error('Error message:', err.message);
      }
      if (err.response) {
        console.error('Error response:', err.response);
      }
      
      // ユーザーに分かりやすいエラーメッセージを表示
      if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
        setError('Rails APIサーバーに接続できません。http://localhost:5000 が起動しているか確認してください。');
      } else if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
        setError('認証エラー: ログインし直してください');
      } else if (err.message?.includes('404')) {
        setError('プロフィールが見つかりません');
      } else {
        setError(`プロフィールの読み込みに失敗しました: ${err.message || '不明なエラー'}`);
      }
    } finally {
      setLoading(false);
    }
  };
  
  // プロフィールデータ取得
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        console.log('⚠️ No Firebase user found, skipping profile fetch');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        if (isOwner) {
          // 自分のプロフィールを取得
          console.log('🔍 Fetching my profile...');
          console.log('Firebase user:', user.email, user.uid);
          
          const response = await getCurrentUser();
          console.log('API response:', response);
          
          if (response.profile) {
            setDisplayUser(response.profile);
            console.log('✅ My profile loaded:', response.profile);
          } else {
            console.warn('⚠️ Profile not found in response');
            setError('プロフィールが見つかりません。初回ログインの場合は、プロフィールを作成してください。');
          }
        } else if (userId) {
          // 他のユーザーのプロフィールを取得
          console.log('🔍 Fetching profile for user:', userId);
          const profile = await getProfile(Number(userId));
          setDisplayUser(profile);
          console.log('✅ Profile loaded:', profile);
        }
      } catch (err: any) {
        console.error('❌ Failed to fetch profile:', err);
        
        // エラーの詳細をログ出力
        if (err.message) {
          console.error('Error message:', err.message);
        }
        if (err.response) {
          console.error('Error response:', err.response);
        }
        
        // ユーザーに分かりやすいエラーメッセージを表示
        if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
          setError('Rails APIサーバーに接続できません。http://localhost:5000 が起動しているか確認してください。');
        } else if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
          setError('認証エラー: ログインし直してください');
        } else if (err.message?.includes('404')) {
          setError('プロフィールが見つかりません');
        } else {
          setError(`プロフィールの読み込みに失敗しました: ${err.message || '不明なエラー'}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, userId, isOwner]);
  
  // アバターアップロード処理
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !displayUser) return;

    try {
      setUploadingAvatar(true);
      console.log('📤 Uploading avatar...');

      // Cloudinaryにアップロード
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default');
      formData.append('public_id', `${user.uid}_avatar_${Date.now()}`);

      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!cloudinaryResponse.ok) {
        throw new Error('Cloudinary upload failed');
      }

      const cloudinaryData = await cloudinaryResponse.json();
      const avatarUrl = cloudinaryData.secure_url;
      console.log('✅ Avatar uploaded to Cloudinary:', avatarUrl);

      // プロフィールを更新
      const { updateProfile } = await import('@/lib/api/client');
      await updateProfile(displayUser.id, { avatar_url: avatarUrl });
      console.log('✅ Avatar URL saved to profile');

      // プロフィールを再読み込み
      await refetchProfile();

      alert('プロフィール画像を更新しました！');
    } catch (error) {
      console.error('❌ Avatar upload failed:', error);
      alert('画像のアップロードに失敗しました');
    } finally {
      setUploadingAvatar(false);
    }
  };
  
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'fortune'>('posts');
  
  // Fortune機能の状態
  const [showDailyTarot, setShowDailyTarot] = useState(false);
  const [showSeasonalDiagnosis, setShowSeasonalDiagnosis] = useState(false);
  const [showMentalStats, setShowMentalStats] = useState(false);
  
  // プロフィール機能の状態
  const [showSettings, setShowSettings] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showShareProfile, setShowShareProfile] = useState(false);
  
  // フォロー状態とメッセージ機能
  const [isFollowing, setIsFollowing] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState('');
  
  // アクティビティカレンダー用の状態
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [activityData, setActivityData] = useState<{ [key: string]: any[] }>({});

  // フォロー状態を読み込み
  useEffect(() => {
    if (!isOwner && user && displayUser) {
      const followKey = `follow_${user.uid}_${displayUser.id}`;
      const following = localStorage.getItem(followKey) === 'true';
      setIsFollowing(following);
    }
  }, [isOwner, user, displayUser]);

  // フォロー/フォロー解除
  const handleFollowToggle = () => {
    if (!user || !displayUser) return;
    
    const followKey = `follow_${user.uid}_${displayUser.id}`;
    const newFollowState = !isFollowing;
    
    localStorage.setItem(followKey, newFollowState.toString());
    setIsFollowing(newFollowState);
    
    // トースト通知（オプション）
    alert(newFollowState ? `${displayUser.name}をフォローしました` : `${displayUser.name}のフォローを解除しました`);
  };

  // メッセージ送信
  const handleSendMessage = () => {
    if (!messageText.trim()) {
      alert('メッセージを入力してください');
      return;
    }
    
    // メッセージをlocalStorageに保存（実際のアプリではAPIに送信）
    const messageKey = `messages_${user?.uid}_${displayUser?.id}`;
    const existingMessages = JSON.parse(localStorage.getItem(messageKey) || '[]');
    
    const newMessage = {
      id: Date.now(),
      from: user?.uid,
      to: displayUser?.id,
      text: messageText,
      timestamp: new Date().toISOString()
    };
    
    existingMessages.push(newMessage);
    localStorage.setItem(messageKey, JSON.stringify(existingMessages));
    
    setMessageText('');
    setShowMessageModal(false);
    alert(`${displayUser?.name}にメッセージを送信しました`);
  };

  // 過去28日間のアクティビティデータを生成
  useEffect(() => {
    const generateActivityData = () => {
      const data: { [key: string]: any[] } = {};
      const today = new Date();
      
      for (let i = 0; i < 28; i++) {
        const date = new Date();
        date.setDate(today.getDate() - (27 - i));
        const dateKey = date.toDateString();
        
        // ランダムにアクティビティを生成
        const activityCount = Math.random() > 0.6 ? Math.floor(Math.random() * 4) : 0;
        
        if (activityCount > 0) {
          data[dateKey] = Array.from({ length: activityCount }, (_, j) => ({
            id: `${dateKey}-${j}`,
            type: ['upload', 'event', 'comment'][j % 3],
            text: ['写真を3枚アップロード', 'イベントに参加', 'コメントを投稿'][j % 3],
            time: `${10 + j}:00`,
            image: j % 3 === 0 ? [PH1, PH2, PH3][j % 3] : undefined
          }));
        }
      }
      
      setActivityData(data);
    };
    
    generateActivityData();
  }, []);

  // サンプル投稿データ（6枚表示）
  const allPosts = Array.from({ length: 24 }, (_, i) => ({
    id: `post-${i}`,
    image: [PH1, PH2, PH3][i % 3],
    likes: Math.floor(Math.random() * 100) + 10,
    comments: Math.floor(Math.random() * 20) + 1
  }));

  const displayedPosts = allPosts.slice(0, 6);
  const hasMorePosts = allPosts.length > 6;

  // 過去28日間の日付配列
  const last28Days = Array.from({ length: 28 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (27 - i));
    return date;
  });

  // アクティビティ合計
  const totalActivities = Object.values(activityData).reduce((sum, activities) => sum + activities.length, 0);

  // ローディング状態
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">プロフィールを読み込んでいます...</p>
        </div>
      </div>
    );
  }

  // エラー状態
  if (error || !displayUser) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'プロフィールが見つかりません'}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            戻る
          </button>
        </div>
      </div>
    );
  }

  console.log('InstagramProfilePage:', {
    userId,
    displayUserId: displayUser.id,
    displayUserName: displayUser.name,
    isOwner
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold">{displayUser.name}</h1>
            {isOwner && (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSettings(true)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="設定"
                >
                  <Settings className="h-6 w-6" />
                </button>
                <button
                  onClick={async () => {
                    if (confirm('ログアウトしますか？')) {
                      await signOut();
                      router.push('/login');
                    }
                  }}
                  className="p-2 hover:bg-red-50 text-red-600 rounded-full transition-colors"
                  title="ログアウト"
                >
                  <LogOut className="h-6 w-6" />
                </button>
              </div>
            )}
            {!isOwner && <div className="w-10" />}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Profile Section */}
        <div className="px-4 py-6">
          <div className="flex items-start gap-6 mb-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-2 ring-gray-200">
                <img
                  src={displayUser.avatar_url || PH1}
                  alt={displayUser.name}
                  className="w-full h-full object-cover"
                />
                {isOwner && (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      id="avatar-upload-icon"
                      disabled={uploadingAvatar}
                    />
                    <label
                      htmlFor="avatar-upload-icon"
                      className="absolute bottom-0 right-0 w-7 h-7 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors shadow-lg cursor-pointer flex items-center justify-center"
                      title="プロフィール画像を変更"
                    >
                      {uploadingAvatar ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      ) : (
                        <span className="text-lg font-bold leading-none">+</span>
                      )}
                    </label>
                  </>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex-1">
              <div className="flex items-center gap-6 mb-4">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-semibold">{displayedPosts.length}</div>
                  <div className="text-xs sm:text-sm text-gray-500">投稿</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-semibold">245</div>
                  <div className="text-xs sm:text-sm text-gray-500">フォロワー</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-semibold">180</div>
                  <div className="text-xs sm:text-sm text-gray-500">フォロー中</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {isOwner ? (
                  <>
                    <button
                      onClick={() => setShowEditProfile(true)}
                      className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-sm transition-colors"
                    >
                      プロフィールを編集
                    </button>
                    {/* プロフィールをシェアは非表示 */}
                    {false && (
                    <button
                      onClick={() => setShowShareProfile(true)}
                      className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-sm transition-colors"
                    >
                      プロフィールをシェア
                    </button>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleFollowToggle}
                      className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                        isFollowing
                          ? 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      {isFollowing ? 'フォロー中' : 'フォロー'}
                    </button>
                    <button
                      onClick={() => setShowMessageModal(true)}
                      className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-sm transition-colors"
                    >
                      メッセージ
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <div className="font-semibold">{displayUser.name}</div>
            <div className="text-sm">{displayUser.bio}</div>
            {displayUser.diagnosis && (
              <div className="text-sm text-purple-600">
                診断: {displayUser.diagnosis}
              </div>
            )}

            {/* 拡張プロフィール情報 */}
            {(displayUser.birthday || displayUser.age || displayUser.birthplace || displayUser.blood_type || displayUser.mbti_type) && (
              <div className="flex flex-wrap gap-2 mt-3">
                {/* 年齢・生年月日 */}
                {displayUser.age && (
                  <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    🎂 {displayUser.age}歳
                  </span>
                )}
                
                {/* 出身地 */}
                {displayUser.birthplace && (
                  <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    📍 {displayUser.birthplace}
                  </span>
                )}
                
                {/* 血液型 */}
                {displayUser.blood_type && (
                  <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                    🩸 {displayUser.blood_type}型
                  </span>
                )}
                
                {/* MBTI */}
                {displayUser.mbti_type && (
                  <button
                    onClick={() => router.push(`/tags/${encodeURIComponent(displayUser.mbti_type!)}`)}
                    className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full hover:bg-purple-200 hover:shadow-sm transition-all cursor-pointer"
                  >
                    🧠 {displayUser.mbti_type}
                  </button>
                )}
              </div>
            )}

            {/* 趣味・好きな食べ物と曼荼羅アートを横並びに */}
            <div className="flex gap-6 items-start mt-3">
              {/* 左側：趣味・好きな食べ物 */}
              <div className="flex-1 min-w-0 space-y-3">
                {/* 趣味 */}
                {(displayUser as any).hobbies && (displayUser as any).hobbies.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold text-gray-500 mb-1">趣味</div>
                    <div className="flex flex-wrap gap-1.5">
                      {(displayUser as any).hobbies.map((hobby: string, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => router.push(`/tags/${encodeURIComponent(hobby)}`)}
                          className="inline-flex items-center px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-md border border-orange-200 hover:bg-orange-100 hover:shadow-sm transition-all cursor-pointer"
                        >
                          {hobby}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 好きな食べ物 */}
                {(displayUser as any).favoriteFood && (displayUser as any).favoriteFood.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold text-gray-500 mb-1">好きな食べ物</div>
                    <div className="flex flex-wrap gap-1.5">
                      {(displayUser as any).favoriteFood.map((food: string, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => router.push(`/tags/${encodeURIComponent(food)}`)}
                          className="inline-flex items-center px-2 py-1 bg-pink-50 text-pink-700 text-xs rounded-md border border-pink-200 hover:bg-pink-100 hover:shadow-sm transition-all cursor-pointer"
                        >
                          🍽️ {food}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 右側：曼荼羅アート */}
              <div className="flex-shrink-0">
                <MandalaGallery userId={displayUser.id.toString()} isOwner={isOwner} />
              </div>
            </div>
          </div>

          {/* タロット・診断ボタン（最上部） */}
          {isOwner && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* タロット占い */}
              <button
                onClick={() => setShowDailyTarot(true)}
                className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🔮</span>
                  <div className="text-left">
                    <h3 className="font-bold text-base">今日のタロット占い</h3>
                    <p className="text-xs opacity-90">毎日の運勢をチェック</p>
                  </div>
                </div>
              </button>

              {/* 季節診断 */}
              <button
                onClick={() => setShowSeasonalDiagnosis(true)}
                className="bg-gradient-to-br from-pink-500 to-rose-600 text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                <div className="flex items-center space-x-3">
                  <Sparkles className="h-6 w-6" />
                  <div className="text-left">
                    <h3 className="font-bold text-base">パーソナル診断</h3>
                    <p className="text-xs opacity-90">あなたの季節タイプは？</p>
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* チームタスク進捗と個人課題進捗 - 今後実装予定のため非表示 */}
          {false && (
          <div className="mt-6 space-y-4">
            {/* チームタスク進捗 */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <h3 className="font-bold text-gray-900 text-sm">チームタスク進捗</h3>
                </div>
                <span className="text-xs text-gray-500">
                  一般グループ
                </span>
              </div>
              
              {/* 進捗バー */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>完了タスク</span>
                  <span className="font-semibold">
                    {(() => {
                      const total = 12;
                      const completed = Math.floor(Math.random() * 5) + 7; // 7-11の範囲
                      return `${completed} / ${total}`;
                    })()}
                  </span>
                </div>
                <div className="w-full bg-blue-100 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                    style={{ 
                      width: `${(() => {
                        const total = 12;
                        const completed = Math.floor(Math.random() * 5) + 7;
                        return Math.round((completed / total) * 100);
                      })()}%` 
                    }}
                  >
                    <span className="text-[10px] text-white font-bold">
                      {(() => {
                        const total = 12;
                        const completed = Math.floor(Math.random() * 5) + 7;
                        return Math.round((completed / total) * 100);
                      })()}%
                    </span>
                  </div>
                </div>
              </div>

              {/* 今週の貢献度 */}
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-gray-600">今週の貢献</span>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 7 }).map((_, i) => {
                    const height = Math.random() > 0.3 ? Math.floor(Math.random() * 20) + 10 : 5;
                    return (
                      <div 
                        key={i}
                        className="w-1.5 bg-blue-400 rounded-sm"
                        style={{ height: `${height}px` }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 個人課題進捗 */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-600" />
                  <h3 className="font-bold text-gray-900 text-sm">個人課題進捗</h3>
                </div>
                <span className="text-xs text-purple-600 font-semibold">
                  {(displayUser as any).goalProgress || 0}%
                </span>
              </div>
              
              {/* 進捗バー */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span className="truncate max-w-[200px]">{(displayUser as any).goal || '目標未設定'}</span>
                  <span className="font-semibold">
                    {(displayUser as any).milestones?.filter((m: any) => m.completed).length || 0} / {(displayUser as any).milestones?.length || 0}
                  </span>
                </div>
                <div className="w-full bg-purple-100 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                    style={{ width: `${(displayUser as any).goalProgress || 0}%` }}
                  >
                    {((displayUser as any).goalProgress || 0) > 15 && (
                      <span className="text-[10px] text-white font-bold">
                        {(displayUser as any).goalProgress}%
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* マイルストーン */}
              {(displayUser as any).milestones && (displayUser as any).milestones.length > 0 && (
                <div className="mt-3 space-y-1">
                  {(displayUser as any).milestones.slice(0, 3).map((milestone: any, index: number) => (
                    <div key={index} className="flex items-center space-x-2 text-xs">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                        milestone.completed ? 'bg-green-500' : 'bg-gray-300'
                      }`}>
                        {milestone.completed && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={`flex-1 truncate ${milestone.completed ? 'text-gray-600 line-through' : 'text-gray-900'}`}>
                        {milestone.title}
                      </span>
                      {milestone.completed && milestone.date && (
                        <span className="text-gray-400 text-[10px]">{milestone.date}</span>
                      )}
                    </div>
                  ))}
                  {(displayUser as any).milestones.length > 3 && (
                    <div className="text-center text-xs text-purple-600 mt-2">
                      +{(displayUser as any).milestones.length - 3}個のマイルストーン
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          )}

          {/* 個人実績（エアコース）- 今後実装予定のため非表示 */}
          {false && isOwner && displayUser && (() => {
            const stats = getTaskStats(displayUser.id.toString());
            const courseProgress = getUserCourseProgress(displayUser.id.toString());
            
            return (
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 rounded-2xl border border-purple-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                    個人実績（エアコース）
                  </h3>
                  <button
                    onClick={() => router.push('/learning')}
                    className="text-sm text-purple-600 font-semibold hover:text-purple-700"
                  >
                    詳細 →
                  </button>
                </div>
                
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl text-center">
                    <div className="text-2xl font-bold text-purple-600">{stats.completionRate}%</div>
                    <div className="text-xs text-gray-600 mt-1">達成率</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                    <div className="text-xs text-gray-600 mt-1">完了</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
                    <div className="text-xs text-gray-600 mt-1">進行中</div>
                  </div>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-700">総合進捗</span>
                    <span className="font-bold text-purple-600">{stats.completed} / {stats.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 h-2.5 rounded-full transition-all duration-500" 
                      style={{ width: `${stats.completionRate}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
                    <span>📚 {courseProgress.length}コース受講中</span>
                    {stats.overdue > 0 && (
                      <span className="text-red-600 font-semibold">⚠️ 期限切れ {stats.overdue}件</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Highlights */}
          <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
            <button
              onClick={() => setShowDailyTarot(true)}
              className="flex flex-col items-center gap-2 flex-shrink-0"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 p-0.5">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="text-xs text-gray-600">タロット</div>
            </button>
            <button
              onClick={() => setShowSeasonalDiagnosis(true)}
              className="flex flex-col items-center gap-2 flex-shrink-0"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-red-400 p-0.5">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-2xl">
                  🌸
                </div>
              </div>
              <div className="text-xs text-gray-600">季節診断</div>
            </button>
            <button
              onClick={() => setShowMentalStats(true)}
              className="flex flex-col items-center gap-2 flex-shrink-0"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 p-0.5">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="text-xs text-gray-600">メンタル</div>
            </button>
            {/* 学習・イベント・チーム機能は今後実装予定のため非表示 */}
            {false && (
            <>
            <button
              onClick={() => router.push('/learning')}
              className="flex flex-col items-center gap-2 flex-shrink-0"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 p-0.5">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="text-xs text-gray-600">学習</div>
            </button>
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 p-0.5">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="text-xs text-gray-600">イベント</div>
            </div>
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-violet-400 p-0.5">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
              <div className="text-xs text-gray-600">写真部</div>
            </div>
            </>
            )}
          </div>
        </div>

        {/* Tabs - 投稿/保存済みタブは非表示 */}
        {false && (
        <div className="border-t border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 border-t-2 transition-colors ${
                activeTab === 'posts'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <Grid className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase hidden sm:inline">投稿</span>
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 border-t-2 transition-colors ${
                activeTab === 'saved'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <Bookmark className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase hidden sm:inline">保存済み</span>
            </button>
            <button
              onClick={() => setActiveTab('fortune')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 border-t-2 transition-colors ${
                activeTab === 'fortune'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <Sparkles className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase hidden sm:inline">占い</span>
            </button>
          </div>
        </div>
        )}

        {/* Content Grid - 投稿/保存済み/活動カレンダーは非表示 */}
        {false && (
        <div className="px-1">
          {activeTab === 'posts' && (
            <>
              <div className="grid grid-cols-3 gap-1">
                {displayedPosts.map((post) => (
                  <div key={post.id} className="aspect-square relative group cursor-pointer">
                    <img
                      src={post.image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center gap-4">
                      <div className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        <HeartIcon className="h-5 w-5 fill-white" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        <span>💬</span>
                        <span>{post.comments}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {hasMorePosts && (
                <div className="mt-4 p-6 text-center border-t">
                  <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                    すべての投稿を見る →
                  </button>
                </div>
              )}

              {/* アクティビティカレンダーは非表示 */}
              <div className="mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">活動カレンダー</h4>
                    <div className="text-xs text-gray-500 mt-1">過去28日間の活動履歴</div>
                  </div>
                  <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border">
                    合計: {totalActivities}
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                  {last28Days.map((date, idx) => {
                    const dateKey = date.toDateString();
                    const activities = activityData[dateKey] || [];
                    const isSelected = selectedDate === dateKey;
                    const hasActivity = activities.length > 0;
                    
                    return (
                      <button 
                        key={idx} 
                        onClick={() => setSelectedDate(isSelected ? null : dateKey)}
                        className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs transition-all cursor-pointer
                          ${hasActivity ? 'bg-purple-200 hover:bg-purple-300 text-purple-900' : 'bg-white hover:bg-gray-100 text-gray-500'}
                          ${isSelected ? 'ring-2 ring-purple-500 ring-offset-2' : ''}
                        `}
                        title={`${date.toLocaleDateString('ja-JP')}: ${activities.length} 活動`}
                      >
                        <div className="font-medium">{date.getDate()}</div>
                        {hasActivity && <div className="text-xs">●</div>}
                      </button>
                    );
                  })}
                </div>

                {/* 選択された日のアクティビティ詳細 */}
                {selectedDate && (
                  <div className="mt-4 p-4 bg-white rounded-xl border border-purple-200">
                    <h5 className="font-semibold text-gray-900 mb-3">
                      {new Date(selectedDate as string).toLocaleDateString('ja-JP', { 
                        month: 'long', 
                        day: 'numeric', 
                        weekday: 'short' 
                      })} のアクティビティ
                    </h5>
                    <div className="space-y-2">
                      {activityData[selectedDate as string]?.length > 0 ? (
                        activityData[selectedDate as string].map((activity: any) => (
                          <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-white flex-shrink-0 flex items-center justify-center border">
                              {activity.image ? (
                                <img src={activity.image} alt="activity" className="w-full h-full object-cover" />
                              ) : (
                                <div className="text-lg">
                                  {activity.type === 'upload' ? '📸' : 
                                   activity.type === 'event' ? '🎯' : '💬'}
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div className="text-sm font-medium text-gray-900">{activity.text}</div>
                                <div className="text-xs text-gray-500">{activity.time}</div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-500 text-center py-4">この日はアクティビティがありませんでした</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'saved' && (
            <div className="py-20 text-center">
              <Bookmark className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">保存済みの投稿はありません</h3>
              <p className="text-gray-500 text-sm">気に入った投稿を保存しましょう</p>
            </div>
          )}

          {activeTab === 'fortune' && (
            <div className="py-6 px-4">
              <div className="space-y-4">
                {/* タロット占い */}
                <button
                  onClick={() => setShowDailyTarot(true)}
                  className="w-full p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-bold text-gray-900">今日のタロット占い</div>
                      <div className="text-sm text-gray-600">1日1回引けます</div>
                    </div>
                  </div>
                </button>

                {/* 季節診断 */}
                <button
                  onClick={() => setShowSeasonalDiagnosis(true)}
                  className="w-full p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-100 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-2xl">
                      🌸
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-bold text-gray-900">季節の性格診断</div>
                      <div className="text-sm text-gray-600">あなたはどの季節タイプ？</div>
                    </div>
                  </div>
                </button>

                {/* メンタル統計 */}
                <button
                  onClick={() => setShowMentalStats(true)}
                  className="w-full p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-bold text-gray-900">メンタル統計</div>
                      <div className="text-sm text-gray-600">心の健康度をチェック</div>
                    </div>
                  </div>
                </button>

                {/* 季節診断履歴 */}
                <div className="mt-6 p-6 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border border-amber-100">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-xl">🌺</span>
                    季節診断の履歴
                  </h4>
                  <div className="space-y-3">
                    <div className="p-4 bg-white rounded-xl border border-amber-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">🌸</span>
                        <span className="text-xs text-gray-500">2024年11月1日</span>
                      </div>
                      <div className="font-semibold text-gray-900">春タイプ</div>
                      <div className="text-sm text-gray-600 mt-1">明るく活発で新しいことに挑戦するのが好き</div>
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-amber-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">☀️</span>
                        <span className="text-xs text-gray-500">2024年10月15日</span>
                      </div>
                      <div className="font-semibold text-gray-900">夏タイプ</div>
                      <div className="text-sm text-gray-600 mt-1">エネルギッシュで情熱的、リーダーシップがある</div>
                    </div>
                  </div>
                </div>

                {/* 今月のTODO - 実データ連携 */}
                <div 
                  className="mt-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => router.push('/learning')}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-gray-900 flex items-center gap-2">
                      <span className="text-xl">✅</span>
                      学習タスク & TODO
                    </h4>
                    <span className="text-sm text-green-600 font-semibold">詳細を見る →</span>
                  </div>
                  
                  {displayUser && (() => {
                    const tasks = getUserTasks(displayUser.id.toString());
                    const stats = getTaskStats(displayUser.id.toString());
                    const recentTasks = tasks.slice(0, 3);
                    
                    return (
                      <>
                        <div className="space-y-2 mb-4">
                          {recentTasks.map(task => (
                            <div key={task.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-200">
                              {task.status === 'completed' ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                              ) : (
                                <div className="h-5 w-5 rounded border-2 border-gray-300 flex-shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <span className={`text-sm block truncate ${
                                  task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
                                }`}>
                                  {task.title}
                                </span>
                                {task.progress > 0 && task.status !== 'completed' && (
                                  <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                                    <div 
                                      className="bg-green-500 h-1 rounded-full" 
                                      style={{ width: `${task.progress}%` }}
                                    />
                                  </div>
                                )}
                              </div>
                              {task.category === 'video-learning' && (
                                <BookOpen className="h-4 w-4 text-green-600 flex-shrink-0" />
                              )}
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">達成率</span>
                          <span className="font-bold text-green-600">{stats.completionRate}%</span>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full" 
                            style={{ width: `${stats.completionRate}%` }}
                          />
                        </div>
                        <div className="mt-3 text-xs text-gray-600 text-center">
                          {stats.completed} / {stats.total} タスク完了
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>
        )}
      </div>

      {/* Fortune Modals */}
      {showDailyTarot && displayUser && (
        <DailyTarot 
          isOpen={showDailyTarot}
          onClose={() => setShowDailyTarot(false)}
          userId={displayUser.id.toString()}
          userName={displayUser.name}
        />
      )}
      
      {showSeasonalDiagnosis && displayUser && (
        <SeasonalDiagnosisHub 
          isOpen={showSeasonalDiagnosis}
          onClose={() => setShowSeasonalDiagnosis(false)}
          userId={displayUser.id.toString()}
        />
      )}
      
      {showMentalStats && displayUser && (
        <MentalStatsAdmin 
          isOpen={showMentalStats}
          onClose={() => setShowMentalStats(false)}
          userId={displayUser.id.toString()}
        />
      )}
      
      {/* Profile Modals */}
      <ProfileSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
      
      <ProfileEditModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        onSave={refetchProfile}
        userId={userId || undefined}
      />
      
      <ShareProfileModal
        isOpen={showShareProfile}
        onClose={() => setShowShareProfile(false)}
      />

      {/* メッセージモーダル */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {displayUser?.name}にメッセージ
              </h2>
              <button
                onClick={() => {
                  setShowMessageModal(false);
                  setMessageText('');
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg">
                <img
                  src={displayUser?.avatar_url || PH1}
                  alt={displayUser?.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-medium text-gray-900">{displayUser?.name}</p>
                  <p className="text-sm text-gray-500">{displayUser?.bio?.slice(0, 50)}...</p>
                </div>
              </div>

              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="メッセージを入力..."
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
                maxLength={500}
              />
              <div className="text-right text-xs text-gray-400 mt-1">
                {messageText.length} / 500
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowMessageModal(false);
                  setMessageText('');
                }}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
                className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                送信
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstagramProfilePage;
