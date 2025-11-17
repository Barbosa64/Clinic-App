import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response) => {
	const { name, email, password } = req.body;

	if (!email || !password || !name) {
		return res.status(400).json({ message: 'Email, password e nome são obrigatórios.' });
	}

	try {
		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser) {
			return res.status(409).json({ message: 'Este email já está em uso.' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
				role: 'PATIENT',
			},
		});

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

export const login = async (req: Request, res: Response) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({ message: 'Email e password obrigatórios.' });
	}

	try {
		const user = await prisma.user.findUnique({ where: { email } });
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

		const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

		res.status(200).json({
			message: 'Login bem sucedido!',
			token,
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
				role: user.role,
				imageUrl: user.imageUrl,
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
				phone: true,
				birthDate: true,
				gender: true,
				insurance: true,
				insuranceNumber: true,
			},
		});

		if (!user) {
			return res.status(404).json({ message: 'Utilizador não encontrado.' });
		}

		res.status(200).json(user);
	} catch (error) {
		console.error('Erro ao obter o utilizador:', error);
		res.status(500).json({ message: 'Erro interno do servidor.' });
	}
};


export const updateMe = async (req: Request, res: Response) => {
	const userId = req.user?.userId;
	const { name, email, imageUrl, insurance, insuranceNumber, birthDate, phone, gender, currentPassword, newPassword } = req.body;

	if (!userId) {
		return res.status(401).json({ message: 'Não autorizado.' });
	}

	try {
		const user = await prisma.user.findUnique({ where: { id: userId } });
		if (!user) {
			return res.status(404).json({ message: 'Utilizador não encontrado.' });
		}

		const isChangingCredentials = newPassword || (email && email !== user.email);

		if (isChangingCredentials) {
			if (!currentPassword) {
				return res.status(400).json({ message: 'A sua password atual é necessária para fazer esta alteração.' });
			}
			const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
			if (!isPasswordCorrect) {
				return res.status(401).json({ message: 'A sua password atual está incorreta.' });
			}
		}

		const dataToUpdate: any = {
			name,
			imageUrl,
			insurance,
			insuranceNumber,
			birthDate: birthDate ? new Date(birthDate) : undefined,
			phone,
			gender,
		};

		if (email && email !== user.email) {
			dataToUpdate.email = email;
		}

		if (newPassword) {
			dataToUpdate.password = await bcrypt.hash(newPassword, 10);
		}

		const updatedUser = await prisma.user.update({
			where: { id: userId },
			data: dataToUpdate,
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				imageUrl: true,
				insurance: true,
				insuranceNumber: true,
				birthDate: true,
				phone: true,
				gender: true,
			},
		});

		res.status(200).json(updatedUser);
	} catch (error) {
		console.error('Erro ao atualizar o perfil:', error);
		res.status(500).json({ message: 'Erro interno do servidor.' });
	}
};
