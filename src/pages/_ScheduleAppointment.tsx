import { useState } from 'react';

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

	const availableDoctors = doctors.filter(doc => doc.specialty === selectedSpecialty);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		alert(`Consulta marcada com ${selectedDoctor} em ${selectedSpecialty}`);
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

				<button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition' disabled={!selectedSpecialty || !selectedDoctor}>
					Marcar Consulta
				</button>
			</form>
		</div>
	);
}
