import { useState } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
	const auth = getAuth();
	const navigate = useNavigate();

	const [authing, setAuthing] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const signUpWithGoogle = async () => {
		setAuthing(true);

		signInWithPopup(auth, new GoogleAuthProvider())
			.then(response => {
				console.log(response.user.uid);
				navigate('/');
			})
			.catch(error => {
				console.log(error);
				setAuthing(false);
			});
	};
	// Função para fazer login
	const signUpWithEmail = async () => {
		setAuthing(true);
		setError('');

		signInWithEmailAndPassword(auth, email, password)
			.then(response => {
				console.log(response.user.uid);
				navigate('/');
			})
			.catch(error => {
				console.log(error);
				setError(error.message);
				setAuthing(false);
			});
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
					{/* Inputs */}
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
					{/* Erro mensagem */}
					{error && <div className='text-red-500 mb-4'>{error}</div>}

					<div className='w-full flex flex-col mb-4'>
						<button onClick={signUpWithEmail} disabled={authing} className='w-full bg-transparent border border-white text-white my-2 font-semibold rounded py-4 mb-4 disabled:opacity-50'>
							Entrar com Email e Password
						</button>
					</div>
					<button onClick={signUpWithGoogle} disabled={authing} className='w-full bg-transparent border border-white text-white my-2 font-semibold rounded py-4 mb-4 disabled:opacity-50'>
						Entrar com Google
					</button>
				</div>
				{/* link login page */}
				<div className='w-full flex items-center justify-center mt-10'>
					<p className='text-sm font-normal text-gray-400'>
						Ainda não tem conta?
						<span className='text-white ml-1 cursor-pointer' onClick={() => navigate('/signup')}>
							Entrar
						</span>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Login;
