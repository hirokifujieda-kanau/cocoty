'use client';

import React, { Suspense } from 'react';
import InstagramProfilePage from '@/components/profile/InstagramProfilePage';
import { AuthProvider } from '@/contexts/AuthContext';

const Page: React.FC = () => {
  return (
    <AuthProvider>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">読み込み中...</div>
      </div>}>
        <InstagramProfilePage />
      </Suspense>
    </AuthProvider>
  );
};

export default Page;
