import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface AuthContextType {
	user: User | null;
	role: 'admin' | 'client' | null;
	loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, role: null, loading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [role, setRole] = useState<'admin' | 'client' | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
			setUser(firebaseUser);
			if (firebaseUser) {
				const docRef = doc(db, 'users', firebaseUser.uid);
				const docSnap = await getDoc(docRef);
				if (docSnap.exists()) setRole(docSnap.data().role);
			} else {
				setRole(null);
			}
			setLoading(false);
		});
		return () => unsubscribe();
	}, []);

	return <AuthContext.Provider value={{ user, role, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
