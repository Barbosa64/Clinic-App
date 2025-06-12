import { useEffect, useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDocs, collection, query, where, deleteDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Search, UserPlus } from 'lucide-react';

interface Doctor {
	id: string;
	UID: string;
	role: string;
	name: string;
	email: string;
	imageUrl?: string;
	specialty?: string[];
}

export default function TeamList() {
	const auth = getAuth();
	const navigate = useNavigate();
	const storage = getStorage();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const role = 'doctor';
	const [name, setName] = useState('');
	const [imageUrl, setImageUrl] = useState('');
	const [error, setError] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [doctors, setDoctors] = useState<Doctor[]>([]);

	const specialty = ['Cardiologia', 'Dermatologia', 'Endocrinologia', 'Ginecologia', 'Ortopedia', 'Pediatria', 'Urologia'];
	const [selectedSpecialty, setSelectedSpecialty] = useState('');

	const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

	const fetchDoctors = async () => {
		try {
			const q = query(collection(db, 'users'), where('role', '==', 'doctor'));
			const querySnapshot = await getDocs(q);
			const doctorList: Doctor[] = [];
			querySnapshot.forEach(doc => {
				doctorList.push({ id: doc.id, ...(doc.data() as Doctor) });
			});
			setDoctors(doctorList);
		} catch (err) {
			console.error('Erro ao buscar médicos:', err);
		}
	};

	useEffect(() => {
		fetchDoctors();
	}, []);

	const openModal = () => {
		setEditingDoctor(null);
		setEmail('');
		setPassword('');
		setName('');
		setImageUrl('');
		setSelectedSpecialty('');
		setError('');
		setShowModal(true);
	};

	// Função para abrir modal para edição, preenchendo campos
	const openEditModal = (doctor: Doctor) => {
		setEditingDoctor(doctor);
		setName(doctor.name);
		setEmail(doctor.email);
		setImageUrl(doctor.imageUrl || '');
		setSelectedSpecialty(doctor.specialty?.[0] || '');
		setPassword(''); // password vazio, não vamos mostrar senha atual por segurança
		setError('');
		setShowModal(true);
	};

	const handleCancel = () => {
		setShowModal(false);
		setEditingDoctor(null);
		setEmail('');
		setPassword('');
		setName('');
		setImageUrl('');
		setSelectedSpecialty('');
		setError('');
	};

	const handleSignup = async () => {
		setError('');

		// Validação
		if (!name || !email || (!editingDoctor && !password) || !selectedSpecialty) {
			setError('Por favor preencha todos os campos obrigatórios.');
			return;
		}

		try {
			if (editingDoctor) {
				// Atualiza o documento do médico
				await setDoc(
					doc(db, 'users', editingDoctor.id),
					{
						UID: editingDoctor.id,
						role: role,
						name,
						email,
						imageUrl,
						specialty: selectedSpecialty ? [selectedSpecialty] : [],
					},
					{ merge: true },
				);

				// falta implementar atualização de email e senha no auth  (requer reautenticação)
			} else {
				// Criar novo doutor com email e password
				const { user } = await createUserWithEmailAndPassword(auth, email, password);

				await setDoc(doc(db, 'users', user.uid), {
					UID: user.uid,
					role: role,
					name,
					email,
					imageUrl,
					specialty: selectedSpecialty ? [selectedSpecialty] : [],
				});
			}

			handleCancel();
			await fetchDoctors();
		} catch (err: any) {
			setError('Falhou: ' + err.message);
		}
	};

	const handleDeleteDoctor = async (userId: string) => {
		try {
			await deleteDoc(doc(db, 'users', userId));
			setDoctors(doctors.filter(doctor => doctor.id !== userId));
		} catch (err: any) {
			console.error('Erro ao eliminar médico:', err.message);
		}
	};

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files || e.target.files.length === 0) return;

		const file = e.target.files[0];
		const storageRef = ref(storage, `doctor_images/${file.name}_${Date.now()}`);

		try {
			await uploadBytes(storageRef, file);
			const url = await getDownloadURL(storageRef);
			setImageUrl(url);
		} catch (error) {
			console.error('Erro no upload da imagem:', error);
			setError('Falha no upload da imagem. Tente novamente.');
		}
	};

	return (
		<div className='p-6'>
			<div className='flex justify-between items-center mb-4'>
				<h1 className='text-3xl font-bold text-teal-700 flex items-center gap-2 mb-6'>
					<UserPlus className='w-7 h-7' />
					Gestão de Médicos
				</h1>
				<button onClick={openModal} className='bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded shadow'>
					Adicionar Médico
				</button>
			</div>

			<ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2'>
				{doctors.map((doctor, index) => (
					<li key={index} className='bg-white p-6 rounded-lg shadow flex flex-col items-center text-center space-y-2'>
						<img src={doctor.imageUrl || 'https://randomuser.me/api/portraits/men/75.jpg'} alt={doctor.name} className='h-40 w-40 rounded-full object-cover' />

						<div className='flex-1 min-w-0'>
							<p className='font-semibold text-lg'>{doctor.name || 'Nome não disponível'}</p>
							<p className='text-sm text-gray-600 truncate'>{doctor.email || 'Sem email'}</p>
							<p className='text-xm text-gray-500 truncate'>{doctor.specialty?.join(', ')}</p>
						</div>

						<div className='flex space-x-2 mt-4'>
							<button
								onClick={() => openEditModal(doctor)}
								className='text-green-600 hover:text-white border border-green-600 hover:bg-green-600 rounded px-3 py-1 text-mb font-semibold transition-colors duration-200 whitespace-nowrap'
							>
								Editar
							</button>

							<button
								onClick={() => handleDeleteDoctor(doctor.id)}
								className='text-red-600 hover:text-white border border-red-600 hover:bg-red-600 rounded px-3 py-1 text-mb font-semibold transition-colors duration-200 whitespace-nowrap'
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
						<h2 className='text-xl font-semibold mb-4'>{editingDoctor ? 'Editar Médico' : 'Adicionar Novo Médico'}</h2>
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
									disabled={!!editingDoctor}
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
									required={!editingDoctor}
									placeholder={editingDoctor ? 'Deixe vazio para manter a senha' : ''}
									className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm'
									disabled={!!editingDoctor}
								/>
							</div>
							<div>
								<label htmlFor='specialty' className='block text-sm font-medium text-gray-700'>
									Especialidade
								</label>
								<select id='specialty' value={selectedSpecialty} onChange={e => setSelectedSpecialty(e.target.value)} required className='border w-full p-2 rounded'>
									<option value=''>Selecione uma especialidade</option>
									{specialty.map((item, index) => (
										<option key={index} value={item}>
											{item}
										</option>
									))}
								</select>
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
								<button onClick={handleSignup} type='submit' className='px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md'>
									{editingDoctor ? 'Salvar Alterações' : 'Criar Médico'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
