import { useState } from 'react';
import Navbar from './components/Navbar';
import PatientsLista from './pages/admin/Patients';
import ScheduleAppointment from './pages/_ScheduleAppointment';

function App() {
	//const [count, setCount] = useState(0);

	return (
		<>
			<Navbar />
			<PatientsLista />
			<ScheduleAppointment />
		</>
	);
}

export default App;
