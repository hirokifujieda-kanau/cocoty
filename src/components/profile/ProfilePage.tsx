 'use client';

import React, { useEffect, useState } from 'react';
import Profile from './Profile';
import { PH1, PH2, PH3 } from '@/lib/placeholders';
import { dummyUsers, currentUserId as defaultUserId, getUserById, getCommonFriends } from '@/lib/dummyUsers';
import DailyTarot from '@/components/fortune/DailyTarot';
import SeasonalDiagnosisHub from '@/components/fortune/SeasonalDiagnosisHub';
import MentalStatsAdmin from '@/components/fortune/MentalStatsAdmin';
import { UnderConstructionModal, SHOW_UNDER_CONSTRUCTION } from '@/components/fortune/UnderConstructionModal';

const STORAGE_KEY = 'cocoty_profile_v1';
const ALBUM_KEY = 'cocoty_albums_v1';
const CURRENT_USER_KEY = 'cocoty_current_user_v1';
const FRIEND_STATUS_KEY = 'cocoty_friend_status_v1';
const PRIVACY_SETTINGS_KEY = 'cocoty_privacy_settings_v1';
const DISPLAY_SETTINGS_KEY = 'cocoty_display_settings_v1';
const VISITOR_STATS_KEY = 'cocoty_visitor_stats_v1';

const seedProfile = () => {
  const today = new Date();
  const recent = [0,1,2,3,5,8].map((d,i) => {
    const dt = new Date();
    dt.setDate(today.getDate() - d);
    return {
      id: `r-${i}`,
      date: dt.toISOString(),
      type: i % 3 === 0 ? 'upload' : i % 3 === 1 ? 'event' : 'comment',
      text: i % 3 === 0 ? `新しい写真を${5 + i}枚アップロードしました` : i % 3 === 1 ? `ワークショップに参加しました（テーマ：構図）` : `メンバーの投稿にコメントしました` ,
      image: i % 3 === 0 ? PH1 : i % 3 === 1 ? PH2 : undefined
    };
  });

  // 28日分の詳細アクティビティを生成
  const dailyActivities: { [key: string]: any[] } = {};
  const activity7 = [1, 2, 0, 3, 2, 4, 2];
  
  // より豊富なテストデータ
  const uploadTexts = [
    '夕日の撮影で5枚アップロード',
    '街角スナップを3枚投稿',
    'ポートレート撮影の成果を4枚公開',
    '風景写真を6枚追加',
    'マクロ撮影の作品を2枚投稿',
    '建築写真を3枚アップロード',
    '花の写真を4枚公開'
  ];
  
  const eventTexts = [
    'フォトウォーク「新宿散策」に参加',
    'ワークショップ「構図の基本」を受講',
    '写真展「都市の表情」を見学',
    '撮影会「紅葉撮影」に参加',
    'セミナー「ライティング技法」を受講',
    '個展「四季の記録」のオープニングに参加',
    'ポートレート撮影会に参加'
  ];
  
  const commentTexts = [
    '田中さんの夕日写真にコメント',
    '佐藤さんの街角スナップにいいね',
    '写真部の投稿にアドバイス',
    '山田さんの作品に感想を投稿',
    '新人メンバーの質問に回答',
    '今日の撮影についてディスカッション'
  ];
  
  // 実際の activity7 データを更新（表示用）
  const updatedActivity7 = [];
  
  for (let i = 0; i < 28; i++) {
    const date = new Date();
    date.setDate(today.getDate() - (27 - i));
    const dateKey = date.toDateString();
    
    // 特定の日に特別なイベントを設定
    let activityCount = 0;
    let specialEvents = [];
    
    if (i >= 21) { // 最後の7日間
      activityCount = activity7[i - 21];
      updatedActivity7.push(activityCount);
    } else {
      // 過去の日付により現実的なパターンを設定
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) { // 週末
        activityCount = Math.random() > 0.3 ? Math.floor(Math.random() * 4) + 1 : 0;
      } else { // 平日
        activityCount = Math.random() > 0.6 ? Math.floor(Math.random() * 3) + 1 : 0;
      }
      
      // 特別なイベントを追加
      if (i === 5) {
        specialEvents.push({
          id: `${dateKey}-special-1`,
          type: 'event',
          text: '写真展「秋の記憶」オープニングパーティーに参加',
          time: '19:00',
          image: PH2
        });
        activityCount += 1;
      }
      if (i === 12) {
        specialEvents.push({
          id: `${dateKey}-special-2`,
          type: 'achievement',
          text: '月間最優秀作品賞を受賞！',
          time: '15:30',
          image: PH1
        });
        activityCount += 1;
      }
    }
    
    const activities = [...specialEvents];
    for (let j = 0; j < Math.max(0, activityCount - specialEvents.length); j++) {
      const types = ['upload', 'event', 'comment'];
      const type = types[j % types.length];
      const hour = 9 + (j * 2) + Math.floor(Math.random() * 2);
      const minute = Math.floor(Math.random() * 60);
      
      let text = '';
      switch (type) {
        case 'upload':
          text = uploadTexts[Math.floor(Math.random() * uploadTexts.length)];
          break;
        case 'event':
          text = eventTexts[Math.floor(Math.random() * eventTexts.length)];
          break;
        case 'comment':
          text = commentTexts[Math.floor(Math.random() * commentTexts.length)];
          break;
      }
      
      activities.push({
        id: `${dateKey}-${j}`,
        type,
        text,
        time: `${hour}:${String(minute).padStart(2, '0')}`,
        image: type === 'upload' ? PH1 : type === 'event' ? PH2 : PH3
      });
    }
    
    // 時間順にソート
    activities.sort((a, b) => a.time.localeCompare(b.time));
    dailyActivities[dateKey] = activities;
  }

  return {
    nickname: '山田 花子',
    bio: '週末は写真を撮ったり、写真展を企画しています。',
    goal: '今年は写真展を1回開催する',
    goalProgress: 75, // 達成率 (%)
    milestones: [
      { id: 1, title: '会場の確保', completed: true, date: '2025-09-15' },
      { id: 2, title: '作品選定（30点）', completed: true, date: '2025-10-01' },
      { id: 3, title: 'ポスター・チラシ作成', completed: true, date: '2025-10-10' },
      { id: 4, title: '展示準備・搬入', completed: false, targetDate: '2025-11-20' },
      { id: 5, title: '写真展開催', completed: false, targetDate: '2025-12-01' }
    ],
    workingOn: ['展示の企画', 'ポートフォリオ整理', '写真教室の企画'],
    teamName: '写真部',
    teamGoal: '月1回の撮影会を開催',
    diagnosis: 'ENFP',
    avatar: PH1,
    skills: '写真,レタッチ,構図',
    socialLink: 'https://twitter.com/example',
    activity7: activity7,
    monthly: [5,8,6,10,7,12],
    recentActivities: recent,
    dailyActivities: dailyActivities
  };
};

const seedAlbums = () => ([
  { id: 'a1', title: '春の撮影会', images: [PH1,PH2], source: 'user' },
  { id: 'a2', title: 'ポートフォリオ', images: [PH3], source: 'store' }
]);

// 現在のログインユーザー情報（ダミーデータから取得）
const seedCurrentUser = () => {
  const user = getUserById(defaultUserId);
  return {
    id: user.id,
    nickname: user.nickname,
    avatar: user.avatar
  };
};

// プライバシー設定のデフォルト
const defaultPrivacySettings = () => ({
  goal: 'public', // public, friends, private
  workingOn: 'public',
  calendar: 'public',
  gallery: 'public',
  diagnosis: 'public',
  albums: 'public'
});

// 表示カスタマイズのデフォルト
const defaultDisplaySettings = () => ({
  showGoal: true,
  showWorkingOn: true,
  showCalendar: true,
  showGallery: true,
  showDiagnosis: true,
  showAlbums: true
});

