import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Patient } from '../pages/patient/data/types';

type Props = {
	id: string;
};

export default function PatientProfileCard({ id }: Props) {
	const [patient, setPatient] = useState<Patient | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchPatient = async () => {
			if (!id) {
				setLoading(false);
				return;
			}
			try {
				const docRef = doc(db, 'users', id);
				const docSnap = await getDoc(docRef);

				if (docSnap.exists()) {
					setPatient({ id: docSnap.id, ...docSnap.data() } as Patient);
				} else {
					console.warn('Paciente não encontrado.');
				}
			} catch (error) {
				console.error('Erro ao buscar paciente:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchPatient();
	}, [id]);

	if (loading) return <p className='text-center mt-10'>A carregar...</p>;
	if (!patient) return <p className='text-center mt-10 text-red-600 font-semibold'>Paciente não encontrado</p>;

	const formatBirthDate = (date: any) => {
		if (!date) return 'N/A';
		if (date instanceof Date) return date.toLocaleDateString('pt-PT');
		if (date.toDate) return date.toDate().toLocaleDateString('pt-PT');
		return 'N/A';
	};

	return (
		<div className='bg-white p-6 rounded-lg shadow-md text-center flex flex-col items-center max-w-sm mx-auto'>
			<img className='h-24 w-24 rounded-full object-cover' src={patient.imageUrl || 'https://placehold.co/100x100?text=Avatar'} alt={patient.name} />
			<h3 className='mt-3 text-xl font-semibold text-teal-700'>{patient.name}</h3>
			<p className='text-gray-500 text-sm'>
				{patient.gender}, {patient.age ?? 'Idade desconhecida'}
			</p>
			<div className='mt-4 space-y-2 text-sm text-gray-600 text-left w-full px-6'>
				<p>
					📅 Nascimento: <span className='font-medium'>{formatBirthDate(patient.birthDate)}</span>
				</p>
				<p>
					📞 Contacto: <span className='font-medium'>{patient.phone || 'N/A'}</span>
				</p>
				<p>
					🏥 Seguro: <span className='font-medium'>{patient.insurance || 'N/A'}</span>
				</p>
			</div>
			<button className='mt-6 px-5 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition'>Mostrar toda a informação</button>
		</div>
	);
}
