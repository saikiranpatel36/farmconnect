import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';

interface SupplierRouteProps {
  children: ReactElement;
}

// Only lets logged in suppliers (admin role) into the wrapped route
function SupplierRoute({ children }: SupplierRouteProps) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  const role = localStorage.getItem('currentuserRole');
  if (role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default SupplierRoute;
