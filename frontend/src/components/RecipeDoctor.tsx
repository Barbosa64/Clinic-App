import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Syringe } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { createPrescription, CreatePrescriptionData, getAppointments } from '../services/apiService';
import { Appointment } from '../types';

interface Props {
	patientId: string;
}

const RecipeDoctor = ({ patientId }: Props) => {
	const { user, role, loading } = useAuth();

	const [form, setForm] = useState<CreatePrescriptionData>({
		patientId: patientId,
		farmaco: '',
		dose: '',
		frequencia: '',
		observacoes: '',
		appointmentId: '',
	});

	const [consultas, setConsultas] = useState<Appointment[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const farmacos = ['Ben-u-ron', 'Nolotil', 'Brufen', 'Aspirina', 'Voltaren', 'Naprosyn', 'Zitromax', 'Aerius', 'Ativan', 'Prozac', 'Ziloric', 'Pantoprazol'];

	useEffect(() => {
		const fetchConsultas = async () => {
			if (!patientId) return;
			try {
				const appointmentsData = await getAppointments({ patientId: patientId });

				setConsultas(appointmentsData);
			} catch (err) {
				toast.error('Erro ao carregar as consultas do paciente.');
			}
		};

		if (user && (role === 'ADMIN' || role === 'DOCTOR')) {
			fetchConsultas();
		}

		// Resetar o patientId no formulário
		setForm(prev => ({ ...prev, patientId: patientId }));
	}, [patientId, user, role]);

	if (loading) return <p className='text-center text-gray-500'>A carregar...</p>;
	if (role !== 'DOCTOR' && role !== 'ADMIN') return null;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setForm(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!form.appointmentId) {
			toast.error('Por favor, selecione uma consulta associada.');
			return;
		}
		setIsSubmitting(true);

		try {
			await createPrescription(form);

			toast.success('Prescrição registada com sucesso!');
			// Limpar o formulário
			setForm({
				patientId: patientId,
				farmaco: '',
				dose: '',
				frequencia: '',
				observacoes: '',
				appointmentId: '',
			});
		} catch (error) {
			console.error('Erro ao gravar prescrição:', error);
			toast.error('Erro ao registar prescrição.');
		} finally {
			setIsSubmitting(false);
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
					<label className='block mb-1 font-medium'>Consulta Associada</label>
					<select name='appointmentId' value={form.appointmentId} onChange={handleChange} required className='w-full bg-gray-50 border border-gray-300 rounded p-2'>
						<option value=''>Selecione a consulta</option>
						{}
						{consultas.map(consulta => (
							<option key={consulta.id} value={consulta.id}>
								{new Date(consulta.date).toLocaleString('pt-PT')} - Dr. {consulta.doctorName || 'Desconhecido'}
							</option>
						))}
						{consultas.length === 0 && <option disabled>Nenhuma consulta encontrada para este paciente</option>}
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
					<button type='submit' disabled={isSubmitting} className='bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition disabled:bg-gray-400'>
						{isSubmitting ? 'A prescrever...' : 'Prescrever'}
					</button>
				</div>
			</form>
		</div>
	);
};

export default RecipeDoctor;
