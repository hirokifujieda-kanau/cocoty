/**
 * イベントのモックデータと管理機能
 */

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  organizerId: string;
  community: string;
  category: 'workshop' | 'online' | 'social' | 'competition' | 'exhibition';
  capacity: number;
  attendees: string[]; // ユーザーID配列
  tags: string[];
  price: number;
  image?: string;
  status: 'open' | 'closed' | 'cancelled' | 'full';
  createdAt: string;
  updatedAt: string;
}

const EVENTS_KEY = 'cocoty_events_v1';
const ATTENDANCE_KEY = 'cocoty_attendance_v1';

// 初期イベントデータ
const initialEvents: Event[] = [
  {
    id: 'evt_001',
    title: '春の撮影会 in 上野公園',
    description: '桜の季節に合わせて屋外撮影を行います。カメラの基本操作から構図のコツまで、初心者の方も安心してご参加ください！',
    date: '2025-04-10',
    time: '10:00-16:00',
    location: '上野公園',
    organizer: '山田 花子',
    organizerId: 'user_001',
    community: '写真部',
    category: 'workshop',
    capacity: 20,
    attendees: ['user_002', 'user_003', 'user_005', 'user_007'],
    tags: ['撮影', '初心者歓迎', '屋外', '桜'],
    price: 500,
    status: 'open',
    createdAt: '2025-03-01T10:00:00Z',
    updatedAt: '2025-03-15T14:30:00Z'
  },
  {
    id: 'evt_002',
    title: 'React入門ハンズオン',
    description: 'React入門をテーマにハンズオン形式で進めます。パソコンをお持ちください。',
    date: '2025-04-15',
    time: '14:00-17:00',
    location: 'オンライン（Zoom）',
    organizer: '田中 太郎',
    organizerId: 'user_002',
    community: 'プログラミング部',
    category: 'online',
    capacity: 30,
    attendees: ['user_001', 'user_004', 'user_008', 'user_012'],
    tags: ['React', 'JavaScript', 'ハンズオン', 'オンライン'],
    price: 0,
    status: 'open',
    createdAt: '2025-03-05T09:00:00Z',
    updatedAt: '2025-03-20T11:00:00Z'
  },
  {
    id: 'evt_003',
    title: '料理コンテスト - 春野菜編',
    description: 'テーマは「春野菜を使った創作料理」。みんなでアイデアを競い合いましょう！',
    date: '2025-04-20',
    time: '13:00-17:00',
    location: 'キッチンスタジオ渋谷',
    organizer: '佐藤 美咲',
    organizerId: 'user_003',
    community: '料理部',
    category: 'competition',
    capacity: 15,
    attendees: ['user_006', 'user_009', 'user_014'],
    tags: ['料理', 'コンテスト', '春野菜'],
    price: 1500,
    status: 'open',
    createdAt: '2025-03-10T15:00:00Z',
    updatedAt: '2025-03-25T10:00:00Z'
  },
  {
    id: 'evt_004',
    title: 'ポートレート撮影会',
    description: '自然光を活用したポートレート撮影の実践講座です。モデルも参加予定！',
    date: '2025-04-25',
    time: '11:00-15:00',
    location: '代々木公園',
    organizer: '高橋 さくら',
    organizerId: 'user_005',
    community: '写真部',
    category: 'workshop',
    capacity: 12,
    attendees: ['user_001', 'user_007', 'user_011'],
    tags: ['ポートレート', '撮影会', '自然光'],
    price: 800,
    status: 'open',
    createdAt: '2025-03-12T12:00:00Z',
    updatedAt: '2025-03-28T16:00:00Z'
  },
  {
    id: 'evt_005',
    title: '映像制作ワークショップ',
    description: 'ショートムービーの企画から撮影、編集までを2日間で学びます。',
    date: '2025-05-10',
    time: '10:00-18:00',
    location: 'スタジオ新宿',
    organizer: '木村 武',
    organizerId: 'user_017',
    community: '映像制作部',
    category: 'workshop',
    capacity: 10,
    attendees: ['user_008', 'user_015'],
    tags: ['映像', 'ワークショップ', '編集'],
    price: 3000,
    status: 'open',
    createdAt: '2025-03-15T10:00:00Z',
    updatedAt: '2025-04-01T09:00:00Z'
  },
  {
    id: 'evt_006',
    title: '写真展「四季の記憶」',
    description: 'メンバーの1年間の作品を展示します。一般公開もあります。',
    date: '2025-05-20',
    time: '10:00-19:00',
    location: 'ギャラリー六本木',
    organizer: '山田 花子',
    organizerId: 'user_001',
    community: '写真部',
    category: 'exhibition',
    capacity: 100,
    attendees: ['user_002', 'user_003', 'user_005', 'user_007', 'user_011'],
    tags: ['写真展', '展示', '四季'],
    price: 0,
    status: 'open',
    createdAt: '2025-03-20T14:00:00Z',
    updatedAt: '2025-04-05T11:00:00Z'
  }
];

/**
 * イベント一覧を取得
 */
