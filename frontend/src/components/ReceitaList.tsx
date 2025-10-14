import { useEffect, useState } from 'react';

interface Receita {
	id: string;
	farmaco: string;
	dose: string;
	frequencia: string;
	observacoes: string;
	patientId: string;
	doctorId: string;
	criadoEm: Timestamp | Date;
}

interface Props {
	patientId: string;
}

export default function ReceitaList({ patientId }: Props) {
	const [receitas, setReceitas] = useState<Receita[]>([]);
	const [doctorNames, setDoctorNames] = useState<{ [key: string]: string }>({});
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!patientId) return;

		const q = query(collection(db, 'receitas'), where('patientId', '==', patientId));

		const unsubscribe = onSnapshot(
			q,
			async snapshot => {
				const lista: Receita[] = snapshot.docs.map(doc => ({
					id: doc.id,
					...(doc.data() as Omit<Receita, 'id'>),
				}));
				setReceitas(lista);

				const doctorIds = [...new Set(lista.map(receita => receita.doctorId))];
				const doctorNameMap: { [key: string]: string } = {};

				await Promise.all(
					doctorIds.map(async doctorId => {
						const docRef = doc(db, 'users', doctorId);
						const docSnap = await getDoc(docRef);
						doctorNameMap[doctorId] = docSnap.exists() ? docSnap.data().name : 'Desconhecido';
					}),
				);

				setDoctorNames(doctorNameMap);
			},
			err => {
				console.error('Erro ao carregar receitas:', err);
				setError('Ocorreu um erro ao carregar as receitas.');
			},
		);

		return () => unsubscribe();
	}, [patientId]);

	if (error) return <p className='text-red-500'>{error}</p>;

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
						{receitas.map(({ id, farmaco, dose, frequencia, observacoes, doctorId, criadoEm }, i) => (
							<tr key={id} className={`text-sm ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}>
								<td className='p-2'>{farmaco}</td>
								<td className='p-2'>{dose}</td>
								<td className='p-2'>{frequencia}</td>
								<td className='p-2'>{observacoes}</td>
								<td className='p-2'>{doctorNames[doctorId] || <span className='text-gray-400'>A carregar...</span>}</td>
								<td className='p-2'>{criadoEm instanceof Date ? criadoEm.toLocaleDateString('pt-PT') : criadoEm.toDate().toLocaleDateString('pt-PT')}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}
