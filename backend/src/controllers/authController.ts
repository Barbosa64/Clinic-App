// backend/src/controllers/authController.ts
import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response) => {
	// 1. Obter dados do corpo do pedido
	const { email, password, name } = req.body;

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

		// hash da password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Criar o novo utilizador na base de dados
		const newUser = await prisma.user.create({
			data: {
				name: name,
				email: email,
				password: hashedPassword,
				role: 'PATIENT', // Se não for fornecido um papel, assume 'PATIENT'
			},
		});

		// Enviar uma resposta de sucesso (sem a password)

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

// controller indentificar o utilizador
export const login = async (req: Request, res: Response) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({ message: 'Email e password obrigatórios.' });
	}

	// 1. Encontrar o utilizador na base de dados pelo email
	try {
		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			return res.status(401).json({ message: 'Credenciais inválidas.' });
		}

		const isPasswordCorrect = await bcrypt.compare(password, user.password);
		if (!isPasswordCorrect) {
			return res.status(401).json({ message: 'Credenciais inválidas.' });
		}

		if (!process.env.JWT_SECRET) {
			throw new Error('JWT_SECRET não está definido no .env');
		}

		const token = jwt.sign(
			{
				userId: user.id,
				role: user.role,
			},
			process.env.JWT_SECRET,
			{ expiresIn: '1h' },
		);

		res.status(200).json({
			message: 'Login bem sucedido!',
			token,
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
				role: user.role,
			},
		});
	} catch (error) {
		console.error('Erro no login:', error);
		res.status(500).json({ message: 'Erro interno do servidor.' });
	}
};

export const getMe = async (req: Request, res: Response) => {
	const userId = req.user?.userId;

	if (!userId) {
		return res.status(401).json({ message: 'Utilizador não autenticado.' });
	}

	try {
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				email: true,
				name: true,
				role: true,
				imageUrl: true,
			},
		});

		if (!user) {
			return res.status(404).json({ message: 'Utilizador nao encontrado.' });
		}

		res.status(200).json(user);
	} catch (error) {
		console.error('Erro ao obter o utilizador:', error);
		res.status(500).json({ message: 'Erro interno do servidor.' });
	}
};