export const getEvents = (): Event[] => {
  if (typeof window === 'undefined') return initialEvents;
  
  try {
    const stored = localStorage.getItem(EVENTS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // 初回は初期データを保存
    localStorage.setItem(EVENTS_KEY, JSON.stringify(initialEvents));
    return initialEvents;
  } catch (e) {
    console.error('Failed to get events:', e);
    return initialEvents;
  }
};

/**
 * イベントIDでイベントを取得
 */
export const getEventById = (id: string): Event | null => {
  const events = getEvents();
  return events.find(e => e.id === id) || null;
};

/**
 * ユーザーIDで主催イベントを取得
 */
export const getEventsByOrganizer = (userId: string): Event[] => {
  const events = getEvents();
  return events.filter(e => e.organizerId === userId);
};

/**
 * ユーザーIDで参加予定のイベントを取得
 */
export const getEventsByAttendee = (userId: string): Event[] => {
  const events = getEvents();
  return events.filter(e => e.attendees.includes(userId));
};

/**
 * カテゴリーでイベントをフィルター
 */
export const getEventsByCategory = (category: Event['category']): Event[] => {
  const events = getEvents();
  return events.filter(e => e.category === category);
};

/**
 * ステータスでイベントをフィルター
 */
export const getEventsByStatus = (status: Event['status']): Event[] => {
  const events = getEvents();
  return events.filter(e => e.status === status);
};

/**
 * 新しいイベントを作成
 */
export const createEvent = (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'attendees'>): Event => {
  if (typeof window === 'undefined') throw new Error('Cannot create event on server');
  
  const events = getEvents();
  const newEvent: Event = {
    ...event,
    id: `evt_${Date.now()}`,
    attendees: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  events.push(newEvent);
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  
  return newEvent;
};

/**
 * イベントを更新
 */
export const updateEvent = (id: string, updates: Partial<Event>): Event | null => {
  if (typeof window === 'undefined') throw new Error('Cannot update event on server');
  
  const events = getEvents();
  const index = events.findIndex(e => e.id === id);
  
  if (index === -1) return null;
  
  events[index] = {
    ...events[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  
  return events[index];
};

/**
 * イベントを削除
 */
export const deleteEvent = (id: string): boolean => {
  if (typeof window === 'undefined') throw new Error('Cannot delete event on server');
  
  const events = getEvents();
  const filtered = events.filter(e => e.id !== id);
  
  if (filtered.length === events.length) return false;
  
  localStorage.setItem(EVENTS_KEY, JSON.stringify(filtered));
  
  return true;
};

/**
 * イベントに参加
 */
export const attendEvent = (eventId: string, userId: string): Event | null => {
  if (typeof window === 'undefined') throw new Error('Cannot attend event on server');
  
  const event = getEventById(eventId);
  if (!event) return null;
  
  // すでに参加している場合
  if (event.attendees.includes(userId)) return event;
  
  // 定員チェック
  if (event.attendees.length >= event.capacity) {
    // 満員の場合はステータスを更新
    updateEvent(eventId, { status: 'full' });
    return null;
  }
  
  const updatedEvent = updateEvent(eventId, {
    attendees: [...event.attendees, userId]
  });
  
  // 定員に達した場合はステータスを更新
  if (updatedEvent && updatedEvent.attendees.length >= updatedEvent.capacity) {
    return updateEvent(eventId, { status: 'full' });
  }
  
  return updatedEvent;
};

/**
 * イベント参加をキャンセル
 */
export const cancelAttendance = (eventId: string, userId: string): Event | null => {
  if (typeof window === 'undefined') throw new Error('Cannot cancel attendance on server');
  
  const event = getEventById(eventId);
  if (!event) return null;
  
  const updatedAttendees = event.attendees.filter(id => id !== userId);
  
  // 満員だった場合はステータスを戻す
  const status = event.status === 'full' ? 'open' : event.status;
  
  return updateEvent(eventId, {
    attendees: updatedAttendees,
    status
  });
};

/**
 * ユーザーがイベントに参加しているかチェック
 */
export const isAttending = (eventId: string, userId: string): boolean => {
  const event = getEventById(eventId);
  return event ? event.attendees.includes(userId) : false;
};

/**
 * 日付範囲でイベントをフィルター
 */
export const getEventsByDateRange = (startDate: string, endDate: string): Event[] => {
  const events = getEvents();
  return events.filter(e => e.date >= startDate && e.date <= endDate);
};

/**
 * 今後のイベントを取得
 */
export const getUpcomingEvents = (): Event[] => {
  const events = getEvents();
  const today = new Date().toISOString().split('T')[0];
  return events
    .filter(e => e.date >= today && e.status !== 'cancelled')
    .sort((a, b) => a.date.localeCompare(b.date));
};

/**
 * 過去のイベントを取得
 */
export const getPastEvents = (): Event[] => {
  const events = getEvents();
  const today = new Date().toISOString().split('T')[0];
  return events
    .filter(e => e.date < today)
    .sort((a, b) => b.date.localeCompare(a.date));
};

/**
 * イベントを検索
 */
export const searchEvents = (query: string): Event[] => {
  const events = getEvents();
  const lowerQuery = query.toLowerCase();
  
  return events.filter(e =>
    e.title.toLowerCase().includes(lowerQuery) ||
    e.description.toLowerCase().includes(lowerQuery) ||
    e.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    e.location.toLowerCase().includes(lowerQuery)
  );
};
