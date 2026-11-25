import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../Components/AuthContext';

export default function AccountLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
