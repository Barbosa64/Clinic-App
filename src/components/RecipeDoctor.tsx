import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const farmacos = ['Paracetamol', 'Ibuprofeno', 'Amoxicilina'];

interface Prescricao {
	farmaco: string;
	dose: string;
	frequencia: string;
	observacoes: string;
}

interface Props {
	patientId: string; // ID do paciente passado como prop testar
}

const FarmacoTest = ({ patientId }: Props) => {
	const [form, setForm] = useState<Prescricao>({
		farmaco: '',
		dose: '',
		frequencia: '',
		observacoes: '',
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setForm(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			await addDoc(collection(db, 'receitas'), {
				...form,
				patientId,
				criadoEm: Timestamp.now(),
			});

			alert('Prescrição registrada com sucesso!');
			setForm({
				farmaco: '',
				dose: '',
				frequencia: '',
				observacoes: '',
			});
		} catch (error) {
			console.error('Erro ao salvar prescrição:', error);
			alert('Erro ao registrar prescrição.');
		}
	};

	return (
		<form onSubmit={handleSubmit} className='flex flex-col space-y-4 p-4 bg-gray-800 rounded-xl text-white'>
			<h2 className='text-xl font-bold'>Prescrever Fármaco</h2>

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

			<div>
				<label className='block mb-1'>Dose</label>
				<input type='text' name='dose' value={form.dose} onChange={handleChange} placeholder='Ex: 500mg' className='w-full p-2 rounded text-black' required />
			</div>

			<div>
				<label className='block mb-1'>Frequência</label>
				<input type='text' name='frequencia' value={form.frequencia} onChange={handleChange} placeholder='Ex: 2x ao dia' className='w-full p-2 rounded text-black' required />
			</div>

			<div>
				<label className='block mb-1'>Observações</label>
				<textarea name='observacoes' value={form.observacoes} onChange={handleChange} placeholder='Instruções adicionais...' className='w-full p-2 rounded text-black' />
			</div>

			<button type='submit' className='bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'>
				Prescrever
			</button>
		</form>
	);
};

export default FarmacoTest;

/*import React, { useState } from 'react';

const farmacos = ['Paracetamol', 'Ibuprofeno'];

interface Prescricao {
	farmaco: string;
	dose: string;
	frequencia: string;
	observacoes: string;
}

const FarmacoTest = () => {
	const [form, setForm] = useState<Prescricao>({
		farmaco: '',
		dose: '',
		frequencia: '',
		observacoes: '',
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setForm(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log('Prescrição:', form);
		// Aqui você pode enviar para um backend, salvar em localStorage, etc.
		alert('Prescrição registrada com sucesso!');
	};

	return (
		<form onSubmit={handleSubmit} className='flex flex-col space-y-4 p-4 bg-gray-800 rounded-xl text-white'>
			<h2 className='text-xl font-bold'>Prescrever Fármaco</h2>

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

			<div>
				<label className='block mb-1'>Dose</label>
				<input type='text' name='dose' value={form.dose} onChange={handleChange} placeholder='Ex: 500mg' className='w-full p-2 rounded text-black' required />
			</div>

			<div>
				<label className='block mb-1'>Frequência</label>
				<input type='text' name='frequencia' value={form.frequencia} onChange={handleChange} placeholder='Ex: 2x ao dia' className='w-full p-2 rounded text-black' required />
			</div>

			<div>
				<label className='block mb-1'>Observações</label>
				<textarea name='observacoes' value={form.observacoes} onChange={handleChange} placeholder='Instruções adicionais...' className='w-full p-2 rounded text-black' />
			</div>

			<button type='submit' className='bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'>
				Prescrever
			</button>
		</form>
	);
};

export default FarmacoTest;
*/
