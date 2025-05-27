import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface Consulta {
	id: string;
	paciente: string;
	medico: string;
	data: string;
	hora: string;
	status: 'Confirmada' | 'Pendente' | 'Cancelada';
}

const Agenda: React.FC = () => {
	const [consultas, setConsultas] = useState<Consulta[]>([]);
	const [filtros, setFiltros] = useState({ data: '', paciente: '', medico: '', status: '' });
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchConsultas = async () => {
			try {
				const querySnapshot = await getDocs(collection(db, 'Appointments'));

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
	}, []);

	const consultasFiltradas = consultas.filter(consulta => {
		return (
			(!filtros.data || consulta.data === filtros.data) &&
			(!filtros.paciente || consulta.paciente.toLowerCase().includes(filtros.paciente.toLowerCase())) &&
			(!filtros.medico || consulta.medico.toLowerCase().includes(filtros.medico.toLowerCase())) &&
			(!filtros.status || consulta.status === filtros.status)
		);
	});

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

			{/* Tabela */}
			{loading ? (
				<p className='text-center'>Carregando...</p>
			) : (
				<div className='overflow-x-auto'>
					<table className='min-w-full divide-y divide-gray-200 shadow rounded-lg'>
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
							{consultasFiltradas.map(consulta => (
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
							{consultasFiltradas.length === 0 && (
								<tr>
									<td colSpan={5} className='text-center text-sm text-gray-500 py-4'>
										Nenhuma consulta encontrada.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default Agenda;
