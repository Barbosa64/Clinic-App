import { useState } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase'; // certifique-se de importar seu db corretamente
import { useAuth } from '../context/AuthContext';

const Login = () => {
	const auth = getAuth();
	const navigate = useNavigate();
	const { setUser, setRole } = useAuth(); // Contexto de autenticação

	const [authing, setAuthing] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const fetchUserRole = async (uid: string) => {
		const userRef = doc(db, 'users', uid);
		const userSnap = await getDoc(userRef);
		if (userSnap.exists()) {
			const data = userSnap.data();
			setRole(data.role);
		} else {
			throw new Error('Perfil de usuário não encontrado');
		}
	};

	const loginWithGoogle = async () => {
		setAuthing(true);
		setError('');

		try {
			const response = await signInWithPopup(auth, new GoogleAuthProvider());
			const uid = response.user.uid;
			setUser(response.user);
			await fetchUserRole(uid);
			navigate('/');
		} catch (error: any) {
			console.log(error);
			setError(error.message);
		} finally {
			setAuthing(false);
		}
	};

	const loginWithEmail = async () => {
		setAuthing(true);
		setError('');

		try {
			const { user } = await signInWithEmailAndPassword(auth, email, password);

			// Verifica/cria perfil
			const docRef = doc(db, 'users', user.uid);
			await getDoc(docRef);

			navigate('/');
		} catch (error: any) {
			console.error(error);
			setError(error.message);
			setAuthing(false);
		}
	};

	return (
		<div className='w-full h-screen flex'>
			{/* Left Section */}
			<div className='w-1/2 h-full flex flex-col bg-[#282c34]' items-center justify-center></div>

			<div className='w-1/2 h-full bg-[#1a1a1a] flex flex-col p-20 justify-center'>
				<div className='w-full flex flex-col max-w-[450px] mx-auto'>
					<div className='w-full flex flex-col mb-10 text-white'>
						<h3 className='text-lg mb-4'>Bem vindo! Por favor insira seus dados para começar.</h3>
					</div>

					<div className='w-full flex flex-col mb-6'>
						<input
							type='email'
							placeholder='Email'
							className='w-full bg-transparent text-lg placeholder:text-white border-b border-white py-4 mb-4 outline-none'
							value={email}
							onChange={e => setEmail(e.target.value)}
						/>
						<input
							type='password'
							placeholder='Senha'
							className='w-full bg-transparent text-lg placeholder:text-white border-b border-white py-4 mb-4 outline-none'
							value={password}
							onChange={e => setPassword(e.target.value)}
						/>
					</div>

					{error && <div className='text-red-500 mb-4'>{error}</div>}

					<div className='w-full flex flex-col mb-4'>
						<button onClick={loginWithEmail} disabled={authing} className='w-full bg-transparent border border-white text-white my-2 font-semibold rounded py-4 mb-4 disabled:opacity-50'>
							Entrar com Email e Password
						</button>
					</div>

					<button onClick={loginWithGoogle} disabled={authing} className='w-full bg-transparent border border-white text-white my-2 font-semibold rounded py-4 mb-4 disabled:opacity-50'>
						Entrar com Google
					</button>
				</div>

				<div className='w-full flex items-center justify-center mt-10'>
					<p className='text-sm font-normal text-gray-400'>
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
