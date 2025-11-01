import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
	allowedRoles: string[];
	children: React.ReactNode;
}

export default function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
	const { user, role, loading } = useAuth();

	if (loading) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<p className='text-gray-600 text-lg'>A carregar autenticação...</p>
			</div>
		);
	}

	if (!user) {
		return <Navigate to='/login' replace />;
	}
	const userRole = (role || '').toUpperCase();

	if (allowedRoles && !allowedRoles.includes(userRole || '')) {
		console.warn(`Acesso negado: role atual "${role}", requerido: ${allowedRoles.join(', ')}`);
		return <Navigate to='/dashboard' replace />;
	}

	return children ? <>{children}</> : <Outlet />;
}
