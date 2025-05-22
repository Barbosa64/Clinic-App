import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type Props = {
	children: JSX.Element;
	allowedRoles: string[];
};

export default function ProtectedRoute({ children, allowedRoles }: Props) {
	// 'loading'
	const authContext = useAuth();

	if (!authContext) {
		return <Navigate to='/login' replace />;
	}

	const { user, role, loading } = authContext;

	// Se estiver a carregar, mostra uma mensagem ou retorna null para não renderizar nada
	if (loading) {
		return <p>A carregar autenticação...</p>;
	}

	if (!user) {
		return <Navigate to='/login' replace />;
	}

	if (!allowedRoles.includes(role || '')) {
		console.warn(`Acesso negado para o role: ${role}. Rota requer: ${allowedRoles.join(', ')}`);
		return <Navigate to='/' replace />; // Ou '/login' ou uma página de 'acesso negado'
	}

	return children;
}
