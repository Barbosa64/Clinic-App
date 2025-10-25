// backend/src/controllers/doctorController.ts
import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';

// @desc    Listar todos os médicos
// @route   GET /api/doctors
// @access  Privado (necessita de autenticação para proteger esta rota)
export const getAllDoctors = async (req: Request, res: Response) => {
	try {
		const doctors = await prisma.user.findMany({
			where: {
				role: 'DOCTOR',
			},

			select: {
				id: true,
				name: true,
				email: true,
				specialty: true,
				role: true,
				imageUrl: true,
			},
		});

		res.status(200).json(doctors);
	} catch (error) {
		console.error('Erro ao obter os médicos:', error);
		res.status(500).json({ message: 'Erro interno do servidor.' });
	}
};

// @desc    Criar um novo médico
// @route   POST /api/doctors
// @access  Privado (Proteger e restringir a Admins)

export const createDoctor = async (req: Request, res: Response) => {
	const { name, email, password, specialty } = req.body;

	if (!name || !email || !password || !specialty) {
		return res.status(400).json({ message: 'Todos os campos obrigatórios devem estar preenchidos.' });
	}

	try {
		const existingDoctor = await prisma.user.findUnique({ where: { email } });

		if (existingDoctor) {
			return res.status(409).json({ message: 'Este email ja esta em uso.' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newDoctor = await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
				role: 'DOCTOR',
				specialty: Array.isArray(specialty) ? specialty : [specialty],
			},
			select: {
				id: true,
				name: true,
				email: true,
				specialty: true,
				role: true,
				imageUrl: true,
			},
		});

		res.status(201).json(newDoctor);
	} catch (error) {
		res.status(500).json({
			message: 'Erro ao criar médico.',
		});
	}
};

// obter médico por ID

export const getDoctorById = async (req: Request, res: Response) => {
	const { id } = req.params; // id URL

	try {
		const doctor = await prisma.user.findUnique({
			where: {
				id,
				role: 'DOCTOR', // Garantir utilizadores que são médicos
			},
			select: {
				id: true,
				name: true,
				email: true,
				specialty: true,
				imageUrl: true,
			},
		});

		if (!doctor) {
			return res.status(404).json({ message: 'Médico nao encontrado.' });
		}

		res.status(200).json(doctor);
	} catch (error) {
		res.status(500).json({ message: 'Erro ao procurar médico.' });
	}
};
