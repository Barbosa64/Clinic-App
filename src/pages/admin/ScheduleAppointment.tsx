import { useState } from 'react';
import React from 'react';

const specialties = ['Cardiologia', 'Dermatologia', 'Pediatria', 'Ortopedia'];

const doctors = [
	{ name: 'Dr. Ana Silva', specialty: 'Cardiologia' },
	{ name: 'Dr. João Souza', specialty: 'Dermatologia' },
	{ name: 'Dra. Paula Lima', specialty: 'Pediatria' },
	{ name: 'Dr. Marcos Castro', specialty: 'Ortopedia' },
];

export default function ScheduleAppointment() {
	const [selectedSpecialty, setSelectedSpecialty] = useState('');
	const [selectedDoctor, setSelectedDoctor] = useState('');
	const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

	const availableDoctors = doctors.filter(doc => doc.specialty === selectedSpecialty);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		setStatus('loading');

		try {
			const response = await fetch('https://teu-servidor.com/api/agendamentos', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					doctor: selectedDoctor,
					specialty: selectedSpecialty,
					timestamp: new Date().toISOString(),
				}),
			});

			if (!response.ok) throw new Error('Erro ao enviar');

			setStatus('success');
			alert('Consulta marcada com sucesso!');
			setSelectedSpecialty('');
			setSelectedDoctor('');
		} catch (error) {
			console.error(error);
			setStatus('error');
			alert('Erro ao marcar consulta.');
		}
	};

	return (
		<div className='p-8'>
			<h1 className='text-2xl font-bold mb-6'>Marcar Consulta</h1>

			<form onSubmit={handleSubmit} className='space-y-4 max-w-md'>
				<div>
					<label className='block mb-1 font-medium'>Especialidade:</label>
					<select
						className='border w-full p-2 rounded'
						value={selectedSpecialty}
						onChange={e => {
							setSelectedSpecialty(e.target.value);
							setSelectedDoctor('');
						}}
					>
						<option value=''>Selecione uma especialidade</option>
						{specialties.map(spec => (
							<option key={spec} value={spec}>
								{spec}
							</option>
						))}
					</select>
				</div>

				{selectedSpecialty && (
					<div>
						<label className='block mb-1 font-medium'>Médico:</label>
						<select className='border w-full p-2 rounded' value={selectedDoctor} onChange={e => setSelectedDoctor(e.target.value)}>
							<option value=''>Selecione um médico</option>
							{availableDoctors.map(doc => (
								<option key={doc.name} value={doc.name}>
									{doc.name}
								</option>
							))}
						</select>
					</div>
				)}

				<button type='submit' className='mt-4 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition' disabled={!selectedSpecialty || !selectedDoctor || status === 'loading'}>
					{status === 'loading' ? 'A enviar...' : 'Marcar Consulta'}
				</button>
			</form>
		</div>
	);
}
