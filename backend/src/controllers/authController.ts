// backend/src/controllers/authController.ts
import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';

export const register = async (req: Request, res: Response) => {
	// 1. Obter dados do corpo do pedido
	const { email, password, name, role } = req.body;

	//  A verficar melhorias
	if (!email || !password || !name) {
		return res.status(400).json({ message: 'Email, password e nome são obrigatórios.' });
	}

	try {
		// Verifica se o utilizador já existe
		const existingUser = await prisma.user.findUnique({
			where: { email: email },
		});

		if (existingUser) {
			return res.status(409).json({ message: 'Este email já está em uso.' });
		}

		// Fazer o hash da password
		const hashedPassword = await bcrypt.hash(password, 10); // O '10' é o "salt rounds" - um bom valor padrão

		// Criar o novo utilizador na base de dados
		const newUser = await prisma.user.create({
			data: {
				email: email,
				password: hashedPassword,
				name: name,
				role: role || 'PATIENT', // Se não for fornecido um papel, assume 'PATIENT'
			},
		});

		// 6. Enviar uma resposta de sucesso (sem a password!)
		// (Mais tarde, aqui também vamos gerar e enviar um token JWT)
		res.status(201).json({
			message: 'Utilizador criado com sucesso!',
			user: {
				id: newUser.id,
				email: newUser.email,
				name: newUser.name,
				role: newUser.role,
			},
		});
	} catch (error) {
		console.error('Erro no registo:', error);
		res.status(500).json({ message: 'Erro interno do servidor.' });
	}
};
