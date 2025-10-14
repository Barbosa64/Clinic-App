import React, { useState, useEffect } from 'react';
import { CalendarCheck, History, Search } from 'lucide-react';

interface Consulta {
	id: string;
	date: Date;
	patientName: string;
	doctorName: string;
	specialty?: string;
}

const Agenda: React.FC = () => {
	const [upcoming, setUpcoming] = useState<Consulta[]>([]);
	const [past, setPast] = useState<Consulta[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [filterSpecialty, setFilterSpecialty] = useState('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchConsultas = async () => {
			try {
				const auth = getAuth();
				const currentUser = auth.currentUser;
				if (!currentUser) return;

				const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
				if (!userDoc.exists()) throw new Error('Usuário não encontrado');
				const userData = userDoc.data() as any;

				let q;
				if (userData.role === 'admin') {
					q = collection(db, 'Appointments');
				} else if (userData.role === 'doctor') {
					q = query(collection(db, 'Appointments'), where('doctorId', '==', currentUser.uid));
				} else if (userData.role === 'patient') {
					q = query(collection(db, 'Appointments'), where('patientId', '==', currentUser.uid));
				} else {
					setLoading(false);
					return;
				}

				const querySnapshot = await getDocs(q);
				const now = new Date();

				const upcomingAppointments: Consulta[] = [];
				const pastAppointments: Consulta[] = [];

				for (const docSnap of querySnapshot.docs) {
					const data = docSnap.data();
					const apptDate: Date = data.date.toDate();

					const patientDoc = await getDoc(doc(db, 'users', data.patientId));
					const doctorDoc = await getDoc(doc(db, 'users', data.doctorId));
					const patientName = patientDoc.exists() ? patientDoc.data().name || 'Desconhecido' : 'Desconhecido';
					const doctorName = doctorDoc.exists() ? doctorDoc.data().name || 'Desconhecido' : 'Desconhecido';
					const specialty = doctorDoc.exists() ? doctorDoc.data().specialty || 'N/A' : 'N/A';

					const consulta: Consulta = {
						id: docSnap.id,
						date: apptDate,
						patientName,
						doctorName,
						specialty,
					};

					if (apptDate >= now) {
						upcomingAppointments.push(consulta);
					} else {
						pastAppointments.push(consulta);
					}
				}

				upcomingAppointments.sort((a, b) => a.date.getTime() - b.date.getTime());
				pastAppointments.sort((a, b) => b.date.getTime() - a.date.getTime());

				setUpcoming(upcomingAppointments);
				setPast(pastAppointments);
			} catch (error) {
				console.error('Erro ao buscar consultas:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchConsultas();
	}, []);

	const filteredUpcoming = upcoming.filter(consulta => {
		const consultaDate = consulta.date;
		const start = startDate ? new Date(startDate) : null;
		const end = endDate ? new Date(endDate) : null;
		const specialty = consulta.specialty ? String(consulta.specialty).toLowerCase().trim() : '';

		return (
			(consulta.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || consulta.doctorName.toLowerCase().includes(searchTerm.toLowerCase())) &&
			(!filterSpecialty || specialty === filterSpecialty.toLowerCase().trim()) &&
			(!start || consultaDate >= start) &&
			(!end || consultaDate <= end)
		);
	});

	const filteredPast = past.filter(consulta => {
		const consultaDate = consulta.date;
		const start = startDate ? new Date(startDate) : null;
		const end = endDate ? new Date(endDate) : null;
		const specialty = consulta.specialty ? String(consulta.specialty).toLowerCase().trim() : '';

		return (
			(consulta.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || consulta.doctorName.toLowerCase().includes(searchTerm.toLowerCase())) &&
			(!filterSpecialty || specialty === filterSpecialty.toLowerCase().trim()) &&
			(!start || consultaDate >= start) &&
			(!end || consultaDate <= end)
		);
	});
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
			{/* Filtros aprimorados */}
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
						<option value='Cardiologia'>Cardiologia</option>
						<option value='Dermatologia'>Dermatologia</option>
						<option value='Ortopedia'>Ortopedia</option>
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
								<strong>🏷️ Especialidade:</strong> {specialty}
							</p>
							<p>
								<strong>🧑 Paciente:</strong> {patientName}
							</p>
						</li>
					))}
				</ul>
			</section>

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
									<strong>🏷️ Especialidade:</strong> {specialty}
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
