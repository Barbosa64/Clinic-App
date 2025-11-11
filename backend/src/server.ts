import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import doctorRoutes from './routes/doctorRoutes';
import patientRoutes from './routes/patientRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import prescriptionRoutes from './routes/prescriptionRoutes';
import labResultsRoutes from './routes/labResultsRoutes';

// =================================================================
//          INÍCIO DO BLOCO DE DEBUGGING
// =================================================================
console.log('--- INICIANDO DEBUGGING DE VARIÁVEIS DE AMBIENTE ---');
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

// Imprimir a DATABASE_URL para vermos o que a aplicação está a ler
// Por segurança, vamos mostrar apenas o início e o fim da URL, não a password.
const dbUrl = process.env.DATABASE_URL;
if (dbUrl) {
	console.log('DATABASE_URL encontrada. Host:', dbUrl.split('@')[1]?.split(':')[0]);
} else {
	console.log('ERRO: A variável de ambiente DATABASE_URL NÃO FOI ENCONTRADA!');
}
console.log('--- FIM DO DEBUGGING ---');
// =================================================================

if (process.env.NODE_ENV !== 'production') {
	dotenv.config();
}

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
app.use('/api/lab-results', labResultsRoutes);

// Uma rota de teste
app.get('/api/test', (req, res) => {
	res.json({ message: 'Olá do backend da Clínica!' });
});

// Inicia o servidor
app.listen(PORT, () => {
	console.log(`Servidor a correr na porta ${PORT}`);
});
