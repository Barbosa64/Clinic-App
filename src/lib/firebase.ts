import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
	apiKey: 'SUA_API_KEY',
	authDomain: 'MEU_AUTH_DOMAIN',
	projectId: 'MEU_PROJECT_ID',
	storageBucket: 'MEU_BUCKET',
	messagingSenderId: 'MEU_ID',
	appId: 'MEU_APP_ID',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