// 訪問者統計の初期化
const initVisitorStats = () => ({
  totalViews: 0,
  weeklyViews: 0,
  recentVisitors: [] as any[],
  lastVisit: null as string | null
});

interface ProfilePageProps {
  userId?: string; // 表示するユーザーID（未指定の場合は自分のプロフィール）
  onClose?: () => void; // 他人のプロフィールを閉じる場合のコールバック
}

const ProfilePage: React.FC<ProfilePageProps> = ({ userId, onClose }) => {
  const [profile, setProfile] = useState<any | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [albums, setAlbums] = useState<any[]>([]);
  const [designPattern, setDesignPattern] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Phase 1-3: 新しいステート管理
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [isOwner, setIsOwner] = useState(true); // 自分のプロフィールかどうか
  const [isPreviewMode, setIsPreviewMode] = useState(false); // プレビューモード
  const [friendStatus, setFriendStatus] = useState<'none' | 'pending' | 'friends'>('none');
  const [showWelcome, setShowWelcome] = useState(false);
  const [privacySettings, setPrivacySettings] = useState<any>(defaultPrivacySettings());
  const [displaySettings, setDisplaySettings] = useState<any>(defaultDisplaySettings());
  const [visitorStats, setVisitorStats] = useState<any>(initVisitorStats());
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showDisplayModal, setShowDisplayModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [commonFriends, setCommonFriends] = useState<any[]>([]);

  // Gallery slider state (moved here so hooks run unconditionally)
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  // 占い・メンタル機能の状態
  const [showDailyTarot, setShowDailyTarot] = useState(false);
  const [showSeasonalDiagnosis, setShowSeasonalDiagnosis] = useState(false);
  const [showMentalStats, setShowMentalStats] = useState(false);
  const [showTarotUnderConstruction, setShowTarotUnderConstruction] = useState(false);
  const [seasonalDiagnosisHistory, setSeasonalDiagnosisHistory] = useState<any[]>([]);

  // Helper: MBTI診断の説明文を取得
  const getDiagnosisDescription = (diagnosis: string) => {
    const descriptions: { [key: string]: string } = {
      'ENFP': '闘志あるアイデアマン。人とつながるのが得意。',
      'INTJ': '戦略的思考家。長期的ビジョンを持つ。',
      'ESFJ': '温かいサポーター。チームの調和を大切にする。',
      'ISTP': '実践的な問題解決者。冷静沈着。'
    };
    return descriptions[diagnosis] || '独自の強みを持つパーソナリティ';
  };

  // Phase 3: 訪問者統計を更新
  const updateVisitorStats = (targetUserId: string, visitorUserId: string) => {
    try {
      const statsRaw = localStorage.getItem(VISITOR_STATS_KEY);
      const stats = statsRaw ? JSON.parse(statsRaw) : initVisitorStats();
      
      stats.totalViews += 1;
      stats.weeklyViews += 1;
      stats.lastVisit = new Date().toISOString();
      
      // 訪問者の情報を取得
      const visitor = getUserById(visitorUserId);
      
      // 訪問者リストに追加（重複チェック）
      const existingVisitor = stats.recentVisitors.find((v: any) => v.id === visitorUserId);
      if (!existingVisitor && visitor) {
        stats.recentVisitors.unshift({
          id: visitor.id,
          nickname: visitor.nickname,
          avatar: visitor.avatar,
          visitedAt: new Date().toISOString()
        });
        // 最大10件まで保持
        if (stats.recentVisitors.length > 10) {
          stats.recentVisitors = stats.recentVisitors.slice(0, 10);
        }
      }
      
      localStorage.setItem(VISITOR_STATS_KEY, JSON.stringify(stats));
      setVisitorStats(stats);
    } catch (e) {
      console.error('Failed to update visitor stats', e);
    }
  };

  // Phase 1: 友達追加処理
  const handleAddFriend = () => {
    try {
      const newStatus = friendStatus === 'none' ? 'pending' : friendStatus === 'pending' ? 'friends' : 'none';
      setFriendStatus(newStatus);
      
      // localStorageに保存
      const friendStatusRaw = localStorage.getItem(FRIEND_STATUS_KEY);
      const statuses = friendStatusRaw ? JSON.parse(friendStatusRaw) : {};
      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get('userId') || 'default';
      statuses[userId] = newStatus;
      localStorage.setItem(FRIEND_STATUS_KEY, JSON.stringify(statuses));
    } catch (e) {
      console.error('Failed to update friend status', e);
    }
  };

  // Phase 1 & 2: 共有機能
  const handleShare = (platform?: 'twitter' | 'facebook' | 'copy') => {
    const url = window.location.href;
    const text = `${profile.nickname}さんのプロフィール`;
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else {
      // URLをコピー
      navigator.clipboard.writeText(url).then(() => {
        alert('URLをコピーしました！');
      });
    }
  };

  // Phase 2: プレビューモードのトグル
  const togglePreviewMode = () => {
    const newPreviewMode = !isPreviewMode;
    setIsPreviewMode(newPreviewMode);
    setIsOwner(!newPreviewMode);
    setShowWelcome(newPreviewMode);
  };

  // Phase 2: プライバシー設定の更新
  const updatePrivacySetting = (key: string, value: string) => {
    const newSettings = { ...privacySettings, [key]: value };
    setPrivacySettings(newSettings);
    localStorage.setItem(PRIVACY_SETTINGS_KEY, JSON.stringify(newSettings));
  };

  // Phase 3: 表示設定の更新
  const updateDisplaySetting = (key: string, value: boolean) => {
    const newSettings = { ...displaySettings, [key]: value };
    setDisplaySettings(newSettings);
    localStorage.setItem(DISPLAY_SETTINGS_KEY, JSON.stringify(newSettings));
  };

  // Helper component: image with fallback to PH1
  const ImageWithFallback: React.FC<{ src?: string; alt?: string; className?: string }> = ({ src, alt, className }) => {
    const [s, setS] = useState(src || PH1);
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={s} alt={alt} className={className} onError={() => setS(PH1)} />
    );
  };

  // Phase 1: 初期化 - プロフィール、現在のユーザー、閲覧モード判定
  useEffect(() => {
    // URLパラメータまたはpropsからユーザーIDを取得
    const urlParams = new URLSearchParams(window.location.search);
    const viewMode = urlParams.get('view');
    const urlUserId = urlParams.get('userId');
    
    // 現在のログインユーザー情報を読み込み
    let loggedInUserId = defaultUserId;
    try {
      const currentUserRaw = localStorage.getItem(CURRENT_USER_KEY);
      if (currentUserRaw) {
        const cu = JSON.parse(currentUserRaw);
        setCurrentUser(cu);
        loggedInUserId = cu.id;
      } else {
        const cu = seedCurrentUser();
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(cu));
        setCurrentUser(cu);
        loggedInUserId = cu.id;
      }
    } catch (e) {
      const cu = seedCurrentUser();
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(cu));
      setCurrentUser(cu);
      loggedInUserId = cu.id;
    }

    // 表示対象のユーザーIDを決定
    const targetUserId = userId || urlUserId || loggedInUserId;
    
    // 表示するユーザーのプロフィールをダミーデータから取得
    const targetUser = getUserById(targetUserId);
    const profileData = {
      ...seedProfile(),
      ...targetUser,
      userId: targetUser.id
    };
    
    setProfile(profileData);

    // 自分/他人/プレビューモードの判定
    if (viewMode === 'preview') {
      setIsPreviewMode(true);
      setIsOwner(false);
      setShowWelcome(true);
    } else if (targetUserId !== loggedInUserId) {
      // 他人のプロフィールを閲覧
      setIsOwner(false);
      setShowWelcome(true);
      
      // 訪問者統計を更新
      updateVisitorStats(targetUserId, loggedInUserId);
      
      // 共通の友達を取得
      const common = getCommonFriends(loggedInUserId, targetUserId);
      setCommonFriends(common);
    } else {
      // 自分のプロフィール
      setIsOwner(true);
      setIsPreviewMode(false);
      setCommonFriends([]);
    }

    // 友達ステータスの読み込み
    try {
      const friendStatusRaw = localStorage.getItem(FRIEND_STATUS_KEY);
      if (friendStatusRaw) {
        const statuses = JSON.parse(friendStatusRaw);
        setFriendStatus(statuses[targetUserId] || 'none');
      }
    } catch (e) {
      console.error('Failed to load friend status', e);
    }

    // プライバシー設定の読み込み
    try {
      const privacyRaw = localStorage.getItem(PRIVACY_SETTINGS_KEY);
      if (privacyRaw) {
        setPrivacySettings(JSON.parse(privacyRaw));
      } else {
        const ps = defaultPrivacySettings();
        localStorage.setItem(PRIVACY_SETTINGS_KEY, JSON.stringify(ps));
        setPrivacySettings(ps);
      }
    } catch (e) {
      setPrivacySettings(defaultPrivacySettings());
    }

    // 表示設定の読み込み
    try {
      const displayRaw = localStorage.getItem(DISPLAY_SETTINGS_KEY);
      if (displayRaw) {
        setDisplaySettings(JSON.parse(displayRaw));
      } else {
        const ds = defaultDisplaySettings();
        localStorage.setItem(DISPLAY_SETTINGS_KEY, JSON.stringify(ds));
        setDisplaySettings(ds);
      }
    } catch (e) {
      setDisplaySettings(defaultDisplaySettings());
    }

    // 訪問者統計の読み込み
    try {
      const statsRaw = localStorage.getItem(VISITOR_STATS_KEY);
      if (statsRaw) {
        setVisitorStats(JSON.parse(statsRaw));
      } else {
        const vs = initVisitorStats();
        localStorage.setItem(VISITOR_STATS_KEY, JSON.stringify(vs));
        setVisitorStats(vs);
      }
    } catch (e) {
      setVisitorStats(initVisitorStats());
    }

    // 共通の友達を計算（ダミーデータ）
    setCommonFriends([
      { id: 'f1', nickname: '田中太郎', avatar: PH1 },
      { id: 'f2', nickname: '佐藤花子', avatar: PH2 },
      { id: 'f3', nickname: '鈴木一郎', avatar: PH3 }
    ]);

    // アルバムの読み込み
    try {
      const a = localStorage.getItem(ALBUM_KEY);
      if (a) setAlbums(JSON.parse(a));
      else {
        const s = seedAlbums();
        localStorage.setItem(ALBUM_KEY, JSON.stringify(s));
        setAlbums(s);
      }
    } catch (e) {
      const s = seedAlbums();
      localStorage.setItem(ALBUM_KEY, JSON.stringify(s));
      setAlbums(s);
    }

    // 季節診断の履歴を読み込み
    try {
      const diagnosisKey = `cocoty_seasonal_diagnosis_v1_${targetUserId}`;
      const diagnosisRaw = localStorage.getItem(diagnosisKey);
      if (diagnosisRaw) {
        const history = JSON.parse(diagnosisRaw);
        // 開催期間中のもののみフィルター
        const today = new Date();
        const activeDiagnoses = history.filter((item: any) => {
          // 診断タイプに応じて期間を判定
          const diagnosisId = item.diagnosisId;
          if (diagnosisId.includes('winter')) {
            return isDateInRange(today, '2024-12-01', '2025-02-28');
          } else if (diagnosisId.includes('spring')) {
            return isDateInRange(today, '2025-03-01', '2025-05-31');
          } else if (diagnosisId.includes('summer')) {
            return isDateInRange(today, '2025-06-01', '2025-08-31');
          } else if (diagnosisId.includes('autumn')) {
            return isDateInRange(today, '2025-09-01', '2025-11-30');
          } else if (diagnosisId.includes('newyear')) {
            return isDateInRange(today, '2025-01-01', '2025-01-31');
          } else if (diagnosisId.includes('halloween')) {
            return isDateInRange(today, '2024-10-15', '2024-10-31');
          }
          return false;
        });
        setSeasonalDiagnosisHistory(activeDiagnoses);
      }
    } catch (e) {
      console.error('Failed to load seasonal diagnosis history', e);
    }
  }, [userId]); // userIdが変更されたら再読み込み

  // 日付範囲チェック用のヘルパー関数
  const isDateInRange = (date: Date, start: string, end: string) => {
    const currentDate = date.getTime();
    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();
    return currentDate >= startDate && currentDate <= endDate;
  };

  if (!profile) return null;

  const totalPosts = (profile.activity7 || []).reduce((s:number, v:number) => s+v, 0);
  const totalMonthly = (profile.monthly || []).reduce((s:number, v:number) => s+v, 0);

  const sparkPoints = (profile.activity7 || []).map((v:number, i:number) => {
    const max = Math.max(...profile.activity7, 1);
    const x = (i / Math.max(1, profile.activity7.length - 1)) * 100;
    const y = 100 - (v / max) * 80; // padding
    return `${x},${y}`;
  }).join(' ');

  // Helper component: image with fallback to PH1
  // Gallery: only include albums from store (purchased/templates) and user uploads
  const galleryImages = albums.filter(a => a.source === 'store' || a.source === 'user').flatMap(a => a.images);

  // Calendar: build last 28 days grid and map actual activity data
  const today = new Date();
  const last28 = Array.from({ length: 28 }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (27 - i));
    return d;
  });
  
  // map actual dailyActivities data to calendar
  const activityMap = new Map<string, number>();
  last28.forEach(d => {
    const dateKey = d.toDateString();
    const dayActivities = profile.dailyActivities?.[dateKey] || [];
    activityMap.set(dateKey, dayActivities.length);
  });


  return (
    <div className="max-w-4xl mx-auto">
      {/* 他人のプロフィールの場合は戻るボタンを表示 */}
      {userId && onClose && (
        <button
          onClick={onClose}
          className="mb-4 px-4 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors flex items-center space-x-2"
        >
          <span>← 戻る</span>
        </button>
      )}
      
      {/* デザインパターン切り替えボタン & 表示モード切り替え */}
      {/* パターン1のみ使用するため切り替えUIを非表示 */}
      {false && (
      <div className="fixed top-4 right-4 z-50 bg-white rounded-xl shadow-2xl p-3 border-2 border-gray-200">
        {/* デザインパターン */}
        <div className="mb-3 pb-3 border-b border-gray-200">
          <div className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">デザインパターン</div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => setDesignPattern(num as 1 | 2 | 3 | 4 | 5)}
                className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${
                  designPattern === num
                    ? 'bg-blue-600 text-white shadow-lg scale-110'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* 表示モード切り替え */}
        <div>
          <div className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">表示モード</div>
          <div className="flex flex-col gap-2">
            {/* 自分視点 / 他人視点 切り替え */}
            <button
              onClick={() => {
                if (isOwner && !isPreviewMode) {
                  // 自分視点 → プレビューモード（他人視点）
                  togglePreviewMode();
                } else if (isOwner && isPreviewMode) {
                  // プレビューモード → 自分視点
                  togglePreviewMode();
                } else {
                  // 他人のプロフィール → 自分のプロフィール
                  window.location.href = '/profile';
                }
              }}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                isOwner && !isPreviewMode
                  ? 'bg-green-500 text-white hover:bg-green-600 shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isOwner && !isPreviewMode ? (
                <>
                  <span>👤</span>
                  <span>自分視点</span>
                </>
              ) : (
                <>
                  <span>👥</span>
                  <span>他人視点</span>
                </>
              )}
            </button>

            {/* プレビューモード（自分のプロフィールの場合のみ） */}
            {isOwner && (
              <button
                onClick={togglePreviewMode}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  isPreviewMode
                    ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isPreviewMode ? (
                  <>
                    <span>✏️</span>
                    <span>編集モードに戻る</span>
                  </>
                ) : (
                  <>
                    <span>👁️</span>
                    <span>プレビュー</span>
                  </>
                )}
              </button>
            )}

            {/* 他のユーザーへ切り替え（開発用） */}
            {!isOwner && (
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    window.location.href = `/profile?userId=${e.target.value}`;
                  }
                }}
                className="px-3 py-2 rounded-lg text-sm border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue=""
              >
                <option value="">他のユーザーへ切り替え</option>
                <option value="user_002">田中 太郎</option>
                <option value="user_003">佐藤 美咲</option>
                <option value="user_004">鈴木 健太</option>
                <option value="user_005">高橋 さくら</option>
              </select>
            )}
          </div>
        </div>

        {/* 占い・メンタル機能 */}
        {isOwner && !isPreviewMode && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">占い・メンタル</div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  if (SHOW_UNDER_CONSTRUCTION) {
                    setShowTarotUnderConstruction(true);
                    return;
                  }
                  setShowDailyTarot(true);
                }}
                className="px-3 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>🔮</span>
                <span>今日の運勢</span>
              </button>
              <button
                onClick={() => setShowSeasonalDiagnosis(true)}
                className="px-3 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>✨</span>
                <span>季節の診断</span>
              </button>
              <button
                onClick={() => setShowMentalStats(true)}
                className="px-3 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600 shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>📊</span>
                <span>メンタル統計</span>
              </button>
            </div>
          </div>
        )}
      </div>
      )}

      {/* パターン1: Instagram風（現在のデザイン） */}
      {designPattern === 1 && (
        <div>
      {/* Cover + Avatar - より大きく目立つデザイン */}
      <div className="relative">
        <div className="h-72 w-full bg-gradient-to-br from-purple-100 to-blue-100 overflow-hidden rounded-b-3xl shadow-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={profile.cover || PH2} alt="cover" className="w-full h-full object-cover" />
        </div>
        <button onClick={() => { window.location.href = '/'; }} className="absolute left-4 top-4 px-3 py-2 bg-white/80 backdrop-blur rounded-md border">← Home</button>
        <div className="absolute left-8 -bottom-16 flex items-end">
          <div className="w-36 h-36 rounded-full ring-6 ring-white overflow-hidden bg-white shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={profile.avatar || PH1} alt="avatar" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="absolute right-8 -bottom-10 flex space-x-3">
          {isOwner ? (
            <>
              <button onClick={() => setEditOpen(true)} className="px-5 py-2.5 bg-purple-600 text-white border-2 border-purple-600 rounded-lg shadow-lg hover:shadow-xl transition-all hover:bg-purple-700 font-medium">
                ✏️ プロフィールを編集
              </button>
              <button onClick={togglePreviewMode} className="px-5 py-2.5 bg-white border-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow font-medium">
                👁️ プレビュー
              </button>
            </>
          ) : (
            <>
              <button onClick={handleAddFriend} className={`px-5 py-2.5 border-2 rounded-lg shadow-lg hover:shadow-xl transition-all font-medium ${
                friendStatus === 'none' ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' :
                friendStatus === 'pending' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                'bg-green-100 text-green-800 border-green-300'
              }`}>
                {friendStatus === 'none' ? '🤝 友達になる' : friendStatus === 'pending' ? '⏳ 承認待ち' : '✓ 友達'}
              </button>
              {friendStatus === 'friends' && (
                <button onClick={() => alert('メッセージ機能は準備中です')} className="px-5 py-2.5 bg-purple-600 text-white border-2 border-purple-600 rounded-lg shadow-lg hover:shadow-xl transition-all hover:bg-purple-700 font-medium">
                  💬 メッセージ
                </button>
              )}
              <button onClick={() => handleShare('copy')} className="px-5 py-2.5 bg-white border-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow font-medium">
                📤 共有
              </button>
            </>
          )}
        </div>
      </div>

      {/* Phase 1: ウェルカムメッセージ */}
      {showWelcome && !isOwner && (
        <div className="mx-6 mt-6 mb-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl shadow-lg animate-fade-in">
          <div className="flex items-center gap-3">
            <span className="text-3xl">👋</span>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-purple-900">
                {profile.nickname}さんのプロフィールへようこそ！
              </h3>
              <p className="text-sm text-purple-700 mt-1">
                {isPreviewMode ? 'プレビューモード：訪問者からはこのように見えます' : 'ぜひ友達になって、一緒に活動しましょう！'}
              </p>
            </div>
            <button onClick={() => setShowWelcome(false)} className="text-purple-400 hover:text-purple-600">✕</button>
          </div>
          {/* 共通の友達表示 */}
          {commonFriends.length > 0 && !isPreviewMode && (
            <div className="mt-3 pt-3 border-t border-purple-200">
              <div className="flex items-center gap-2 text-sm text-purple-700">
                <span className="font-medium">共通の友達:</span>
                <div className="flex -space-x-2">
                  {commonFriends.slice(0, 3).map((friend: any) => (
                    <div key={friend.id} className="w-6 h-6 rounded-full ring-2 ring-white overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={friend.avatar} alt={friend.nickname} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <span>{commonFriends.length}人</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Phase 3: 自分視点時の統計情報 */}
      {isOwner && !isPreviewMode && (
        <div className="mx-6 mt-6 mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-blue-900">📊 プロフィール統計</h4>
              <div className="flex gap-4 mt-2 text-sm">
                <div>
                  <span className="text-blue-700">今週の訪問者:</span>
                  <span className="ml-1 font-bold text-blue-900">{visitorStats.weeklyViews}人</span>
                </div>
                <div>
                  <span className="text-blue-700">累計:</span>
                  <span className="ml-1 font-bold text-blue-900">{visitorStats.totalViews}回</span>
                </div>
              </div>
            </div>
            <button onClick={() => setShowStatsModal(true)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              詳細 →
            </button>
          </div>
        </div>
      )}

      <div className="px-6 pt-20">
        {/* Phase 2 & 3: 自分視点時の設定ボタン */}
        {isOwner && !isPreviewMode && (
          <div className="mb-4 flex gap-2 justify-end">
            <button onClick={() => setShowPrivacyModal(true)} className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 text-sm font-medium">
              🔒 プライバシー設定
            </button>
            <button onClick={() => setShowDisplayModal(true)} className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 text-sm font-medium">
              ⚙️ 表示設定
            </button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{profile.nickname}</h1>
            <div className="mt-2 text-gray-600 flex items-center gap-3">
              {profile.diagnosis && displaySettings.showDiagnosis && <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">{profile.diagnosis}</span>}
              <div className="text-sm">{profile.bio}</div>
            </div>
            
            {/* 季節診断結果の表示（開催期間中のみ） */}
            {seasonalDiagnosisHistory.length > 0 && displaySettings.showDiagnosis && (
              <div className="mt-3 flex flex-wrap gap-2">
                {seasonalDiagnosisHistory.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="px-3 py-1.5 bg-gradient-to-r from-pink-100 to-purple-100 text-purple-800 rounded-full text-xs font-medium flex items-center gap-1.5 border border-purple-200"
                    title={item.diagnosisTitle}
                  >
                    <span>{item.result?.icon || '✨'}</span>
                    <span>{item.result?.title || 'タイプ'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-lg font-bold">{albums.flatMap(a=>a.images).length}</div>
              <div className="text-sm text-gray-500">投稿</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{albums.length}</div>
              <div className="text-sm text-gray-500">アルバム</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{totalMonthly}</div>
              <div className="text-sm text-gray-500">今月の活動</div>
            </div>
          </div>
        </div>

        {/* Goals / Working On */}
        {displaySettings.showWorkingOn && displaySettings.showGoal && (
          <div className="mt-6 bg-white p-4 rounded-lg border">
            <h4 className="font-medium mb-2">今取り組んでいること</h4>
            <div className="flex flex-wrap gap-2">
              {(profile.workingOn || []).map((w:string, i:number) => (
                <div key={i} className="px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-sm">{w}</div>
              ))}
            </div>
            <div className="mt-3 text-sm text-gray-600">目標: <span className="font-medium">{profile.goal}</span></div>
          </div>
        )}

        {/* Goal Achievement Progress */}
        <div className="mt-6 bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">目標達成度</h4>
            <div className="text-2xl font-bold text-amber-600">{profile.goalProgress || 0}%</div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-amber-400 to-amber-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${profile.goalProgress || 0}%` }}
            ></div>
          </div>

          {/* Milestones */}
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-gray-700 mb-2">マイルストーン</h5>
            {(profile.milestones || []).map((milestone:any) => (
              <div key={milestone.id} className={`flex items-center gap-3 p-2 rounded ${milestone.completed ? 'bg-green-50' : 'bg-gray-50'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${milestone.completed ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
                  {milestone.completed ? '✓' : milestone.id}
                </div>
                <div className="flex-1">
                  <div className={`text-sm ${milestone.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {milestone.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    {milestone.completed ? `完了: ${milestone.date}` : `予定: ${milestone.targetDate}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gallery */}
        <div className="mt-6">
          <h3 className="font-medium mb-3">投稿した写真</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {galleryImages.slice(0, 48).map((img:string, i:number) => (
              <button key={i} onClick={() => { setGalleryIndex(i); setGalleryOpen(true); }} className="block w-full">
                <ImageWithFallback src={img} alt={`g-${i}`} className="w-full h-40 object-cover rounded-lg" />
              </button>
            ))}
          </div>

          {/* Slider modal */}
          {galleryOpen && (
            <div className="fixed inset-0 z-70 bg-black bg-opacity-60 flex items-center justify-center p-4">
              <div className="w-full max-w-4xl bg-white rounded-lg overflow-hidden">
                <div className="relative bg-black">
                  <div className="h-96 flex items-center justify-center">
                    <ImageWithFallback src={galleryImages[galleryIndex]} alt={`slide-${galleryIndex}`} className="w-full h-full object-contain" />
                  </div>
                  <button onClick={() => setGalleryOpen(false)} className="absolute top-3 right-3 text-white bg-black/40 px-3 py-1 rounded">✕</button>
                  <button onClick={() => setGalleryIndex(i => Math.max(0, i-1))} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white bg-black/40 px-3 py-1 rounded">‹</button>
                  <button onClick={() => setGalleryIndex(i => Math.min(galleryImages.length-1, i+1))} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white bg-black/40 px-3 py-1 rounded">›</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Activity Calendar */}
        <div className="mt-6 bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-medium">活動カレンダー</h4>
              <div className="text-sm text-gray-500">過去28日間（活動日は色付き・日付をクリックで詳細表示）</div>
            </div>
            <div className="text-sm text-gray-500">合計: {totalPosts}</div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {last28.map((d, idx) => {
              const key = d.toDateString();
              const val = activityMap.get(key) || 0;
              const isSelected = selectedDate === key;
              const hasActivity = val > 0;
              
              return (
                <button 
                  key={idx} 
                  onClick={() => setSelectedDate(isSelected ? null : key)}
                  className={`h-12 rounded flex flex-col items-center justify-center text-xs transition-all cursor-pointer
                    ${hasActivity ? 'bg-amber-200 hover:bg-amber-300' : 'bg-gray-100 hover:bg-gray-200'}
                    ${isSelected ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
                  `} 
                  title={`${d.toDateString()}: ${val} 活動`}
                >
                  <div className="text-xs text-gray-700 font-medium">{d.getDate()}</div>
                  {hasActivity && <div className="text-xs text-amber-800">●</div>}
                </button>
              );
            })}
          </div>

          {/* 選択された日のアクティビティ詳細 */}
          {selectedDate && profile.dailyActivities && (
            <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
              <h5 className="font-medium mb-2">
                {new Date(selectedDate).toLocaleDateString('ja-JP', { 
                  month: 'long', 
                  day: 'numeric', 
                  weekday: 'short' 
                })} のアクティビティ
              </h5>
              <div className="space-y-2">
                {profile.dailyActivities[selectedDate]?.length > 0 ? (
                  profile.dailyActivities[selectedDate].map((activity: any) => (
                    <div key={activity.id} className="flex items-start gap-3 p-2 bg-white rounded">
                      <div className="w-8 h-8 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                        {activity.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={activity.image} alt="activity" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs">
                            {activity.type === 'upload' ? '📸' : 
                             activity.type === 'event' ? '🎯' : 
                             activity.type === 'achievement' ? '🏆' : '💬'}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">{activity.text}</div>
                          <div className="text-xs text-gray-500">{activity.time}</div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">この日はアクティビティがありませんでした</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
        </div>
      )}

      {/* パターン2: カード重視デザイン */}
      {designPattern === 2 && (
        <div>
          {/* Cover + Avatar - より大きく華やかに */}
          <div className="relative">
            <div className="h-56 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-400 rounded-b-3xl shadow-2xl"></div>
            <button onClick={() => { window.location.href = '/'; }} className="absolute left-4 top-4 px-4 py-2 bg-white/95 backdrop-blur rounded-full border-2 text-sm font-medium shadow-lg">← ホーム</button>
            <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-20 flex flex-col items-center">
              <div className="w-44 h-44 rounded-full ring-6 ring-white overflow-hidden bg-white shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={profile.avatar || PH1} alt="avatar" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <div className="px-6 pt-24">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold mb-2">{profile.nickname}</h1>
              <div className="flex items-center justify-center gap-2 mb-3">
                {profile.diagnosis && <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">{profile.diagnosis}</span>}
              </div>
              <div className="text-gray-600 max-w-md mx-auto">{profile.bio}</div>
              <div className="flex gap-3 justify-center mt-5">
                <button onClick={() => setEditOpen(true)} className="px-8 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 shadow-lg font-medium">編集</button>
                <button className="px-8 py-3 bg-white border-2 rounded-full hover:bg-gray-50 shadow-lg font-medium">共有</button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-2xl text-center shadow-md">
                <div className="text-3xl font-bold text-blue-600">{albums.flatMap(a=>a.images).length}</div>
                <div className="text-sm text-blue-800 mt-1 font-medium">投稿</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-2xl text-center shadow-md">
                <div className="text-3xl font-bold text-green-600">{albums.length}</div>
                <div className="text-sm text-green-800 mt-1 font-medium">アルバム</div>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-5 rounded-2xl text-center shadow-md">
                <div className="text-3xl font-bold text-amber-600">{totalMonthly}</div>
                <div className="text-sm text-amber-800 mt-1 font-medium">今月</div>
              </div>
            </div>

            {/* Goals Card */}
            <div className="bg-white p-5 rounded-2xl shadow-md border mb-6">
              <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                <span>🎯</span> 取り組んでいること
              </h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {(profile.workingOn || []).map((w:string, i:number) => (
                  <div key={i} className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">{w}</div>
                ))}
              </div>
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <span className="font-medium">目標:</span> {profile.goal}
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-4">📸 投稿した写真</h3>
              <div className="grid grid-cols-3 gap-2">
                {galleryImages.slice(0, 48).map((img:string, i:number) => (
                  <button key={i} onClick={() => { setGalleryIndex(i); setGalleryOpen(true); }} className="aspect-square overflow-hidden rounded-xl">
                    <ImageWithFallback src={img} alt={`g-${i}`} className="w-full h-full object-cover hover:scale-110 transition-transform" />
                  </button>
                ))}
              </div>
            </div>

            {/* Calendar Card */}
            <div className="bg-white p-5 rounded-2xl shadow-md border mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-lg">📅 活動カレンダー</h4>
                <div className="text-sm text-gray-500">合計: {totalPosts}</div>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {last28.map((d, idx) => {
                  const key = d.toDateString();
                  const val = activityMap.get(key) || 0;
                  const isSelected = selectedDate === key;
                  const hasActivity = val > 0;
                  
                  return (
                    <button 
                      key={idx} 
                      onClick={() => setSelectedDate(isSelected ? null : key)}
                      className={`h-12 rounded-xl flex flex-col items-center justify-center text-xs transition-all
                        ${hasActivity ? 'bg-purple-200 hover:bg-purple-300' : 'bg-gray-50 hover:bg-gray-100'}
                        ${isSelected ? 'ring-2 ring-purple-500 ring-offset-1 shadow-lg' : ''}
                      `}
                    >
                      <div className="text-xs font-medium">{d.getDate()}</div>
                      {hasActivity && <div className="text-xs text-purple-800">●</div>}
                    </button>
                  );
                })}
              </div>
              {selectedDate && profile.dailyActivities && profile.dailyActivities[selectedDate]?.length > 0 && (
                <div className="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <h5 className="font-semibold mb-3 text-purple-900">
                    {new Date(selectedDate).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' })}
                  </h5>
                  <div className="space-y-2">
                    {profile.dailyActivities[selectedDate].map((activity: any) => (
                      <div key={activity.id} className="flex gap-3 p-3 bg-white rounded-lg shadow-sm">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {activity.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={activity.image} alt="activity" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-sm">
                              {activity.type === 'upload' ? '📸' : activity.type === 'event' ? '🎯' : activity.type === 'achievement' ? '🏆' : '💬'}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{activity.text}</div>
                          <div className="text-xs text-gray-500 mt-1">{activity.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* パターン3: ミニマルデザイン */}
      {designPattern === 3 && (
        <div className="bg-gray-50 min-h-screen">
          {/* Minimal Header */}
          <div className="bg-white border-b">
            <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
              <button onClick={() => { window.location.href = '/'; }} className="text-sm text-gray-600 hover:text-gray-900">← 戻る</button>
              <div className="flex items-center gap-3">
                <button onClick={() => setEditOpen(true)} className="text-sm text-gray-600 hover:text-gray-900">編集</button>
                <button className="text-sm text-gray-600 hover:text-gray-900">共有</button>
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-6 py-8">
            {/* Minimal Profile Header */}
            <div className="flex items-start gap-6 mb-8">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={profile.avatar || PH1} alt="avatar" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-1">{profile.nickname}</h1>
                {profile.diagnosis && <span className="inline-block px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs mb-2">{profile.diagnosis}</span>}
                <p className="text-gray-600 text-sm mb-3">{profile.bio}</p>
                <div className="flex gap-6 text-sm">
                  <div><span className="font-semibold">{albums.flatMap(a=>a.images).length}</span> <span className="text-gray-500">投稿</span></div>
                  <div><span className="font-semibold">{albums.length}</span> <span className="text-gray-500">アルバム</span></div>
                  <div><span className="font-semibold">{totalMonthly}</span> <span className="text-gray-500">今月の活動</span></div>
                </div>
              </div>
            </div>

            {/* Minimal Goals */}
            <div className="bg-white border rounded-lg p-5 mb-6">
              <div className="text-sm font-medium text-gray-500 mb-2">現在取り組んでいること</div>
              <div className="flex flex-wrap gap-2 mb-3">
                {(profile.workingOn || []).map((w:string, i:number) => (
                  <span key={i} className="text-sm text-gray-700 border px-3 py-1 rounded-full">{w}</span>
                ))}
              </div>
              <div className="text-sm text-gray-600 pt-3 border-t">
                <span className="font-medium">目標:</span> {profile.goal}
              </div>
            </div>

            {/* Minimal Gallery */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">投稿した写真</h3>
              <div className="grid grid-cols-4 gap-1">
                {galleryImages.slice(0, 48).map((img:string, i:number) => (
                  <button key={i} onClick={() => { setGalleryIndex(i); setGalleryOpen(true); }} className="aspect-square overflow-hidden">
                    <ImageWithFallback src={img} alt={`g-${i}`} className="w-full h-full object-cover hover:opacity-80 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>

            {/* Minimal Calendar */}
            <div className="bg-white border rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-gray-700">活動カレンダー (過去28日)</h4>
                <span className="text-xs text-gray-500">{totalPosts} 活動</span>
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {last28.map((d, idx) => {
                  const key = d.toDateString();
                  const val = activityMap.get(key) || 0;
                  const isSelected = selectedDate === key;
                  const hasActivity = val > 0;
                  
                  return (
                    <button 
                      key={idx} 
                      onClick={() => setSelectedDate(isSelected ? null : key)}
                      className={`h-11 flex flex-col items-center justify-center text-xs transition-all border
                        ${hasActivity ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-400 border-gray-200'}
                        ${isSelected ? 'ring-2 ring-offset-1 ring-gray-800' : ''}
                      `}
                    >
                      <div className="font-medium">{d.getDate()}</div>
                      {hasActivity && <div className="text-xs">・</div>}
                    </button>
                  );
                })}
              </div>
              {selectedDate && profile.dailyActivities && profile.dailyActivities[selectedDate]?.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <div className="text-sm font-medium text-gray-700 mb-3">
                    {new Date(selectedDate).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' })}
                  </div>
                  <div className="space-y-2">
                    {profile.dailyActivities[selectedDate].map((activity: any) => (
                      <div key={activity.id} className="flex gap-3 py-2 border-b last:border-0">
                        <div className="w-8 h-8 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                          {activity.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={activity.image} alt="activity" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs">
                              {activity.type === 'upload' ? '📸' : activity.type === 'event' ? '🎯' : activity.type === 'achievement' ? '🏆' : '💬'}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-gray-900">{activity.text}</div>
                          <div className="text-xs text-gray-500">{activity.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* パターン4: 超大型アバターデザイン */}
      {designPattern === 4 && (
        <div className="bg-gradient-to-b from-indigo-50 to-white min-h-screen">
          {/* ナビゲーション */}
          <div className="px-6 py-4">
            <button onClick={() => { window.location.href = '/'; }} className="text-sm text-gray-600 hover:text-gray-900">← 戻る</button>
          </div>

          {/* 超大型アバター中心レイアウト */}
          <div className="max-w-4xl mx-auto px-6 pb-8">
            <div className="flex flex-col items-center mb-8">
              {/* 巨大アバター */}
              <div className="relative mb-6">
                <div className="w-48 h-48 rounded-full overflow-hidden bg-white shadow-2xl ring-8 ring-white ring-offset-4 ring-offset-indigo-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={profile.avatar || PH1} alt="avatar" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* プロフィール情報 */}
              <h1 className="text-4xl font-bold mb-3 text-center">{profile.nickname}</h1>
              
              {/* 診断結果を独自のカードスタイルで表示 */}
              {profile.diagnosis && (
                <div className="mb-4 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl shadow-lg">
                  <div className="text-center">
                    <div className="text-xl font-bold mb-1">{profile.diagnosis}</div>
                    <div className="text-sm opacity-90">{getDiagnosisDescription(profile.diagnosis)}</div>
                  </div>
                </div>
              )}

              {/* 季節診断結果の表示（開催期間中のみ） */}
              {seasonalDiagnosisHistory.length > 0 && (
                <div className="mb-4 w-full max-w-md">
                  <div className="text-sm font-medium text-gray-700 mb-2 text-center">🎉 開催中の診断結果</div>
                  <div className="space-y-2">
                    {seasonalDiagnosisHistory.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{item.result?.icon || '✨'}</span>
                            <div>
                              <div className="font-bold text-sm">{item.result?.title || 'タイプ'}</div>
                              <div className="text-xs opacity-90">{item.diagnosisTitle}</div>
                            </div>
                          </div>
                          <div className="text-xs opacity-75">
                            {new Date(item.date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <p className="text-gray-600 text-center max-w-md mb-4">{profile.bio}</p>
              
              <div className="flex gap-3 mb-6">
                <button onClick={() => setEditOpen(true)} className="px-6 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 shadow-lg">
                  編集
                </button>
                <button className="px-6 py-3 bg-white border-2 border-gray-200 rounded-full font-medium hover:bg-gray-50 shadow">
                  共有
                </button>
              </div>

              {/* 統計カード - 横並び */}
              <div className="flex gap-8 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600">{albums.flatMap(a=>a.images).length}</div>
                  <div className="text-sm text-gray-600 mt-1">投稿</div>
                </div>
                <div className="w-px bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600">{albums.length}</div>
                  <div className="text-sm text-gray-600 mt-1">アルバム</div>
                </div>
                <div className="w-px bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600">{totalMonthly}</div>
                  <div className="text-sm text-gray-600 mt-1">今月</div>
                </div>
              </div>
            </div>

            {/* 2カラムレイアウト */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 左カラム */}
              <div className="space-y-6">
                {/* Goals */}
                <div className="bg-white rounded-2xl p-6 shadow-md">
                  <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <span>🎯</span> 取り組んでいること
                  </h4>
                  <div className="space-y-2 mb-4">
                    {(profile.workingOn || []).map((w:string, i:number) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                        <div className="text-sm text-gray-700">{w}</div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t">
                    <div className="text-xs text-gray-500 mb-1">目標</div>
                    <div className="text-sm font-medium text-gray-900">{profile.goal}</div>
                  </div>
                </div>

                {/* Calendar */}
                <div className="bg-white rounded-2xl p-6 shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-lg">📅 活動カレンダー</h4>
                    <div className="text-xs text-gray-500">{totalPosts} 活動</div>
                  </div>
                  <div className="grid grid-cols-7 gap-1.5">
                    {last28.map((d, idx) => {
                      const key = d.toDateString();
                      const val = activityMap.get(key) || 0;
                      const isSelected = selectedDate === key;
                      const hasActivity = val > 0;
                      
                      return (
                        <button 
                          key={idx} 
                          onClick={() => setSelectedDate(isSelected ? null : key)}
                          className={`h-10 rounded-lg flex flex-col items-center justify-center text-xs transition-all
                            ${hasActivity ? 'bg-indigo-500 text-white hover:bg-indigo-600' : 'bg-gray-100 hover:bg-gray-200'}
                            ${isSelected ? 'ring-2 ring-indigo-600 ring-offset-2' : ''}
                          `}
                        >
                          <div className="font-medium">{d.getDate()}</div>
                        </button>
                      );
                    })}
                  </div>
                  {selectedDate && profile.dailyActivities && profile.dailyActivities[selectedDate]?.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <h5 className="text-sm font-semibold mb-3">
                        {new Date(selectedDate).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' })}
                      </h5>
                      <div className="space-y-2">
                        {profile.dailyActivities[selectedDate].map((activity: any) => (
                          <div key={activity.id} className="flex gap-2 text-sm">
                            <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center flex-shrink-0 text-xs">
                              {activity.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={activity.image} alt="act" className="w-full h-full object-cover rounded" />
                              ) : (
                                <span>{activity.type === 'upload' ? '📸' : activity.type === 'event' ? '🎯' : activity.type === 'achievement' ? '🏆' : '💬'}</span>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="text-gray-900">{activity.text}</div>
                              <div className="text-xs text-gray-500">{activity.time}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 右カラム - ギャラリー */}
              <div>
                <div className="bg-white rounded-2xl p-6 shadow-md">
                  <h3 className="font-bold text-lg mb-4">📸 投稿した写真</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {galleryImages.slice(0, 48).map((img:string, i:number) => (
                      <button key={i} onClick={() => { setGalleryIndex(i); setGalleryOpen(true); }} className="aspect-square overflow-hidden rounded-lg">
                        <ImageWithFallback src={img} alt={`g-${i}`} className="w-full h-full object-cover hover:scale-110 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* パターン5: ダークモード・マルチビュースタイル */}
      {designPattern === 5 && (
        <div className="bg-gray-900 text-white min-h-screen">
          {/* ヘッダー */}
          <div className="border-b border-gray-800">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
              <button onClick={() => { window.location.href = '/'; }} className="text-gray-400 hover:text-white text-sm">← 戻る</button>
              <div className="flex items-center gap-3">
                <button onClick={() => setEditOpen(true)} className="text-sm text-gray-400 hover:text-white">編集</button>
                <button className="text-sm text-gray-400 hover:text-white">共有</button>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-6 py-8">
            {/* トップセクション */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* メインアバター */}
              <div className="md:col-span-1 flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="w-40 h-40 rounded-2xl overflow-hidden bg-gray-800 shadow-xl ring-4 ring-gray-700">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={profile.avatar || PH1} alt="avatar" className="w-full h-full object-cover" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2">{profile.nickname}</h2>
                
                {/* 診断結果を別のスタイルで表示 */}
                {profile.diagnosis && (
                  <div className="mb-3 w-full">
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 px-4 py-2 rounded-lg font-bold text-center mb-2">
                      {profile.diagnosis}
                    </div>
                    <div className="text-sm text-gray-400 text-center px-2">
                      {getDiagnosisDescription(profile.diagnosis)}
                    </div>
                  </div>
                )}
                
                <p className="text-gray-400 text-sm text-center">{profile.bio}</p>
              </div>

              {/* 小さなアバターグリッド - 最近の活動写真 */}
              <div className="md:col-span-2 grid grid-cols-4 gap-3">
                {galleryImages.slice(0, 8).map((img:string, i:number) => (
                  <button key={i} onClick={() => { setGalleryIndex(i); setGalleryOpen(true); }} className="aspect-square overflow-hidden rounded-xl bg-gray-800 hover:ring-2 hover:ring-yellow-500 transition-all">
                    <ImageWithFallback src={img} alt={`mini-${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* 統計バー */}
            <div className="bg-gray-800 rounded-2xl p-6 mb-6">
              <div className="grid grid-cols-3 divide-x divide-gray-700">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-500">{albums.flatMap(a=>a.images).length}</div>
                  <div className="text-sm text-gray-400 mt-1">投稿数</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-500">{albums.length}</div>
                  <div className="text-sm text-gray-400 mt-1">アルバム</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-500">{totalMonthly}</div>
                  <div className="text-sm text-gray-400 mt-1">今月の活動</div>
                </div>
              </div>
            </div>

            {/* コンテンツグリッド */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Goals */}
              <div className="bg-gray-800 rounded-2xl p-5">
                <h4 className="font-bold mb-4 flex items-center gap-2 text-yellow-500">
                  <span>🎯</span> 取り組み中
                </h4>
                <div className="space-y-3 mb-4">
                  {(profile.workingOn || []).map((w:string, i:number) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="text-sm text-gray-300">{w}</div>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-gray-700">
                  <div className="text-xs text-gray-500 mb-1">目標</div>
                  <div className="text-sm text-gray-200">{profile.goal}</div>
                </div>
              </div>

              {/* Calendar */}
              <div className="bg-gray-800 rounded-2xl p-5 lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-yellow-500">📅 活動カレンダー</h4>
                  <div className="text-xs text-gray-500">{totalPosts} 活動</div>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {last28.map((d, idx) => {
                    const key = d.toDateString();
                    const val = activityMap.get(key) || 0;
                    const isSelected = selectedDate === key;
                    const hasActivity = val > 0;
                    
                    return (
                      <button 
                        key={idx} 
                        onClick={() => setSelectedDate(isSelected ? null : key)}
                        className={`h-12 rounded-lg flex flex-col items-center justify-center text-xs transition-all
                          ${hasActivity ? 'bg-yellow-500 text-gray-900 font-bold hover:bg-yellow-400' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}
                          ${isSelected ? 'ring-2 ring-yellow-500 ring-offset-2 ring-offset-gray-900' : ''}
                        `}
                      >
                        <div>{d.getDate()}</div>
                        {hasActivity && <div className="text-xs">●</div>}
                      </button>
                    );
                  })}
                </div>
                {selectedDate && profile.dailyActivities && profile.dailyActivities[selectedDate]?.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <h5 className="text-sm font-semibold mb-3 text-yellow-500">
                      {new Date(selectedDate).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' })}
                    </h5>
                    <div className="space-y-2">
                      {profile.dailyActivities[selectedDate].map((activity: any) => (
                        <div key={activity.id} className="flex gap-3 p-2 bg-gray-700/50 rounded-lg">
                          <div className="w-8 h-8 rounded overflow-hidden bg-gray-600 flex-shrink-0">
                            {activity.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={activity.image} alt="activity" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs">
                                {activity.type === 'upload' ? '📸' : activity.type === 'event' ? '🎯' : activity.type === 'achievement' ? '🏆' : '💬'}
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-gray-200">{activity.text}</div>
                            <div className="text-xs text-gray-500">{activity.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* フルワイドギャラリー */}
            <div className="mt-6 bg-gray-800 rounded-2xl p-5">
              <h3 className="font-bold mb-4 text-yellow-500">📸 すべての投稿</h3>
              <div className="grid grid-cols-6 gap-2">
                {galleryImages.slice(0, 48).map((img:string, i:number) => (
                  <button key={i} onClick={() => { setGalleryIndex(i); setGalleryOpen(true); }} className="aspect-square overflow-hidden rounded-lg">
                    <ImageWithFallback src={img} alt={`g-${i}`} className="w-full h-full object-cover hover:opacity-70 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gallery slider modal (全パターン共通) */}
      {galleryOpen && (
        <div className="fixed inset-0 z-70 bg-black bg-opacity-60 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-white rounded-lg overflow-hidden">
            <div className="relative bg-black">
              <div className="h-96 flex items-center justify-center">
                <ImageWithFallback src={galleryImages[galleryIndex]} alt={`slide-${galleryIndex}`} className="w-full h-full object-contain" />
              </div>
              <button onClick={() => setGalleryOpen(false)} className="absolute top-3 right-3 text-white bg-black/40 px-3 py-1 rounded">✕</button>
              <button onClick={() => setGalleryIndex(i => Math.max(0, i-1))} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white bg-black/40 px-3 py-1 rounded">‹</button>
              <button onClick={() => setGalleryIndex(i => Math.min(galleryImages.length-1, i+1))} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white bg-black/40 px-3 py-1 rounded">›</button>
            </div>
          </div>
        </div>
      )}

      {/* Phase 2: プライバシー設定モーダル */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold">🔒 プライバシー設定</h3>
              <button onClick={() => setShowPrivacyModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <p className="text-sm text-gray-600 mb-6">各項目の公開範囲を設定できます</p>
            
            {Object.entries({
              goal: '目標',
              workingOn: '取り組んでいること',
              calendar: '活動カレンダー',
              gallery: '投稿ギャラリー',
              diagnosis: '診断結果',
              albums: 'アルバム'
            }).map(([key, label]) => (
              <div key={key} className="mb-4 p-4 border rounded-lg">
                <div className="font-medium mb-2">{label}</div>
                <div className="flex gap-2">
                  {['public', 'friends', 'private'].map((level) => (
                    <button
                      key={level}
                      onClick={() => updatePrivacySetting(key, level)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        privacySettings[key] === level
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {level === 'public' ? '🌐 公開' : level === 'friends' ? '👥 友達のみ' : '🔒 自分のみ'}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            
            <button onClick={() => setShowPrivacyModal(false)} className="w-full mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
              完了
            </button>
          </div>
        </div>
      )}

      {/* Phase 3: 表示カスタマイズモーダル */}
      {showDisplayModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold">⚙️ 表示設定</h3>
              <button onClick={() => setShowDisplayModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <p className="text-sm text-gray-600 mb-6">プロフィールに表示する項目を選択できます</p>
            
            {Object.entries({
              showGoal: '目標',
              showWorkingOn: '取り組んでいること',
              showCalendar: '活動カレンダー',
              showGallery: '投稿ギャラリー',
              showDiagnosis: '診断結果',
              showAlbums: 'アルバム'
            }).map(([key, label]) => (
              <div key={key} className="mb-3 p-4 border rounded-lg flex items-center justify-between">
                <div className="font-medium">{label}</div>
                <button
                  onClick={() => updateDisplaySetting(key, !displaySettings[key])}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    displaySettings[key]
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {displaySettings[key] ? '✓ 表示中' : '非表示'}
                </button>
              </div>
            ))}
            
            <button onClick={() => setShowDisplayModal(false)} className="w-full mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
              完了
            </button>
          </div>
        </div>
      )}

      {/* Phase 3: 訪問者統計モーダル */}
      {showStatsModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold">📊 訪問者統計</h3>
              <button onClick={() => setShowStatsModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-600">今週の訪問者</div>
                <div className="text-3xl font-bold text-blue-900 mt-1">{visitorStats.weeklyViews}人</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-sm text-purple-600">累計閲覧数</div>
                <div className="text-3xl font-bold text-purple-900 mt-1">{visitorStats.totalViews}回</div>
              </div>
            </div>
            
            <h4 className="font-bold mb-3">最近の訪問者</h4>
            <div className="space-y-2">
              {visitorStats.recentVisitors.length > 0 ? (
                visitorStats.recentVisitors.map((visitor: any) => (
                  <div key={visitor.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={visitor.avatar} alt={visitor.nickname} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{visitor.nickname}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(visitor.visitedAt).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">まだ訪問者がいません</div>
              )}
            </div>
            
            <button onClick={() => setShowStatsModal(false)} className="w-full mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
              閉じる
            </button>
          </div>
        </div>
      )}

      {/* 占い・メンタル機能のモーダル */}
      {/* 実装中モーダル */}
      <UnderConstructionModal
        isOpen={showTarotUnderConstruction}
        onClose={() => setShowTarotUnderConstruction(false)}
      />
      
      <DailyTarot
        isOpen={showDailyTarot}
        onClose={() => setShowDailyTarot(false)}
        userId={currentUser?.id || 'PH1'}
        userName={currentUser?.nickname || profile?.nickname || 'ゲスト'}
      />
      
      <SeasonalDiagnosisHub
        isOpen={showSeasonalDiagnosis}
        onClose={() => setShowSeasonalDiagnosis(false)}
        userId={currentUser?.id || 'PH1'}
      />
      
      <MentalStatsAdmin
        isOpen={showMentalStats}
        onClose={() => setShowMentalStats(false)}
        userId={currentUser?.id || 'PH1'}
      />

      {editOpen && <Profile isOpen={editOpen} onClose={() => { setEditOpen(false); setProfile(JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')); }} onSave={() => {}} />}
    </div>
  );
};

export default ProfilePage;

