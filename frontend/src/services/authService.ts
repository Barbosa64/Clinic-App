import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../lib/firebase';

export async function register(email: string, password: string, role: 'admin' | 'client') {
	const userCredential = await createUserWithEmailAndPassword(auth, email, password);
	const uid = userCredential.user.uid;

	await setDoc(doc(db, 'users', uid), { email, role });
}
