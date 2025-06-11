import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, where, orderBy, addDoc, Timestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const farmacos = ['Paracetamol', 'Ibuprofeno', 'Amoxicilina'];

interface Prescricao {
	farmaco: string;
	dose: string;
	frequencia: string;
	observacoes: string;
	consultaId: string;
}

interface Consulta {
	id: string;
	date: Date;
}

interface Props {
	patientId: string;
}

const FarmacoTest = ({ patientId }: Props) => {
	const { user, role, loading } = useAuth();

	const [form, setForm] = useState<Prescricao>({
		farmaco: '',
		dose: '',
		frequencia: '',
		observacoes: '',
		consultaId: '',
	});

	const [consultas, setConsultas] = useState<Consulta[]>([]);

	useEffect(() => {
		const fetchConsultas = async () => {
			const consultasRef = collection(db, 'Appointments');
			const q = query(consultasRef, where('patientId', '==', patientId), orderBy('date', 'desc'));

			const snapshot = await getDocs(q);

			const lista = snapshot.docs.map(doc => {
				const date = doc.data().date?.toDate(); // Timestamp -> Date
				return { id: doc.id, date: date };
			});

			setConsultas(lista);
		};

		if (user) fetchConsultas();
	}, [user, patientId]);

	if (loading) return <p>A carregar...</p>;
	if (!user) return <p>Precisa de fazer login para prescrever.</p>;

	if (role !== 'doctor' && role !== 'admin') {
		return <p>Não tem permissão. </p>;
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setForm(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const consultaSelecionada = consultas.find(c => c.id === form.consultaId);
		if (!consultaSelecionada) {
			alert('Consulta inválida.');
			return;
		}

		try {
			await addDoc(collection(db, 'receitas'), {
				farmaco: form.farmaco,
				dose: form.dose,
				frequencia: form.frequencia,
				observacoes: form.observacoes,
				consulta: Timestamp.fromDate(consultaSelecionada.date),
				patientId,
				doctorId: user.uid,
				criadoEm: Timestamp.now(),
			});

			alert('Prescrição registada com sucesso!');
			setForm({
				farmaco: '',
				dose: '',
				frequencia: '',
				observacoes: '',
				consultaId: '',
			});
		} catch (error) {
			console.error('Erro ao gravar prescrição:', error);
			alert('Erro ao registar prescrição.');
		}
	};

	return (
		<form onSubmit={handleSubmit} className='flex flex-col space-y-4 p-4 bg-gray-800 rounded-xl text-white'>
			<h2 className='text-xl font-bold'>Prescrever Fármaco</h2>

			{/* Fármaco */}
			<div>
				<label className='block mb-1'>Fármaco</label>
				<select name='farmaco' value={form.farmaco} onChange={handleChange} className='w-full p-2 rounded bg-white text-black' required>
					<option value=''>Selecione</option>
					{farmacos.map((f, idx) => (
						<option key={idx} value={f}>
							{f}
						</option>
					))}
				</select>
			</div>

			{/* Consulta */}
			<div>
				<label className='block mb-1'>Consulta</label>
				<select name='consultaId' value={form.consultaId} onChange={handleChange} className='w-full p-2 rounded bg-white text-black' required>
					<option value=''>Selecione a consulta</option>
					{consultas.map(consulta => (
						<option key={consulta.id} value={consulta.id}>
							{consulta.date.toLocaleString()}
						</option>
					))}
				</select>
			</div>

			{/* Dose */}
			<div>
				<label className='block mb-1'>Dose</label>
				<input type='text' name='dose' value={form.dose} onChange={handleChange} placeholder='Ex: 500mg' className='w-full p-2 rounded bg-white text-black' required />
			</div>

			{/* Frequência */}
			<div>
				<label className='block mb-1'>Frequência</label>
				<input type='text' name='frequencia' value={form.frequencia} onChange={handleChange} placeholder='Ex: 2x ao dia' className='w-full p-2 rounded bg-white text-black' required />
			</div>

			{/* Observações */}
			<div>
				<label className='block mb-1'>Observações</label>
				<textarea name='observacoes' value={form.observacoes} onChange={handleChange} placeholder='Instruções adicionais...' className='w-full p-2 rounded bg-white text-black' />
			</div>

			{/* Botão */}
			<button type='submit' className='bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'>
				Prescrever
			</button>
		</form>
	);
};

export default FarmacoTest;
