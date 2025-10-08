import SidebarPatients from '../../components/SidebarPatients';
import AppointmentsHistory from '../../components/AppointmentsHistory';
import DiagnosticList from '../../components/ReceitaList';
import PatientProfileCard from '../../components/PatientProfileCard';
import LabResults from '../../components/LabResults';
import { useParams } from 'react-router-dom';
import FarmacoTest from '../../components/RecipeDoctor';

export default function PatientsPage() {
	const { id } = useParams();

	return (
		<main className='flex-1 p-4 grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-4'>
			<aside className='xl:col-span-1'>
				<SidebarPatients />
			</aside>

			<section className='space-y-4 xl:col-span-2'>
				<AppointmentsHistory patientId={id} />
				<DiagnosticList patientId={id || ''} />
				{id && <FarmacoTest patientId={id} />}
			</section>

			<aside className='space-y-4 md:col-span-2 lg:col-span-1 xl:col-span-1'>
				{id ? <PatientProfileCard id={id} /> : <p className='text-center'>Selecione um paciente</p>}
				<LabResults patientId={id || ''} />
			</aside>
		</main>
	);
}
