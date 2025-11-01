import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import doctorRoutes from './routes/doctorRoutes';
import patientRoutes from './routes/patientRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import prescriptionRoutes from './routes/prescriptionRoutes';

// Carrega as variáveis de ambiente do ficheiro .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors()); // Permite pedidos de outros domínios do seu frontend)
app.use(express.json()); // Permite que o servidor entenda JSON no corpo dos pedidos

// Rotas

app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);

// Uma rota de teste
app.get('/api/test', (req, res) => {
	res.json({ message: 'Olá do backend da Clínica!' });
});

// Inicia o servidor
app.listen(PORT, () => {
	console.log(`Servidor a correr na porta ${PORT}`);
});
