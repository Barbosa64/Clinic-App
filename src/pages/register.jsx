import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

export default function Register() {
	const [email, setEmail] = useState('');
	const [senha, setSenha] = useState('');
	const [confirmarSenha, setConfirmarSenha] = useState('');
	const [erro, setErro] = useState('');
	const navigate = useNavigate();

	const handleRegister = async e => {
		e.preventDefault();

		if (senha !== confirmarSenha) {
			setErro('As senhas não coincidem');
			return;
		}

		try {
			await createUserWithEmailAndPassword(auth, email, senha);
			navigate('/dashboard');
		} catch (err) {
			setErro('Erro ao criar conta. Tente outro email.');
		}
	};

	return (
		<div className='flex items-center justify-center h-screen'>
			<form onSubmit={handleRegister} className='p-6 bg-white rounded shadow-md space-y-4 max-w-sm w-full'>
				<h2 className='text-xl font-bold'>Criar Conta</h2>

				<input type='email' placeholder='Email' className='border p-2 w-full' value={email} onChange={e => setEmail(e.target.value)} />

				<input type='password' placeholder='Senha' className='border p-2 w-full' value={senha} onChange={e => setSenha(e.target.value)} />

				<input type='password' placeholder='Confirmar Senha' className='border p-2 w-full' value={confirmarSenha} onChange={e => setConfirmarSenha(e.target.value)} />

				{erro && <p className='text-red-500 text-sm'>{erro}</p>}

				<button type='submit' className='bg-green-600 text-white p-2 w-full rounded hover:bg-green-700 transition'>
					Registrar
				</button>
			</form>
		</div>
	);
}
