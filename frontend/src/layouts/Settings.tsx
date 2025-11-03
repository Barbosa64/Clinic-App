import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMe, updateMe, UpdateUserData } from '../services/apiService';
import { toast } from 'react-hot-toast';

export default function Settings() {
	const { setUser } = useAuth();

	// Estados para o formulário
	const [name, setName] = useState('');
	const [originalEmail, setOriginalEmail] = useState('');
	const [email, setEmail] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [birthDate, setBirthDate] = useState('');
	const [imageUrl, setImageUrl] = useState('');
	const [currentPassword, setCurrentPassword] = useState('');
	const [insurance, setInsurance] = useState('');
	const [insuranceNumber, setInsuranceNumber] = useState('');
	const [loading, setLoading] = useState(true);

	// Carregar os dados do utilizador quando o componente montar
	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const userData = await getMe();

				// Preencher o formulário com os dados da API
				setName(userData.name || '');
				setOriginalEmail(userData.email || '');
				setEmail(userData.email || '');
				setImageUrl(userData.imageUrl || '');
				setInsurance(userData.insurance || '');
				setInsuranceNumber(userData.insuranceNumber || '');
				// Formatar a data que vem da API (ISO string) para o formato YYYY-MM-DD
				if (userData.birthDate) {
					setBirthDate(userData.birthDate.substring(0, 10));
				}
			} catch (err) {
				console.error('Erro ao carregar dados do perfil:', err);
				toast.error('Não foi possível carregar os seus dados.');
			} finally {
				setLoading(false);
			}
		};

		fetchUserData();
	}, []);

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();

		const isEmailChanged = email !== originalEmail;
		const isPasswordChanged = newPassword.trim() !== '';

		
		if ((isEmailChanged || isPasswordChanged) && !currentPassword) {
			toast.error('Informe a password atual para alterar o e-mail ou a password.');
			return;
		}

		// Construir o objeto de dados para enviar à API
		const updateData: UpdateUserData = {
			name,
			imageUrl,
			insurance,
			insuranceNumber,
			birthDate: birthDate || undefined,
		};

		if (isEmailChanged) {
			updateData.email = email;
		}
		if (isPasswordChanged) {
			updateData.newPassword = newPassword;
		}
		if (isEmailChanged || isPasswordChanged) {
			updateData.currentPassword = currentPassword;
		}

		try {
			const updatedUser = await updateMe(updateData);
			toast.success('Dados atualizados com sucesso!');

			// Atualizar o estado global do utilizador com os novos dados
			setUser(updatedUser);

			// Resetar campos de password e atualizar e-mail original
			setNewPassword('');
			setCurrentPassword('');
			setOriginalEmail(email);
		} catch (err: any) {
			console.error('Erro ao atualizar dados:', err);

			const errorMessage = err.response?.data?.message || 'Ocorreu um erro desconhecido.';
			toast.error(errorMessage);
		}
	};

	if (loading) {
		return <p className='text-center text-gray-500'>A carregar perfil...</p>;
	}

	return (
		<div className='max-w-xl mx-auto p-6'>
			<div className='bg-white shadow-md rounded-xl p-6 space-y-6'>
				<h2 className='text-2xl font-bold text-gray-800'>Meu Perfil</h2>

				<form onSubmit={handleSave} className='space-y-6'>
					{/* Seção: Dados Pessoais */}
					<div>
						<h3 className='text-lg font-semibold text-gray-700 mb-2'>Dados Pessoais</h3>
						<div className='space-y-4'>
							<div>
								<label className='block text-sm font-medium text-gray-700'>Nome</label>
								<input type='text' value={name} onChange={e => setName(e.target.value)} className='w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none' />
							</div>
							<div>
								<label className='block text-sm font-medium text-gray-700'>Data de Nascimento</label>
								<input
									type='date'
									value={birthDate}
									onChange={e => setBirthDate(e.target.value)}
									className='w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none'
								/>
							</div>
							<div>
								<label className='block text-sm font-medium text-gray-700'>Imagem (URL)</label>
								<input
									type='text'
									value={imageUrl}
									onChange={e => setImageUrl(e.target.value)}
									className='w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none'
								/>
								{imageUrl && <img src={imageUrl} alt='preview' className='mt-3 h-24 w-24 object-cover rounded-full border' />}
							</div>
						</div>
					</div>

					<hr className='border-t border-gray-200' />

					{/* Seção: Segurança */}
					<div>
						<h3 className='text-lg font-semibold text-gray-700 mb-2'>Segurança</h3>
						<div className='space-y-4'>
							<div>
								<label className='block text-sm font-medium text-gray-700'>Email</label>
								<input
									type='email'
									value={email}
									onChange={e => setEmail(e.target.value)}
									autoComplete='email'
									className='w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none'
								/>
							</div>
							<div>
								<label className='block text-sm font-medium text-gray-700'>Nova Password</label>
								<input
									type='password'
									value={newPassword}
									onChange={e => setNewPassword(e.target.value)}
									autoComplete='new-password'
									placeholder='Deixe vazio para não alterar'
									className='w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none'
								/>
							</div>
							<div>
								<label className='block text-sm font-medium text-gray-700'>
									Password Atual <span className='text-gray-500'>(obrigatória p/ mudar email/password)</span>
								</label>
								<input
									type='password'
									value={currentPassword}
									onChange={e => setCurrentPassword(e.target.value)}
									autoComplete='current-password'
									className='w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none'
								/>
							</div>
						</div>
					</div>

					<hr className='border-t border-gray-200' />

					{/* Seção: Seguro */}
					<div>
						<h3 className='text-lg font-semibold text-gray-700 mb-2'>Informações do Seguro</h3>
						<div className='space-y-4'>
							<div>
								<label className='block text-sm font-medium text-gray-700'>Seguro</label>
								<input
									type='text'
									value={insurance}
									onChange={e => setInsurance(e.target.value)}
									placeholder='Ex: ADSE, Multicare, etc.'
									className='w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none'
								/>
							</div>
							<div>
								<label className='block text-sm font-medium text-gray-700'>Número do Seguro</label>
								<input
									type='text'
									value={insuranceNumber}
									onChange={e => setInsuranceNumber(e.target.value)}
									placeholder='Número do Seguro'
									className='w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none'
								/>
							</div>
						</div>
					</div>

					<hr className='border-t border-gray-200' />

					{/* Botão Final */}
					<button type='submit' className='w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200'>
						Salvar Alterações
					</button>
				</form>
			</div>
		</div>
	);
}
