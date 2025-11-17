import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// @desc    Criar uma nova prescrição
// @route   POST /api/prescriptions
// @access  Privado (Admin, Doctor)

export const createPrescription = async (req: Request, res: Response) => {
	const { patientId, appointmentId, farmaco, dose, frequencia, observacoes } = req.body;
	const currentUser = req.user;

	if (!patientId || !appointmentId || !farmaco || !dose || !frequencia) {
		return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos.' });
	}

	try {
		const appointment = await prisma.appointment.findUnique({
			where: { id: appointmentId },
		});

		if (!appointment || appointment.patientId !== patientId) {
			return res.status(404).json({ message: 'Consulta inválida ou não pertence ao paciente especificado.' });
		}

		if (currentUser?.role === 'DOCTOR' && appointment.doctorId !== currentUser.userId) {
			return res.status(403).json({ message: 'Acesso negado. Só pode prescrever em consultas que lhe pertencem.' });
		}

		const newPrescription = await prisma.prescription.create({
			data: {
				farmaco,
				dose,
				frequencia,
				observacoes: observacoes || '',
				patientId,
				appointmentId,
				doctorId: appointment.doctorId,
			},
		});

		res.status(201).json(newPrescription);
	} catch (error) {
		console.error('Erro ao criar prescrição:', error);
		res.status(500).json({ message: 'Erro ao criar prescrição.' });
	}
};

// @desc    Listar as prescrições de um paciente
// @route   GET /api/prescriptions?patientId=<id>
// @access  Privado (Admin, Doctor, Patient)

export const getPrescriptions = async (req: Request, res: Response) => {
	const { patientId } = req.query;
	const currentUser = req.user;

	if (!patientId || typeof patientId !== 'string') {
		return res.status(400).json({ message: 'ID do paciente obrigatório.' });
	}

	const patientIdStr = Array.isArray(patientId) ? patientId[0] : patientId;
	if (typeof patientIdStr !== 'string') {
		return res.status(400).json({ message: 'ID do paciente inválido.' });
	}

	try {
		if (currentUser?.role === 'PATIENT' && currentUser.userId !== patientId) {
			return res.status(403).json({ message: 'Acesso negado. Só pode ver suas prescrições.' });
		}
		const prescriptions = await prisma.prescription.findMany({
			where: {
				patientId: patientId,
			},
			include: {
				doctor: { select: { name: true } },
			},
			orderBy: {
				criadoEm: 'desc',
			},
		});

		res.status(200).json(prescriptions);
	} catch (error) {
		console.error('Erro ao buscar prescrições:', error);
		res.status(500).json({ message: 'Erro ao buscar prescrições.' });
	}
};
