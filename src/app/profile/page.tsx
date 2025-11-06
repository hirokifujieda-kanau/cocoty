'use client';

import React from 'react';
import InstagramProfilePage from '@/components/profile/InstagramProfilePage';
import { AuthProvider } from '@/contexts/AuthContext';

const Page: React.FC = () => {
  return (
    <AuthProvider>
      <InstagramProfilePage />
    </AuthProvider>
  );
};

export default Page;
