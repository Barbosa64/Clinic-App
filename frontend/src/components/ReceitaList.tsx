// frontend/src/components/ReceitaList.tsx

import { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';

// 1. Importar a função da nossa API e o tipo
import { getPrescriptionsByPatient } from '../services/apiService';
import { Receita } from '../types';

interface Props {
	patientId: string;
}

export default function ReceitaList({ patientId }: Props) {
	const [receitas, setReceitas] = useState<Receita[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// 2. Reescrever o useEffect para usar a nossa API
	useEffect(() => {
		if (!patientId) {
			setLoading(false);
			return;
		}

		const fetchPrescriptions = async () => {
			setLoading(true);
			setError(null);
			try {
				const data = await getPrescriptionsByPatient(patientId);
				setReceitas(data);
			} catch (err) {
				setError('Ocorreu um erro ao carregar as receitas.');
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchPrescriptions();
	}, [patientId]); // O efeito depende apenas do patientId

	// 3. Adicionar um estado de loading para melhor feedback ao utilizador
	if (loading) return <p className='text-center p-4'>A carregar receitas...</p>;
	if (error) return <p className='text-red-500 text-center p-4'>{error}</p>;

	return (
		<div className='bg-white p-6 rounded-lg shadow overflow-x-auto'>
			<h2 className='text-xl font-semibold text-teal-700 mb-4 flex items-center gap-2'>
				<FileText className='w-5 h-5 text-teal-600' />
				Receitas médicas
			</h2>

			{receitas.length === 0 ? (
				<p className='text-gray-400'>Não foram encontradas receitas para este utente.</p>
			) : (
				<table className='w-full min-w-[700px] text-left border-collapse'>
					<thead>
						<tr className='text-gray-600 text-sm bg-gray-50'>
							<th className='p-2'>Fármaco</th>
							<th className='p-2'>Dose</th>
							<th className='p-2'>Frequência</th>
							<th className='p-2'>Observações</th>
							<th className='p-2'>Prescritor</th>
							<th className='p-2'>Data de prescrição</th>
						</tr>
					</thead>
					<tbody>
						{/* 4. Adaptar o .map() para a nova estrutura de dados */}
						{receitas.map(({ id, farmaco, dose, frequencia, observacoes, doctor, criadoEm }, i) => (
							<tr key={id} className={`text-sm ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}>
								<td className='p-2'>{farmaco}</td>
								<td className='p-2'>{dose}</td>
								<td className='p-2'>{frequencia}</td>
								<td className='p-2'>{observacoes}</td>
								<td className='p-2'>{doctor.name || 'Desconhecido'}</td>
								<td className='p-2'>{new Date(criadoEm).toLocaleDateString('pt-PT')}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}
