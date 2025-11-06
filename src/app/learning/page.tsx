import React from 'react';
import MemberLearningProgress from '@/components/learning/MemberLearningProgress';
import { AuthProvider } from '@/contexts/AuthContext';

export default function LearningPage() {
  return (
    <AuthProvider>
      <MemberLearningProgress />
    </AuthProvider>
  );
}
