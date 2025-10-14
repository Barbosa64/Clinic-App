import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { Stethoscope } from 'lucide-react';

import { Patient } from './typesPatient';
import { Doctor } from '../../doctor/doctorType';


type Appointment = {
	id: string; 
	date: Timestamp;
	doctorId: string; 
	doctorName: string;
	patientId: string;
	patientName: string;
	specialty: string;
};

export default function PatientAppointment() {

	const [specialties, setSpecialties] = useState<string[]>([]);
	const [doctors, setDoctors] = useState<Doctor[]>([]); // Usar o tipo Doctor
	const [selectedSpecialty, setSelectedSpecialty] = useState('');
	const [selectedDoctorId, setSelectedDoctorId] = useState('');
	const [appointmentDate, setAppointmentDate] = useState('');
	const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
	const [patientData, setPatientData] = useState<Patient | null>(null); // Usar o tipo Patient
	const [myAppointments, setMyAppointments] = useState<Appointment[]>([]); // Usar o tipo Appointment

	const { user } = useAuth();

	// --- FUNÇÃO REUTILIZÁVEL PARA BUSCAR CONSULTAS ---
	const fetchMyAppointments = useCallback(async () => {
		if (!user?.uid) return;
		try {
			const appointmentsQuery = query(collection(db, 'Appointments'), where('patientId', '==', user.uid));
			const appointmentsSnap = await getDocs(appointmentsQuery);
			const appointmentsList = appointmentsSnap.docs.map(
				doc =>
					({
						id: doc.id,
						...doc.data(),
					} as Appointment),
			);
			setMyAppointments(appointmentsList);
		} catch (error) {
			console.error('Erro ao buscar as minhas consultas:', error);
		}
	}, [user]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const doctorQuery = query(collection(db, 'users'), where('role', '==', 'doctor'));
				const doctorSnap = await getDocs(doctorQuery);

				const fetchedDoctors = doctorSnap.docs.map(
					doc =>
						({
							id: doc.id,
							...doc.data(),
						} as Doctor),
				);
				setDoctors(fetchedDoctors);

				// Extrair especialidades dos doutores já carregados
				const specialtiesSet = new Set<string>();
				fetchedDoctors.forEach(doctor => {
					if (Array.isArray(doctor.specialty)) {
						doctor.specialty.forEach((spec: string) => specialtiesSet.add(spec));
					}
				});
				setSpecialties(Array.from(specialtiesSet));

				// Buscar dados do paciente e as suas consultas
				if (user?.uid) {
					const patientRef = doc(db, 'users', user.uid);
					const patientSnap = await getDoc(patientRef);
					if (patientSnap.exists()) {
						setPatientData(patientSnap.data() as Patient);
					}
					await fetchMyAppointments();
				}
			} catch (error) {
				console.error('Erro ao buscar dados:', error);
			}
		};

		fetchData();
	}, [user, fetchMyAppointments]);

	const availableDoctors = doctors.filter(d => Array.isArray(d.specialty) && d.specialty.includes(selectedSpecialty));

	// --- FUNÇÃO PARA SUBMETER O FORMULÁRIO ---
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedDoctorId || !appointmentDate || !user?.uid || !patientData) {
			alert('Preencha todos os campos.');
			return;
		}

		const appointmentDateTime = new Date(appointmentDate);
		if (appointmentDateTime < new Date()) {
			alert('A data da consulta deve ser no futuro.');
			return; // Não mude o status para erro aqui, apenas retorne.
		}

		setStatus('loading');

		try {
			// OTIMIZAÇÃO: Não é preciso buscar o médico na BD. Ele já está no estado 'doctors'.
			const doctorData = doctors.find(doc => doc.id === selectedDoctorId);
			if (!doctorData) {
				alert('Dados do médico não encontrados!');
				setStatus('error');
				return;
			}

			await addDoc(collection(db, 'Appointments'), {
				doctorId: selectedDoctorId,
				doctorName: doctorData.name || 'Desconhecido',
				specialty: selectedSpecialty,
				patientId: user.uid,
				patientName: patientData.name || 'Paciente Desconhecido', // O seu tipo Patient não tem email
				date: Timestamp.fromDate(appointmentDateTime),
				status: 'Scheduled', // É uma boa prática adicionar um status
			});

			setStatus('success');
			alert('Consulta marcada com sucesso!');
			setSelectedSpecialty('');
			setSelectedDoctorId('');
			setAppointmentDate('');

			await fetchMyAppointments(); // Atualizar a lista de consultas
		} catch (error) {
			console.error('Erro ao marcar consulta:', error);
			setStatus('error');
			alert('Erro ao marcar consulta.');
		} finally {
			// Garante que o estado de 'loading' é sempre limpo
			if (status !== 'success') {
				setStatus('idle');
			}
		}
	};

	return (
		<div className='p-8 max-w-3xl mx-auto'>
			<h1 className='text-3xl font-bold mb-6 text-teal-700 flex items-center gap-2'>
				<CalendarDaysIcon className='w-7 h-7' />
				Marcar Consulta
			</h1>

			<form onSubmit={handleSubmit} className='space-y-4 bg-white p-6 rounded-lg shadow'>
				<div>
					<label className='block mb-1 font-medium text-gray-700'>Paciente:</label>
					{/* O seu tipo Patient não tem 'email', então removemos essa opção */}
					<p className='border p-2 rounded bg-gray-100'>{patientData?.name || user?.email}</p>
				</div>

				<div>
					<label className='block mb-1 font-medium text-gray-700'>Especialidade:</label>
					<select
						className='border w-full p-2 rounded'
						value={selectedSpecialty}
						onChange={e => {
							setSelectedSpecialty(e.target.value);
							setSelectedDoctorId('');
						}}
					>
						<option value=''>Selecione uma especialidade</option>
						{specialties.map(spec => (
							<option key={spec} value={spec}>
								{spec}
							</option>
						))}
					</select>
				</div>

				{selectedSpecialty && (
					<div>
						<label className='block mb-1 font-medium text-gray-700'>Médico:</label>
						<select className='border w-full p-2 rounded' value={selectedDoctorId} onChange={e => setSelectedDoctorId(e.target.value)}>
							<option value=''>Selecione um médico</option>
							{/* Agora `doc.id` existe e a key funcionará corretamente */}
							{availableDoctors.map(doc => (
								<option key={doc.id} value={doc.id}>
									{/* Usar optional chaining (`?.`) para segurança caso a especialidade seja nula */}
									{doc.name} - {doc.specialty?.join(', ')}
								</option>
							))}
						</select>
					</div>
				)}

				<div>
					<label className='block mb-1 font-medium text-gray-700'>Data da Consulta:</label>
					<input type='datetime-local' className='border w-full p-2 rounded' value={appointmentDate} onChange={e => setAppointmentDate(e.target.value)} min={new Date().toISOString().slice(0, 16)} />
				</div>

				<button type='submit' className='mt-4 w-full px-4 py-2 bg-teal-600 text-white font-medium rounded hover:bg-teal-700 transition' disabled={status === 'loading'}>
					{status === 'loading' ? 'A marcar...' : 'Marcar Consulta'}
				</button>
			</form>

			<div className='mt-10'>
				<h2 className='text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2'>
					<Stethoscope className='w-6 h-6 text-teal-600' />
					As Minhas Consultas
				</h2>
				{myAppointments.length === 0 ? (
					<p className='text-gray-500'>Nenhuma consulta agendada.</p>
				) : (
					<ul className='grid gap-4 sm:grid-cols-2'>
						{myAppointments.map(appt => (
							<li key={appt.id} className='border p-4 rounded-lg shadow bg-white'>
								<p className='text-gray-800'>
									<span className='font-semibold'>🩺 Médico:</span> {appt.doctorName}
								</p>
								<p className='text-gray-800'>
									<span className='font-semibold'>🏷️ Especialidade:</span> {appt.specialty}
								</p>
								<p className='text-gray-800'>
									<span className='font-semibold'>📅 Data:</span>{' '}
									{new Date(appt.date.seconds * 1000).toLocaleString('pt-PT', {
										dateStyle: 'long',
										timeStyle: 'short',
									})}
								</p>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}
