'use client';

import React, { Suspense } from 'react';
import InstagramProfilePage from '@/components/profile/InstagramProfilePage';
import AuthGuard from '@/components/auth/AuthGuard';

const Page: React.FC = () => {
  return (
    <AuthGuard requireAuth={true}>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">読み込み中...</div>
      </div>}>
        <InstagramProfilePage />
      </Suspense>
    </AuthGuard>
  );
};

export default Page;
