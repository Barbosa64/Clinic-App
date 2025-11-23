import { useEffect, useState } from 'react';
import { CalendarCheck, History } from 'lucide-react';
import { getAppointments, deleteAppointment } from '../services/apiService';
import { Appointment } from '../types';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

interface Props {
	patientId?: string;
}

export default function AppointmentsHistory({ patientId }: Props) {
	const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);
	const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
	const [loading, setLoading] = useState(true);
	const { role, user } = useAuth();

	useEffect(() => {
		const fetchAppointmentsData = async () => {
			setLoading(true);
			try {
				const filters: { patientId?: string } = {};

				if (role === 'PATIENT') {
					filters.patientId = user?.id;
				} else if (patientId) {
					filters.patientId = patientId;
				}

				if (!filters.patientId) {
					setLoading(false);
					return;
				}

				const allAppointments = await getAppointments(filters);

				const now = new Date();
				const upcoming: Appointment[] = [];
				const past: Appointment[] = [];

				allAppointments.forEach(appt => {
					if (new Date(appt.date) >= now) {
						upcoming.push(appt);
					} else {
						past.push(appt);
					}
				});

				upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
				past.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

				setUpcomingAppointments(upcoming);
				setPastAppointments(past);
			} catch (error) {
				console.error('Erro ao buscar consultas:', error);
				toast.error('Não foi possível carregar o histórico de consultas.');
			} finally {
				setLoading(false);
			}
		};

		fetchAppointmentsData();
	}, [patientId, role, user]);

	const handleCancelAppointment = async (id: string) => {
		if (!confirm('Tem a certeza que deseja cancelar esta consulta?')) {
			return;
		}

		try {
			await deleteAppointment(id);

			setUpcomingAppointments(prev => prev.filter(appt => appt.id !== id));

			setPastAppointments(prev => prev.filter(appt => appt.id !== id));

			toast.success('Consulta cancelada com sucesso!');
		} catch (error) {
			console.error('Erro ao cancelar consulta:', error);
			const errorMessage = (error as any).response?.data?.message || 'Não foi possível cancelar a consulta.';
			toast.error(errorMessage);
		}
	};

	if (loading)
		return (
			<div className='flex justify-center items-center h-32'>
				<div className='animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600'></div>
				<span className='ml-3 text-teal-700 font-medium'>A carregar consultas...</span>
			</div>
		);

	const patientNameForDisplay = pastAppointments[0]?.patientName || upcomingAppointments[0]?.patientName;

	return (
		<div className='bg-white p-6 rounded-lg shadow space-y-8'>
			{/* Próximas Consultas */}
			<section>
				<h2 className='text-xl font-semibold text-teal-700 mb-3 flex items-center gap-2'>
					<CalendarCheck className='w-5 h-5 text-teal-600' />
					Próximas Consultas {role !== 'PATIENT' && patientNameForDisplay ? `de ${patientNameForDisplay}` : ''}
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
									<span className='font-medium'>🩺 Médico:</span> {appt.doctorName}
								</p>
								<p>
									<span className='font-medium'>🏷️ Especialidade:</span> {appt.specialty || 'N/A'}
								</p>
								{/* Adicionar nome do paciente se for admin/médico */}
								{role !== 'PATIENT' && (
									<p>
										<span className='font-medium'>🧑 Paciente:</span> {appt.patientName}
									</p>
								)}
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
									<span className='font-medium'>🩺 Médico:</span> {appt.doctorName}
								</p>
								<p>
									<span className='font-medium'>🏷️ Especialidade:</span> {appt.specialty || 'N/A'}
								</p>
								{role !== 'PATIENT' && (
									<p>
										<span className='font-medium'>🧑 Paciente:</span> {appt.patientName}
									</p>
								)}
								{role === 'ADMIN' && (
									<button onClick={() => handleCancelAppointment(appt.id)} className='mt-2 px-3 py-1 bg-red-100 text-red-700 text-sm rounded hover:bg-red-200'>
										Apagar Registo
									</button>
								)}
							</li>
						))}
					</ul>
				)}
			</section>
		</div>
	);
}
