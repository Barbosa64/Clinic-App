import { useState } from 'react';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';

const Signup = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [role, setRole] = useState<'admin' | 'doctor' | 'patient'>('patient');
	const [error, setError] = useState('');
	const navigate = useNavigate();
	const auth = getAuth();

	const handleSignup = async () => {
		setError('');
		try {
			const { user } = await createUserWithEmailAndPassword(auth, email, password);

			await setDoc(doc(db, 'users', user.uid), {
				UID: user.uid,
				role: role,
			});

			navigate('/');
		} catch (err: any) {
			setError(err.message);
		}
	};

	return (
		<div className='w-full h-screen flex'>
			{/* Seção Esquerda (ilustração ou cor de fundo) */}
			<div className='w-1/2 h-full flex flex-col bg-[#282c34]' items-center justify-center></div>

			{/* Seção Direita (formulário) */}
			<div className='w-1/2 h-full bg-[#1a1a1a] flex flex-col p-20 justify-center'>
				<div className='w-full flex flex-col max-w-[450px] mx-auto'>
					<div className='w-full flex flex-col mb-10 text-white'>
						<h3 className='text-lg mb-4'>Crie sua conta para começar.</h3>
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
						<select value={role} onChange={e => setRole(e.target.value as 'admin' | 'doctor' | 'patient')} className='bg-transparent border border-white text-white py-3 px-2 rounded mt-2'>
							<option className='bg-black' value='admin'>
								Admin
							</option>
							<option className='bg-black' value='doctor'>
								Doutor
							</option>
							<option className='bg-black' value='patient'>
								Paciente
							</option>
						</select>
					</div>

					{/* Mensagem de erro */}
					{error && <div className='text-red-500 mb-4'>{error}</div>}

					{/* Botão */}
					<div className='w-full flex flex-col mb-4'>
						<button onClick={handleSignup} className='w-full bg-transparent border border-white text-white font-semibold rounded py-4 mb-4'>
							Criar Conta
						</button>
					</div>
				</div>

				{/* Link para login */}
				<div className='w-full flex items-center justify-center mt-10'>
					<p className='text-sm font-normal text-gray-400'>
						Já tem conta?
						<span className='text-white ml-1 cursor-pointer' onClick={() => navigate('/login')}>
							Entrar
						</span>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Signup;
