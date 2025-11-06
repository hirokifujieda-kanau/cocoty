/**
 * 学習コース・レッスン管理システム
 * 動画学習プラットフォームとの連携用
 */

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number; // 分単位
  order: number;
  isRequired: boolean;
  quizId?: string;
  resources: {
    title: string;
    url: string;
    type: 'pdf' | 'link' | 'file';
  }[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: 'photography' | 'editing' | 'business' | 'theory' | 'other';
  level: 'beginner' | 'intermediate' | 'advanced';
  instructor: string;
  thumbnailUrl: string;
  lessons: Lesson[];
  totalDuration: number; // 分単位
  isRequired: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserCourseProgress {
  userId: string;
  courseId: string;
  enrolledAt: string;
  lastAccessedAt: string;
  completedLessons: string[]; // lesson IDs
  currentLessonId: string | null;
  progress: number; // 0-100
  totalTimeSpent: number; // 分単位
  isCompleted: boolean;
  completedAt?: string;
  certificate?: string; // 修了証URL
}

const COURSES_STORAGE_KEY = 'cocoty_courses_v1';
const PROGRESS_STORAGE_KEY = 'cocoty_course_progress_v1';

// サンプルコースデータ
const initialCourses: Course[] = [
  {
    id: 'course-photo-basics',
    title: '写真撮影基礎コース',
    description: 'カメラの使い方から構図、光の使い方まで、写真撮影の基本を学びます',
    category: 'photography',
    level: 'beginner',
    instructor: '山田太郎',
    thumbnailUrl: 'https://via.placeholder.com/400x250/4F46E5/ffffff?text=Photo+Basics',
    totalDuration: 180,
    isRequired: true,
    tags: ['カメラ', '構図', '光', '基礎'],
    lessons: [
      {
        id: 'lesson-1',
        title: 'カメラの基本操作',
        description: '絞り、シャッタースピード、ISO感度の理解',
        videoUrl: 'https://example.com/video/photo-basics-1',
        duration: 30,
        order: 1,
        isRequired: true,
        resources: [
          {
            title: 'カメラ設定チートシート',
            url: 'https://example.com/resources/camera-settings.pdf',
            type: 'pdf'
          }
        ]
      },
      {
        id: 'lesson-2',
        title: '光の使い方とホワイトバランス',
        description: '自然光と人工光の特性、ホワイトバランスの調整方法',
        videoUrl: 'https://example.com/video/photo-basics-2',
        duration: 35,
        order: 2,
        isRequired: true,
        quizId: 'quiz-light-wb',
        resources: []
      },
      {
        id: 'lesson-3',
        title: '構図の基本ルール',
        description: '三分割法、対角線構図、シンメトリーなど',
        videoUrl: 'https://example.com/video/photo-basics-3',
        duration: 40,
        order: 3,
        isRequired: true,
        resources: [
          {
            title: '構図ガイド',
            url: 'https://example.com/resources/composition-guide.pdf',
            type: 'pdf'
          }
        ]
      },
      {
        id: 'lesson-4',
        title: '被写体の選び方と撮影実践',
        description: '実際の撮影シーンでの応用テクニック',
        videoUrl: 'https://example.com/video/photo-basics-4',
        duration: 45,
        order: 4,
        isRequired: false,
        resources: []
      },
      {
        id: 'lesson-5',
        title: '総合演習: 課題撮影',
        description: '学んだ技術を使って実際に撮影',
        videoUrl: 'https://example.com/video/photo-basics-5',
        duration: 30,
        order: 5,
        isRequired: true,
        quizId: 'quiz-final-basics',
        resources: []
      }
    ],
    createdAt: '2024-10-01T00:00:00Z',
    updatedAt: '2024-10-15T12:00:00Z'
  },
  {
    id: 'course-editing',
    title: 'Lightroom編集マスターコース',
    description: 'Adobe Lightroomを使った写真編集の基礎から応用まで',
    category: 'editing',
    level: 'intermediate',
    instructor: '佐藤花子',
    thumbnailUrl: 'https://via.placeholder.com/400x250/EC4899/ffffff?text=Lightroom',
    totalDuration: 240,
    isRequired: false,
    tags: ['Lightroom', '編集', 'RAW現像', '色調整'],
    lessons: [
      {
        id: 'lesson-lr-1',
        title: 'Lightroomの基本操作',
        description: 'インターフェースとカタログの使い方',
        videoUrl: 'https://example.com/video/lightroom-1',
        duration: 25,
        order: 1,
        isRequired: true,
        resources: [
          {
            title: 'Lightroom初期設定ガイド',
            url: 'https://example.com/resources/lr-setup.pdf',
            type: 'pdf'
          }
        ]
      },
      {
        id: 'lesson-lr-2',
        title: 'RAW現像の基礎',
        description: '露出、コントラスト、彩度の調整',
        videoUrl: 'https://example.com/video/lightroom-2',
        duration: 40,
        order: 2,
        isRequired: true,
        resources: []
      },
      {
        id: 'lesson-lr-3',
        title: '色調補正とトーンカーブ',
        description: '高度な色調整テクニック',
        videoUrl: 'https://example.com/video/lightroom-3',
        duration: 50,
        order: 3,
        isRequired: true,
        quizId: 'quiz-color-correction',
        resources: []
      },
      {
        id: 'lesson-lr-4',
        title: '部分補正とブラシツール',
        description: '特定の部分だけを調整する方法',
        videoUrl: 'https://example.com/video/lightroom-4',
        duration: 45,
        order: 4,
        isRequired: false,
        resources: []
      },
      {
        id: 'lesson-lr-5',
        title: 'プリセットの作成と活用',
        description: '効率的な編集ワークフロー',
        videoUrl: 'https://example.com/video/lightroom-5',
        duration: 35,
        order: 5,
        isRequired: false,
        resources: [
          {
            title: 'プリセットパック',
            url: 'https://example.com/resources/presets.zip',
            type: 'file'
          }
        ]
      },
      {
        id: 'lesson-lr-6',
        title: '書き出しと共有',
        description: 'Web用・印刷用の最適な設定',
        videoUrl: 'https://example.com/video/lightroom-6',
        duration: 25,
        order: 6,
        isRequired: true,
        resources: []
      },
      {
        id: 'lesson-lr-7',
        title: '実践: ポートレート編集',
        description: '人物写真の編集テクニック',
        videoUrl: 'https://example.com/video/lightroom-7',
        duration: 20,
        order: 7,
        isRequired: false,
        quizId: 'quiz-portrait-editing',
        resources: []
      }
    ],
    createdAt: '2024-10-05T00:00:00Z',
    updatedAt: '2024-10-20T15:00:00Z'
  },
  {
    id: 'course-business',
    title: '写真家のためのビジネス講座',
    description: 'フリーランス写真家として活動するためのビジネススキル',
    category: 'business',
    level: 'advanced',
    instructor: '鈴木一郎',
    thumbnailUrl: 'https://via.placeholder.com/400x250/10B981/ffffff?text=Business',
    totalDuration: 150,
    isRequired: false,
    tags: ['ビジネス', '営業', '価格設定', 'ポートフォリオ'],
    lessons: [
      {
        id: 'lesson-biz-1',
        title: 'ポートフォリオの作り方',
        description: '魅力的な作品集の構成方法',
        videoUrl: 'https://example.com/video/business-1',
        duration: 30,
        order: 1,
        isRequired: true,
        resources: []
      },
      {
        id: 'lesson-biz-2',
        title: '価格設定の考え方',
        description: '適正価格の決め方と交渉術',
        videoUrl: 'https://example.com/video/business-2',
        duration: 35,
        order: 2,
        isRequired: true,
        resources: [
          {
            title: '価格設定シート',
            url: 'https://example.com/resources/pricing-sheet.xlsx',
            type: 'file'
          }
        ]
      },
      {
        id: 'lesson-biz-3',
        title: 'クライアントとのコミュニケーション',
        description: 'ヒアリングと提案の技術',
        videoUrl: 'https://example.com/video/business-3',
        duration: 40,
        order: 3,
        isRequired: true,
        resources: []
      },
      {
        id: 'lesson-biz-4',
        title: 'SNSマーケティング',
        description: 'InstagramやTwitterでの集客方法',
        videoUrl: 'https://example.com/video/business-4',
        duration: 45,
        order: 4,
        isRequired: false,
        quizId: 'quiz-sns-marketing',
        resources: []
      }
    ],
    createdAt: '2024-10-10T00:00:00Z',
    updatedAt: '2024-10-25T10:00:00Z'
  }
];

// 初期進捗データ
const initialProgress: UserCourseProgress[] = [
  {
    userId: 'user-1',
    courseId: 'course-photo-basics',
    enrolledAt: '2024-11-01T09:00:00Z',
    lastAccessedAt: '2024-11-05T14:20:00Z',
    completedLessons: ['lesson-1'],
    currentLessonId: 'lesson-2',
    progress: 40, // 5レッスン中2レッスン目まで進行
    totalTimeSpent: 70,
    isCompleted: false
  }
];

// コース取得
export const getCourses = (): Course[] => {
  if (typeof window === 'undefined') return initialCourses;
  
  const stored = localStorage.getItem(COURSES_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(initialCourses));
    return initialCourses;
  }
  
  return JSON.parse(stored);
};

