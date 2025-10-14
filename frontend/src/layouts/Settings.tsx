import { useEffect, useState } from 'react';

export default function PatientProfile() {
	const auth = getAuth();
	const user = auth.currentUser;

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [newEmail, setNewEmail] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [birthDate, setBirthDate] = useState<string>('');
	const [imageUrl, setImageUrl] = useState('');
	const [currentPassword, setCurrentPassword] = useState('');
	const [insurance, setInsurance] = useState('');
	const [insuranceNumber, setInsuranceNumber] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	useEffect(() => {
		if (user) {
			loadPatientData(user.uid);
		}
	}, [user]);

	const loadPatientData = async (uid: string) => {
		try {
			const docRef = doc(db, 'users', uid);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				const data = docSnap.data();
				setName(data.name || '');
				setEmail(data.email || '');
				setNewEmail(data.email || '');
				setImageUrl(data.imageUrl || '');
				setInsurance(data.insurance || '');
				setInsuranceNumber(data.insuranceNumber || '');
				if (data.birthDate) {
					let date: Date;
					if (data.birthDate.toDate) {
						date = data.birthDate.toDate();
					} else {
						date = new Date(data.birthDate);
					}
					const yyyy = date.getFullYear();
					const mm = String(date.getMonth() + 1).padStart(2, '0');
					const dd = String(date.getDate()).padStart(2, '0');
					setBirthDate(`${yyyy}-${mm}-${dd}`);
				}
			}
		} catch (err) {
			console.error('Erro ao carregar dados:', err);
		}
	};

	const handleSave = async () => {
		if (!user) return;

		setError('');
		setSuccess('');

		try {
			const isEmailChanged = newEmail !== email;
			const isPasswordChanged = !!newPassword;

			if ((isEmailChanged || isPasswordChanged) && !currentPassword) {
				setError('Informe a password atual para atualizar o e-mail ou password.');
				return;
			}

			if (isEmailChanged || isPasswordChanged) {
				const credential = EmailAuthProvider.credential(user.email || '', currentPassword);
				await reauthenticateWithCredential(user, credential);
			}

			if (isEmailChanged) {
				await updateEmail(user, newEmail);
				setEmail(newEmail);
			}

			if (isPasswordChanged) {
				await updatePassword(user, newPassword);
			}

			await setDoc(doc(db, 'users', user.uid), { name, email: newEmail, imageUrl, insurance, insuranceNumber, birthDate: birthDate ? Timestamp.fromDate(new Date(birthDate)) : null }, { merge: true });

			setSuccess('Dados atualizados com sucesso!');
		} catch (err: any) {
			switch (err.code) {
				case 'auth/wrong-password':
					setError('Password atual incorreta.');
					break;
				case 'auth/invalid-credential':
					setError('Credenciais inválidas. Verifique o e-mail e a password.');
					break;
				case 'auth/requires-recent-login':
					setError('Você precisa fazer login novamente para atualizar essas informações.');
					break;
				case 'auth/email-already-in-use':
					setError('Este e-mail já está em uso por outra conta.');
					break;
				default:
					setError('Erro: ' + err.message);
			}
		}
	};

	return (
		<div className='max-w-xl mx-auto p-6'>
			<div className='bg-white shadow-md rounded-xl p-6 space-y-6'>
				<h2 className='text-2xl font-bold text-gray-800'>Meu Perfil</h2>

				{error && <p className='text-sm text-red-600'>{error}</p>}
				{success && <p className='text-sm text-green-600'>{success}</p>}

				<form onSubmit={e => e.preventDefault()} className='space-y-6'>
					{/* Seção: Dados Pessoais */}
					<div>
						<h3 className='text-lg font-semibold text-gray-700 mb-2'>Dados Pessoais</h3>

						<div className='space-y-4'>
							<div>
								<label className='block text-sm font-medium text-gray-700'>Nome</label>
								<input type='text' value={name} onChange={e => setName(e.target.value)} className='w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none' />
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700'>Data de Nascimento</label>
								<input
									type='date'
									value={birthDate}
									onChange={e => setBirthDate(e.target.value)}
									className='w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
								/>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700'>Imagem (URL)</label>
								<input
									type='text'
									value={imageUrl}
									onChange={e => setImageUrl(e.target.value)}
									className='w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
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
								<label className='block text-sm font-medium text-gray-700'>Novo Email</label>
								<input
									type='email'
									value={newEmail}
									onChange={e => setNewEmail(e.target.value)}
									autoComplete='email'
									className='w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
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
									className='w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
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
									className='w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
								/>
							</div>
						</div>
					</div>

					<hr className='border-t border-gray-200' />

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
									className='w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
								/>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700'>Número do Seguro</label>
								<input
									type='text'
									value={insuranceNumber}
									onChange={e => setInsuranceNumber(e.target.value)}
									placeholder='Número do Seguro'
									className='w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
								/>
							</div>
						</div>
					</div>

					<hr className='border-t border-gray-200' />

					{/* Botão Final */}
					<button onClick={handleSave} className='w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200'>
						Salvar Alterações
					</button>
				</form>
			</div>
		</div>
	);
}
