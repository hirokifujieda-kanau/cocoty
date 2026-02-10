'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Settings, Grid, Bookmark, Sparkles, TrendingUp, Heart as HeartIcon, Users, Calendar, BookOpen, CheckCircle2, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { PH1, PH2, PH3 } from '@/lib/placeholders';
import styles from './InstagramProfilePage.module.css';
import DailyTarot from '@/components/fortune/DailyTarot';
import SeasonalDiagnosisHub from '@/components/fortune/SeasonalDiagnosisHub';
import MentalStatsAdmin from '@/components/fortune/MentalStatsAdmin';
import { SettingsModal } from '@/components/profile';
import ProfileEditPage from '@/components/profile/ProfileEditPage';
import ShareProfileModal from '@/components/profile/ShareProfileModal';
import MandalaGallery from '@/components/profile/MandalaGallery';
import { RpgDiagnosisModal } from '@/components/rpg/RpgDiagnosisModal';
import { RpgDiagnosisCard } from '@/components/profile/RpgDiagnosisCard';
import { TarotCard } from '@/components/profile/TarotCard';
import { getUserTasks, getTaskStats } from '@/lib/mock/mockLearningTasks';
import { getUserCourseProgress } from '@/lib/mock/mockLearningCourses';
import { getCurrentUser, getProfile, updateProfile, type Profile } from '@/lib/api/client';

