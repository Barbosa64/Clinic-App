import { useEffect, useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, updateEmail, updatePassword } from 'firebase/auth';
import { doc, setDoc, getDocs, collection, query, where, deleteDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useNavigate } from 'react-router-dom';

interface Patient {
	id: string;
	UID: string;
	role: string;
	name: string;
	email: string;
	imageUrl?: string;
}

export default function PatientList() {
	const auth = getAuth();
	const navigate = useNavigate();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const role = 'patient';
	const [name, setName] = useState('');
	const [imageUrl, setImageUrl] = useState('');
	const [error, setError] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [patients, setPatients] = useState<Patient[]>([]);

	// Estado para armazenar o médico que está sendo editado (null se criando novo)
	const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

	const fetchPatients = async () => {
		try {
			const q = query(collection(db, 'users'), where('role', '==', 'patient'));
			const querySnapshot = await getDocs(q);
			const patientList: Patient[] = [];
			querySnapshot.forEach(doc => {
				patientList.push({ id: doc.id, ...(doc.data() as Patient) });
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
		setError('');
		setShowModal(true);
	};

	// Função para abrir modal para edição, preenchendo campos
	const openEditModal = (patient: Patient) => {
		setEditingPatient(patient);
		setName(patient.name);
		setEmail(patient.email);
		setImageUrl(patient.imageUrl || '');
		setPassword(''); // password vazio, não vamos mostrar senha atual por segurança
		setError('');
		setShowModal(true);
	};

	const handleCancel = () => {
		setShowModal(false);
		setEditingPatient(null);
		setEmail('');
		setPassword('');
		setName('');
		setImageUrl('');
		setError('');
	};

	const handleSignup = async () => {
		setError('');

		// Validação
		if (!name || !email || (!editingPatient && !password)) {
			setError('Por favor preencha todos os campos obrigatórios.');
			return;
		}

		try {
			if (editingPatient) {
				// Atualiza o documento do médico
				await setDoc(
					doc(db, 'users', editingPatient.id),
					{
						UID: editingPatient.id,
						role: role,
						name,
						email,
						imageUrl,
					},
					{ merge: true },
				);

				// Se quiser, pode implementar atualização de email e senha no auth aqui (requer reautenticação)
				// Por simplicidade, não faremos isso agora.
			} else {
				// Criar novo usuário com email e password
				const { user } = await createUserWithEmailAndPassword(auth, email, password);

				await setDoc(doc(db, 'users', user.uid), {
					UID: user.uid,
					role: role,
					name,
					email,
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

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {};

	return (
		<div className='p-6'>
			<div className='flex justify-between items-center mb-4'>
				<h1 className='text-2xl font-bold'>Pacientes</h1>
				<button onClick={openModal} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out'>
					Adicionar Paciente
				</button>
			</div>

			<ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2'>
				{patients.map((patient, index) => (
					<li key={index} className='bg-white p-4 rounded shadow flex items-center space-x-4 flex-wrap sm:flex-nowrap'>
						<img src={patient.imageUrl || 'https://via.placeholder.com/64'} alt={patient.name} className='h-16 w-16 rounded-full object-cover flex-shrink-0' />

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
									disabled={!!editingPatient} // desabilita edição do email se editando
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
									required={!editingPatient} // obrigatório só ao criar
									placeholder={editingPatient ? 'Deixe vazio para manter a senha' : ''}
									className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm'
									disabled={!!editingPatient} // desabilita edição de senha para simplicidade
								/>
							</div>

							<div>
								<label htmlFor='imageUpload' className='block text-sm font-medium text-gray-700'>
									Upload da Imagem (opcional)
								</label>
								<input
									type='file'
									id='imageUpload'
									accept='image/*'
									onChange={handleImageUpload}
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
								<button onClick={handleSignup} type='submit' className='px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 border border-transparent rounded-md shadow-sm'>
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
