import SidebarPatients from '../../components/SidebarPatients';
import DiagnosisHistory from '../../components/DiagnosisHistory';
import PatientQuickStats from '../../components/PatientQuickStats';
import DiagnosticList from '../../components/DiagnosticList';
import PatientProfileCard from '../../components/PatientProfileCard';
import LabResults from '../../components/LabResults';
import { useParams } from 'react-router-dom';

export default function PatientsPage() {
	const { id } = useParams();
	return (
		<div className='flex'>
			<SidebarPatients />
			<main className='flex-1 p-6 grid grid-cols-3 gap-4'>
				<section className='col-span-2 space-y-4'>
					<DiagnosisHistory />
					<PatientQuickStats />
					<DiagnosticList />
				</section>
				<aside className='col-span-1 space-y-4'>
					{id ? <PatientProfileCard id={id} /> : <p className='text-center'>Selecione um paciente</p>}
					<LabResults />
				</aside>
			</main>
		</div>
	);
}
