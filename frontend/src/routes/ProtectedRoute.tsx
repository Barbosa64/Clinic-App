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

	// Se não há utilizador autenticado → redireciona para login
	if (!user) {
		return <Navigate to='/login' replace />;
	}

	// Se há restrição de role e o utilizador não tem acesso
	if (allowedRoles && !allowedRoles.includes(role || '')) {
		console.warn(`Acesso negado: role atual "${role}", requerido: ${allowedRoles.join(', ')}`);
		return <Navigate to='/dashboard' replace />;
	}

	// Suporte tanto a children diretos como rotas aninhadas
	return children ? <>{children}</> : <Outlet />;
}
