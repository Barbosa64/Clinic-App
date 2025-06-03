import { useParams } from 'react-router-dom';
import ReceitaList from '../components/ReceitaList';

export default function Patients() {
	const { id: patientId } = useParams();
	console.log('🆔 patientId capturado da URL:', patientId);

	return (
		<div>
			{/* Outros conteúdos */}
			<ReceitaList patientId={patientId} />
		</div>
	);
}
