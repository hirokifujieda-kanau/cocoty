/**
 * ユーザー設定のモックデータ
 */

export interface UserSettings {
  userId: string;
  
  // アカウント情報
  account: {
    name: string;
    email: string;
    phone: string;
    avatar: string;
  };
  
  // プライバシー設定
  privacy: {
    isPrivateAccount: boolean;
    showActivityStatus: boolean;
    showInSearch: boolean;
    allowTagging: boolean;
  };
  
  // 通知設定
  notifications: {
    likes: boolean;
    comments: boolean;
    followers: boolean;
    messages: boolean;
    learningReminders: boolean;
    emailNotifications: boolean;
  };
  
  // セキュリティ設定
  security: {
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
  };
}

const STORAGE_KEY = 'cocoty_user_settings_v1';

// デフォルト設定
const getDefaultSettings = (userId: string, name: string, email: string, avatar: string): UserSettings => ({
  userId,
  account: {
    name,
    email,
    phone: '090-1234-5678',
    avatar
  },
  privacy: {
    isPrivateAccount: false,
    showActivityStatus: true,
    showInSearch: true,
    allowTagging: true
  },
  notifications: {
    likes: true,
    comments: true,
    followers: true,
    messages: true,
    learningReminders: true,
    emailNotifications: false
  },
  security: {
    twoFactorEnabled: false,
    lastPasswordChange: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString() // 3ヶ月前
  }
});

// 全ユーザーの設定を取得
const getAllSettings = (): { [userId: string]: UserSettings } => {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
  
  return {};
};

// 設定を保存
const saveAllSettings = (settings: { [userId: string]: UserSettings }): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
};

/**
 * ユーザー設定を取得
 */
export const getUserSettings = (userId: string, name: string, email: string, avatar: string): UserSettings => {
  const allSettings = getAllSettings();
  
  if (!allSettings[userId]) {
    // 初回アクセス時はデフォルト設定を作成
    const defaultSettings = getDefaultSettings(userId, name, email, avatar);
    allSettings[userId] = defaultSettings;
    saveAllSettings(allSettings);
    return defaultSettings;
  }
  
  return allSettings[userId];
};

/**
 * アカウント情報を更新
 */
export const updateAccountInfo = (
  userId: string,
  updates: Partial<UserSettings['account']>
): boolean => {
  const allSettings = getAllSettings();
  
  if (!allSettings[userId]) return false;
  
  allSettings[userId].account = {
    ...allSettings[userId].account,
    ...updates
  };
  
  saveAllSettings(allSettings);
  return true;
};

/**
 * プライバシー設定を更新
 */
export const updatePrivacySettings = (
  userId: string,
  updates: Partial<UserSettings['privacy']>
): boolean => {
  const allSettings = getAllSettings();
  
  if (!allSettings[userId]) return false;
  
  allSettings[userId].privacy = {
    ...allSettings[userId].privacy,
    ...updates
  };
  
  saveAllSettings(allSettings);
  return true;
};

/**
 * 通知設定を更新
 */
export const updateNotificationSettings = (
  userId: string,
  updates: Partial<UserSettings['notifications']>
): boolean => {
  const allSettings = getAllSettings();
  
  if (!allSettings[userId]) return false;
  
  allSettings[userId].notifications = {
    ...allSettings[userId].notifications,
    ...updates
  };
  
  saveAllSettings(allSettings);
  return true;
};

/**
 * セキュリティ設定を更新
 */
export const updateSecuritySettings = (
  userId: string,
  updates: Partial<UserSettings['security']>
): boolean => {
  const allSettings = getAllSettings();
  
  if (!allSettings[userId]) return false;
  
  allSettings[userId].security = {
    ...allSettings[userId].security,
    ...updates
  };
  
  saveAllSettings(allSettings);
  return true;
};

/**
 * パスワードを変更
 */
export const changePassword = (
  userId: string,
  currentPassword: string,
  newPassword: string
): { success: boolean; message: string } => {
  // モック実装: 実際にはバックエンドで検証
  if (!currentPassword || !newPassword) {
    return { success: false, message: 'パスワードを入力してください' };
  }
  
  if (newPassword.length < 8) {
    return { success: false, message: 'パスワードは8文字以上で設定してください' };
  }
  
  const allSettings = getAllSettings();
  
  if (!allSettings[userId]) {
    return { success: false, message: 'ユーザーが見つかりません' };
  }
  
  allSettings[userId].security.lastPasswordChange = new Date().toISOString();
  saveAllSettings(allSettings);
  
  return { success: true, message: 'パスワードを変更しました' };
};

/**
 * アカウントを削除
 */
export const deleteAccount = (userId: string, password: string): { success: boolean; message: string } => {
  // モック実装: 実際にはバックエンドで検証
  if (!password) {
    return { success: false, message: 'パスワードを入力してください' };
  }
  
  const allSettings = getAllSettings();
  delete allSettings[userId];
  saveAllSettings(allSettings);
  
  return { success: true, message: 'アカウントを削除しました' };
};
