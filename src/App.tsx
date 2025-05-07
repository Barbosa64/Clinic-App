import { useState } from 'react';
import { Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './pages/register';
import Home from './pages/Home';
import PatientsLista from './pages/admin/Patients';
import ScheduleAppointment from './pages/_ScheduleAppointment';

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<Route path='/register' element={<Register />} />
			<Navbar />
			<PatientsLista />
			<Home />
			<ScheduleAppointment />
		</>
	);
}

Navbar();

export default App;