// 進捗データ取得
export const getCourseProgress = (): UserCourseProgress[] => {
  if (typeof window === 'undefined') return initialProgress;
  
  const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(initialProgress));
    return initialProgress;
  }
  
  return JSON.parse(stored);
};

// ユーザーの進捗取得
export const getUserCourseProgress = (userId: string): UserCourseProgress[] => {
  return getCourseProgress().filter(p => p.userId === userId);
};

// 特定コースの進捗取得
export const getUserProgressForCourse = (userId: string, courseId: string): UserCourseProgress | null => {
  const progress = getCourseProgress();
  return progress.find(p => p.userId === userId && p.courseId === courseId) || null;
};

// コース登録
export const enrollCourse = (userId: string, courseId: string): UserCourseProgress => {
  const progress = getCourseProgress();
  const course = getCourses().find(c => c.id === courseId);
  
  if (!course) throw new Error('Course not found');
  
  const newProgress: UserCourseProgress = {
    userId,
    courseId,
    enrolledAt: new Date().toISOString(),
    lastAccessedAt: new Date().toISOString(),
    completedLessons: [],
    currentLessonId: course.lessons[0]?.id || null,
    progress: 0,
    totalTimeSpent: 0,
    isCompleted: false
  };
  
  progress.push(newProgress);
  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  
  return newProgress;
};

