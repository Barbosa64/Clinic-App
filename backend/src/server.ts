import dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
	dotenv.config();
}
import app from './app';

// =================================================================
//          INÍCIO DO BLOCO DE DEBUGGING
// =================================================================
console.log('--- INICIANDO DEBUGGING DE VARIÁVEIS DE AMBIENTE ---');
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

const dbUrl = process.env.DATABASE_URL;
if (dbUrl) {
	const host = dbUrl.includes('@') ? dbUrl.split('@')[1]?.split(':')[0] : 'Formato desconhecido';
	console.log('DATABASE_URL encontrada. Host:', host);
} else {
	console.log('ERRO: A variável de ambiente DATABASE_URL NÃO FOI ENCONTRADA!');
}
console.log('--- FIM DO DEBUGGING ---');
// =================================================================

const PORT = process.env.PORT || 3001;

// Inicia o servidor
app.listen(PORT, () => {
	console.log(`Servidor a correr na porta ${PORT}`);
});
