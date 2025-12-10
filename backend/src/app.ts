import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import doctorRoutes from './routes/doctorRoutes';
import patientRoutes from './routes/patientRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import prescriptionRoutes from './routes/prescriptionRoutes';
import labResultsRoutes from './routes/labResultsRoutes';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/lab-results', labResultsRoutes);

app.get('/api/test', (req, res) => {
	res.json({ message: 'Olá do backend da Clínica!' });
});

app.get('/', (req, res) => {
	res.status(200).send('API Clinic-App is running correctly!');
});

export default app;
