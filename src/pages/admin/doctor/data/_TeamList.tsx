import React, { useState } from 'react';
import { doctors as initialDoctors } from '../data/doctors'; // Assuming you might want to use this later or add to it
import { getAuth, signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

// Define a type for the doctor data, including password for the form
interface DoctorFormData {
	id: string;
	name: string;
	email: string;
	password?: string; // Password is for creation, might not be displayed
	specialty: string;
	imageUrl: string; // You might want to add a field for this or auto-generate
	lastSeen?: string | null;
	lastSeenDateTime?: string;
}

const initialDoctorFormData: DoctorFormData = {
	id: '',
	name: '',
	email: '',
	password: '',
	specialty: '',
	imageUrl: 'https://via.placeholder.com/150/000000/FFFFFF/?text=Doctor', // Default placeholder
	lastSeen: null,
};

export default function TeamList() {
	// If you plan to actually add doctors to the list, you'd manage 'doctors' with useState
	// For now, we'll just use the imported list for display
	const auth = getAuth();
	const navigate = useNavigate();
	const [doctors] = useState(initialDoctors);
	const [showModal, setShowModal] = useState(false);
	const [email, setEmail] = useState('');
	const [newDoctor, setNewDoctor] = useState<DoctorFormData>(initialDoctorFormData);
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const openModal = () => {
		//setNewDoctor(initialDoctorFormData); // Reset form when opening
		setShowModal(true);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setNewDoctor(prev => ({ ...prev, [name]: value }));
	};

	const handleCancel = () => {
		setShowModal(false);
	};

	const signUpWithEmail = async () => {
		if (password !== confirmPassword) {
			setError('Passwords do not match.');
			return;
		}

		setAuthing(true);
		setError('');

		createUserWithEmailAndPassword(auth, email, password)
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
		<div className='p-6'>
			<div className='flex justify-between items-center mb-4'>
				<h1 className='text-2xl font-bold'>Equipa Médica</h1>
				<button onClick={openModal} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out'>
					Adicionar Médico
				</button>
			</div>

			<ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
				{doctors.map((doctor, index) => (
					<li key={index} className='bg-white p-4 rounded shadow flex items-center space-x-4'>
						<img src={doctor.imageUrl || 'https://via.placeholder.com/64'} alt={doctor.name} className='h-16 w-16 rounded-full object-cover' />
						<div>
							<p className='font-semibold'>{doctor.name}</p>
							<p className='text-sm text-gray-500'>{doctor.specialty}</p>
							{doctor.lastSeen && <p className='text-xs text-gray-400'>Última vez visto: {doctor.lastSeen}</p>}
						</div>
					</li>
				))}
			</ul>

			{/* Modal for Adding Doctor */}
			{showModal && (
				<div className='fixed inset-0 z-40 flex justify-center items-center p-4'>
					<div className='bg-white p-6 rounded-lg shadow-xl w-full max-w-md z-50'>
						<h2 className='text-xl font-semibold mb-4'>Adicionar Novo Médico</h2>
						<form className='space-y-4'>
							<div>
								<label htmlFor='name' className='block text-sm font-medium text-gray-700'>
									Nome
								</label>
								<input
									type='text'
									name='name'
									id='name'
									value={newDoctor.name}
									onChange={handleInputChange}
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
									value={newDoctor.email}
									onChange={handleInputChange}
									className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
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
									value={newDoctor.password}
									onChange={handleInputChange}
									className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
									required
								/>
							</div>
							<div>
								<label htmlFor='specialty' className='block text-sm font-medium text-gray-700'>
									Especialidade
								</label>
								<input
									type='text'
									name='specialty'
									id='specialty'
									value={newDoctor.specialty}
									onChange={handleInputChange}
									className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
									required
								/>
							</div>
							<div>
								<label htmlFor='imageUrl' className='block text-sm font-medium text-gray-700'>
									URL da Imagem (opcional)
								</label>
								<input
									type='url'
									name='imageUrl'
									id='imageUrl'
									value={newDoctor.imageUrl}
									onChange={handleInputChange}
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
									type='submit'
									className='px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
								>
									Criar Médico
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
