import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, DocumentData, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getAuth } from 'firebase/auth';
import { CalendarCheck, History } from 'lucide-react';

type Appointment = {
	id: string;
	date: Date;
	doctorId: string;
	doctorName?: string;
	specialty?: string;
};

type Props = {
	patientId?: string;
};

export default function AppointmentsHistory({ patientId }: Props) {
	const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);
	const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchAppointments = async () => {
			try {
				const auth = getAuth();
				const currentUser = auth.currentUser;
				if (!currentUser) return;

				const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
				if (!userDoc.exists()) throw new Error('Usuário não encontrado');
				const userData = userDoc.data() as any;

				let q;

				if (userData.role === 'patient') {
					if (!patientId) {
						setLoading(false);
						return;
					}
					q = query(collection(db, 'Appointments'), where('patientId', '==', patientId));
				} else if (userData.role === 'doctor') {
					if (patientId) {
						q = query(collection(db, 'Appointments'), where('doctorId', '==', currentUser.uid), where('patientId', '==', patientId));
					} else {
						q = query(collection(db, 'Appointments'), where('doctorId', '==', currentUser.uid));
					}
				} else if (userData.role === 'admin') {
					q = patientId ? query(collection(db, 'Appointments'), where('patientId', '==', patientId)) : collection(db, 'Appointments');
				} else {
					setLoading(false);
					return;
				}

				const querySnapshot = await getDocs(q);

				const now = new Date();
				const upcoming: Appointment[] = [];
				const past: Appointment[] = [];

				for (const docSnap of querySnapshot.docs) {
					const data = docSnap.data() as DocumentData;
					const apptDate = data.date.toDate();

					const doctorDoc = await getDoc(doc(db, 'users', data.doctorId));
					const doctorData = doctorDoc.exists() ? doctorDoc.data() : null;

					const appointment: Appointment = {
						id: docSnap.id,
						date: apptDate,
						doctorId: data.doctorId,
						doctorName: doctorData?.name || 'Desconhecido',
						specialty: doctorData?.specialty || 'N/A',
					};

					if (apptDate >= now) {
						upcoming.push(appointment);
					} else {
						past.push(appointment);
					}
				}

				upcoming.sort((a, b) => a.date.getTime() - b.date.getTime());
				past.sort((a, b) => b.date.getTime() - a.date.getTime());

				setUpcomingAppointments(upcoming);
				setPastAppointments(past);
			} catch (error) {
				console.error('Erro ao buscar consultas:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchAppointments();
	}, [patientId]);

	if (loading) return <p className='text-center text-gray-500'>A Carregar consultas...</p>;

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
						{upcomingAppointments.map(appt => (
							<li key={appt.id} className='border p-4 rounded-lg bg-gray-50 shadow-sm'>
								<p>
									<span className='font-medium'>📅 Data:</span> {appt.date.toLocaleString('pt-BR')}
								</p>
								<p>
									<span className='font-medium'>🩺 Médico:</span> {appt.doctorName}
								</p>
								<p>
									<span className='font-medium'>🏷️ Especialidade:</span> {appt.specialty}
								</p>
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
						{pastAppointments.map(appt => (
							<li key={appt.id} className='border p-4 rounded-lg bg-gray-50 shadow-sm'>
								<p>
									<span className='font-medium'>📅 Data:</span> {appt.date.toLocaleString('pt-PT')}
								</p>
								<p>
									<span className='font-medium'>🩺 Médico:</span> {appt.doctorName}
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
