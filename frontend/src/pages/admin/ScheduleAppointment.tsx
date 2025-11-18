import { useState, useEffect } from 'react';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { Doctor } from '../doctor/doctorType';
import { Patient } from '../patient/data/typesPatient';
import toast from 'react-hot-toast';
import { getDoctors, getPatients, createAppointment, getDoctorAvailability } from '../../services/apiService';

export default function ScheduleAppointment() {
	const [doctors, setDoctors] = useState<Doctor[]>([]);
	const [patients, setPatients] = useState<Patient[]>([]);
	const [specialties, setSpecialties] = useState<string[]>([]);

	const [selectedPatientId, setSelectedPatientId] = useState('');
	const [selectedSpecialty, setSelectedSpecialty] = useState('');
	const [selectedDoctorId, setSelectedDoctorId] = useState('');
	const [appointmentDate, setAppointmentDate] = useState('');
	const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

	const [bookedSlots, setBookedSlots] = useState<string[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [fetchDoctors, fetchPatients] = await Promise.all([getDoctors(), getPatients()]);

				setDoctors(fetchDoctors);
				setPatients(fetchPatients);

				const specialtiesSet = new Set<string>();
				fetchDoctors.forEach(doctor => {
					if (Array.isArray(doctor.specialty)) {
						doctor.specialty.forEach((spec: string) => specialtiesSet.add(spec));
					}
				});

				setSpecialties(Array.from(specialtiesSet));
			} catch (error) {
				console.error('Erro ao buscar dados:', error);
				toast.error('Não foi possível carregar os dados necessários.');
			}
		};

		fetchData();
	}, []);

	useEffect(() => {
		if (!selectedDoctorId) {
			setBookedSlots([]);
			return;
		}

		const fetchAvailability = async () => {
			try {
				const slots = await getDoctorAvailability(selectedDoctorId);
				setBookedSlots(slots);
			} catch (error) {
				console.error(`Erro ao buscar disponibilidade para o médico ${selectedDoctorId}:`, error);
				toast.error('Não foi possível verificar a disponibilidade do médico.');
			}
		};

		fetchAvailability();
	}, [selectedDoctorId]);

	const availableDoctors = doctors.filter(d => Array.isArray(d.specialty) && d.specialty.includes(selectedSpecialty));

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedDoctorId || !appointmentDate || !selectedPatientId || !selectedSpecialty) {
			toast.error('Preencha todos os campos.');
			return;
		}

		if (new Date(appointmentDate) < new Date()) {
			toast.error('A data da consulta deve ser no futuro.');
			return;
		}
		const selectedDateISO = new Date(appointmentDate).toISOString();
		if (bookedSlots.includes(selectedDateISO)) {
			toast.error('Este horário já está ocupado. Por favor, escolha outra data/hora.');
			return;
		}

		setStatus('loading');

		try {
			const appointmentData = {
				doctorId: selectedDoctorId,
				patientId: selectedPatientId,
				date: new Date(appointmentDate).toISOString(),
				specialty: selectedSpecialty,
			};

			await createAppointment(appointmentData);

			setStatus('success');
			toast.success('Consulta marcada com sucesso!');

			setSelectedSpecialty('');
			setSelectedDoctorId('');
			setSelectedPatientId('');
			setAppointmentDate('');
		} catch (error) {
			console.error('Erro ao marcar consulta:', error);
			setStatus('error');
			toast.error('Erro ao marcar consulta.');
		} finally {
			setStatus('idle');
		}
	};

	const isCurrentSlotBooked = new Date(appointmentDate).toISOString() === new Date().toISOString() ? false : bookedSlots.includes(new Date(appointmentDate).toISOString());

	return (
		<div className='p-8 max-w-3xl mx-auto'>
			<h1 className='text-3xl font-bold mb-6 text-teal-700 flex items-center gap-2'>
				<CalendarDaysIcon className='w-7 h-7' />
				Marcar Consulta (Admin)
			</h1>

			<form onSubmit={handleSubmit} className='space-y-4 bg-white p-6 rounded-lg shadow'>
				<div>
					<label className='block mb-1 font-medium text-gray-700'>Paciente:</label>
					<select className='border w-full p-2 rounded' value={selectedPatientId} onChange={e => setSelectedPatientId(e.target.value)}>
						<option value=''>Selecione um paciente</option>
						{patients.map(p => (
							<option key={p.id} value={p.id}>
								{p.name || p.email}
							</option>
						))}
					</select>
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
						<select required className='border w-full p-2 rounded' value={selectedDoctorId} onChange={e => setSelectedDoctorId(e.target.value)}>
							<option value=''>Selecione um médico</option>
							{availableDoctors.map(doc => (
								<option key={doc.id} value={doc.id}>
									{doc.name} - {doc.specialty?.join(', ')}
								</option>
							))}
						</select>
					</div>
				)}

				<div>
					<label className='block mb-1 font-medium text-gray-700'>Data da Consulta:</label>
					<input
						required
						type='datetime-local'
						className={`border w-full p-2 rounded ${isCurrentSlotBooked ? 'border-red-500' : ''}`}
						value={appointmentDate}
						onChange={e => setAppointmentDate(e.target.value)}
						// Adicionar um step para permitir apenas marcações de hora em hora (ou 30 em 30 min)
						step='1800' // 1800 segundos = 30 minutos
					/>
					{isCurrentSlotBooked && <p className='text-red-500 text-sm mt-1'>Este horário não está disponível para o médico selecionado.</p>}
				</div>
				<button type='submit' className='mt-4 w-full px-4 py-2 bg-teal-600 text-white font-medium rounded hover:bg-teal-700 transition' disabled={status === 'loading' || isCurrentSlotBooked}>
					{status === 'loading' ? 'A marcar...' : 'Marcar Consulta'}
				</button>
			</form>
		</div>
	);
}
