import React from 'react';
import AdminLearningDashboard from '@/components/learning/AdminLearningDashboard';
import { AuthProvider } from '@/contexts/AuthContext';

export default function AdminLearningPage() {
  return (
    <AuthProvider>
      <AdminLearningDashboard />
    </AuthProvider>
  );
}
