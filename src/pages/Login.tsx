import { useState } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

const Login = () => {
	const auth = getAuth();
	const navigate = useNavigate();
	const { setUser, setRole } = useAuth();

	const [authing, setAuthing] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const loginWithEmail = async () => {
		setAuthing(true);
		setError('');

		try {
			const { user } = await signInWithEmailAndPassword(auth, email, password);

			const docRef = doc(db, 'users', user.uid);
			const userDoc = await getDoc(docRef);

			if (!userDoc.exists()) {
				throw new Error('Perfil de utilizador não encontrado');
			}

			const userData = userDoc.data();
			const role = userData.role;

			setUser(user);
			setRole(role);

			if (role === 'patient') {
				navigate(`/dashboard/${user.uid}`);
			} else if (role === 'doctor') {
				navigate('/agenda');
			} else if (role === 'admin') {
				navigate('/dashboard');
			} else {
				throw new Error('Tipo de utilizador desconhecido.');
			}
		} catch (error: any) {
			console.error(error);
			setError(error.message);
		} finally {
			setAuthing(false);
		}
	};

	const loginWithGoogle = async () => {
		setAuthing(true);
		setError('');

		try {
			const response = await signInWithPopup(auth, new GoogleAuthProvider());
			const uid = response.user.uid;

			const userRef = doc(db, 'users', uid);
			const userSnap = await getDoc(userRef);

			if (!userSnap.exists()) {
				throw new Error('Perfil de utilizador não encontrado');
			}

			const userData = userSnap.data();
			const role = userData.role;

			setUser(response.user);
			setRole(role);

			if (role === 'patient') {
				navigate(`/pacientes/${uid}`);
			} else if (role === 'doctor') {
				navigate('/agenda');
			} else if (role === 'admin') {
				navigate('/dashboard');
			} else {
				throw new Error('Tipo de utilizador desconhecido.');
			}
		} catch (error: any) {
			console.log(error);
			setError(error.message);
		} finally {
			setAuthing(false);
		}
	};

	return (
		<div className='w-full h-screen flex'>
			<div className="w-1/2 h-full flex flex-col items-center justify-center bg-[url('../assets/17818.jpg')] bg-cover bg-center"></div>
			<div className='w-1/2 h-full bg-teal-600 flex flex-col p-20 justify-center'>
				<div className='w-full flex flex-col max-w-[450px] mx-auto'>
					<div className='w-full flex flex-col mb-10 text-white'>
						<h3 className='text-lg mb-4'>Bem vindo à Clinica*! Por favor insira os seus dados para começar.</h3>
					</div>
					<form
						onSubmit={e => {
							e.preventDefault();
							loginWithEmail();
						}}
						className='w-full flex flex-col mb-6'
					>
						<input
							type='email'
							autoComplete='email'
							placeholder='Email'
							className='w-full bg-transparent text-white text-lg placeholder:text-white border-b border-white py-4 mb-4 outline-none'
							value={email}
							onChange={e => setEmail(e.target.value)}
							required
						/>
						<input
							type='password'
							autoComplete='current-password'
							placeholder='Senha'
							className='w-full bg-transparent text-lg text-white placeholder:text-white border-b border-white py-4 mb-4 outline-none'
							value={password}
							onChange={e => setPassword(e.target.value)}
							required
						/>

						{error && <div className='text-red-500 mb-4'>{error}</div>}

						<div className='w-full flex flex-col mb-4'>
							<button type='submit' disabled={authing} className='w-full bg-transparent border border-white text-white my-2 font-semibold rounded py-4 mb-4 disabled:opacity-50'>
								Entrar com Email e Password
							</button>
						</div>
					</form>

					<button onClick={loginWithGoogle} disabled={authing} className='w-full bg-transparent border border-white text-white my-2 font-semibold rounded py-4 mb-4 disabled:opacity-50'>
						Entrar com Google
					</button>
				</div>

				<div className='w-full flex items-center justify-center mt-10'>
					<p className='text-sm font-normal text-gray-800'>
						Ainda não tem conta?
						<span className='text-white ml-1 cursor-pointer' onClick={() => navigate('/signup')}>
							Criar
						</span>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Login;