const InstagramProfilePage: React.FC<{ userId?: string }> = ({ userId: userIdProp }) => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // プロフィールデータの状態
  const [displayUser, setDisplayUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const [currentUserProfile, setCurrentUserProfile] = useState<Profile | null>(null);
  
  // propsからuserIdを取得、なければURLパラメータを確認
  const userIdFromUrl = searchParams.get('userId');
  const userId = userIdProp || userIdFromUrl;
  
  // 自分のプロフィールかどうかを判定
  // userId指定がないか、displayUserのIDが自分のプロフィールIDと一致する場合はオーナー
  const isOwner = !userId || (!!displayUser && !!currentUserProfile && displayUser.id === currentUserProfile.id);
  
  // プロフィールデータを再取得する関数
  const refetchProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      console.log('🔄 [InstagramProfilePage] refetchProfile called');
      setLoading(true);
      setError(null);

      // まず自分のプロフィールを取得
      const currentUserResponse = await getCurrentUser();
      if (currentUserResponse.profile) {
        setCurrentUserProfile(currentUserResponse.profile);
      }

      if (!userId) {
        // userIdが指定されていない場合は自分のプロフィールを表示
        console.log('📥 [InstagramProfilePage] API Response:', currentUserResponse);
        
        if (currentUserResponse.profile) {
          console.log('📋 [InstagramProfilePage] Profile data:', {
            rpg_diagnosis_completed_at: currentUserResponse.profile.rpg_diagnosis_completed_at,
            tarot_last_drawn_at: currentUserResponse.profile.tarot_last_drawn_at,
          });
          setDisplayUser(currentUserResponse.profile);
          setIsFirstTimeUser(false);
        } else {
          // プロフィールがない場合、初回ユーザーとして扱い、ダミープロフィールを作成
          setIsFirstTimeUser(true);
          setDisplayUser({
            id: 0,
            user_id: 0,
            firebase_uid: user.uid,
            name: user.email?.split('@')[0] || 'ユーザー',
            nickname: '',
            bio: '',
            avatar_url: undefined,
            cover_url: undefined,
            hobbies: [],
            favorite_food: [],
            mbti_type: undefined,
            blood_type: undefined,
            birthday: undefined,
            birthplace: undefined,
            age: undefined,
            goal: undefined,
            goal_progress: undefined,
            skills: undefined,
            social_link: undefined,
            posts_count: 0,
            albums_count: 0,
            friends_count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          setError(null);
        }
      } else {
        // 他のユーザーのプロフィールを取得
        const profile = await getProfile(Number(userId));
        setDisplayUser(profile);
      }
    } catch (err: any) {
      // デバッグ用：エラーの詳細をコンソールに出力
      console.error('❌ プロフィール取得エラー:', err);
      console.error('❌ エラーメッセージ:', err.message);
      console.error('❌ エラー全体:', JSON.stringify(err, null, 2));
      
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
  
  // displayUserの変更を監視してログ出力
  useEffect(() => {
    if (displayUser) {
      console.log('🎨 [InstagramProfilePage] displayUser updated:', {
        name: displayUser.name,
        tarot_last_drawn_at: displayUser.tarot_last_drawn_at,
        rpg_diagnosis_completed_at: displayUser.rpg_diagnosis_completed_at,
        mandala_thumbnail_url: displayUser.mandala_thumbnail_url,
        mandala_detail_url: displayUser.mandala_detail_url,
      });
    }
  }, [displayUser]);
  
  // プロフィールデータ取得
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // まず自分のプロフィールを取得（isOwner判定に必要）
        const currentUserResponse = await getCurrentUser();
        if (currentUserResponse.profile) {
          setCurrentUserProfile(currentUserResponse.profile);
        }

        if (!userId) {
          // userIdが指定されていない場合は自分のプロフィールを表示
          console.log('🔍 プロフィール取得開始（自分）...');
          
          if (currentUserResponse.profile) {
            setDisplayUser(currentUserResponse.profile);
            setIsFirstTimeUser(false);
            console.log('✅ プロフィール設定完了');
          } else {
            // プロフィールがない場合、初回ユーザーとして扱う
            console.log('⚠️ プロフィールが見つかりません。初回ユーザーとして扱います。');
            setIsFirstTimeUser(true);
            setError(null);
          }
        } else {
          // userIdが指定されている場合は他のユーザーのプロフィールを取得
          console.log('🔍 プロフィール取得開始（他のユーザー）:', userId);
          const profile = await getProfile(Number(userId));
          setDisplayUser(profile);
        }
      } catch (err: any) {
        // デバッグ用：エラーの詳細をコンソールに出力
        console.error('❌ プロフィール取得エラー (useEffect):', err);
        console.error('❌ エラーメッセージ:', err.message);
        console.error('❌ エラー全体:', JSON.stringify(err, null, 2));
        
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
  }, [user, userId]);
  
  // アバターアップロード処理
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !displayUser) {
      console.log('❌ Avatar upload cancelled:', { file: !!file, user: !!user, displayUser: !!displayUser });
      return;
    }

    try {
      console.log('📤 Starting avatar upload...', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        profileId: displayUser.id
      });
      
      setUploadingAvatar(true);

      // Cloudinaryにアップロード
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default');
      formData.append('public_id', `${user.uid}_avatar_${Date.now()}`);

      console.log('☁️ Uploading to Cloudinary...');
      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!cloudinaryResponse.ok) {
        const errorText = await cloudinaryResponse.text();
        console.error('❌ Cloudinary upload failed:', errorText);
        throw new Error(`Cloudinary upload failed: ${cloudinaryResponse.status}`);
      }

      const cloudinaryData = await cloudinaryResponse.json();
      const avatarUrl = cloudinaryData.secure_url;
      console.log('✅ Cloudinary upload success:', avatarUrl);

      // プロフィールを更新
      console.log('💾 Updating profile with avatar URL...');
      await updateProfile(displayUser.id, { avatar_url: avatarUrl });
      console.log('✅ Profile updated successfully');

      // プロフィールを再読み込み
      console.log('🔄 Refetching profile...');
      await refetchProfile();

      alert('プロフィール画像を更新しました！');
    } catch (error: any) {
      console.error('❌ Avatar upload error:', error);
      alert(`画像のアップロードに失敗しました: ${error.message || '不明なエラー'}`);
    } finally {
      setUploadingAvatar(false);
    }
  };
  
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'fortune'>('fortune');
  
  // activeTab変更を監視
  useEffect(() => {
    console.log('🎯 [InstagramProfilePage] activeTab changed:', activeTab);
  }, [activeTab]);
  
  // Fortune機能の状態
  const [showDailyTarot, setShowDailyTarot] = useState(false);
  const [showSeasonalDiagnosis, setShowSeasonalDiagnosis] = useState(false);
  const [showMentalStats, setShowMentalStats] = useState(false);
  
  // プロフィール機能の状態
  const [showSettings, setShowSettings] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showShareProfile, setShowShareProfile] = useState(false);
  const [showRpgDiagnosis, setShowRpgDiagnosis] = useState(false);
  
  // デバッグ用: showSettingsの変更を監視
  useEffect(() => {
    console.log('🔍 showSettings が変更されました:', showSettings);
  }, [showSettings]);
  
  // 初回ユーザーの場合、自動的にプロフィール編集モーダルを開く
  useEffect(() => {
    if (isFirstTimeUser && isOwner) {
      setShowEditProfile(true);
    }
  }, [isFirstTimeUser, isOwner]);
  
  // フォロー状態とメッセージ機能
  const [isFollowing, setIsFollowing] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState('');
  
  // アクティビティカレンダー用の状態
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [activityData, setActivityData] = useState<{ [key: string]: any[] }>({});

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

  // エラー状態（初回ユーザー以外）
  if (error && !isFirstTimeUser && !displayUser) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
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

  // displayUserがnullの場合（通常ありえないが念のため）
  if (!displayUser) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">プロフィールデータの読み込みに失敗しました</p>
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

  // ここから先は displayUser が必ず存在する

  // プロフィール編集画面を表示中は、それだけを表示
  if (showEditProfile) {
    return (
      <ProfileEditPage
        onClose={() => setShowEditProfile(false)}
        onSave={refetchProfile}
        userId={userId || undefined}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-50 h-[30px] bg-[#FFD26A] flex items-center">
        <div className="mx-auto flex w-full items-center justify-between px-[clamp(26px,8vw,106px)]" style={{ maxWidth: '750px' }}>
          {/* Logo */}
          <h1 className="font-noto text-base font-medium text-white leading-none">
            ここてぃ
          </h1>
          
          {/* Search & Settings */}
          <div className="flex gap-2 items-center">
            <div className="relative flex items-center my-1 ml-[9px]">
              <img 
                src="/人物アイコン　チーム 1.svg" 
                alt="search" 
                className="absolute left-2 w-5 h-5 pointer-events-none"
              />
              <input
                type="text"
                placeholder="ユーザー一覧"
                onClick={() => router.push('/users')}
                className="w-[clamp(120px,30vw,200px)] h-5 pl-8 pr-3 text-[10px] font-noto font-medium bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 cursor-pointer shadow-sm placeholder:text-[#5C5C5C] placeholder:font-medium placeholder:text-[10px]"
                readOnly
              />
            </div>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="設定"
            >
              <img src="/歯車.svg" alt="設定" className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full" style={{ maxWidth: '750px' }}>
        {/* Profile Section - 内部コンテンツ最大幅 626px（750px - 88px*2 - 18px*2） */}
        <div className={`py-6 px-4 ${styles.profileSection}`}>
          <div className="flex items-center gap-6 mb-6">
            {/* Avatar */}
            <div className="flex-shrink-0 relative">
              <div className="relative rounded-full overflow-hidden ring-2 ring-gray-200" style={{ width: 'clamp(65.66px, 22vw, 165px)', height: 'clamp(62.85px, 21vw, 157.96px)' }}>
                <img
                  src={displayUser.avatar_url || PH1}
                  alt={displayUser.name}
                  className="w-full h-full object-cover"
                />
              </div>
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
                    className={`absolute hover:opacity-80 transition-all cursor-pointer flex items-center justify-center z-10 ${styles.avatarLabel}`}
                    title="プロフィール画像を変更"
                  >
                    {uploadingAvatar ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-600 border-t-transparent" />
                    ) : (
                      <div className="relative flex items-center justify-center">
                        <Image src="/circle.svg" alt="プロフィール画像を変更" width={25} height={25} style={{ width: 'clamp(25px, 8.33vw, 30px)', height: 'clamp(25px, 8.33vw, 30px)' }} />
                        <span
                          className="absolute font-black text-white"
                          style={{
                            fontFamily: 'Noto Sans JP',
                            fontSize: 'clamp(10px, 3.33vw, 20px)',
                            lineHeight: '100%',
                            letterSpacing: '0%',
                            color: '#5C5C5C',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -68%)'
                          }}
                        >
                          +
                        </span>
                      </div>
                    )}
                  </label>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="flex-1">
              {/* Stats削除 - 今後実装予定 */}

              {/* ユーザー名 */}
              <div className="flex items-center justify-between">
                <div 
                  style={{
                    fontFamily: 'Noto Sans JP',
                    fontWeight: 700,
                    fontSize: 'clamp(16px, 2.67vw, 20px)',
                    lineHeight: 1.3,
                    letterSpacing: '0%',
                    color: '#1A1A1A'
                  }}
                >
                  {displayUser.name}
                </div>
                {isOwner && (
                  <button
                    onClick={() => setShowEditProfile(true)}
                    className="hover:opacity-80 transition-all"
                    title="プロフィールを編集"
                  >
                    <Image src="/edit.svg" alt="プロフィールを編集" width={15} height={15} />
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {isOwner ? (
                  <>
                    {/* プロフィール編集ボタンはアイコンで上に移動 */}
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
                ) : null}
              </div>
            </div>
          </div>

          {/* Bio - 独立表示 */}
          <div className="font-medium text-sm leading-[1.3] text-gray-500 mb-[26px]">{displayUser.bio}</div>

          {/* 基本情報・趣味・好きな食べ物をまとめたセクション */}
          <div className="space-y-4 mb-6">
            {/* 基本情報 */}
            {(displayUser.birthday || displayUser.age || displayUser.birthplace || displayUser.blood_type || displayUser.mbti_type) && (
              <div className="space-y-2">
                <div className="font-bold text-xs leading-3 text-gray-700 mb-[10px]">基本情報</div>
                <div className="flex flex-wrap gap-2">
                  {/* 年齢・生年月日 */}
                  {displayUser.age && (
                    <button
                      onClick={() => router.push(`/tags/${encodeURIComponent(displayUser.age! + '歳')}`)}
                      className="inline-flex items-center px-2 py-1 text-xs rounded-full font-bold text-white hover:opacity-80 transition-all cursor-pointer"
                      style={{ backgroundColor: '#FFBA48', fontFamily: 'Noto Sans JP', boxShadow: '0px 1px 1px 0px #F0AC3C' }}
                    >
                      🎂 {displayUser.age}歳
                    </button>
                  )}
                  
                  {/* 出身地 */}
                  {displayUser.birthplace && (
                    <button
                      onClick={() => router.push(`/tags/${encodeURIComponent(displayUser.birthplace!)}`)}
                      className="inline-flex items-center px-2 py-1 text-xs rounded-full font-bold text-white hover:opacity-80 transition-all cursor-pointer"
                      style={{ backgroundColor: '#FFBA48', fontFamily: 'Noto Sans JP', boxShadow: '0px 1px 1px 0px #F0AC3C' }}
                    >
                      📍 {displayUser.birthplace}
                    </button>
                  )}
                  
                  {/* 血液型 */}
                  {displayUser.blood_type && (
                    <button
                      onClick={() => router.push(`/tags/${encodeURIComponent(displayUser.blood_type! + '型')}`)}
                      className="inline-flex items-center px-2 py-1 text-xs rounded-full font-bold text-white hover:opacity-80 transition-all cursor-pointer"
                      style={{ backgroundColor: '#FFBA48', fontFamily: 'Noto Sans JP', boxShadow: '0px 1px 1px 0px #F0AC3C' }}
                    >
                      🩸 {displayUser.blood_type}型
                    </button>
                  )}
                  
                  {/* MBTI */}
                  {displayUser.mbti_type && (
                    <button
                      onClick={() => router.push(`/tags/${encodeURIComponent(displayUser.mbti_type!)}`)}
                      className="inline-flex items-center px-2 py-1 text-xs rounded-full font-bold text-white hover:opacity-80 transition-all cursor-pointer"
                      style={{ backgroundColor: '#FFBA48', fontFamily: 'Noto Sans JP', boxShadow: '0px 1px 1px 0px #F0AC3C' }}
                    >
                      🧠 {displayUser.mbti_type}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* 趣味 */}
            {(displayUser as any).hobbies && (displayUser as any).hobbies.length > 0 && (
              <div className="space-y-2">
                <div className="font-bold text-xs leading-3 text-gray-700 mb-[10px]">趣味</div>
                <div className="flex flex-wrap gap-1.5">
                  {(displayUser as any).hobbies.map((hobby: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => router.push(`/tags/${encodeURIComponent(hobby)}`)}
                      className="inline-flex items-center px-2 py-1 text-xs rounded-full font-bold text-white cursor-pointer"
                      style={{ backgroundColor: '#FFAFBD', fontFamily: 'Noto Sans JP', boxShadow: '0px 1px 1px 0px #E891A2' }}
                    >
                      {hobby}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 好きな食べ物 */}
            {(displayUser as any).favoriteFood && (displayUser as any).favoriteFood.length > 0 && (
              <div className="space-y-2">
                <div className="font-bold text-xs leading-3 text-gray-700 mb-[10px]">好きな食べ物</div>
                <div className="flex flex-wrap gap-1.5">
                  {(displayUser as any).favoriteFood.map((food: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => router.push(`/tags/${encodeURIComponent(food)}`)}
                      className="inline-flex items-center px-2 py-1 text-xs rounded-full font-bold text-white cursor-pointer"
                      style={{ backgroundColor: '#FFAFBD', fontFamily: 'Noto Sans JP', boxShadow: '0px 1px 1px 0px #E891A2' }}
                    >
                      🍽️ {food}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 曼荼羅アートとタロット・診断ボタンを縦並びに */}
          <div className="flex flex-col gap-6 items-start mt-6">
            {isOwner && displayUser && (
              <div className="w-full flex flex-col items-center" style={{ gap: '48px' }}>
                <div className="w-full flex justify-center" style={{ gap: 'clamp(16px, 4vw, 40px)' }}>
                  {/* タロット占い - 1日1回制限（0時リセット） */}
                  {(() => {
                    const lastDrawn = displayUser.tarot_last_drawn_at 
                      ? new Date(displayUser.tarot_last_drawn_at) 
                      : null;
                    const today = new Date();
                    const isDrawnToday = lastDrawn && 
                      lastDrawn.getDate() === today.getDate() &&
                      lastDrawn.getMonth() === today.getMonth() &&
                      lastDrawn.getFullYear() === today.getFullYear();

                    return (
                      <div className="relative">
                        <button
                          onClick={async () => {
                            // モーダルを開く前に最新のプロフィールを取得
                            await refetchProfile();
                            setShowDailyTarot(true);
                          }}
                          className={`transition-all transform rounded-xl overflow-hidden flex-shrink-0 ${
                            isDrawnToday 
                              ? 'opacity-90 cursor-pointer hover:opacity-100 hover:scale-105' 
                              : 'hover:opacity-80 hover:scale-105'
                          }`}
                          style={{ 
                            width: 'clamp(150px, 26vw, 200px)', 
                            height: 'clamp(56px, 10vw, 75px)',
                            boxSizing: 'border-box'
                          }}
                        >
                          <img 
                            src="/タロット占い.svg" 
                            alt={isDrawnToday ? "今日の結果" : "今日のタロット占い"} 
                            className="w-full h-full shadow-lg hover:shadow-xl rounded-xl object-cover" 
                          />
                        </button>
                        {isDrawnToday && (
                          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                            本日完了
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* RPG診断 - 1回のみ（完了後は結果のみ） */}
                  {(() => {
                    const isCompleted = !!displayUser.rpg_diagnosis_completed_at;

                    return (
                      <div className="relative">
                        <button
                          onClick={() => setShowRpgDiagnosis(true)}
                          className={`transition-all transform rounded-xl overflow-hidden ${
                            isCompleted 
                              ? 'opacity-60 cursor-default' 
                              : 'hover:opacity-80 hover:scale-105'
                          }`}
                          style={{ 
                            width: 'clamp(150px, 26vw, 200px)', 
                            height: 'clamp(56px, 10vw, 75px)',
                            flexShrink: 0,
                            boxSizing: 'border-box'
                          }}
                        >
                          <img 
                            src="/診断.svg" 
                            alt={isCompleted ? "診断結果" : "RPG診断"} 
                            className="w-full h-full shadow-lg hover:shadow-xl rounded-xl object-cover" 
                          />
                        </button>
                        {isCompleted && (
                          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                            完了
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* マンダラチャート（全ユーザーに表示） */}
            {displayUser && (
              <div className={`w-full flex flex-col items-center ${isOwner ? 'mt-12' : 'mt-0'}`}>
                <div className="w-[343px]">
                  <h2 className="font-noto font-bold text-base leading-4 text-white text-center mb-0 py-3 rounded-t-lg shadow-[0px_1px_1px_0px_#F0AC3C] bg-[#FFBA48]">
                    マンダラチャート
                  </h2>
                  <MandalaGallery
                    userId={displayUser.id.toString()}
                    isOwner={isOwner}
                  />
                </div>
              </div>
            )}
          </div>

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
            const stats = getTaskStats(displayUser!.id.toString());
            const courseProgress = getUserCourseProgress(displayUser!.id.toString());
            
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

          {/* Highlights - 占い機能は別タブで提供 */}
        </div>

        {/* Tabs - 投稿/保存済み/占い・診断タブは非表示 */}
        {false && (
        <div className="border-t border-gray-200">
          <div className="flex">
            <button
              onClick={() => {
                console.log('🔘 [InstagramProfilePage] 占い・診断タブクリック');
                setActiveTab('fortune');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 border-t-2 transition-colors ${
                activeTab === 'fortune'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <Sparkles className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase">占い・診断</span>
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
              {/* RPG診断とタロット占いのカード */}
              {displayUser && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <RpgDiagnosisCard
                    profile={displayUser!}
                    isOwner={isOwner}
                    onOpenDiagnosis={async () => {
                      // モーダルを開く前に最新のプロフィールを取得
                      await refetchProfile();
                      setShowRpgDiagnosis(true);
                    }}
                  />
                  <TarotCard
                    profile={displayUser!}
                    isOwner={isOwner}
                    onOpenTarot={async () => {
                      // モーダルを開く前に最新のプロフィールを取得
                      await refetchProfile();
                      setShowDailyTarot(true);
                    }}
                  />
                </div>
              )}

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
                    const tasks = getUserTasks(displayUser!.id.toString());
                    const stats = getTaskStats(displayUser!.id.toString());
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

      {/* Fortune Modals */}
      {showDailyTarot && displayUser && (
        <DailyTarot 
          isOpen={showDailyTarot}
          onClose={() => {
            console.log('🔒 [InstagramProfilePage] DailyTarot closed, refetching profile...');
            setShowDailyTarot(false);
            // タロット占い完了後、プロフィールを再取得
            setTimeout(() => {
              refetchProfile();
            }, 500); // 少し遅延させてバックエンドの更新を待つ
          }}
          userId={displayUser.id.toString()}
          userName={displayUser.name}
          profile={displayUser}
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
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
      
      <ShareProfileModal
        isOpen={showShareProfile}
        onClose={() => setShowShareProfile(false)}
      />

      {/* RPG診断モーダル */}
      <RpgDiagnosisModal
        isOpen={showRpgDiagnosis}
        onClose={() => {
          console.log('🔒 [InstagramProfilePage] RpgDiagnosis closed, refetching profile...');
          setShowRpgDiagnosis(false);
          // 診断完了後、プロフィールを再取得
          setTimeout(() => {
            refetchProfile();
          }, 500); // 少し遅延させてバックエンドの更新を待つ
        }}
        profile={displayUser}
      />
    </div>
    </div>
  );
};

export default InstagramProfilePage;
