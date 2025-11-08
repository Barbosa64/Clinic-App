import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { getPrescriptionsByPatient } from '../services/apiService';
import { Receita } from '../types';

interface Props {
	patientId: string;
}

const ListaPrescricoes = ({ patientId }: Props) => {
	const [prescricoes, setPrescricoes] = useState<Receita[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!patientId) {
			setLoading(false);
			setPrescricoes([]);
			return;
		}

		const fetchPrescricoes = async () => {
			setLoading(true);
			try {
				const data = await getPrescriptionsByPatient(patientId);
				setPrescricoes(data);
			} catch (err) {
				toast.error('Erro ao carregar as prescrições.');
			} finally {
				setLoading(false);
			}
		};
		fetchPrescricoes();
	}, [patientId]);
	if (loading) return <p className='text-white'>A carregar...</p>;
	if (prescricoes.length === 0) return <p className='text-white'>Nenhuma prescrição encontrada.</p>;

	return (
		<div className='bg-gray-900 text-white p-4 rounded-xl mt-6'>
			<h3 className='text-lg font-bold mb-4'>Prescrições Anteriores</h3>
			<ul className='space-y-4'>
				{prescricoes.map(p => (
					<li key={p.id} className='border-b border-gray-700 pb-2'>
						<p>
							<strong>Fármaco:</strong> {p.farmaco}
						</p>
						<p>
							<strong>Data da Consulta:</strong>
						</p>
						<p>
							<strong>Dose:</strong> {p.dose}
						</p>
						<p>
							<strong>Frequência:</strong> {p.frequencia}
						</p>
						{p.observacoes && (
							<p>
								<strong>Observações:</strong> {p.observacoes}
							</p>
						)}
						{p.criadoEm && <p className='text-sm text-gray-400'>Prescrito em: {new Date(p.criadoEm).toLocaleDateString('pt-PT', { dateStyle: 'long', timeStyle: 'short' })}</p>}
					</li>
				))}
			</ul>
		</div>
	);
};

export default ListaPrescricoes;
