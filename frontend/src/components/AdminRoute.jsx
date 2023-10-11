import { Navigate, Outlet } from 'react-router-dom';
import { getUserInfo } from '../utils/userHelper';

const AdminRoute = () => {
  const userInfo = getUserInfo();

  if (!userInfo) {
    return <Navigate to='user/signin' replace />;
  }
  if (userInfo.role !== 'admin') {
    return <Navigate to='/' replace />;
  }
  return <Outlet />;
};

export default AdminRoute;
