// src/tests/appointment.test.ts
import request from 'supertest';
import app from '../app';
import { prismaMock } from './prismaMock';
import jwt from 'jsonwebtoken';

// Mock do middleware de autenticação para evitar validar tokens reais
jest.mock('jsonwebtoken');

describe('Appointment Routes', () => {
	// Simular um utilizador logado (Paciente)
	const mockUserPayload = { userId: 'patient-123', role: 'PATIENT' };

	beforeEach(() => {
		// Sempre que o jwt.verify for chamado, devolve o nosso payload falso
		(jwt.verify as jest.Mock).mockReturnValue(mockUserPayload);
	});

	it('POST /api/appointments - deve marcar uma consulta', async () => {
		// Dados da consulta
		const appointmentData = {
			doctorId: 'doc-1',
			patientId: 'patient-123',
			date: '2025-12-25T10:00:00.000Z',
			specialty: 'Cardiologia',
		};

		// Simular a resposta do Prisma ao criar consulta
		prismaMock.appointment.create.mockResolvedValue({
			id: 'appt-1',
			...appointmentData,
			date: new Date(appointmentData.date),
			createdAt: new Date(),
			updatedAt: new Date(),
		} as any);

		// Fazer o pedido HTTP
		const response = await request(app)
			.post('/api/appointments')
			.set('Authorization', 'Bearer token_falso') // O header é necessário para passar o "check" inicial
			.send(appointmentData);

		expect(response.status).toBe(201);
		expect(response.body).toHaveProperty('id', 'appt-1');
		expect(prismaMock.appointment.create).toHaveBeenCalled();
	});

	it('POST /api/appointments - deve impedir paciente de marcar para outro', async () => {
		const appointmentData = {
			doctorId: 'doc-1',
			patientId: 'outro-paciente-id', // ID diferente do token
			date: '2025-12-25T10:00:00.000Z',
			specialty: 'Cardiologia',
		};

		const response = await request(app).post('/api/appointments').set('Authorization', 'Bearer token_falso').send(appointmentData);

		expect(response.status).toBe(403);
		expect(response.body.message).toMatch(/Acesso negado/);
	});
});
