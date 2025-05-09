import React from 'react';

const diagnostics = [
	{ problem: 'Hipertensão', description: 'Chronic high blood pressure', status: 'Sob observação' },
	{ problem: 'Type 2 Diabetes', description: 'Resistência à insulina', status: 'Curado' },
	{ problem: 'Asma', description: 'Broncoconstrição', status: 'Inativo' },
];

export default function DiagnosticList() {
	return (
		<div className='bg-white p-4 rounded shadow'>
			<h2 className='text-lg font-semibold mb-4'>Lista de Diagnostico</h2>
			<table className='w-full text-left'>
				<thead>
					<tr className='text-gray-500 text-sm'>
						<th className='pb-2'>Problema</th>
						<th className='pb-2'>Descrição</th>
						<th className='pb-2'>Status</th>
					</tr>
				</thead>
				<tbody>
					{diagnostics.map((diag, index) => (
						<tr key={index} className='border-t'>
							<td className='py-2'>{diag.problem}</td>
							<td className='py-2'>{diag.description}</td>
							<td className='py-2'>{diag.status}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
