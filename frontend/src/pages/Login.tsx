import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
	const navigate = useNavigate();
	const { login } = useAuth(); // Função do AuthContext login via API

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		const success = await login(email, password);
		if (success) {
			// Redireciona baseado no role guardado no AuthContext
			navigate('/dashboard');
		} else {
			setError('Email ou senha inválidos');
		}

		setLoading(false);
	};

	return (
		<div className='w-full h-screen flex flex-col md:flex-row'>
			<div className="w-full md:w-1/2 h-64 md:h-full bg-[url('../assets/17818.jpg')] bg-cover bg-center"></div>
			<div className='w-full md:w-1/2 h-full bg-teal-600 flex flex-col p-6 md:p-20 justify-center'>
				<div className='w-full flex flex-col max-w-[450px] mx-auto'>
					<div className='w-full flex flex-col mb-10 text-white'>
						<h3 className='text-lg mb-4'>Bem-vindo à Clínica! Insira seus dados.</h3>
					</div>

					<form onSubmit={handleSubmit} className='w-full flex flex-col mb-6'>
						<input
							type='email'
							placeholder='Email'
							className='w-full bg-transparent text-white text-lg placeholder:text-white border-b border-white py-4 mb-4 outline-none'
							value={email}
							onChange={e => setEmail(e.target.value)}
							required
							autoComplete='email'
						/>
						<input
							type='password'
							placeholder='Senha'
							className='w-full bg-transparent text-lg text-white placeholder:text-white border-b border-white py-4 mb-4 outline-none'
							value={password}
							onChange={e => setPassword(e.target.value)}
							required
							autoComplete='current-password'
						/>

						{error && <div className='text-red-500 mb-4'>{error}</div>}

						<button type='submit' disabled={loading} className='w-full bg-transparent border border-white text-white my-2 font-semibold rounded py-4 mb-4 disabled:opacity-50'>
							Entrar
						</button>
					</form>

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
		</div>
	);
};

export default Login;
