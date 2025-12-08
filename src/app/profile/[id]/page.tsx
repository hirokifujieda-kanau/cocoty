'use client';

import React, { Suspense, use } from 'react';
import InstagramProfilePage from '@/components/profile/InstagramProfilePage';
import AuthGuard from '@/components/auth/AuthGuard';

interface PageProps {
  params: Promise<{ id: string }>;
}

const OtherUserProfilePage: React.FC<PageProps> = ({ params }) => {
  const { id } = use(params);

  return (
    <AuthGuard requireAuth={true}>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-500">読み込み中...</div>
        </div>
      }>
        <InstagramProfilePage userId={id} />
      </Suspense>
    </AuthGuard>
  );
};

export default OtherUserProfilePage;
