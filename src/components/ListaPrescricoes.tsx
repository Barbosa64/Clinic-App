import React from 'react';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

import { ListaPrescricao } from './ListaPrescricoes';

interface Props {
	patientId: string;
}

const ListaPrescricoes = ({ patientId }: Props) => {
	const [prescricoes, setPrescricoes] = useState<ListaPrescricao[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const q = query(collection(db, 'prescricoes'), where('patientId', '==', patientId), orderBy('criadoEm', 'desc'));

		const unsubscribe = onSnapshot(q, snapshot => {
			const lista = snapshot.docs.map(doc => ({
				id: doc.id,
				...doc.data(),
			})) as ListaPrescricao[];

			setPrescricoes(lista);
			setLoading(false);
		});

		return () => unsubscribe();
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
						{p.criadoEm?.toDate && <p className='text-sm text-gray-400'>Prescrito em: {p.criadoEm.toDate().toLocaleString()}</p>}
					</li>
				))}
			</ul>
		</div>
	);
};

export default ListaPrescricoes;
