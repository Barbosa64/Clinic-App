import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, where, orderBy, addDoc, Timestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Syringe } from 'lucide-react';
import { toast } from 'react-hot-toast';

const farmacos = ['Ben-u-ron', 'Nolotil', 'Brufen', 'Aspirina', 'Voltaren', 'Naprosyn', 'Zitromax', 'Aerius', 'Ativan', 'Prozac', 'Ziloric', 'Pantoprazol'];

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
			if (!user) return;

			const consultasRef = collection(db, 'Appointments');

			let q;

			if (role === 'doctor') {
				q = query(consultasRef, where('patientId', '==', patientId), where('doctorId', '==', user.uid), orderBy('date', 'desc'));
			} else if (role === 'admin') {
				q = query(consultasRef, where('patientId', '==', patientId), orderBy('date', 'desc'));
			} else {
				return;
			}

			try {
				const snapshot = await getDocs(q);
				const lista = snapshot.docs.map(doc => {
					const date = doc.data().date?.toDate();
					return { id: doc.id, date };
				});
				setConsultas(lista);
			} catch (err) {
				console.error('Erro ao buscar consultas:', err);
			}
		};

		if (!loading) {
			fetchConsultas();
		}
	}, [user, patientId, role, loading]);

	if (loading) return <p className='text-center text-gray-500'>A carregar...</p>;
	if (!user) return <p className='text-red-600'>Precisa de fazer login para prescrever.</p>;
	if (role !== 'doctor' && role !== 'admin') return;

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
				criadoEm: Timestamp.fromDate(consultaSelecionada.date),
			});

			toast.success('Prescrição registada com sucesso!');
			setForm({
				farmaco: '',
				dose: '',
				frequencia: '',
				observacoes: '',
				consultaId: '',
			});
		} catch (error) {
			console.error('Erro ao gravar prescrição:', error);
			toast.error('Erro ao registar prescrição.');
		}
	};

	return (
		<div className='bg-white p-6 rounded-lg shadow space-y-6'>
			<h2 className='text-xl font-semibold text-teal-700 flex items-center gap-2'>
				<Syringe className='w-5 h-5 text-teal-600' />
				Prescrever Fármaco
			</h2>

			<form onSubmit={handleSubmit} className='space-y-4'>
				<div>
					<label className='block mb-1 font-medium'>Fármaco</label>
					<select name='farmaco' value={form.farmaco} onChange={handleChange} required className='w-full bg-gray-50 border border-gray-300 rounded p-2'>
						<option value=''>Selecione</option>
						{farmacos.map((f, idx) => (
							<option key={idx} value={f}>
								{f}
							</option>
						))}
					</select>
				</div>

				<div>
					<label className='block mb-1 font-medium'>Consulta</label>
					<select name='consultaId' value={form.consultaId} onChange={handleChange} required className='w-full bg-gray-50 border border-gray-300 rounded p-2'>
						<option value=''>Selecione a consulta</option>
						{consultas.map(consulta => (
							<option key={consulta.id} value={consulta.id}>
								{consulta.date.toLocaleString()}
							</option>
						))}
					</select>
				</div>

				<div>
					<label className='block mb-1 font-medium'>Dose</label>
					<input type='text' name='dose' value={form.dose} onChange={handleChange} placeholder='Ex: 500mg' required className='w-full bg-gray-50 border border-gray-300 rounded p-2' />
				</div>

				<div>
					<label className='block mb-1 font-medium'>Frequência</label>
					<input type='text' name='frequencia' value={form.frequencia} onChange={handleChange} placeholder='Ex: 2x ao dia' required className='w-full bg-gray-50 border border-gray-300 rounded p-2' />
				</div>

				<div>
					<label className='block mb-1 font-medium'>Observações</label>
					<textarea name='observacoes' value={form.observacoes} onChange={handleChange} placeholder='Instruções adicionais...' className='w-full bg-gray-50 border border-gray-300 rounded p-2' />
				</div>

				<div className='text-right'>
					<button type='submit' className='bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition'>
						Prescrever
					</button>
				</div>
			</form>
		</div>
	);
};

export default FarmacoTest;
