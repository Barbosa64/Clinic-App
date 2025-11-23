import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// @desc    Criar uma nova consulta

export const createAppointment = async (req: Request, res: Response) => {
	const { doctorId, patientId, date, specialty } = req.body;
	const currentUser = req.user;

	if (!doctorId || !patientId || !date || !specialty) {
		return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos.' });
	}

	try {
		if (currentUser?.role === 'PATIENT' && currentUser?.userId !== patientId) {
			return res.status(403).json({ message: 'Acesso negado. Pacientes só podem marcar consultas para si próprios.' });
		}
		const newAppointment = await prisma.appointment.create({
			data: {
				date: new Date(date),
				specialty,
				doctorId,
				patientId,
			},
		});

		res.status(201).json(newAppointment);
	} catch (error) {
		res.status(500).json({ message: 'Erro ao criar consulta.' });
	}
};
// @desc    Listar consultas

export const getAppointments = async (req: Request, res: Response) => {
	const currentUser = req.user;
	const { patientId, doctorId } = req.query;

	try {
		const whereClause: any = {};

		if (currentUser?.role === 'PATIENT') {
			// Paciente só pode ver as suas próprias consultas
			whereClause.patientId = currentUser.userId;
		} else if (currentUser?.role === 'DOCTOR') {
			// Médico só pode ver as suas próprias consultas
			whereClause.doctorId = currentUser.userId;

			if (patientId) {
				whereClause.patientId = patientId as string;
			}
		} else if (currentUser?.role === 'ADMIN') {
			// Admin pode filtrar por qualquer médico ou paciente
			if (patientId) whereClause.patientId = patientId as string;
			if (doctorId) whereClause.doctorId = doctorId as string;
		}

		const appointments = await prisma.appointment.findMany({
			where: whereClause,
			include: {
				doctor: true,
				patient: true,
			},
			orderBy: {
				date: 'desc',
			},
		});

		const formattedAppointments = appointments.map(appt => ({
			id: appt.id,
			date: appt.date,
			specialty: appt.specialty,
			patientId: appt.patientId,
			// Extrai o nome do objeto aninhado 'patient'
			patientName: appt.patient.name,
			doctorId: appt.doctorId,
			// Extrai o nome do objeto aninhado 'doctor'
			doctorName: appt.doctor.name,
		}));

		// Enviar a lista formatada em vez da original
		res.status(200).json(formattedAppointments);
	} catch (error) {
		console.error('Erro ao buscar consultas:', error); // Adicionar log para debugging
		res.status(500).json({ message: 'Erro ao listar consultas.' });
	}
};

// Cancelar (apagar) uma consulta

export const cancelAppointment = async (req: Request, res: Response) => {
	const { id } = req.params;
	const currentUser = req.user;

	try {
		const appointment = await prisma.appointment.findUnique({
			where: { id },
		});

		if (!appointment) {
			return res.status(404).json({ message: 'Consulta não encontrada.' });
		}

		if (currentUser?.role === 'DOCTOR' && appointment.doctorId !== currentUser.userId) {
			return res.status(403).json({ message: 'Acesso negado. Médicos só podem cancelar suas próprias consultas.' });
		}

		if (currentUser?.role === 'PATIENT' && appointment.patientId !== currentUser.userId) {
			return res.status(403).json({ message: 'Acesso negado.' });
		}

		const now = new Date();
		const appointmentDate = new Date(appointment.date);

		if (appointmentDate < now) {
			if (currentUser?.role !== 'ADMIN') {
				return res.status(403).json({
					message: 'Não é possível cancelar consultas passadas. Contacte a administração.',
				});
			}
		}

		await prisma.appointment.delete({
			where: { id },
		});

		res.status(200).json({ message: 'Consulta cancelada com sucesso.' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Erro ao cancelar consulta.' });
	}
};
