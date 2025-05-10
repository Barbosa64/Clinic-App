import React, { useEffect, useState, useContext } from 'react';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = React.createContext();

export function AuthProvider({ children }) {
	const [currentUser, setCurrentUser] = React.useState(null);
	const [loading, setLoading] = React.useState(true);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(auth, initializeUser);
		return unsubscribe;
	}, []);

	async function initializeUser(user) {
		if (user) {
			setCurrentUser({ ...user });
			setUserLoggedIn(true);
		} else {
			setCurrentUser(null);
			setUserLoggedIn(false);
		}
		setLoading(false);
	}

	const value = {
		currentUser,
		setUserLoggedIn,
		loading,
	};
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
