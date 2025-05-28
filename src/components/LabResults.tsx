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

const LabResults: React.FC = () => {
	const { user, role } = useAuth(); // ✅ extraímos também o `role`
	const [labResults, setLabResults] = useState<LabResult[]>([]);
	const [file, setFile] = useState<File | null>(null);
	const [labType, setLabType] = useState('');
	const [loading, setLoading] = useState(false);

	// 🔁 Troque por lógica real de seleção se aplicável
	const selectedPatientId = role === 'patient' && user ? user.uid : 'SELECIONAR_PACIENTE';

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
		if (user) {
			fetchResults();
		}
	}, [user]);

	const handleUpload = async () => {
		if (!file || !labType || selectedPatientId === '') {
			console.warn('Falta o arquivo, tipo do exame ou paciente');
			return;
		}

		setLoading(true);

		try {
			const timestamp = Date.now();
			const fileName = `${timestamp}_${file.name}`;
			const filePath = `${selectedPatientId}/${labType}/${fileName}`;
			console.log('Iniciando upload para:', filePath);

			const fileRef = ref(storage, filePath);

			
			const uploadResult = await uploadBytes(fileRef, file);
			console.log('Upload concluído:', uploadResult);

			
			const url = await getDownloadURL(fileRef);
			console.log('URL obtida:', url);

			// Adiciona documento no Firestore
			const docRef = await addDoc(collection(db, 'LabResults'), {
				patientId: selectedPatientId,
				uploadedBy: user?.uid,
				fileName,
				fileUrl: url,
				uploadDate: new Date().toISOString(),
				labType,
				status: 'Disponível',
			});

			console.log('Documento Firestore criado com ID:', docRef.id);

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
			await deleteObject(ref(storage, `${result.patientId}/${result.fileName}`));
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
					<button onClick={handleUpload} disabled={loading || !file || !labType} className='bg-teal-500 text-white px-4 py-2 rounded'>
						{loading ? 'Enviando...' : 'Fazer upload'}
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
				{labResults.length === 0 && <p className='text-gray-500'>Nenhum resultado disponível.</p>}
			</ul>
		</div>
	);
};

export default LabResults;
