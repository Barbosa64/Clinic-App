import React from 'react';

const patients = [
	{ name: 'Marta Gonçalves', gender: 'Feminino', age: 18, imageUrl: 'https://randomuser.me/api/portraits/women/1.jpg' },
	{ name: 'André Fonseca', gender: 'Masculino', age: 45, imageUrl: 'https://randomuser.me/api/portraits/men/2.jpg' },
	{ name: 'Jessica Silva', gender: 'Feminino', age: 36, imageUrl: 'https://randomuser.me/api/portraits/women/2.jpg' },
];

export default function SidebarPatients() {
	return (
		<aside className='w-full sm:w-64 bg-white p-4 sm:static fixed bottom-0 sm:bottom-auto sm:left-0 z-50 sm:z-auto'>
			<h2 className='text-xl font-bold mb-4'>Pacientes</h2>
			<input type='text' placeholder='Buscar...' className='mb-4 p-2 w-full border rounded' />
			<ul className='space-y-4 overflow-y-auto max-h-64 sm:max-h-none'>
				{patients.map((patient, index) => (
					<li key={index} className='flex items-center space-x-4'>
						<img src={patient.imageUrl} alt={patient.name} className='h-10 w-10 rounded-full' />
						<div>
							<p className='font-semibold'>{patient.name}</p>
							<p className='text-xs text-gray-500'>
								{patient.gender}, {patient.age}
							</p>
						</div>
					</li>
				))}
			</ul>
		</aside>
	);
}
