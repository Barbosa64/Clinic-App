// src/components/LabResults.tsx
import React, { useEffect, useState } from 'react';
import { db, storage } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { useAuth } from '../context/AuthContext';

interface LabResult {
	id: string;
	patientId: string;
	fileName: string;
	fileUrl: string;
	uploadAt: string;
	type: string;
}

interface Props {
	patientId?: string;
}

const LabResults: React.FC<Props> = ({ patientId }) => {
	const { user, role } = useAuth();
	const [labResults, setLabResults] = useState<LabResult[]>([]);
	const [file, setFile] = useState<File | null>(null);
	const [labType, setLabType] = useState('');
	const [selectedPatientId, setSelectedPatientId] = useState('');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (role === 'patient' && user?.uid) {
			setSelectedPatientId(user.uid);
		} else if ((role === 'doctor' || role === 'admin') && patientId) {
			setSelectedPatientId(patientId);
		}
	}, [user?.uid, role, patientId]);

	const fetchResults = async () => {
		if (!user || !selectedPatientId) return;
		try {
			const q = query(collection(db, 'LabResults'), where('patientId', '==', selectedPatientId));
			const snapshot = await getDocs(q);
			const results: LabResult[] = snapshot.docs.map(doc => ({
				id: doc.id,
				...(doc.data() as Omit<LabResult, 'id'>),
			}));
			setLabResults(results);
		} catch (err) {
			console.error('Erro ao buscar resultados:', err);
		}
	};

	useEffect(() => {
		if (selectedPatientId) {
			fetchResults();
		}
	}, [selectedPatientId]);

	const handleUpload = async () => {
		if (!file || !labType || selectedPatientId === '') {
			console.warn('Falta o arquivo, tipo do exame ou paciente selecionado');
			return;
		}

		setLoading(true);

		try {
			const timestamp = Date.now();
			const fileName = `${timestamp}_${file.name}`;
			const filePath = `${selectedPatientId}/${labType}/${fileName}`;
			const fileRef = ref(storage, filePath);

			await uploadBytes(fileRef, file);
			const url = await getDownloadURL(fileRef);

			const docRef = await addDoc(collection(db, 'LabResults'), {
				patientId: selectedPatientId,
				fileName,
				fileUrl: url,
				uploadAt: new Date().toISOString(),
				type: labType,
			});

			console.log('Arquivo salvo com ID:', docRef.id);
			setFile(null);
			setLabType('');
			fetchResults();
		} catch (err) {
			console.error('Erro ao fazer upload:', err);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (result: LabResult) => {
		try {
			await deleteDoc(doc(db, 'LabResults', result.id));
			const filePath = `${result.patientId}/${result.type}/${result.fileName}`;
			await deleteObject(ref(storage, filePath));
			fetchResults();
		} catch (err) {
			console.error('Erro ao apagar:', err);
		}
	};

	return (
		<div className='p-4 bg-white rounded shadow'>
			<h2 className='text-lg font-bold mb-4'>Resultados de Laboratório</h2>

			{(role === 'doctor' || role === 'admin') && (
				<div className='mb-6'>
					<input type='text' placeholder='Tipo de exame' value={labType} onChange={e => setLabType(e.target.value)} className='border p-2 mr-2 rounded' />
					<input type='file' onChange={e => setFile(e.target.files?.[0] || null)} className='mr-2' />
					{process.env.NODE_ENV === 'development' && (
						<pre className='text-xs text-gray-500'>
							file: {file?.name ?? 'null'} | labType: {labType || 'vazio'} | selectedPatientId: {selectedPatientId || 'vazio'}
						</pre>
					)}
					<button
						onClick={handleUpload}
						disabled={loading || !file || !labType || !selectedPatientId}
						className={`px-4 py-2 rounded text-white ${loading || !file || !labType || !selectedPatientId ? 'bg-gray-300 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-600'}`}
					>
						{loading ? 'A enviar...' : 'Fazer upload'}
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
						{(role === 'doctor' || role === 'admin') && (
							<button onClick={() => handleDelete(result)} className='text-red-500'>
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
