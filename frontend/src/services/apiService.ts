import axios from 'axios';
import { Patient } from '../pages/patient/data/typesPatient';
import { Receita } from '../types';
import { Appointment } from '../types';

const apiClient = axios.create({
	baseURL: 'http://localhost:3001/api',
});

// Interceptor: Adiciona o token de autenticação a cada pedido
apiClient.interceptors.request.use(
	config => {
		const token = localStorage.getItem('authToken'); // O token será guardado aqui no login
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	error => {
		return Promise.reject(error);
	},
);

// --- Funções da API ---

// Função para buscar todos os pacientes (para Admin/Doctor)
export const getPatients = async (): Promise<Patient[]> => {
	const response = await apiClient.get('/patients');
	return response.data;
};

// Função para buscar os dados do utilizador logado (para Patient)
export const getMe = async (): Promise<Patient> => {
	const response = await apiClient.get('/auth/me');
	return response.data;
};
// Função para buscar prescrições de um paciente
export const getPrescriptionsByPatient = async (patientId: string): Promise<Receita[]> => {
	try {
		const response = await apiClient.get(`/prescriptions?patientId=${patientId}`);
		return response.data;
	} catch (error) {
		console.error('Erro ao buscar prescrições:', error);
		return []; // Retorna um array vazio em caso de erro para não quebrar o componente
	}
};

export const getAppointments = async (): Promise<Appointment[]> => {
	try {
		const response = await apiClient.get('/appointments');
		return response.data;
	} catch (error) {
		console.error('Erro ao buscar consultas:', error);
		return [];
	}
};
