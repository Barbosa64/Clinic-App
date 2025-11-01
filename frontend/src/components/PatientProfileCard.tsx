import { useEffect, useState } from 'react';
import { Patient } from '../pages/patient/data/typesPatient';
import { CalendarIcon, PhoneIcon, ShieldCheckIcon } from 'lucide-react';
import { calcularIdade } from '../lib/utilsIdade';
import { getPatientById } from '../services/apiService';

type Props = {
	id: string;
};

export default function PatientProfileCard({ id }: Props) {
	const [patient, setPatient] = useState<Patient | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!id) {
			setLoading(false);
			setPatient(null);
			return;
		}

		const fetchPatient = async () => {
			setLoading(true);
			try {
				const fetchedPatient = await getPatientById(id);
				setPatient(fetchedPatient);
			} catch (error) {
				console.error('Falha ao carregar os dados do paciente');
			} finally {
				setLoading(false);
			}
		};

		fetchPatient();
	}, [id]);

	if (loading) return <p className='text-center mt-10'>A carregar...</p>;
	if (!patient) return <p className='text-center mt-10 text-red-600 font-semibold'>Paciente não encontrado</p>;

	const formatBirthDate = (dateString: string | undefined) => {
		if (!dateString) return 'N/A';
		return new Date(dateString).toLocaleDateString('pt-PT');
	};

	return (
		<div className='bg-white p-6 rounded-lg shadow-md text-center flex flex-col items-center max-w-sm mx-auto'>
			<img className='h-24 w-24 rounded-full object-cover' src={patient.imageUrl || 'https://placehold.co/100x100?text=Avatar'} alt={patient.name} />
			<h3 className='mt-3 text-xl font-semibold text-teal-700'>{patient.name}</h3>
			<p className='text-gray-500 text-sm'>
				{patient.gender} {calcularIdade(patient.birthDate) ?? 'Idade desconhecida'}
			</p>
			<div className='mt-4 space-y-3 text-sm text-gray-700 text-left w-full px-6'>
				<p className='flex items-center gap-2'>
					<CalendarIcon className='w-4 h-4 text-teal-600' />
					<span>
						Nascimento: <span className='font-medium'>{formatBirthDate(patient.birthDate)}</span>
					</span>
				</p>
				<p className='flex items-center gap-2'>
					<PhoneIcon className='w-4 h-4 text-teal-600' />
					<span>
						Contacto: <span className='font-medium'>{patient.phone || 'N/A'}</span>
					</span>
				</p>
				<p className='flex items-center gap-2'>
					<ShieldCheckIcon className='w-4 h-4 text-teal-600' />
					<span>
						Seguro: <span className='font-medium'>{patient.insurance || 'N/A'}</span>
					</span>
				</p>
				<p className='flex items-center gap-2'>
					<ShieldCheckIcon className='w-4 h-4 text-teal-600' />
					<span>
						Numero do Seguro: <span className='font-medium'>{patient.insuranceNumber || 'N/A'}</span>
					</span>
				</p>
			</div>
		</div>
	);
}
