import axios from 'axios';
import { Patient } from '../pages/patient/data/typesPatient';
import { Receita } from '../types';
import { Appointment } from '../types';
import { LabResult } from '../types';

const apiClient = axios.create({
	baseURL: 'http://localhost:3001/api',
});

// Interceptor: Adiciona o token de autenticação
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

// buscar todos os pacientes (para Admin/Doctor)
export const getPatients = async (): Promise<Patient[]> => {
	const response = await apiClient.get('/patients');
	return response.data;
};

// buscar os dados do utilizador logado (para Patient)
export const getMe = async (): Promise<Patient> => {
	const response = await apiClient.get('/auth/me');
	return response.data;
};
// buscar prescrições de um paciente
export const getPrescriptionsByPatient = async (patientId: string): Promise<Receita[]> => {
	try {
		const response = await apiClient.get(`/prescriptions?patientId=${patientId}`);
		return response.data;
	} catch (error) {
		console.error('Erro ao buscar prescrições:', error);
		return [];
	}
};

export const getAppointments = async (filters?: { patientId?: string; doctorId?: string }): Promise<Appointment[]> => {
	try {
		const response = await apiClient.get('/appointments', { params: filters });
		return response.data;
	} catch (error) {
		console.error('Erro ao buscar consultas:', error);
		return [];
	}
};
export const getPatientById = async (id: string): Promise<Patient | null> => {
	try {
		const response = await apiClient.get(`/patients/${id}`);
		return response.data;
	} catch (error) {
		console.error('Erro ao buscar paciente:', error);
		return null;
	}
};

// Prescrições formulário
export interface CreatePrescriptionData {
	patientId: string;
	appointmentId: string;
	farmaco: string;
	dose: string;
	frequencia: string;
	observacoes?: string;
}

// Prescrições

export const createPrescription = async (data: CreatePrescriptionData): Promise<Receita> => {
	const response = await apiClient.post('/prescriptions', data);
	return response.data;
};

// Resultados laboratório paciente

export const getLabResultsByPatient = async (patientId: string): Promise<LabResult[]> => {
	try {
		const response = await apiClient.get(`/lab-results?patientId=${patientId}`);
		return response.data;
	} catch (error) {
		console.error('Erro ao buscar resultados:', error);
		return [];
	}
};

export const uploadLabResult = async (patientId: string, type: string, file: File): Promise<LabResult> => {
	const formData = new FormData();
	formData.append('patientId', patientId);
	formData.append('type', type);
	formData.append('file', file);

	const response = await apiClient.post('/lab-results', formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});

	return response.data;
};
