/**
 * 学習タスク・TODO管理システム
 * 動画学習サイトとの連携を想定した進捗管理
 */

export interface LearningTask {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: 'video-learning' | 'assignment' | 'event' | 'practice' | 'other';
  status: 'not-started' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  dueDate: string | null;
  courseId?: string; // 関連する学習コースID
  lessonId?: string; // 関連するレッスンID
  videoUrl?: string; // 動画URL
  progress: number; // 0-100
  timeSpent: number; // 分単位
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  assignedBy?: string; // 管理者が割り当てた場合
  tags: string[];
  notes: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  overdue: number;
  completionRate: number;
}

const STORAGE_KEY = 'cocoty_learning_tasks_v1';

// サンプルタスクデータ
const initialTasks: LearningTask[] = [
  {
    id: 'task-1',
    userId: 'user-1',
    title: '写真撮影基礎コース - レッスン1',
    description: '基本的なカメラの使い方と構図の基礎を学ぶ',
    category: 'video-learning',
    status: 'completed',
    priority: 'high',
    dueDate: '2024-11-10',
    courseId: 'course-photo-basics',
    lessonId: 'lesson-1',
    videoUrl: 'https://example.com/video/1',
    progress: 100,
    timeSpent: 45,
    completedAt: '2024-11-03T10:30:00Z',
    createdAt: '2024-11-01T09:00:00Z',
    updatedAt: '2024-11-03T10:30:00Z',
    assignedBy: 'admin-1',
    tags: ['写真', '基礎', '必須'],
    notes: '理解度チェックテスト: 90点'
  },
  {
    id: 'task-2',
    userId: 'user-1',
    title: '写真撮影基礎コース - レッスン2',
    description: '光の使い方とホワイトバランスの調整',
    category: 'video-learning',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2024-11-12',
    courseId: 'course-photo-basics',
    lessonId: 'lesson-2',
    videoUrl: 'https://example.com/video/2',
    progress: 60,
    timeSpent: 25,
    createdAt: '2024-11-01T09:00:00Z',
    updatedAt: '2024-11-05T14:20:00Z',
    assignedBy: 'admin-1',
    tags: ['写真', '基礎', '必須'],
    notes: ''
  },
  {
    id: 'task-3',
    userId: 'user-1',
    title: '月例撮影課題: 季節の風景',
    description: '秋の風景を撮影して提出',
    category: 'assignment',
    status: 'in-progress',
    priority: 'medium',
    dueDate: '2024-11-15',
    progress: 30,
    timeSpent: 120,
    createdAt: '2024-11-01T09:00:00Z',
    updatedAt: '2024-11-04T16:00:00Z',
    assignedBy: 'admin-1',
    tags: ['課題', '撮影'],
    notes: 'ロケハン完了、撮影予定: 11/10'
  },
  {
    id: 'task-4',
    userId: 'user-1',
    title: '写真展イベント準備',
    description: '展示作品の選定と準備',
    category: 'event',
    status: 'not-started',
    priority: 'high',
    dueDate: '2024-11-20',
    progress: 0,
    timeSpent: 0,
    createdAt: '2024-11-02T10:00:00Z',
    updatedAt: '2024-11-02T10:00:00Z',
    tags: ['イベント', '展示'],
    notes: ''
  },
  {
    id: 'task-5',
    userId: 'user-1',
    title: 'Lightroom編集スキル習得',
    description: 'RAW現像と色調整の基礎',
    category: 'video-learning',
    status: 'not-started',
    priority: 'medium',
    dueDate: '2024-11-25',
    courseId: 'course-editing',
    lessonId: 'lesson-1',
    videoUrl: 'https://example.com/video/3',
    progress: 0,
    timeSpent: 0,
    createdAt: '2024-11-03T11:00:00Z',
    updatedAt: '2024-11-03T11:00:00Z',
    assignedBy: 'admin-1',
    tags: ['編集', '動画学習'],
    notes: ''
  },
  {
    id: 'task-6',
    userId: 'user-1',
    title: '週3回の写真投稿',
    description: 'SNSに作品を定期的に投稿',
    category: 'practice',
    status: 'in-progress',
    priority: 'low',
    dueDate: '2024-11-30',
    progress: 40,
    timeSpent: 60,
    createdAt: '2024-11-01T09:00:00Z',
    updatedAt: '2024-11-05T08:00:00Z',
    tags: ['継続', '投稿'],
    notes: '今週は2回投稿済み'
  }
];

// ローカルストレージからタスクを取得
export const getTasks = (): LearningTask[] => {
  if (typeof window === 'undefined') return initialTasks;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTasks));
    return initialTasks;
  }
  
  return JSON.parse(stored);
};

