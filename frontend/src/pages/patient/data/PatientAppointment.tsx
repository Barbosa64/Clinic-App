import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { Stethoscope } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { Patient } from './typesPatient';
import { Doctor } from '../../doctor/doctorType';
import { Appointment } from '../../../types';
import { getDoctors, getMe, getAppointments, createAppointment, CreateAppointmentData } from '../../../services/apiService';

export default function PatientAppointment() {
	const [specialties, setSpecialties] = useState<string[]>([]);
	const [doctors, setDoctors] = useState<Doctor[]>([]);
	const [patientData, setPatientData] = useState<Patient | null>(null);
	const [myAppointments, setMyAppointments] = useState<Appointment[]>([]);
	const [loading, setLoading] = useState(true);

	//formulário
	const [selectedSpecialty, setSelectedSpecialty] = useState('');
	const [selectedDoctorId, setSelectedDoctorId] = useState('');
	const [appointmentDate, setAppointmentDate] = useState('');

	const { user } = useAuth();

	const fetchData = useCallback(async () => {
		if (!user?.id) return;
		setLoading(true);
		try {
			const [fetchedDoctors, fetchedPatient, fetchedAppointments] = await Promise.all([getDoctors(), getMe(), getAppointments({ patientId: user.id })]);

			setDoctors(fetchedDoctors);
			setPatientData(fetchedPatient);
			setMyAppointments(fetchedAppointments);

			// Extrair especialidades

			const specialtiesSet = new Set<string>();
			fetchedDoctors.forEach(doctor => {
				doctor.specialty?.forEach(spec => specialtiesSet.add(spec));
			});
			setSpecialties(Array.from(specialtiesSet));
		} catch (error) {
			console.error('Erro ao buscar dados:', error);
			toast.error('Não foi possível carregar os dados necessários.');
		} finally {
			setLoading(false);
		}
	}, [user]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	// filtro

	const availableDoctors = doctors.filter(d => d.specialty?.includes(selectedSpecialty));

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedDoctorId || !appointmentDate || !user?.id) {
			toast.error('Preencha todos os campos.');
			return;
		}

		if (new Date(appointmentDate) < new Date()) {
			toast.error('A data da consulta deve ser no futuro.');
			return;
		}

		//objeto de dados para enviar à API

		const appointmentData: CreateAppointmentData = {
			doctorId: selectedDoctorId,
			patientId: user.id,
			date: new Date(appointmentDate).toISOString(),
			specialty: selectedSpecialty,
		};

		try {
			await createAppointment(appointmentData);
			toast.success('Consulta marcada com sucesso!');
			setSelectedSpecialty('');
			setSelectedDoctorId('');
			setAppointmentDate('');

			await fetchData();
		} catch (error) {
			console.error('Erro ao marcar consulta:', error);
			toast.error('Erro ao marcar consulta.');
		}
	};

	if (loading) {
		return <p className='text-center text-gray-500'>A carregar dados...</p>;
	}

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
									{new Date(appt.date).toLocaleString('pt-PT', {
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
