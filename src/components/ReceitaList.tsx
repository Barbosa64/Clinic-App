// ReceitaList.tsx
import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface Receita {
	id: string;
	farmaco: string;
	dose: string;
	frequencia: string;
	observacoes: string;
	patientId: string;
	criadoEm: any;
}

export default function ReceitaList({ patientId }: { patientId: string }) {
	const [receitas, setReceitas] = useState<Receita[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!patientId) return;

		const q = query(collection(db, 'receitas'), where('patientId', '==', patientId));
		

		const unsubscribe = onSnapshot(
			q,
			snapshot => {
				const lista: Receita[] = snapshot.docs.map(doc => ({
					id: doc.id,
					...(doc.data() as Omit<Receita, 'id'>),
				}));
				setReceitas(lista);
			},
			err => {
				console.error('Erro ao carregar receitas:', err);
				setError('Erro ao carregar receitas.');
			},
		);

		return () => unsubscribe();
	}, [patientId]);

	if (error) return <p>{error}</p>;

	return (
		<div className='bg-white p-4 rounded shadow overflow-x-auto'>
			<h2 className='text-lg font-semibold mb-4'>Receitas Médicas</h2>
			{receitas.length === 0 ? (
				<p>Nenhuma receita encontrada para este paciente.</p>
			) : (
				<table className='w-full min-w-[600px] text-left'>
					<thead>
						<tr className='text-gray-500 text-sm'>
							<th className='pb-2'>Fármaco</th>
							<th className='pb-2'>Dose</th>
							<th className='pb-2'>Frequência</th>
							<th className='pb-2'>Observações</th>
						</tr>
					</thead>
					<tbody>
						{receitas.map(({ id, farmaco, dose, frequencia, observacoes }) => (
							<tr key={id} className='border-t'>
								<td className='py-2'>{farmaco}</td>
								<td className='py-2'>{dose}</td>
								<td className='py-2'>{frequencia}</td>
								<td className='py-2'>{observacoes}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}
