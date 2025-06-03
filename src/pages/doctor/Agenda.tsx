import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { getAuth } from 'firebase/auth';

interface Consulta {
	id: string;
	paciente: string;
	medico: string;
	data: string; // 'yyyy-mm-dd'
	hora: string; // 'HH:mm'
	status: 'Confirmada' | 'Pendente' | 'Cancelada';
}

const Agenda: React.FC = () => {
	const [consultas, setConsultas] = useState<Consulta[]>([]);
	const [loading, setLoading] = useState(true);
	const [role, setRole] = useState<string | null>(null);
	const [filtros, setFiltros] = useState({ data: '', paciente: '', medico: '', status: '' });

	const auth = getAuth();
	const currentUser = auth.currentUser;

	useEffect(() => {
		if (!currentUser) return;

		const fetchUserRole = async () => {
			try {
				const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
				if (userDoc.exists()) {
					setRole(userDoc.data().role);
				} else {
					setRole(null);
				}
			} catch (error) {
				console.error('Erro ao buscar role do usuário:', error);
				setRole(null);
			}
		};

		fetchUserRole();
	}, [currentUser]);

	useEffect(() => {
		if (!currentUser || role === null) return;

		const fetchConsultas = async () => {
			try {
				let q;

				if (role === 'admin') {
					q = collection(db, 'Appointments');
				} else if (role === 'doctor') {
					q = query(collection(db, 'Appointments'), where('doctorId', '==', currentUser.uid));
				} else {
					setConsultas([]);
					setLoading(false);
					return;
				}

				const querySnapshot = await getDocs(q);

				const consultasCompletas: Consulta[] = await Promise.all(
					querySnapshot.docs.map(async docSnap => {
						const data = docSnap.data();
						const dateObj = data.date.toDate();
						const hora = dateObj.toTimeString().slice(0, 5);
						const dataFormatada = dateObj.toISOString().split('T')[0];

						let pacienteNome = 'Desconhecido';
						if (data.patientId) {
							const pacienteDoc = await getDoc(doc(db, 'users', data.patientId));
							pacienteNome = pacienteDoc.exists() ? pacienteDoc.data().name || pacienteDoc.data().email : 'Desconhecido';
						}

						let medicoNome = 'Desconhecido';
						if (data.doctorId) {
							const medicoDoc = await getDoc(doc(db, 'users', data.doctorId));
							medicoNome = medicoDoc.exists() ? medicoDoc.data().name || medicoDoc.data().email : 'Desconhecido';
						}

						return {
							id: docSnap.id,
							paciente: pacienteNome,
							medico: medicoNome,
							data: dataFormatada,
							hora,
							status: data.status || 'Pendente',
						};
					}),
				);

				setConsultas(consultasCompletas);
			} catch (error) {
				console.error('Erro ao buscar consultas:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchConsultas();
	}, [currentUser, role]);

	// Data de hoje sem hora (00:00)
	const hoje = new Date();
	hoje.setHours(0, 0, 0, 0);

	// Função de filtro reutilizável
	const aplicarFiltro = (lista: Consulta[]) => {
		return lista.filter(consulta => {
			return (
				(!filtros.data || consulta.data === filtros.data) &&
				(!filtros.paciente || consulta.paciente.toLowerCase().includes(filtros.paciente.toLowerCase())) &&
				(!filtros.medico || consulta.medico.toLowerCase().includes(filtros.medico.toLowerCase())) &&
				(!filtros.status || consulta.status === filtros.status)
			);
		});
	};

	// Separa consultas futuras e passadas
	const consultasFuturas = aplicarFiltro(consultas.filter(c => new Date(c.data) >= hoje));
	const consultasPassadas = aplicarFiltro(consultas.filter(c => new Date(c.data) < hoje));

	const renderTabela = (lista: Consulta[], titulo: string) => (
		<>
			<h2 className='text-xl font-semibold mt-6 mb-2'>{titulo}</h2>
			{lista.length === 0 ? (
				<p className='mb-4 text-gray-600'>Nenhuma consulta {titulo.toLowerCase()}.</p>
			) : (
				<table className='min-w-full divide-y divide-gray-200 shadow rounded-lg mb-6'>
					<thead className='bg-gray-100'>
						<tr>
							<th className='px-6 py-3 text-left text-sm font-medium text-gray-600'>Paciente</th>
							<th className='px-6 py-3 text-left text-sm font-medium text-gray-600'>Médico</th>
							<th className='px-6 py-3 text-left text-sm font-medium text-gray-600'>Data</th>
							<th className='px-6 py-3 text-left text-sm font-medium text-gray-600'>Hora</th>
							<th className='px-6 py-3 text-left text-sm font-medium text-gray-600'>Status</th>
						</tr>
					</thead>
					<tbody className='divide-y divide-gray-200 bg-white'>
						{lista.map(consulta => (
							<tr key={consulta.id}>
								<td className='px-6 py-4'>{consulta.paciente}</td>
								<td className='px-6 py-4'>{consulta.medico}</td>
								<td className='px-6 py-4'>{consulta.data}</td>
								<td className='px-6 py-4'>{consulta.hora}</td>
								<td className='px-6 py-4'>
									<span
										className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
											consulta.status === 'Confirmada' ? 'bg-green-100 text-green-800' : consulta.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
										}`}
									>
										{consulta.status}
									</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</>
	);

	return (
		<div className='p-6'>
			<h1 className='text-2xl font-bold mb-4'>Agenda de Consultas</h1>

			{/* Filtros */}
			<div className='mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4'>
				<input type='date' value={filtros.data} onChange={e => setFiltros({ ...filtros, data: e.target.value })} className='border p-2 rounded' />
				<input type='text' placeholder='Filtrar por paciente' value={filtros.paciente} onChange={e => setFiltros({ ...filtros, paciente: e.target.value })} className='border p-2 rounded' />
				<input type='text' placeholder='Filtrar por médico' value={filtros.medico} onChange={e => setFiltros({ ...filtros, medico: e.target.value })} className='border p-2 rounded' />
				<select value={filtros.status} onChange={e => setFiltros({ ...filtros, status: e.target.value })} className='border p-2 rounded'>
					<option value=''>Todos os status</option>
					<option value='Confirmada'>Confirmada</option>
					<option value='Pendente'>Pendente</option>
					<option value='Cancelada'>Cancelada</option>
				</select>
			</div>

			{loading ? (
				<p className='text-center'>Carregando...</p>
			) : (
				<>
					{renderTabela(consultasFuturas, 'Consultas Futuras')}
					{renderTabela(consultasPassadas, 'Consultas Passadas')}
				</>
			)}
		</div>
	);
};

export default Agenda;
