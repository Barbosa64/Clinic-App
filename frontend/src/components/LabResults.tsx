// src/components/LabResults.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LabResult } from '../types';
import { getLabResultsByPatient, uploadLabResult } from '../services/apiService';
import { toast } from 'react-hot-toast';

interface Props {
	patientId?: string;
}

const LabResults: React.FC<Props> = ({ patientId }) => {
	const { role } = useAuth();
	const [labResults, setLabResults] = useState<LabResult[]>([]);
	const [file, setFile] = useState<File | null>(null);
	const [labType, setLabType] = useState('');
	const [loading, setLoading] = useState(false);
	const [uploading, setUploading] = useState(false);

	const fetchResults = async () => {
		if (!patientId) return;
		setLoading(true);
		try {
			const results = await getLabResultsByPatient(patientId);
			setLabResults(results);
		} catch (err) {
			console.error('Erro ao carregar resultados:', err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchResults();
	}, [patientId]);

	const handleUpload = async () => {
		if (!file || !labType || !patientId) {
			toast.error('Por favor, selecione um arquivo e um tipo de exame.');
			return;
		}
		setUploading(true);
		try {
			await uploadLabResult(patientId, labType, file);
			toast.success('Resultados enviados com sucesso!');
			setFile(null);
			setLabType('');
			// Recarregar a lista após o upload
			fetchResults();
		} catch (err) {
			toast.error('Erro ao enviar resultados.');
		} finally {
			setUploading(false);
		}
	};

	const handleDelete = async (resultId: string) => {
		alert(`Funcionalidade para apagar o resultado ${resultId} ainda a ser implementada.`);
	};

	return (
		<div className='p-4 bg-white rounded shadow'>
			<h2 className='text-lg font-bold mb-4'>Resultados de Laboratório</h2>

			{(role === 'DOCTOR' || role === 'ADMIN') && (
				<div className='mb-6'>
					<input type='text' placeholder='Tipo de exame' value={labType} onChange={e => setLabType(e.target.value)} className='border p-2 mr-2 rounded' />
					<input type='file' onChange={e => setFile(e.target.files?.[0] || null)} className='mr-2' />
					<button
						onClick={handleUpload}
						disabled={loading || !file || !labType || !patientId}
						className={`px-4 py-2 rounded text-white ${loading || !file || !labType || !patientId ? 'bg-gray-300 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-600'}`}
					>
						{uploading ? 'A enviar...' : 'Fazer upload'}
					</button>
				</div>
			)}

			<ul className='space-y-3'>
				{labResults.map(result => (
					<li key={result.id} className='flex justify-between items-center border p-2 rounded'>
						<div>
							<p className='font-semibold'>{result.type}</p>
							<a href={result.fileUrl} target='_blank' rel='noopener noreferrer' className='text-blue-500'>
								Ver resultado
							</a>
						</div>
						{(role === 'DOCTOR' || role === 'ADMIN') && (
							<button onClick={() => handleDelete(result.id)} className='text-red-500'>
								🗑️
							</button>
						)}
					</li>
				))}
				{labResults.length === 0 && <p className='text-gray-500'>Brevemente disponivel.</p>}
			</ul>
		</div>
	);
};

export default LabResults;
