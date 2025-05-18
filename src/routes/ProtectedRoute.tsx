import { Navigate } from 'react-router-dom';
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
