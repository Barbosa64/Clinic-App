import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { RegisterData } from '../context/AuthContext';

const Signup = () => {
	const navigate = useNavigate();

	const { register } = useAuth();

	const [formData, setFormData] = useState<RegisterData>({
		name: '',
		email: '',
		password: '',
		phone: '',
		birthDate: '',
		gender: 'Outro',
		insurance: '',
		insuranceNumber: '',
		imageUrl: '',
	});
	const [loading, setLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSignup = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			const result = await register(formData);

			if (result.success) {
				toast.success('Conta criada com sucesso! Por favor, faça login.');
				navigate('/login');
			} else {
				toast.error(result.message || 'Falha no registo. Verifique os seus dados.');
			}
		} catch (err: any) {
			toast.error('Ocorreu um erro inesperado.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='w-full h-auto md:h-screen flex flex-col md:flex-row'>
			<div className="w-full md:w-1/2 h-64 md:h-full flex flex-col items-center justify-center bg-[url('../assets/64.jpg')] bg-cover bg-center"></div>

			<div className='w-full md:w-1/2 h-full bg-teal-600 flex flex-col p-6 md:p-20 justify-center'>
				{/* Envolver tudo num <form> para melhor acessibilidade e semântica */}
				<form onSubmit={handleSignup} className='w-full flex flex-col max-w-[450px] mx-auto'>
					<div className='w-full flex flex-col mb-10 text-white'>
						<h3 className='text-lg mb-4'>Crie a sua conta na Clinica* para começar.</h3>
					</div>

					<div className='w-full flex flex-col mb-6'>
						<input
							name='name'
							type='text'
							placeholder='Nome'
							value={formData.name}
							onChange={handleChange}
							required
							className='w-full bg-transparent text-lg placeholder:text-white border-b text-white border-white py-4 mb-4 outline-none'
						/>
						<input
							name='email'
							type='email'
							placeholder='Email'
							value={formData.email}
							onChange={handleChange}
							required
							className='w-full bg-transparent text-lg placeholder:text-white border-b text-white border-white py-4 mb-4 outline-none'
						/>
						<input
							name='password'
							type='password'
							placeholder='Senha'
							value={formData.password}
							onChange={handleChange}
							required
							className='w-full bg-transparent text-lg placeholder:text-white border-b text-white border-white py-4 mb-4 outline-none'
						/>
						<input
							name='phone'
							type='text'
							placeholder='Telefone'
							value={formData.phone}
							onChange={handleChange}
							className='w-full bg-transparent text-lg placeholder:text-white border-b text-white border-white py-4 mb-4 outline-none'
						/>
						<input
							name='birthDate'
							type='date'
							placeholder='Data de Nascimento'
							value={formData.birthDate}
							onChange={handleChange}
							className='w-full bg-transparent text-lg placeholder:text-white border-b text-white border-white py-4 mb-4 outline-none'
						/>
						<input
							name='insurance'
							type='text'
							placeholder='Seguro'
							value={formData.insurance}
							onChange={handleChange}
							className='w-full bg-transparent text-lg placeholder:text-white border-b text-white border-white py-4 mb-4 outline-none'
						/>
						<input
							name='insuranceNumber'
							type='text'
							placeholder='Número do Seguro'
							value={formData.insuranceNumber}
							onChange={handleChange}
							className='w-full bg-transparent text-lg placeholder:text-white border-b text-white border-white py-4 mb-4 outline-none'
						/>
						<input
							name='imageUrl'
							type='url'
							placeholder='URL da Imagem'
							value={formData.imageUrl || ''}
							onChange={handleChange}
							className='w-full bg-transparent text-lg placeholder:text-white border-b text-white border-white py-4 mb-4 outline-none'
						/>
						<select name='gender' value={formData.gender} onChange={handleChange} className='bg-transparent border border-white text-white py-3 px-2 rounded mt-2'>
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

					<div className='w-full flex flex-col mb-4'>
						<button type='submit' disabled={loading} className='w-full bg-transparent border border-white text-white font-semibold rounded py-4 mb-4 disabled:opacity-50'>
							{loading ? 'A criar...' : 'Criar Conta'}
						</button>
					</div>
				</form>

				<div className='w-full flex items-center justify-center mt-10'>
					<p className='text-sm font-normal text-white'>
						Já tem conta?
						<span className='font-bold ml-1 cursor-pointer' onClick={() => navigate('/login')}>
							Entrar
						</span>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Signup;
