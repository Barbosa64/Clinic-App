// Importações do Firebase
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// 🔐 Substitua com suas credenciais do Firebase
const firebaseConfig = {
	apiKey: 'SUA_API_KEY',
	authDomain: 'SEU_DOMINIO.firebaseapp.com',
	projectId: 'my-clinic-app-3dbe6',
	storageBucket: 'SEU_BUCKET.appspot.com',
	messagingSenderId: 'SEU_SENDER_ID',
	appId: 'AIzaSyCVXioAXNCAyRXCi8u5e9H3I1ODYvZapIo',
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta o serviço de autenticação
export const auth = getAuth(app);
