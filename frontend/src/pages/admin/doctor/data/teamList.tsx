import { useEffect, useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Doctor } from '../../../doctor/doctorType';
import toast from 'react-hot-toast';
import { getDoctors, createDoctor, updateDoctor, deleteDoctor } from '../../../../services/apiService';

export default function TeamList() {
	const [doctors, setDoctors] = useState<Doctor[]>([]);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [imageUrl, setImageUrl] = useState('');
	const [selectedSpecialty, setSelectedSpecialty] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
	const [error, setError] = useState('');

	const specialties = ['Cardiologia', 'Dermatologia', 'Endocrinologia', 'Ginecologia', 'Ortopedia', 'Pediatria', 'Urologia'];

	const fetchDoctors = async () => {
		try {
			const data = await getDoctors();
			setDoctors(data);
		} catch (err) {
			console.error('Erro ao carregar dados:', err);
			toast.error('Erro ao carregar médicos');
		}
	};

	useEffect(() => {
		fetchDoctors();
	}, []);

	const openModal = (doctor?: Doctor) => {
		if (doctor) {
			setEditingDoctor(doctor);
			setName(doctor.name);
			setEmail(doctor.email);
			setSelectedSpecialty(doctor.specialty?.[0] || '');
			setImageUrl(doctor.imageUrl || '');
			setPassword('');
		} else {
			setEditingDoctor(null);
			setName('');
			setEmail('');
			setPassword('');
			setSelectedSpecialty('');
			setImageUrl('');
		}
		setError('');
		setShowModal(true);
	};

	const handleCancel = () => setShowModal(false);

	const handleSave = async () => {
		if (!name || !email || (!editingDoctor && !password) || !selectedSpecialty) {
			toast.error('Preencha todos os campos obrigatórios.');
			return;
		}

		const doctorData = {
			name,
			email,
			password,
			imageUrl,
			specialty: [selectedSpecialty],
		};

		try {
			if (editingDoctor) {
				await updateDoctor(editingDoctor.id, doctorData);
				toast.success('Médico atualizado com sucesso!');
			} else {
				await createDoctor(doctorData);
				toast.success('Médico criado com sucesso!');
			}
			handleCancel();
			fetchDoctors();
		} catch (err: any) {
			console.error(err);
			toast.error('Erro ao salvar médico.');
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm('Tem certeza que deseja eliminar este médico?')) return;
		try {
			await deleteDoctor(id);
			toast.success('Médico removido com sucesso!');
			fetchDoctors();
		} catch (err: any) {
			console.error(err);
			toast.error('Erro ao eliminar médico.');
		}
	};

	return (
		<div className='p-6'>
			<div className='flex justify-between items-center mb-4'>
				<h1 className='text-3xl font-bold text-teal-700 flex items-center gap-2 mb-6'>
					<UserPlus className='w-7 h-7' />
					Gestão de Médicos
				</h1>
				<button onClick={() => openModal()} className='bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded shadow'>
					Adicionar Médico
				</button>
			</div>

			<ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2'>
				{doctors.map(doctor => (
					<li key={doctor.id} className='bg-white p-6 rounded-lg shadow flex flex-col items-center text-center space-y-2'>
						<img src={doctor.imageUrl || 'https://randomuser.me/api/portraits/men/75.jpg'} alt={doctor.name} className='h-40 w-40 rounded-full object-cover' />
						<div className='flex-1 min-w-0'>
							<p className='font-semibold text-lg'>{doctor.name || 'Nome não disponível'}</p>
							<p className='text-sm text-gray-600 truncate'>{doctor.email || 'Sem email'}</p>
							<p className='text-sm text-gray-500 truncate'>{doctor.specialty?.join(', ')}</p>
						</div>
						<div className='flex space-x-2 mt-4'>
							<button
								onClick={() => openModal(doctor)}
								className='text-green-600 hover:text-white border border-green-600 hover:bg-green-600 rounded px-3 py-1 text-sm font-semibold transition-colors duration-200 whitespace-nowrap'
							>
								Editar
							</button>
							<button
								onClick={() => handleDelete(doctor.id)}
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
						<h2 className='text-xl font-semibold mb-4'>{editingDoctor ? 'Editar Médico' : 'Adicionar Novo Médico'}</h2>
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
									{specialties.map((item, idx) => (
										<option key={idx} value={item}>
											{item}
										</option>
									))}
								</select>
							</div>

							<div className='flex justify-end space-x-3 pt-4'>
								<button type='button' onClick={handleCancel} className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md shadow-sm'>
									Cancelar
								</button>
								<button type='submit' onClick={handleSave} className='px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md'>
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
