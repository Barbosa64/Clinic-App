import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export interface IAuthRouteProps {
	children: React.ReactNode;
}

const AuthRoute: React.FunctionComponent<IAuthRouteProps> = props => {
	const { children } = props;
	const auth = getAuth();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, user => {
			if (user) {
				setLoading(false);
			} else {
				console.log('not logged in');
				setLoading(false);
				navigate('/login');
			}
		});
		return () => unsubscribe();
	}, [auth, navigate]);
	if (loading) return <p>A carregar...</p>;
	return <div> {children}</div>;
};

export default AuthRoute;
