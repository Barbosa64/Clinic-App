// backend/src/controllers/doctorController.ts
import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// @desc    Listar todos os médicos
// @route   GET /api/doctors
// @access  Privado (vamos proteger esta rota)
export const getAllDoctors = async (req: Request, res: Response) => {
	try {
		const doctors = await prisma.user.findMany({
			where: {
				role: 'DOCTOR', // Filtrar apenas por utilizadores com o papel de DOCTOR
			},
			select: {
				id: true,
				name: true,
				email: true,
				specialty: true,
				imageUrl: true,
			},
		});
		res.status(200).json(doctors);
	} catch (error) {
		res.status(500).json({ message: 'Erro ao buscar médicos.' });
	}
};

// mais tarde, criar funções para create doctor, update doctor, delete doctor...)
