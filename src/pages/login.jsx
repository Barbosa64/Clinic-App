import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doSignInWithGoogle } from '../lib/firebase';
import { useAuth } from '../contexts/auth';

const Login = () => {
	const { userLoggedIn } = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isSigningIn, setIsSigningIn] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const onSubmit = async e => {
		e.preventDefault();
		if (!isSigningIn) {
			setIsSigningIn(true);
			try {
				await signInWithEmailAndPassword(email, password);
			} catch (error) {
				setErrorMessage(error.message);
				setIsSigningIn(false);
			}
		}
	};

	const onGoogleSignIn = () => {
		setIsSigningIn(true);
		doSignInWithGoogle().catch(error => {
			setErrorMessage(error.message);
			setIsSigningIn(false);
		});
	};

	if (userLoggedIn) return <Navigate to='/home' replace={true} />;

	return (
		<main className='flex items-center justify-center h-screen'>
			<form onSubmit={onSubmit} className='p-6 bg-white rounded shadow-md space-y-4'>
				<h2 className='text-xl font-bold'>Login</h2>
				<input type='email' placeholder='Email' className='border p-2 w-full' value={email} onChange={e => setEmail(e.target.value)} />
				<input type='password' placeholder='Senha' className='border p-2 w-full' value={password} onChange={e => setPassword(e.target.value)} />
				{errorMessage && <p className='text-red-500'>{errorMessage}</p>}
				<button type='submit' className='bg-blue-600 text-white p-2 w-full rounded'>
					Entrar
				</button>
				<button type='button' onClick={onGoogleSignIn} className='bg-red-600 text-white p-2 w-full rounded'>
					Entrar com Google
				</button>
			</form>
		</main>
	);
};

export default Login;
