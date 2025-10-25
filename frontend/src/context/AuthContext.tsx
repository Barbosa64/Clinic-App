import { createContext, useContext, useEffect, useState } from 'react';

type Role = 'ADMIN' | 'doctor' | 'patient' | null;

interface User {
	id: string;
	email: string;
	name: string;
	role: Role;
	imageUrl?: string | null;
}

interface AuthContextType {
	user: User | null;
	role: Role;
	imageUrl: string | null;
	loading: boolean;
	login: (email: string, password: string) => Promise<boolean>;
	logout: () => void;
	register: (data: { name: string; email: string; password: string; role?: Role }) => Promise<boolean>;
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
				const res = await fetch('http://localhost:3000/auth/me', {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				if (!res.ok) throw new Error('Sessão inválida');

				const data = await res.json();
				setUser(data);
				setRole(data.role);
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

	// 🔑 Login (recebe email e password)
	const login = async (email: string, password: string) => {
		try {
			const res = await fetch('http://localhost:3001/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password }),
			});

			if (!res.ok) {
				console.error('Login falhou:', res.status);
				return false;
			}

			const data = await res.json();
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

	// 🧾 Registo de utilizador
	const register = async (data: { name: string; email: string; password: string; role?: Role }) => {
		try {
			const res = await fetch('http://localhost:3001/api/auth/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});

			if (!res.ok) {
				console.error('Erro no registo:', res.status);
				return false;
			}

			return true;
		} catch (err) {
			console.error('Erro no registo:', err);
			return false;
		}
	};

	// 🚪 Logout
	const logout = () => {
		localStorage.removeItem('authToken');
		setUser(null);
		setRole(null);
		setImageUrl(null);
	};

	return <AuthContext.Provider value={{ user, role, imageUrl, loading, login, logout, register }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
	return ctx;
};
