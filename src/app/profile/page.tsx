'use client';

import React, { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import InstagramProfilePage from '@/components/profile/InstagramProfilePage';
import { useAuth } from '@/contexts/AuthContext';

const Page: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
      <div className="text-gray-500">読み込み中...</div>
    </div>}>
      <InstagramProfilePage />
    </Suspense>
  );
};

export default Page;
