/*
import React from 'react';
import { useParams } from 'react-router-dom';
import ReceitaList from '../components/ReceitaList';

export default function Patients() {
	const { id: patientId } = useParams<{ id: string }>();
	console.log('PatientId da URL:', patientId);

	if (!patientId) return <p>Paciente não encontrado</p>;

	return (
		<div>
			<h1>Detalhes do Paciente</h1>

			<ReceitaList patientId={patientId} />
		</div>
	);
}
*/
