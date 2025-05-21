import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type Props = {
	children: JSX.Element;
	allowedRoles: string[];
};

export default function ProtectedRoute({ children, allowedRoles }: Props) {
	const { user, role } = useAuth();

	if (!user) return <Navigate to='/login' replace />;
	if (!allowedRoles.includes(role || '')) return <Navigate to='/login' replace />;

	return children;
}

/* import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
	children: JSX.Element;
	requiredRole: 'admin' | 'client' | 'doctor';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
	const { user, role, loading } = useAuth();

	if (loading) return <p>Loading...</p>;

	if (!user || role !== requiredRole) {
		return <Navigate to='/login' replace />;
	}

	return children;
}
*/
