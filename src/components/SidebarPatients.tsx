import React from 'react';

const patients = [
	{ name: 'Emily Williams', gender: 'Female', age: 18, imageUrl: 'https://randomuser.me/api/portraits/women/1.jpg' },
	{ name: 'Ryan Johnson', gender: 'Male', age: 45, imageUrl: 'https://randomuser.me/api/portraits/men/2.jpg' },
	{ name: 'Jessica Taylor', gender: 'Female', age: 28, imageUrl: 'https://randomuser.me/api/portraits/women/3.jpg' },
];

export default function SidebarPatients() {
	return (
		<aside className='w-64 bg-white border-r p-4'>
			<h2 className='text-xl font-bold mb-4'>Pacientes</h2>
			<input type='text' placeholder='Search...' className='mb-4 p-2 w-full border rounded' />
			<ul className='space-y-4'>
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