import { Navigate, Outlet } from 'react-router-dom';
import { getUserInfo } from '../utils/userHelper';

const UserRoute = () => {
  const userInfo = getUserInfo();

  if (!userInfo) {
    return <Navigate to='/' replace />;
  }

  return <Outlet />;
};

export default UserRoute;
