import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
	apiKey: 'AIzaSyCVXioAXNCAyRXCi8u5e9H3I1ODYvZapIo',
	authDomain: 'my-clinic-app-3dbe6.firebaseapp.com',
	projectId: 'my-clinic-app-3dbe6',
	storageBucket: 'my-clinic-app-3dbe6.appspot.com', // corrigido: estava "firebasestorage.app"
	messagingSenderId: '460347855386',
	appId: '1:460347855386:web:e6b55b0e77d8ea4b0a77a3',
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta o módulo de autenticação (opcional, mas comum)
export const auth = getAuth(app);
export default app;
