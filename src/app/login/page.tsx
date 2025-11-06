import React from 'react';
import LoginPage from '@/components/auth/LoginPage';
import { AuthProvider } from '@/contexts/AuthContext';

export default function Login() {
  return (
    <AuthProvider>
      <LoginPage />
    </AuthProvider>
  );
}
