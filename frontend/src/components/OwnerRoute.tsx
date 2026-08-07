import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';

interface OwnerRouteProps {
  children: ReactElement;
}

// Only lets logged in owners (user role) into the wrapped route
function OwnerRoute({ children }: OwnerRouteProps) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  const role = localStorage.getItem('currentuserRole');
  if (role !== 'user') {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default OwnerRoute;
