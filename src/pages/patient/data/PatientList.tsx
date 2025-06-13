import { useEffect, useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDocs, collection, query, where, deleteDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { Search, UserPlus } from 'lucide-react';

interface Patient {
	id: string;
	UID: string;
	role: string;
	name: string;
	email: string;
	insurance: string;
	insuranceNumber: string;
	imageUrl?: string;
}

export default function PatientList() {
	const auth = getAuth();

	const role = 'patient';
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [name, setName] = useState('');
	const [imageUrl, setImageUrl] = useState('');
	const [insurance, setInsurance] = useState('');
	const [insuranceNumber, setInsuranceNumber] = useState('');
	const [error, setError] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [patients, setPatients] = useState<Patient[]>([]);

	const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

	const fetchPatients = async () => {
		try {
			const q = query(collection(db, 'users'), where('role', '==', 'patient'));
			const querySnapshot = await getDocs(q);
			const patientList: Patient[] = [];
			querySnapshot.forEach(doc => {
				patientList.push({ ...(doc.data() as Patient) });
			});
			setPatients(patientList);
		} catch (err) {
			console.error('Erro ao buscar pacientes:', err);
		}
	};

	useEffect(() => {
		fetchPatients();
	}, []);

	const openModal = () => {
		setEditingPatient(null);
		setEmail('');
		setPassword('');
		setName('');
		setImageUrl('');
		setInsurance('');
		setInsuranceNumber('');
		setError('');
		setShowModal(true);
	};

	const openEditModal = (patient: Patient) => {
		setEditingPatient(patient);
		setName(patient.name);
		setEmail(patient.email);
		setInsurance(patient.insurance || '');
		setInsuranceNumber(patient.insuranceNumber || '');
		setImageUrl(patient.imageUrl || '');
		setPassword('');
		setError('');
		setShowModal(true);
	};

	const handleCancel = () => {
		setShowModal(false);
		setEditingPatient(null);
		setEmail('');
		setPassword('');
		setName('');
		setInsurance('');
		setInsuranceNumber('');
		setImageUrl('');
		setError('');
	};

	const handleSignup = async () => {
		setError('');

		if (!name || !email || (!editingPatient && !password)) {
			setError('Por favor preencha todos os campos obrigatórios.');
			return;
		}

		try {
			if (editingPatient) {
				await setDoc(
					doc(db, 'users', editingPatient.id),
					{
						UID: editingPatient.id,
						role: role,
						name,
						email,
						imageUrl,
						insurance,
						insuranceNumber,
					},
					{ merge: true },
				);
			} else {
				const { user } = await createUserWithEmailAndPassword(auth, email, password);

				await setDoc(doc(db, 'users', user.uid), {
					UID: user.uid,
					role: role,
					name,
					email,
					insurance,
					insuranceNumber,
					imageUrl,
				});
			}

			handleCancel();
			await fetchPatients();
		} catch (err: any) {
			setError('Falhou: ' + err.message);
		}
	};

	const handleDeletePatient = async (userId: string) => {
		try {
			await deleteDoc(doc(db, 'users', userId));
			setPatients(patients.filter(patient => patient.id !== userId));
		} catch (err: any) {
			console.error('Erro ao eliminar paciente:', err.message);
		}
	};

	return (
		<div className='p-6'>
			<div className='flex justify-between items-center mb-4'>
				<h1 className='text-3xl font-bold text-teal-700 flex items-center gap-2 mb-6'>
					<UserPlus className='w-7 h-7' />
					Gestão de Pacientes
				</h1>

				<div className='mb-6 w-full max-w-md relative'>
					<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
					<input
						type='text'
						placeholder='Pesquisar por nome ou email...'
						className='pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none'
						onChange={e => {
							const value = e.target.value.toLowerCase();
							setPatients(value ? patients.filter(p => p.name.toLowerCase().includes(value) || p.email.toLowerCase().includes(value)) : [...patients]);
						}}
					/>
				</div>
				<button onClick={openModal} className='bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded shadow'>
					Adicionar Paciente
				</button>
			</div>

			<ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2'>
				{patients.map((patient, index) => (
					<li key={index} className='bg-white p-4 rounded shadow flex items-center space-x-4 flex-wrap sm:flex-nowrap'>
						<img src={patient.imageUrl || 'https://placehold.co/100x100?text=Avatar'} alt={patient.name} className='h-16 w-16 rounded-full object-cover flex-shrink-0' />

						<div className='flex-1 min-w-0'>
							<p className='font-semibold truncate'>{patient.name || 'Nome não disponível'}</p>
							<p className='text-sm text-gray-500 truncate'>{patient.email || 'Sem email'}</p>
						</div>

						<div className='flex space-x-2 flex-shrink-0'>
							<button
								onClick={() => openEditModal(patient)}
								className='text-green-600 hover:text-white border border-green-600 hover:bg-green-600 rounded px-3 py-1 text-sm font-semibold transition-colors duration-200 whitespace-nowrap'
							>
								Editar
							</button>

							<button
								onClick={() => handleDeletePatient(patient.id)}
								className='text-red-600 hover:text-white border border-red-600 hover:bg-red-600 rounded px-3 py-1 text-sm font-semibold transition-colors duration-200 whitespace-nowrap'
							>
								Eliminar
							</button>
						</div>
					</li>
				))}
			</ul>

			{showModal && (
				<div className='fixed inset-0 z-40 flex justify-center items-center p-4 bg-black bg-opacity-50'>
					<div className='bg-white p-6 rounded-lg shadow-xl w-full max-w-md z-50'>
						<h2 className='text-xl font-semibold mb-4'>{editingPatient ? 'Editar Paciente' : 'Adicionar Novo Paciente'}</h2>
						{error && <p className='text-red-600 mb-2 text-sm font-medium'>{error}</p>}
						<form onSubmit={e => e.preventDefault()} className='space-y-4'>
							<div>
								<label htmlFor='name' className='block text-sm font-medium text-gray-700'>
									Nome
								</label>
								<input
									type='text'
									id='name'
									value={name}
									onChange={e => setName(e.target.value)}
									required
									className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm'
								/>
							</div>
							<div>
								<label htmlFor='email' className='block text-sm font-medium text-gray-700'>
									Email
								</label>
								<input
									type='email'
									id='email'
									value={email}
									onChange={e => setEmail(e.target.value)}
									required
									className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm'
									disabled={!!editingPatient}
								/>
							</div>
							<div>
								<label htmlFor='password' className='block text-sm font-medium text-gray-700'>
									Password
								</label>
								<input
									type='password'
									id='password'
									value={password}
									onChange={e => setPassword(e.target.value)}
									required={!editingPatient}
									placeholder={editingPatient ? 'Deixe vazio para manter a senha' : ''}
									className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm'
									disabled={!!editingPatient}
								/>
							</div>
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

							<div>
								<label htmlFor='imageUpload' className='block text-sm font-medium text-gray-700'>
									Upload da Imagem (opcional)
								</label>
								<input
									type='file'
									id='imageUpload'
									accept='image/*'
									className='mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100
                  '
								/>
								{imageUrl && <img src={imageUrl} alt='Imagem do médico' className='mt-2 rounded max-h-40' />}
							</div>

							<div className='flex justify-end space-x-3 pt-4'>
								<button type='button' onClick={handleCancel} className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md shadow-sm'>
									Cancelar
								</button>
								<button onClick={handleSignup} type='submit' className='px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md'>
									{editingPatient ? 'Salvar Alterações' : 'Criar Paciente'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
