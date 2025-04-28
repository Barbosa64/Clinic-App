import React from 'react';

const labs = ['Exames de sangue', 'TAC', 'Relatórios radiológicos', 'Raio-X', 'Teste urina'];

export default function LabResults() {
	return (
		<div className='bg-white p-4 rounded shadow'>
			<h2 className='text-lg font-semibold mb-4'>Resultados de Laboratório</h2>
			<ul className='space-y-2'>
				{labs.map((lab, index) => (
					<li key={index} className='flex justify-between items-center'>
						{lab}
						<button className='text-teal-500'>⬇️</button>
					</li>
				))}
			</ul>
		</div>
	);
}
