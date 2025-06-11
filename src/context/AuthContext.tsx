import { createContext, useEffect, useState, useContext } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

type Role = 'admin' | 'doctor' | 'patient' | null;

type AuthContextType = {
	user: User | null;
	role: Role;
	imageUrl: string | null;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
	setRole: React.Dispatch<React.SetStateAction<Role>>;
	setImageUrl: React.Dispatch<React.SetStateAction<string | null>>;
	loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [role, setRole] = useState<Role>(null);
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
			if (firebaseUser) {
				setUser(firebaseUser);

				try {
					const docRef = doc(db, 'users', firebaseUser.uid);
					const docSnap = await getDoc(docRef);
					const data = docSnap.data();

					// Atualiza o estado com a imagem do utilizador
					setImageUrl(data?.imageUrl || null);
					setRole(data?.role || null);
				} catch (error) {
					console.error('Erro ao buscar dados do utilizador:', error);
					setRole(null);
					setImageUrl(null);
				}
			} else {
				setUser(null);
				setRole(null);
				setImageUrl(null);
			}
			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	return <AuthContext.Provider value={{ user, role, imageUrl, setUser, setRole, setImageUrl, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth deve ser usado dentro de um <AuthProvider>');
	}
	return context;
};
