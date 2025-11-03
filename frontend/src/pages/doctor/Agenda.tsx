import React, { useState, useEffect } from 'react';
import { CalendarCheck, History, Search } from 'lucide-react';
import { getAppointments, getMe } from '../../services/apiService';
import { Appointment } from '../../types';

interface AgendaAppointment extends Omit<Appointment, 'date'> {
	date: Date;
}

const Agenda: React.FC = () => {
	const [upcoming, setUpcoming] = useState<AgendaAppointment[]>([]);
	const [past, setPast] = useState<AgendaAppointment[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [filterSpecialty, setFilterSpecialty] = useState('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [loading, setLoading] = useState(true);
	const [allSpecialties, setAllSpecialties] = useState<string[]>([]);

	useEffect(() => {
		const fetchConsultas = async () => {
			try {
				const currentUser = await getMe();
				if (!currentUser) throw new Error('Utilizador não autenticado');

				let filters: { doctorId?: string; patientId?: string } = {};
				if (currentUser.role === 'DOCTOR') {
					filters = { doctorId: currentUser.id };
				} else if (currentUser.role === 'PATIENT') {
					filters = { patientId: currentUser.id };
				}

				const appointmentsFromApi = await getAppointments(filters);

				const now = new Date();
				const upcomingAppointments: AgendaAppointment[] = [];
				const pastAppointments: AgendaAppointment[] = [];
				const specialtiesSet = new Set<string>();

				appointmentsFromApi.forEach(appt => {
					const date = new Date(appt.date);
					const processedAppointment: AgendaAppointment = { ...appt, date };

					if (date >= now) {
						upcomingAppointments.push(processedAppointment);
					} else {
						pastAppointments.push(processedAppointment);
					}

					if (appt.specialty) {
						specialtiesSet.add(appt.specialty);
					}
				});

				upcomingAppointments.sort((a, b) => a.date.getTime() - b.date.getTime());
				pastAppointments.sort((a, b) => b.date.getTime() - a.date.getTime());

				setUpcoming(upcomingAppointments);
				setPast(pastAppointments);
				setAllSpecialties(Array.from(specialtiesSet));
			} catch (error) {
				console.error('Erro ao buscar consultas:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchConsultas();
	}, []);

	const applyFilters = (appointments: AgendaAppointment[]) => {
		return appointments.filter(consulta => {
			const consultaDate = consulta.date;
			const start = startDate ? new Date(startDate) : null;
			if (start) start.setHours(0, 0, 0, 0);

			const end = endDate ? new Date(endDate) : null;
			if (end) end.setHours(23, 59, 59, 999);

			const patientName = consulta.patientName || '';
			const doctorName = consulta.doctorName || '';

			return (
				(patientName.toLowerCase().includes(searchTerm.toLowerCase()) || doctorName.toLowerCase().includes(searchTerm.toLowerCase())) &&
				(!filterSpecialty || consulta.specialty === filterSpecialty) &&
				(!start || consultaDate >= start) &&
				(!end || consultaDate <= end)
			);
		});
	};

	const filteredUpcoming = applyFilters(upcoming);
	const filteredPast = applyFilters(past);

	if (loading)
		return (
			<div className='flex justify-center items-center h-32'>
				<div className='animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600'></div>
				<span className='ml-3 text-teal-700 font-medium'>A Carregar consultas...</span>
			</div>
		);

	const formatDateTime = (date: Date) => date.toLocaleString('pt-PT', { dateStyle: 'medium', timeStyle: 'short' });

	return (
		<div className='bg-white p-6 rounded-lg shadow space-y-10 max-w-5xl mx-auto'>
			{/* Filtros */}
			<div className='mb-6 bg-gray-100 p-6 rounded-lg shadow-sm'>
				<h3 className='text-lg font-semibold text-gray-700 mb-4'>🔍 Filtros de Pesquisa</h3>
				<div className='flex flex-wrap gap-4'>
					<div className='relative w-full sm:w-1/3'>
						<Search className='absolute left-3 top-3 text-gray-400' />
						<input
							type='text'
							placeholder='Procurar por nome...'
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
							className='p-2 pl-10 border border-gray-300 rounded w-full bg-white focus:outline-none focus:ring-2 focus:ring-teal-500'
						/>
					</div>
					<select
						value={filterSpecialty}
						onChange={e => setFilterSpecialty(e.target.value)}
						className='p-2 border border-gray-300 rounded w-full sm:w-1/3 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500'
					>
						<option value=''>Todas as especialidades</option>
						{allSpecialties.map(spec => (
							<option key={spec} value={spec}>
								{spec}
							</option>
						))}
					</select>
					<input
						type='date'
						value={startDate}
						onChange={e => setStartDate(e.target.value)}
						className='p-2 border border-gray-300 rounded w-full sm:w-1/6 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500'
					/>
					<input
						type='date'
						value={endDate}
						onChange={e => setEndDate(e.target.value)}
						className='p-2 border border-gray-300 rounded w-full sm:w-1/6 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500'
					/>
				</div>
			</div>

			{/* Próximas Consultas */}
			<section>
				<h2 className='text-xl font-semibold text-teal-700 mb-4 flex items-center gap-2'>
					<CalendarCheck className='w-6 h-6 text-teal-600' />
					Próximas Consultas
				</h2>
				{/* ✅ MELHORIA APLICADA AQUI */}
				{filteredUpcoming.length > 0 ? (
					<ul className='grid gap-6 sm:grid-cols-2'>
						{filteredUpcoming.map(({ id, date, doctorName, patientName, specialty }) => (
							<li key={id} className='border border-teal-200 rounded-lg p-4 bg-teal-50 shadow-sm hover:shadow-md transition'>
								<p>
									<strong>📅 Data:</strong> {formatDateTime(date)}
								</p>
								<p>
									<strong>🩺 Médico:</strong> {doctorName}
								</p>
								<p>
									<strong>🏷️ Especialidade:</strong> {specialty || 'N/A'}
								</p>
								<p>
									<strong>🧑 Paciente:</strong> {patientName}
								</p>
							</li>
						))}
					</ul>
				) : (
					<p className='text-gray-500 col-span-2'>Nenhuma consulta futura encontrada com os filtros atuais.</p>
				)}
			</section>

			{/* Consultas Passadas */}
			<section>
				<h2 className='text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2'>
					<History className='w-6 h-6 text-gray-600' />
					Consultas Passadas
				</h2>
				{filteredPast.length > 0 ? (
					<ul className='grid gap-6 sm:grid-cols-2'>
						{filteredPast.map(({ id, date, doctorName, patientName, specialty }) => (
							<li key={id} className='border border-gray-300 rounded-lg p-4 bg-gray-50 shadow-sm hover:shadow-md transition'>
								<p>
									<strong>📅 Data:</strong> {formatDateTime(date)}
								</p>
								<p>
									<strong>🧑 Paciente:</strong> {patientName}
								</p>
								<p>
									<strong>🩺 Médico:</strong> {doctorName}
								</p>
								<p>
									<strong>🏷️ Especialidade:</strong> {specialty || 'N/A'}
								</p>
							</li>
						))}
					</ul>
				) : (
					<p className='text-gray-500'>Nenhuma consulta passada encontrada com os filtros atuais.</p>
				)}
			</section>
		</div>
	);
};

export default Agenda;
