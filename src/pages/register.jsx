import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

export default function Register() {
	const [email, setEmail] = useState('');
	const [senha, setSenha] = useState('');
	const [confirmarSenha, setConfirmarSenha] = useState('');
	const [erro, setErro] = useState(null);
	const navigate = useNavigate();

	const handleSubmit = async e => {
		e.preventDefault();
		setErro(null);

		if (senha !== confirmarSenha) {
			setErro('As senhas não coincidem.');
			return;
		}

		try {
			await createUserWithEmailAndPassword(auth, email, senha);
			navigate('/'); // Redireciona para a página principal
		} catch (err) {
			setErro(err.message);
		}
	};

	return (
		<div>
			<h1>Registrar</h1>
			<form onSubmit={handleSubmit}>
				<input type='email' placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} />
				<br />
				<input type='password' placeholder='Senha' value={senha} onChange={e => setSenha(e.target.value)} />
				<br />
				<input type='password' placeholder='Confirmar senha' value={confirmarSenha} onChange={e => setConfirmarSenha(e.target.value)} />
				<br />
				{erro && <p style={{ color: 'red' }}>{erro}</p>}
				<button type='submit'>Registrar</button>
			</form>
		</div>
	);
}
