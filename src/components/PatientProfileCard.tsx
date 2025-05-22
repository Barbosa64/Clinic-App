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

	if (loading) return <p className='text-center mt-10'>Carregando...</p>;
	if (!patient) return <p className='text-center mt-10 text-red-500'>Paciente não encontrado</p>;

	return (
		<div className='bg-white p-4 rounded shadow text-center max-w-sm w-full mx-auto sm:max-w-md lg:max-w-lg'>
			<img className='mx-auto h-24 w-24 rounded-full object-cover' src={patient.imageUrl || 'https://placehold.co/100x100?text=Avatar'} alt={patient.name} />
			<h3 className='mt-2 text-lg font-semibold'>{patient.name}</h3>
			<p className='text-gray-500 text-sm'>
				{patient.gender}, {patient.age}
			</p>
			<div className='mt-4 space-y-2 text-sm text-gray-600'>
				<p>📅 Nascimento: {patient.birthDate || 'N/A'}</p>
				<p>📞 Contacto: {patient.phone || 'N/A'}</p>
				<p>🏥 Seguro: {patient.insurance || 'N/A'}</p>
			</div>
			<button className='mt-4 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition'>Mostrar toda a informação</button>
		</div>
	);
}
