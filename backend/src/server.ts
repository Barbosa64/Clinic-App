import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';

// Carrega as variáveis de ambiente do ficheiro .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares essenciais
app.use(cors()); // Permite pedidos de outros domínios (o seu frontend)
app.use(express.json()); // Permite que o servidor entenda JSON no corpo dos pedidos

app.use('/api/auth', authRoutes);
// Uma rota de teste
app.get('/api/test', (req, res) => {
	res.json({ message: 'Olá do backend da Clínica!' });
});

// Inicia o servidor
app.listen(PORT, () => {
	console.log(`Servidor a correr na porta ${PORT}`);
});
