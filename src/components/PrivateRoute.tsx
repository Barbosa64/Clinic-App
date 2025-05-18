import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebase';

export default function PrivateRoute({ children }: { children: JSX.Element }) {
	const [user, loading] = useAuthState(auth);

	if (loading) return <p>A carregar...</p>;
	if (!user) return <Navigate to='/login' />;

	return children;
}
