import { redirect } from 'next/navigation';

export default function Home() {
  // 認証システム実装前なので、直接プロフィールページへリダイレクト
  redirect('/profile');
}
