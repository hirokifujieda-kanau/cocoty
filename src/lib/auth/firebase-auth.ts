/**
 * Firebase Authentication Helper Functions
 * Firebase認証の各種機能を提供
 */

import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';

/**
 * メールアドレスとパスワードで新規登録
 */
export const signUp = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error('❌ Firebase signup error:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * メールアドレスとパスワードでログイン
 */
export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error('❌ Firebase signin error:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * ログアウト
 */
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('❌ Firebase logout error:', error);
    throw error;
  }
};

/**
 * メール認証を送信
 */
export const sendVerificationEmail = async (user: User): Promise<void> => {
  try {
    await sendEmailVerification(user);
  } catch (error) {
    console.error('❌ Failed to send verification email:', error);
    throw error;
  }
};

/**
 * パスワードリセットメールを送信
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error('❌ Failed to send password reset email:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * ユーザープロフィールを更新（表示名など）
 */
export const updateUserProfile = async (
  user: User, 
  profile: { displayName?: string; photoURL?: string }
): Promise<void> => {
  try {
    await updateProfile(user, profile);
  } catch (error) {
    console.error('❌ Failed to update user profile:', error);
    throw error;
  }
};

/**
 * Firebaseエラーコードを日本語メッセージに変換
 */
export const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'このメールアドレスは既に使用されています';
    case 'auth/invalid-email':
      return 'メールアドレスの形式が正しくありません';
    case 'auth/operation-not-allowed':
      return 'この操作は許可されていません';
    case 'auth/weak-password':
      return 'パスワードは6文字以上で設定してください';
    case 'auth/user-disabled':
      return 'このアカウントは無効化されています';
    case 'auth/user-not-found':
      return 'ユーザーが見つかりません';
    case 'auth/wrong-password':
      return 'パスワードが間違っています';
    case 'auth/invalid-credential':
      return 'メールアドレスまたはパスワードが間違っています';
    case 'auth/too-many-requests':
      return 'リクエストが多すぎます。しばらく待ってから再試行してください';
    case 'auth/network-request-failed':
      return 'ネットワークエラーが発生しました。接続を確認してください';
    case 'auth/requires-recent-login':
      return 'この操作には再ログインが必要です';
    default:
      return '認証エラーが発生しました';
  }
};
