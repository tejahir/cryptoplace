import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContextValue';

const ProtectedRoute = () => {
  const { isAuthenticated, isInitializing } = useContext(AuthContext);
  const location = useLocation();

  if (isInitializing) {
    return (
      <section className='auth-guard'>
        <div className='spin' />
      </section>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to='/signin' replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
