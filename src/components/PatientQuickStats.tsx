import React from 'react';

export default function PatientQuickStats() {
	return (
		<div className='grid grid-cols-3 gap-4'>
			<div className='bg-white p-4 rounded shadow text-center'>
				<h3 className='text-sm text-gray-500'>Respiração</h3>
				<p className='text-xl font-bold'>20 bpm</p>
			</div>
			<div className='bg-white p-4 rounded shadow text-center'>
				<h3 className='text-sm text-gray-500'>Temperatura</h3>
				<p className='text-xl font-bold'>36°C</p>
			</div>
			<div className='bg-white p-4 rounded shadow text-center'>
				<h3 className='text-sm text-gray-500'>Batimento Cardiaco</h3>
				<p className='text-xl font-bold'>78 bpm</p>
			</div>
		</div>
	);
}
