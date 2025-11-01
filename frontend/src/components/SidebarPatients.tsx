// frontend/src/components/SidebarPatients.tsx

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Patient } from '../pages/patient/data/typesPatient';
import { useAuth } from '../context/AuthContext';
import { calcularIdade } from '../lib/utilsIdade'; // Certifique-se que este caminho está correto

// 1. Importar as nossas novas funções de API
import { getPatients, getMe } from '../services/apiService';

export default function SidebarPatients() {
	const [patients, setPatients] = useState<Patient[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const navigate = useNavigate();
	const { id: selectedPatientId } = useParams();
	const { user, role } = useAuth(); // Usamos o user e o role do nosso contexto

	function classNames(...classes: string[]) {
		return classes.filter(Boolean).join(' ');
	}

	// 2. Reescrever o useEffect para usar a nossa API
	useEffect(() => {
		const fetchPatientsData = async () => {
			if (!user) return; // Se não há utilizador, não fazer nada

			try {
				if (role === 'ADMIN' || role === 'DOCTOR') {
					// Se for Admin ou Médico, busca todos os pacientes
					const fetchedPatients = await getPatients();
					setPatients(fetchedPatients);
				} else if (role === 'PATIENT') {
					// Se for Paciente, busca apenas os seus próprios dados
					const myData = await getMe();
					setPatients([myData]); // Coloca o resultado num array para manter o tipo de estado
				}
			} catch (error) {
				console.error('Erro ao procurar pacientes:', error);
				// Opcional: Mostrar uma mensagem de erro ao utilizador
			}
		};

		fetchPatientsData();
	}, [user, role]); // 3. A dependência agora é o user e o role do contexto

	const filteredPatients = patients.filter(patient => patient.name?.toLowerCase().includes(searchTerm.toLowerCase()));

	return (
		<ul role='list' className='rounded-3xl bg-white divide-y divide-gray-100'>
			<li className='flex justify-between items-center gap-x-6 p-5'>
				<h2 className='text-2xl font-medium'>Pacientes</h2>
			</li>
			<input type='text' placeholder='Procurar...' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className='mb-4 p-2 w-full border rounded' />
			<ul className='space-y-4 overflow-y-auto max-h-64 sm:max-h-none'>
				{filteredPatients.map(patient => (
					<li
						key={patient.id}
						onClick={() => navigate(`/dashboard/${patient.id}`)}
						className={classNames(
							patient.id === selectedPatientId ? 'bg-teal-600 text-white' : 'text-gray-900 hover:bg-gray-100',
							'flex justify-between gap-x-6 p-5 items-center rounded-md cursor-pointer',
						)}
					>
						<img src={patient.imageUrl || 'https://placehold.co/100x100?text=Avatar'} alt={patient.name} className='h-10 w-10 rounded-full' />
						<div className='min-w-0 flex-auto'>
							<p className='text-sm font-semibold leading-6'>{patient.name}</p>
							<p className='mt-1 truncate text-xs leading-5'>
								{patient.gender}, {calcularIdade(patient.birthDate)}
							</p>
						</div>
					</li>
				))}
			</ul>
		</ul>
	);
}
