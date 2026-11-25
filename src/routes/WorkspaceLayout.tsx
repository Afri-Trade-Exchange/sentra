import { Outlet } from 'react-router-dom';
import AppShell from '../Components/AppShell';
import ProtectedRoute from '../Components/ProtectedRoute';
import type { UserRole } from '../firebase/authService';

export default function WorkspaceLayout({ requiredRole }: { requiredRole?: UserRole }) {
  return (
    <ProtectedRoute requiredRole={requiredRole}>
      <AppShell>
        <Outlet />
      </AppShell>
    </ProtectedRoute>
  );
}
