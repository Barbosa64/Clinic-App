import { useState } from 'react';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';

const Signup = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [insurance, setInsurance] = useState('');
	const [insuranceNumber, setInsuranceNumber] = useState('');
	const [imageUrl, setImageUrl] = useState('');
	const [gender, setGender] = useState<'Masculino' | 'Feminino' | 'Outro'>('Outro');
	const [phone, setPhone] = useState('');
	const [birthDate, setBirthDate] = useState('');
	const [age, setAge] = useState('');
	const [role, setRole] = useState<'admin' | 'doctor' | 'patient'>('patient');
	const [error, setError] = useState('');
	const navigate = useNavigate();
	const auth = getAuth();

	const handleSignup = async () => {
		setError('');
		if (!name || !email || !password || !phone || !birthDate || !age) {
			setError('Por favor, preencha todos os campos obrigatórios.');
			return;
		}
		try {
			const { user } = await createUserWithEmailAndPassword(auth, email, password);

			await setDoc(doc(db, 'users', user.uid), {
				UID: user.uid,
				role: role,
				name,
				email,
				insurance,
				insuranceNumber,
				imageUrl,
				gender,
				phone,
				birthDate,
				age,
			});

			navigate('/');
		} catch (err: any) {
			setError('Falhou o registo: ' + err.message);
		}
	};

	return (
		<div className='w-full h-screen flex'>
			{/* Seção Esquerda (ilustração ou cor de fundo) */}
			<div className="w-1/2 h-full flex flex-col items-center justify-center bg-[url('../assets/17818.jpg')] bg-cover bg-center"></div>

			{/* Seção Direita (formulário) */}
			<div className='w-1/2 h-full bg-teal-600 flex flex-col p-20 justify-center'>
				<div className='w-full flex flex-col max-w-[450px] mx-auto'>
					<div className='w-full flex flex-col mb-10 text-white'>
						<h3 className='text-lg mb-4'>Crie a sua conta para começar.</h3>
					</div>

					{/* Inputs */}
					<div className='w-full flex flex-col mb-6'>
						<input
							type='text'
							placeholder='Nome'
							className='w-full bg-transparent text-lg placeholder:text-white border-b text-white border-white py-4 mb-4 outline-none'
							value={name}
							onChange={e => setName(e.target.value)}
							required
						/>
						<input
							type='email'
							placeholder='Email'
							className='w-full bg-transparent text-lg placeholder:text-white border-b text-white border-white py-4 mb-4 outline-none'
							value={email}
							onChange={e => setEmail(e.target.value)}
							required
						/>
						<input
							type='password'
							placeholder='Senha'
							className='w-full bg-transparent text-lg placeholder:text-white border-b text-white border-white py-4 mb-4 outline-none'
							value={password}
							onChange={e => setPassword(e.target.value)}
							required
						/>
						<input
							type='text'
							placeholder='Telefone'
							className='w-full bg-transparent text-lg placeholder:text-white border-b text-white border-white py-4 mb-4 outline-none'
							value={phone}
							onChange={e => setPhone(e.target.value)}
							required
						/>
						<input
							type='date'
							placeholder='Data de Nascimento'
							className='w-full bg-transparent text-lg placeholder:text-white border-b text-white border-white py-4 mb-4 outline-none'
							value={birthDate}
							onChange={e => setBirthDate(e.target.value)}
							required
						/>
						<input
							type='number'
							placeholder='Idade'
							className='w-full bg-transparent text-lg placeholder:text-white border-b text-white border-white py-4 mb-4 outline-none'
							value={age}
							onChange={e => setAge(e.target.value)}
							required
						/>
						<input
							type='text'
							placeholder='Seguro'
							className='w-full bg-transparent text-lg placeholder:text-white border-b text-white border-white py-4 mb-4 outline-none'
							value={insurance}
							onChange={e => setInsurance(e.target.value)}
						/>
						<input
							type='text'
							placeholder='Número do Seguro'
							className='w-full bg-transparent text-lg placeholder:text-white border-b text-white border-white py-4 mb-4 outline-none'
							value={insuranceNumber}
							onChange={e => setInsuranceNumber(e.target.value)}
						/>
						<input
							type='url'
							placeholder='URL da Imagem'
							className='w-full bg-transparent text-lg placeholder:text-white border-b text-white border-white py-4 mb-4 outline-none'
							value={imageUrl}
							onChange={e => setImageUrl(e.target.value)}
						/>
						<select value={gender} onChange={e => setGender(e.target.value as 'Maculino' | 'Feminino' | 'Outro')} className='bg-transparent border border-white text-white py-3 px-2 rounded mt-2'>
							<option className='bg-black' value='Masculino'>
								Masculino
							</option>
							<option className='bg-black' value='Feminino'>
								Feminino
							</option>
							<option className='bg-black' value='Outro'>
								Outro
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
