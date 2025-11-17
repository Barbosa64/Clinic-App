import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { getPatientById, getMe } from '../../../services/apiService';
import { Patient } from './typesPatient';

export default function PatientProfile() {
	const { id } = useParams<{ id: string }>();
	const { role } = useAuth();
	const [patient, setPatient] = useState<Patient | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchPatientData = async () => {
			setLoading(true);

			try {
				let patientData = null;
				if (role === 'PATIENT') {
					patientData = await getMe();
				} else if (id) {
					patientData = await getPatientById(id);
				}
				setPatient(patientData);
			} catch (error) {
				const errorMessage = (error as any).response?.data?.message || 'Não foi possível carregar os dados.';
				toast.error(errorMessage);
			} finally {
				setLoading(false);
			}
		};
		console.log(`[DEBUG] Role atual: ${role}, ID da URL: ${id}`);
		if (role) {
			fetchPatientData();
		}
	}, [role, id]);

	if (loading) {
		return <p className='text-center text-gray-500'>A carregar ficha do paciente...</p>;
	}

	if (!patient) {
		return <p className='text-center text-red-500'>Não foi possível encontrar os dados deste paciente.</p>;
	}

	const calculateAge = (birthDateString?: string) => {
		if (!birthDateString) return 'N/A';
		const birthDate = new Date(birthDateString);
		const today = new Date();
		let age = today.getFullYear() - birthDate.getFullYear();
		const monthDifference = today.getMonth() - birthDate.getMonth();
		if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
			age--;
		}
		return age;
	};

	return (
		<div className='bg-white p-6 rounded-lg shadow'>
			<div className='flex items-center space-x-4'>
				<img src={patient.imageUrl || 'https://via.placeholder.com/150'} alt={patient.name} className='h-24 w-24 rounded-full object-cover border-4 border-teal-500' />
				<div>
					<h1 className='text-3xl font-bold text-gray-800'>{patient.name}</h1>
					<p className='text-gray-600'>{patient.email}</p>
				</div>
			</div>

			<div className='mt-6 border-t border-gray-200 pt-6'>
				<h2 className='text-xl font-semibold text-gray-700 mb-4'>Informações Pessoais</h2>
				<dl className='grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2'>
					<div className='py-2'>
						<dt className='text-sm font-medium text-gray-500'>Idade</dt>
						<dd className='mt-1 text-md text-gray-900'>{calculateAge(patient.birthDate)} anos</dd>
					</div>
					<div className='py-2'>
						<dt className='text-sm font-medium text-gray-500'>Género</dt>
						<dd className='mt-1 text-md text-gray-900'>{patient.gender || 'Não especificado'}</dd>
					</div>
					<div className='py-2'>
						<dt className='text-sm font-medium text-gray-500'>Telefone</dt>
						<dd className='mt-1 text-md text-gray-900'>{patient.phone || 'Não especificado'}</dd>
					</div>
					<div className='py-2'>
						<dt className='text-sm font-medium text-gray-500'>Data de Nascimento</dt>
						<dd className='mt-1 text-md text-gray-900'>{patient.birthDate ? new Date(patient.birthDate).toLocaleDateString('pt-PT') : 'Não especificada'}</dd>
					</div>
				</dl>
			</div>

			<div className='mt-6 border-t border-gray-200 pt-6'>
				<h2 className='text-xl font-semibold text-gray-700 mb-4'>Informações do Seguro</h2>
				<dl className='grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2'>
					<div className='py-2'>
						<dt className='text-sm font-medium text-gray-500'>Seguro</dt>
						<dd className='mt-1 text-md text-gray-900'>{patient.insurance || 'Não especificado'}</dd>
					</div>
					<div className='py-2'>
						<dt className='text-sm font-medium text-gray-500'>Número do Seguro</dt>
						<dd className='mt-1 text-md text-gray-900'>{patient.insuranceNumber || 'Não especificado'}</dd>
					</div>
				</dl>
			</div>
		</div>
	);
}