// レッスン完了
export const completeLesson = (userId: string, courseId: string, lessonId: string, timeSpent: number): UserCourseProgress | null => {
  const progress = getCourseProgress();
  const index = progress.findIndex(p => p.userId === userId && p.courseId === courseId);
  
  if (index === -1) return null;
  
  const course = getCourses().find(c => c.id === courseId);
  if (!course) return null;
  
  // レッスンを完了済みに追加
  if (!progress[index].completedLessons.includes(lessonId)) {
    progress[index].completedLessons.push(lessonId);
  }
  
  // 進捗率計算
  const totalLessons = course.lessons.length;
  const completedCount = progress[index].completedLessons.length;
  progress[index].progress = Math.round((completedCount / totalLessons) * 100);
  
  // 時間を追加
  progress[index].totalTimeSpent += timeSpent;
  progress[index].lastAccessedAt = new Date().toISOString();
  
  // 次のレッスンを設定
  const currentLessonIndex = course.lessons.findIndex(l => l.id === lessonId);
  if (currentLessonIndex < course.lessons.length - 1) {
    progress[index].currentLessonId = course.lessons[currentLessonIndex + 1].id;
  } else {
    progress[index].currentLessonId = null;
  }
  
  // 全レッスン完了チェック
  if (completedCount === totalLessons) {
    progress[index].isCompleted = true;
    progress[index].completedAt = new Date().toISOString();
  }
  
  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  
  return progress[index];
};

// 進捗更新（動画視聴時間など）
export const updateCourseProgress = (userId: string, courseId: string, lessonId: string, timeSpent: number): void => {
  const progress = getCourseProgress();
  const index = progress.findIndex(p => p.userId === userId && p.courseId === courseId);
  
  if (index === -1) return;
  
  progress[index].currentLessonId = lessonId;
  progress[index].totalTimeSpent += timeSpent;
  progress[index].lastAccessedAt = new Date().toISOString();
  
  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
};

// カテゴリ別コース取得
export const getCoursesByCategory = (category: Course['category']): Course[] => {
  return getCourses().filter(c => c.category === category);
};

// レベル別コース取得
export const getCoursesByLevel = (level: Course['level']): Course[] => {
  return getCourses().filter(c => c.level === level);
};

// 必須コース取得
export const getRequiredCourses = (): Course[] => {
  return getCourses().filter(c => c.isRequired);
};

// コース検索
export const searchCourses = (query: string): Course[] => {
  const courses = getCourses();
  const lowerQuery = query.toLowerCase();
  
  return courses.filter(course =>
    course.title.toLowerCase().includes(lowerQuery) ||
    course.description.toLowerCase().includes(lowerQuery) ||
    course.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

// 管理者用: 全ユーザーの進捗取得
export const getAllUserProgress = (): UserCourseProgress[] => {
  return getCourseProgress();
};

// 管理者用: コース別完了率
export const getCourseCompletionStats = (courseId: string): {
  totalEnrolled: number;
  completed: number;
  inProgress: number;
  averageProgress: number;
} => {
  const progress = getCourseProgress().filter(p => p.courseId === courseId);
  const completed = progress.filter(p => p.isCompleted).length;
  const inProgress = progress.filter(p => !p.isCompleted).length;
  const averageProgress = progress.length > 0
    ? Math.round(progress.reduce((sum, p) => sum + p.progress, 0) / progress.length)
    : 0;
  
  return {
    totalEnrolled: progress.length,
    completed,
    inProgress,
    averageProgress
  };
};
