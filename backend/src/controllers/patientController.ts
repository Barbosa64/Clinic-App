import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getAllPatients = async (req: Request, res: Response) => {
	try {
		const patients = await prisma.user.findMany({
			where: {
				role: 'PATIENT',
			},
			select: {
				id: true,
				name: true,
				email: true,
				phone: true,
				birthDate: true,
				gender: true,
				insurance: true,
				insuranceNumber: true,
				imageUrl: true,
			},
		});

		res.status(200).json(patients);
	} catch (error) {
		res.status(500).json({
			message: 'Erro ao buscar pacientes',
		});
	}
};
