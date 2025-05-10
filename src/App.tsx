import { useState } from 'react';
import { Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PatientsLista from './pages/admin/Patients';
import ScheduleAppointment from './pages/_ScheduleAppointment';
import { useAuth } from './contexts/authContext';
import Login from './pages/login';

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<Login />
			<Navbar />
			<PatientsLista />
			<Home />
			<ScheduleAppointment />
		</>
	);
}

Navbar();

export default App;
