import React from 'react';
import MemberLearningProgress from '@/components/learning/MemberLearningProgress';
import { AuthProvider } from '@/context/AuthContext';

export default function LearningPage() {
  return (
    <AuthProvider>
      <MemberLearningProgress />
    </AuthProvider>
  );
}
