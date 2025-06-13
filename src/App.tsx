// App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './layouts/Navbar';

import PatientsLista from './pages/admin/Patients';
import ScheduleAppointment from './pages/admin/ScheduleAppointment';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TeamList from './pages/admin/doctor/data/_TeamList';
import Agenda from './pages/doctor/Agenda';
import PatientList from './pages/patient/data/PatientList';
import ProtectedRoute from './routes/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

import Patients from './pages/admin/Patients';
import PatientAppointment from './pages/patient/data/PatientAppointment.tsx';
import Settings from './layouts/Settings';

function AppRoutes() {
	const location = useLocation();

	return (
		<>
			{location.pathname !== '/login' && location.pathname !== '/signup' && <Navbar />}

			<Routes>
				<Route path='/login' element={<Login />} />
				<Route path='/signup' element={<Signup />} />
				{/* ADMIN */}
				<Route
					path='/dashboard'
					element={
						<ProtectedRoute allowedRoles={['admin', 'doctor', 'patient']}>
							<PatientsLista />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/consulta/admin'
					element={
						<ProtectedRoute allowedRoles={['admin']}>
							<ScheduleAppointment />
						</ProtectedRoute>
					}
				/>
				«{/* DOCTOR */}
				<Route
					path='/agenda'
					element={
						<ProtectedRoute allowedRoles={['admin', 'doctor', 'patient']}>
							<Agenda />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/medicos'
					element={
						<ProtectedRoute allowedRoles={['admin']}>
							<TeamList />
						</ProtectedRoute>
					}
				/>
				{/* PATIENT */}
				<Route
					path='/pacientes'
					element={
						<ProtectedRoute allowedRoles={['doctor', 'admin']}>
							<PatientList />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/marcar-consulta/:id'
					element={
						<ProtectedRoute allowedRoles={['admin', 'patient']}>
							<PatientAppointment />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/dashboard/:id'
					element={
						<ProtectedRoute allowedRoles={['admin', 'doctor', 'patient']}>
							<Patients />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/configuracoes'
					element={
						<ProtectedRoute allowedRoles={['admin', 'doctor', 'patient']}>
							<Settings />
						</ProtectedRoute>
					}
				/>
				{/* Fallback para rota inexistente */}
				<Route
					path='*'
					element={
						<ProtectedRoute allowedRoles={['admin', 'doctor', 'patient']}>
							<Navigate to='/dashboard' replace />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</>
	);
}

export default function App() {
	return (
		<Router>
			<AuthProvider>
				<AppRoutes />
			</AuthProvider>
		</Router>
	);
}
