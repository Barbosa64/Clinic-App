import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '../services/apiService';

type Role = 'ADMIN' | 'DOCTOR' | 'PATIENT' | null;

interface User {
	id: string;
	email: string;
	name: string;
	role: Role;
	imageUrl?: string | null;
}

export interface RegisterData {
	name: string;
	email: string;
	password: string;
	phone?: string;
	birthDate?: string;
	gender?: 'Masculino' | 'Feminino' | 'Outro';
	insurance?: string;
	insuranceNumber?: string;
	imageUrl?: string | null;
}

interface AuthContextType {
	user: User | null;
	role: Role;
	imageUrl: string | null;
	loading: boolean;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
	login: (email: string, password: string) => Promise<boolean>;
	logout: () => void;
	register: (data: RegisterData) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [role, setRole] = useState<Role>(null);
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	// Buscar utilizador logado ao carregar a app
	useEffect(() => {
		const token = localStorage.getItem('authToken');
		if (!token) {
			setLoading(false);
			return;
		}

		const fetchUser = async () => {
			try {
				const res = await apiClient.get('/auth/me');

				const data = res.data;
				setUser(data);
				setRole(data.role?.toUpperCase() || null);
				setImageUrl(data.imageUrl || null);
			} catch (error) {
				console.error('Erro ao carregar utilizador:', error);
				localStorage.removeItem('authToken');
				setUser(null);
				setRole(null);
				setImageUrl(null);
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, []);

	// Login
	const login = async (email: string, password: string): Promise<boolean> => {
		try {
			const res = await apiClient.post('/auth/login', { email, password });

			const data = res.data;
			localStorage.setItem('authToken', data.token);
			setUser(data.user);
			setRole(data.user.role);
			setImageUrl(data.user.imageUrl || null);
			return true;
		} catch (err) {
			console.error('Erro no login:', err);
			return false;
		}
	};

	// Registo de utilizador
	const register = async (data: RegisterData): Promise<{ success: boolean; message?: string }> => {
		try {
			await apiClient.post('/auth/register', data);

			return { success: true };
		} catch (err: any) {
			// Usar 'any' para aceder a 'err.response'
			const message = err.response?.data?.message || 'Não foi possível ligar ao servidor.';
			console.error('Erro no registo:', message);
			return { success: false, message };
		}
	};

	// Logout
	const logout = () => {
		localStorage.removeItem('authToken');
		setUser(null);
		setRole(null);
		setImageUrl(null);
	};

	return <AuthContext.Provider value={{ user, setUser, role, imageUrl, loading, login, logout, register }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
	return ctx;
};
