import React from 'react';

export default function PatientProfileCard() {
	return (
		<div className='bg-white p-4 rounded shadow text-center'>
			<img className='mx-auto h-24 w-24 rounded-full' src='https://randomuser.me/api/portraits/women/3.jpg' alt='Patient' />
			<h3 className='mt-2 text-lg font-semibold'>Jessica Taylor</h3>
			<p className='text-gray-500 text-sm'>Feminino, 28</p>
			<div className='mt-4 space-y-2 text-sm text-gray-600'>
				<p>📅 DOB: Agosto 23, 1996</p>
				<p>📞 Contacto: 923304192</p>
				<p>🏥 Insurance: Sunrise Health</p>
			</div>
			<button className='mt-4 px-4 py-2 bg-teal-500 text-white rounded'>Mostrar toda a informação</button>
		</div>
	);
}
