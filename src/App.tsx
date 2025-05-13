import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './layouts/Navbar';
import PatientsLista from './pages/admin/Patients';
import ScheduleAppointment from './pages/admin/ScheduleAppointment';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AuthRoute from './pages/AuthRoute';

function App() {
	const location = useLocation();

	return (
		<>
			{location.pathname !== '/login' && location.pathname !== '/signup' && <Navbar />}

			<Routes>
				<Route path='/login' element={<Login />} />
				<Route path='/signup' element={<Signup />} />

				<Route
					path='/'
					element={
						<AuthRoute>
							<PatientsLista />
						</AuthRoute>
					}
				/>
				<Route
					path='/pacientes'
					element={
						<AuthRoute>
							<PatientsLista />
						</AuthRoute>
					}
				/>
				<Route
					path='/marcar-consulta'
					element={
						<AuthRoute>
							<ScheduleAppointment />
						</AuthRoute>
					}
				/>

				{/* fallback 404 */}
				<Route path='*' element={<Navigate to='/' replace />} />
			</Routes>
		</>
	);
}

export default () => (
	<Router>
		<App />
	</Router>
);
