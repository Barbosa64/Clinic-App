import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { getAuth } from 'firebase/auth';
import { CalendarCheck, History } from 'lucide-react';

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

					// Buscar nomes do paciente e médico
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

	if (loading) {
		return <p className='text-center text-gray-500 mt-10'>A carregar consultas...</p>;
	}

	const formatDateTime = (date: Date) => date.toLocaleString('pt-PT', { dateStyle: 'medium', timeStyle: 'short' });

	return (
		<div className='bg-white p-6 rounded-lg shadow space-y-10 max-w-5xl mx-auto'>
			{/* Próximas Consultas */}
			<section>
				<h2 className='text-xl font-semibold text-teal-700 mb-4 flex items-center gap-2'>
					<CalendarCheck className='w-6 h-6 text-teal-600' />
					Próximas Consultas
				</h2>
				{upcoming.length === 0 ? (
					<p className='text-gray-400'>Nenhuma consulta agendada</p>
				) : (
					<ul className='grid gap-6 sm:grid-cols-2'>
						{upcoming.map(({ id, date, doctorName, specialty }) => (
							<li key={id} className='border border-teal-200 rounded-lg p-4 bg-teal-50 shadow-sm hover:shadow-md transition'>
								<p>
									<span className='font-medium'>📅 Data:</span> {formatDateTime(date)}
								</p>
								<p>
									<span className='font-medium'>🩺 Médico:</span> {doctorName}
								</p>
								<p>
									<span className='font-medium'>🏷️ Especialidade:</span> {specialty}
								</p>
							</li>
						))}
					</ul>
				)}
			</section>

			{/* Histórico de Consultas */}
			<section>
				<h2 className='text-xl font-semibold text-teal-700 mb-4 flex items-center gap-2'>
					<History className='w-6 h-6 text-teal-600' />
					Histórico de Consultas
				</h2>
				{past.length === 0 ? (
					<p className='text-gray-400'>Nenhuma consulta realizada</p>
				) : (
					<ul className='grid gap-6 sm:grid-cols-2'>
						{past.map(({ id, date, doctorName, specialty }) => (
							<li key={id} className='border border-gray-300 rounded-lg p-4 bg-gray-50 shadow-sm hover:shadow-md transition'>
								<p>
									<span className='font-medium'>📅 Data:</span> {formatDateTime(date)}
								</p>
								<p>
									<span className='font-medium'>🩺 Médico:</span> {doctorName}
								</p>
								<p>
									<span className='font-medium'>🏷️ Especialidade:</span> {specialty}
								</p>
							</li>
						))}
					</ul>
				)}
			</section>
		</div>
	);
};

export default Agenda;
