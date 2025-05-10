import { auth } from "./firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail, updatePassword, sendEmailVerification, User } from 'firebase/auth';

/**
 * Cria um novo usuário com email e senha
 */
export const doCreateUserWithEmailAndPassword = async (email: string, password: string) => {
	return await createUserWithEmailAndPassword(auth, email, password);
};

/**
 * Faz login com Google
 */
export const doSignWithGoogle = async () => {
	const provider = new GoogleAuthProvider();
	return await signInWithPopup(auth, provider);
};

/**
 * Faz logout
 */
export const doSignOut = () => {
	return auth.signOut();
};

/**
 * Redefine senha por e-mail
 */
export const doPasswordReset = (email: string) => {
	return sendPasswordResetEmail(auth, email);
};

/**
 * Altera a senha do usuário atual
 */
export const doPasswordChange = (password: string) => {
	const currentUser = auth.currentUser;
	if (!currentUser) throw new Error('Usuário não autenticado');
	return updatePassword(currentUser, password);
};

/**
 * Envia e-mail de verificação
 */
export const doSendEmailVerification = () => {
	const currentUser = auth.currentUser;
	if (!currentUser) throw new Error('Usuário não autenticado');
	return sendEmailVerification(currentUser, {
		url: `${window.location.origin}/home`,
	});
};
