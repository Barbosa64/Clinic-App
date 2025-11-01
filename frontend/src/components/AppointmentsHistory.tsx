// frontend/src/components/AppointmentsHistory.tsx

import { useEffect, useState } from 'react';
import { CalendarCheck, History } from 'lucide-react';

// 1. Importar a nossa função de API e o tipo
import { getAppointments } from '../services/apiService';
import { Appointment } from '../types';
import { useAuth } from '../context/AuthContext'; // Precisamos do papel do utilizador

interface Props {
	patientId?: string; // Mantemos para contexto, mas a lógica principal usa o utilizador logado
}

export default function AppointmentsHistory({ patientId }: Props) {
	const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);
	const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
	const [loading, setLoading] = useState(true);
	const { role } = useAuth(); // Obter o papel do utilizador a partir do contexto

	useEffect(() => {
		const fetchAppointmentsData = async () => {
			setLoading(true);
			try {
				const allAppointments = await getAppointments();

				const now = new Date();
				const upcoming: Appointment[] = [];
				const past: Appointment[] = [];

				// Filtrar e separar as consultas em futuras e passadas
				allAppointments.forEach(appt => {
					if (new Date(appt.date) >= now) {
						upcoming.push(appt);
					} else {
						past.push(appt);
					}
				});

				// Ordenar as consultas
				upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
				past.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

				setUpcomingAppointments(upcoming);
				setPastAppointments(past);
			} catch (error) {
				console.error('Erro ao buscar consultas:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchAppointmentsData();
	}, [patientId]); // Pode depender do patientId para re-fetch quando muda de paciente no dashboard

	const handleCancelAppointment = async (id: string) => {
		// AVISO: A API para cancelar ainda não foi adicionada ao apiService
		// Isto vai precisar da sua própria função no apiService:
		// await apiClient.delete(`/appointments/${id}`);
		alert('Funcionalidade de cancelar ainda a ser migrada para a nova API.');
	};

	if (loading)
		return (
			<div className='flex justify-center items-center h-32'>
				<div className='animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600'></div>
				<span className='ml-3 text-teal-700 font-medium'>A carregar consultas...</span>
			</div>
		);

	return (
		<div className='bg-white p-6 rounded-lg shadow space-y-8'>
			{/* Próximas Consultas */}
			<section>
				<h2 className='text-xl font-semibold text-teal-700 mb-3 flex items-center gap-2'>
					<CalendarCheck className='w-5 h-5 text-teal-600' />
					Próximas Consultas
				</h2>
				{upcomingAppointments.length === 0 ? (
					<p className='text-gray-400'>Nenhuma consulta agendada</p>
				) : (
					<ul className='grid gap-4 sm:grid-cols-2'>
						{upcomingAppointments.slice(0, 4).map(appt => (
							<li key={appt.id} className='border p-4 rounded-lg bg-gray-50 shadow-sm'>
								<p>
									<span className='font-medium'>📅 Data:</span> {new Date(appt.date).toLocaleString('pt-PT')}
								</p>
								<p>
									<span className='font-medium'>🩺 Médico:</span> {appt.doctor.name}
								</p>
								<p>
									<span className='font-medium'>🏷️ Especialidade:</span> {appt.specialty}
								</p>
								{(role === 'DOCTOR' || role === 'ADMIN') && (
									<button onClick={() => handleCancelAppointment(appt.id)} className='mt-2 px-3 py-1 bg-red-100 text-red-700 text-sm rounded hover:bg-red-200'>
										Cancelar
									</button>
								)}
							</li>
						))}
					</ul>
				)}
			</section>

			{/* Histórico de Consultas */}
			<section>
				<h2 className='text-xl font-semibold text-teal-700 mb-3 flex items-center gap-2'>
					<History className='w-5 h-5 text-teal-600' />
					Histórico de Consultas
				</h2>
				{pastAppointments.length === 0 ? (
					<p className='text-gray-400'>Nenhuma consulta realizada</p>
				) : (
					<ul className='grid gap-4 sm:grid-cols-2'>
						{pastAppointments.slice(0, 2).map(appt => (
							<li key={appt.id} className='border p-4 rounded-lg bg-gray-50 shadow-sm'>
								<p>
									<span className='font-medium'>📅 Data:</span> {new Date(appt.date).toLocaleString('pt-PT')}
								</p>
								<p>
									<span className='font-medium'>🩺 Médico:</span> {appt.doctor.name}
								</p>
								<p>
									<span className='font-medium'>🏷️ Especialidade:</span> {appt.specialty}
								</p>
							</li>
						))}
					</ul>
				)}
			</section>
		</div>
	);
}
