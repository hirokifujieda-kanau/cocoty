'use client';

import React from 'react';
import BackButton from '@/components/ui/BackButton';
import ProfilePage from '@/components/profile/ProfilePage';

const Page: React.FC = () => {
  return (
    <div className="p-4">
      <BackButton className="mb-4" />
      <ProfilePage />
    </div>
  );
};

export default Page;
