import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente do ficheiro .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001; // Usa a porta do .env ou 3001 como padrão

// Middlewares essenciais
app.use(cors()); // Permite pedidos de outros domínios (o seu frontend)
app.use(express.json()); // Permite que o servidor entenda JSON no corpo dos pedidos

// Uma rota de teste
app.get('/api/test', (req, res) => {
	res.json({ message: 'Olá do backend da Clínica!' });
});

// Inicia o servidor
app.listen(PORT, () => {
	console.log(`Servidor a correr na porta ${PORT}`);
});
