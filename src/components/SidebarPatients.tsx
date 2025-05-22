import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Patient } from '../pages/patient/data/types';
import { useNavigate } from 'react-router-dom';

// Definindo a estrutura de um paciente

export default function SidebarPatients() {
	const [patients, setPatients] = useState<Patient[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const navigate = useNavigate();

	useEffect(() => {
		const fetchPatients = async () => {
			try {
				const q = query(collection(db, 'users'), where('role', '==', 'patient'));
				const querySnapshot = await getDocs(q);
				const fetchedPatients: Patient[] = querySnapshot.docs.map(doc => ({
					id: doc.id,
					...doc.data(),
				})) as Patient[];

				setPatients(fetchedPatients);
			} catch (error) {
				console.error('Erro ao buscar pacientes:', error);
			}
		};

		fetchPatients();
	}, []);

	const filteredPatients = patients.filter(patient => patient.name.toLowerCase().includes(searchTerm.toLowerCase()));

	return (
		<ul role='list' className='rounded-3xl bg-white divide-y divide-gray-100'>
			<li className='flex justify-between items-center gap-x-6 p-5'>
				<h2 className='text-2xl font-medium'>Patients</h2>
			</li>
			<input type='text' placeholder='Procurar...' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className='mb-4 p-2 w-full border rounded' />
			<ul className='space-y-4 overflow-y-auto max-h-64 sm:max-h-none'>
				{filteredPatients.map(patient => (
					<li key={patient.id} className='flex justify-between gap-x-6 p-5 items-center' onClick={() => navigate(`/pacientes/${patient.id}`)}>
						<img src={patient.imageUrl || 'nao existe'} alt={patient.name} className='h-10 w-10 rounded-full' />
						<div className='min-w-0 flex-auto'>
							<p className='text-sm font-semibold leading-6 text-gray-900'>{patient.name}</p>
							<p className='mt-1 truncate text-xs leading-5 text-gray-500'>
								{patient.gender}, {patient.age}
							</p>
						</div>
					</li>
				))}
			</ul>
		</ul>
	);
}
