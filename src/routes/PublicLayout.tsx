import { Outlet } from 'react-router-dom';
import Layout from '../Components/Layout';
import Footer from '../Components/Footer';

export default function PublicLayout() {
  return (
    <Layout>
      <Outlet />
      <Footer />
    </Layout>
  );
}
