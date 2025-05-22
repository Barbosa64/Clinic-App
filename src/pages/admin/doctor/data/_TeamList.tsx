import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';

export default function TeamList() {
	const auth = getAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [role, setRole] = useState<'doctor'>('doctor');
	const navigate = useNavigate();

	const [showModal, setShowModal] = useState(false);

	const [error, setError] = useState('');

	const specialty = ['Cardiologia', 'Dermatologia', 'Endocrinologia', 'Ginecologia', 'Ortopedia', 'Pediatria', 'Urologia'];

	const openModal = () => {
		setShowModal(true);
	};
	const handleCancel = () => {
		setShowModal(false);
		setError('');
	};

	const handleSignup = async () => {
		setError('');
		try {
			const { user } = await createUserWithEmailAndPassword(auth, email, password);

			await setDoc(doc(db, 'users', user.uid), {
				UID: user.uid,
				role: role,
				specialty: specialty,
			});

			navigate('/');
		} catch (err: any) {
			setError('Falhou o registo: ' + err.message);
		}
	};

	return (
		<div className='p-6'>
			<div className='flex justify-between items-center mb-4'>
				<h1 className='text-2xl font-bold'>Equipa Médica</h1>
				<button onClick={openModal} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out'>
					Adicionar Médico
				</button>
			</div>

			<ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
				<li className='bg-white p-4 rounded shadow flex items-center space-x-4'>
					<img src='https://via.placeholder.com/64' alt='Doctor name' className='h-16 w-16 rounded-full object-cover' />
					<div>
						<p className='font-semibold'>fwwfwewfewfwe</p>
						<p className='text-sm text-gray-500'>fwwefwfefwefw</p>
						<p className='text-xs text-gray-400'>derfwefwe</p>
					</div>
					<button className='ml-auto text-red-600 hover:text-white border border-red-600 hover:bg-red-600 rounded px-3 py-1 text-sm font-semibold transition-colors duration-200'>Eliminar</button>
				</li>
			</ul>

			{/* Janela criação de médico */}
			{showModal && (
				<div className='fixed inset-0 z-40 flex justify-center items-center p-4 bg-black bg-opacity-50'>
					<div className='bg-white p-6 rounded-lg shadow-xl w-full max-w-md z-50'>
						<h2 className='text-xl font-semibold mb-4'>Adicionar Novo Médico</h2>
						{error && <p className='text-red-600 mb-2 text-sm font-medium'>{error}</p>}
						<form
							onSubmit={e => {
								e.preventDefault();
							}}
							className='space-y-4'
						>
							<div>
								<label htmlFor='name' className='block text-sm font-medium text-gray-700'>
									Nome
								</label>
								<input
									type='text'
									name='name'
									id='name'
									className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
									required
								/>
							</div>
							<div>
								<label htmlFor='email' className='block text-sm font-medium text-gray-700'>
									Email
								</label>
								<input
									type='email'
									name='email'
									id='email'
									className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
									value={email}
									onChange={e => setEmail(e.target.value)}
									required
								/>
							</div>
							<div>
								<label htmlFor='password' className='block text-sm font-medium text-gray-700'>
									Password
								</label>
								<input
									type='password'
									name='password'
									id='password'
									className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
									value={password}
									onChange={e => setPassword(e.target.value)}
									required
								/>
							</div>
							<div>
								<select value={role} onChange={e => setRole(e.target.value as 'doctor')} className='bg-black border border-white text-white py-3 px-2 rounded mt-2'>
									<option className='bg-black' value='doctor'>
										Doutor
									</option>
								</select>
							</div>
							<div>
								<label htmlFor='specialty' className='block text-sm font-medium text-gray-700'>
									Especialidade
								</label>
								<select name='specialty' id='specialty' className='border w-full p-2 rounded' required>
									<option value=''>Selecione uma especialidade</option>
									{specialty.map((item, index) => (
										<option key={index} value={item}>
											{item.charAt(0).toUpperCase() + item.slice(1)}
										</option>
									))}
								</select>
							</div>
							<div>
								<label htmlFor='imageUrl' className='block text-sm font-medium text-gray-700'>
									URL da Imagem (opcional)
								</label>
								<input
									type='url'
									name='imageUrl'
									id='imageUrl'
									placeholder='https://exemplo.com/imagem.jpg'
									className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
								/>
							</div>

							<div className='flex justify-end space-x-3 pt-4'>
								<button
									type='button'
									onClick={handleCancel}
									className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
								>
									Cancelar
								</button>
								<button
									onClick={handleSignup}
									type='submit'
									className='px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
								>
									'Criar Médico'
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
