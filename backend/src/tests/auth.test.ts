import { register } from '../controllers/authController';
import { prismaMock } from './prismaMock';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

// Mock do bcrypt para não ficar lento
jest.mock('bcryptjs');

describe('Auth Controller - Register', () => {
	let req: Partial<Request>;
	let res: Partial<Response>;
	let jsonMock: jest.Mock;
	let statusMock: jest.Mock;

	beforeEach(() => {
		jsonMock = jest.fn();
		statusMock = jest.fn(() => ({ json: jsonMock })); // Encadeamento .status().json()
		req = {
			body: {
				name: 'Teste User',
				email: 'teste@email.com',
				password: 'password123',
			},
		};
		res = {
			status: statusMock as unknown as any,
			json: jsonMock as unknown as any,
		};
	});

	it('deve registar um utilizador com sucesso', async () => {
		// 1. Simular que não existe utilizador com este email
		prismaMock.user.findUnique.mockResolvedValue(null);

		// 2. Simular o hash da password
		(bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');

		
		prismaMock.user.create.mockResolvedValue({
			id: '1',
			name: 'Teste User',
			email: 'teste@email.com',
			password: 'hashed_password',
			role: 'PATIENT',
			createdAt: new Date(),
			updatedAt: new Date(),
			phone: null,
			birthDate: null,
			gender: null,
			insurance: null,
			insuranceNumber: null,
			imageUrl: null,
			specialty: [],
		} as any);

		// 4. Executar a função do controlador
		await register(req as Request, res as Response);

		// 5. Asserções (Expects)
		expect(prismaMock.user.create).toHaveBeenCalled();
		expect(statusMock).toHaveBeenCalledWith(201);
		expect(jsonMock).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'Utilizador criado com sucesso!',
			}),
		);
	});

	it('deve falhar se o email já existir', async () => {
		
		prismaMock.user.findUnique.mockResolvedValue({ id: '1', email: 'teste@email.com' } as any);

		await register(req as Request, res as Response);

		expect(prismaMock.user.create).not.toHaveBeenCalled(); // Não deve tentar criar
		expect(statusMock).toHaveBeenCalledWith(409);
		expect(jsonMock).toHaveBeenCalledWith({ message: 'Este email já está em uso.' });
	});
});
