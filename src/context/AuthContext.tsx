// src/contexts/AuthContext.tsx
import { createContext, useEffect, useState, useContext } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

type Role = 'admin' | 'doctor' | 'patient' | null;

type AuthContextType = {
	user: User | null;
	role: Role;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
	setRole: React.Dispatch<React.SetStateAction<Role>>;
	loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [role, setRole] = useState<Role>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
			if (firebaseUser) {
				console.log('aqui');

				setUser(firebaseUser);
				const docRef = doc(db, 'users', firebaseUser.uid);
				const docSnap = await getDoc(docRef);
				const data = docSnap.data();
				setRole(data?.role || null);
			} else {
				setUser(null);
				setRole(null);
			}
			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	return <AuthContext.Provider value={{ user, role, setUser, setRole, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
