import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp,
  DocumentSnapshot,
  DocumentData 
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { firestore } from '../firebaseConfig';

// Firestore プロフィールデータの型定義
export interface FirestoreProfile {
  uid: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
  bio?: string;
  website?: string;
  location?: string;
  followers?: number;
  following?: number;
  posts?: number;
  isVerified?: boolean;
  createdAt?: any; // Firestore Timestamp
  updatedAt?: any; // Firestore Timestamp
}

// コレクション名
const PROFILES_COLLECTION = 'profiles';

/**
 * プロフィールを Firestore から取得
 */
export async function getProfile(uid: string): Promise<FirestoreProfile | null> {
  try {
    const docRef = doc(firestore, PROFILES_COLLECTION, uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as FirestoreProfile;
    } else {
      console.log('No profile found for uid:', uid);
      return null;
    }
  } catch (error) {
    console.error('Error getting profile:', error);
    throw error;
  }
}

/**
 * プロフィールを Firestore に保存（新規作成）
 */
export async function createProfile(
  user: User, 
  additionalData: Partial<FirestoreProfile> = {}
): Promise<void> {
  try {
    const docRef = doc(firestore, PROFILES_COLLECTION, user.uid);
    
    const profileData: FirestoreProfile = {
      uid: user.uid,
      displayName: user.displayName || '',
      email: user.email || '',
      photoURL: user.photoURL || '',
      bio: '',
      website: '',
      location: '',
      followers: 0,
      following: 0,
      posts: 0,
      isVerified: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...additionalData
    };

    await setDoc(docRef, profileData);
    console.log('Profile created successfully for uid:', user.uid);
  } catch (error) {
    console.error('Error creating profile:', error);
    throw error;
  }
}

/**
 * プロフィールを Firestore で更新
 */
export async function updateProfile(
  uid: string, 
  updateData: Partial<FirestoreProfile>
): Promise<void> {
  try {
    const docRef = doc(firestore, PROFILES_COLLECTION, uid);
    
    const dataWithTimestamp = {
      ...updateData,
      updatedAt: serverTimestamp()
    };

    await updateDoc(docRef, dataWithTimestamp);
    console.log('Profile updated successfully for uid:', uid);
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}

/**
 * プロフィール画像URLを更新
 */
export async function updateProfilePhoto(uid: string, photoURL: string): Promise<void> {
  try {
    await updateProfile(uid, { photoURL });
    console.log('Profile photo updated successfully for uid:', uid);
  } catch (error) {
    console.error('Error updating profile photo:', error);
    throw error;
  }
}

/**
 * ユーザーが初回ログイン時にプロフィールを確認・作成
 */
export async function ensureProfile(user: User): Promise<FirestoreProfile> {
  try {
    // 既存プロフィールを確認
    const existingProfile = await getProfile(user.uid);
    
    if (existingProfile) {
      // プロフィールが存在する場合、Firebase Auth の情報で更新
      const updatedData: Partial<FirestoreProfile> = {};
      
      if (user.displayName && user.displayName !== existingProfile.displayName) {
        updatedData.displayName = user.displayName;
      }
      if (user.email && user.email !== existingProfile.email) {
        updatedData.email = user.email;
      }
      if (user.photoURL && user.photoURL !== existingProfile.photoURL) {
        updatedData.photoURL = user.photoURL;
      }
      
      // 変更があった場合のみ更新
      if (Object.keys(updatedData).length > 0) {
        await updateProfile(user.uid, updatedData);
        return { ...existingProfile, ...updatedData };
      }
      
      return existingProfile;
    } else {
      // プロフィールが存在しない場合、新規作成
      await createProfile(user);
      const newProfile = await getProfile(user.uid);
      return newProfile!;
    }
  } catch (error) {
    console.error('Error ensuring profile:', error);
    throw error;
  }
}