// ユーザーのタスクを取得
export const getUserTasks = (userId: string): LearningTask[] => {
  return getTasks().filter(task => task.userId === userId);
};

// タスク統計を取得
export const getTaskStats = (userId: string): TaskStats => {
  const tasks = getUserTasks(userId);
  const completed = tasks.filter(t => t.status === 'completed').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  
  // 期限切れチェック
  const overdue = tasks.filter(t => {
    if (!t.dueDate || t.status === 'completed') return false;
    return new Date(t.dueDate) < new Date();
  }).length;
  
  return {
    total: tasks.length,
    completed,
    inProgress,
    overdue,
    completionRate: tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0
  };
};

// カテゴリ別タスク取得
export const getTasksByCategory = (userId: string, category: LearningTask['category']): LearningTask[] => {
  return getUserTasks(userId).filter(task => task.category === category);
};

// ステータス別タスク取得
export const getTasksByStatus = (userId: string, status: LearningTask['status']): LearningTask[] => {
  return getUserTasks(userId).filter(task => task.status === status);
};

// 期限が近いタスク取得（7日以内）
export const getUpcomingTasks = (userId: string): LearningTask[] => {
  const tasks = getUserTasks(userId);
  const sevenDaysLater = new Date();
  sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
  
  return tasks.filter(task => {
    if (!task.dueDate || task.status === 'completed') return false;
    const dueDate = new Date(task.dueDate);
    return dueDate <= sevenDaysLater && dueDate >= new Date();
  });
};

// タスク作成
export const createTask = (task: Omit<LearningTask, 'id' | 'createdAt' | 'updatedAt'>): LearningTask => {
  const tasks = getTasks();
  const newTask: LearningTask = {
    ...task,
    id: `task-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  tasks.push(newTask);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  
  return newTask;
};

// タスク更新
export const updateTask = (taskId: string, updates: Partial<LearningTask>): LearningTask | null => {
  const tasks = getTasks();
  const index = tasks.findIndex(t => t.id === taskId);
  
  if (index === -1) return null;
  
  tasks[index] = {
    ...tasks[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  
  return tasks[index];
};

// 進捗更新
export const updateProgress = (taskId: string, progress: number, timeSpent?: number): LearningTask | null => {
  const updates: Partial<LearningTask> = { progress };
  
  if (timeSpent !== undefined) {
    const task = getTasks().find(t => t.id === taskId);
    if (task) {
      updates.timeSpent = task.timeSpent + timeSpent;
    }
  }
  
  // 100%になったら完了に
  if (progress >= 100) {
    updates.status = 'completed';
    updates.completedAt = new Date().toISOString();
  } else if (progress > 0) {
    updates.status = 'in-progress';
  }
  
  return updateTask(taskId, updates);
};

// タスク完了
export const completeTask = (taskId: string): LearningTask | null => {
  return updateTask(taskId, {
    status: 'completed',
    progress: 100,
    completedAt: new Date().toISOString()
  });
};

// タスク削除
export const deleteTask = (taskId: string): boolean => {
  const tasks = getTasks();
  const filtered = tasks.filter(t => t.id !== taskId);
  
  if (filtered.length === tasks.length) return false;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
};

// 管理者用: 全ユーザーのタスクを取得
export const getAllTasks = (): LearningTask[] => {
  return getTasks();
};

// 管理者用: ユーザー別の統計
export const getAllUserStats = (): { [userId: string]: TaskStats } => {
  const tasks = getTasks();
  const userIds = Array.from(new Set(tasks.map(t => t.userId)));
  
  const stats: { [userId: string]: TaskStats } = {};
  userIds.forEach(userId => {
    stats[userId] = getTaskStats(userId);
  });
  
  return stats;
};

// タスク検索
export const searchTasks = (userId: string, query: string): LearningTask[] => {
  const tasks = getUserTasks(userId);
  const lowerQuery = query.toLowerCase();
  
  return tasks.filter(task =>
    task.title.toLowerCase().includes(lowerQuery) ||
    task.description.toLowerCase().includes(lowerQuery) ||
    task.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

// 期限切れステータス更新
export const updateOverdueTasks = (userId: string): void => {
  const tasks = getUserTasks(userId);
  const now = new Date();
  
  tasks.forEach(task => {
    if (task.dueDate && task.status !== 'completed') {
      const dueDate = new Date(task.dueDate);
      if (dueDate < now && task.status !== 'overdue') {
        updateTask(task.id, { status: 'overdue' });
      }
    }
  });
};
