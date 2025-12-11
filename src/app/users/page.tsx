import { UserListPage } from '@/components/users/UserListPage';
import AuthGuard from '@/components/auth/AuthGuard';

export default function UsersPage() {
  return (
    <AuthGuard requireAuth={true}>
      <UserListPage />
    </AuthGuard>
  );
}
