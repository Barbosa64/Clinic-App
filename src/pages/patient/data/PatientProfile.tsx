import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { Patient } from './typesPatient';

export default function PatientProfile() {
	const { id } = useParams<{ id: string }>();
	const [patient, setPatient] = useState<Patient | null>(null);

	useEffect(() => {
		const fetchPatient = async () => {
			if (!id) return;
			const patientRef = doc(db, 'users', id);
			const docSnap = await getDoc(patientRef);
			if (docSnap.exists()) {
				setPatient({ id: docSnap.id, ...docSnap.data() } as Patient);
			}
		};
		fetchPatient();
	}, [id]);

	if (!patient) return <p>A carregar ficha do paciente...</p>;

	return (
		<div className='p-6'>
			<h1 className='text-3xl font-bold'>{patient.name}</h1>
			<p className='text-gray-600'>Idade: {patient.age}</p>
			<p className='text-gray-600'>Gênero: {patient.gender}</p>
		</div>
	);
}
