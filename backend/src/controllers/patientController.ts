import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';

// @desc    Criar um novo paciente
// @route   POST /api/patients
// @access  Privado (Admin)
export const createPatient = async (req: Request, res: Response) => {
	const { name, email, password, phone, birthDate, gender, insurance, insuranceNumber, imageUrl } = req.body;

	if (!name || !email || !password) {
		return res.status(400).json({ message: 'Nome, e-mail e password são obrigatórios.' });
	}

	try {
		const userExists = await prisma.user.findUnique({
			where: { email },
		});

		if (userExists) {
			return res.status(400).json({ message: 'Este e-mail já está em uso.' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newPatient = await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
				role: 'PATIENT',
				phone,
				birthDate: birthDate ? new Date(birthDate) : null,
				gender,
				insurance,
				insuranceNumber,
				imageUrl,
			},
			// Selecionar os campos a devolver (para não expor a password)
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

		res.status(201).json(newPatient);
	} catch (error) {
		console.error('Erro ao criar paciente:', error);
		res.status(500).json({ message: 'Erro interno do servidor ao criar paciente.' });
	}
};

// @desc    Obter todos os pacientes
// @route   GET /api/patients
// @access  Privado (Admin, Doctor)
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

// @desc    Obter os dados de um paciente específico
// @route   GET /api/patients/:id
// @access  Privado (Admin, Doctor)
export const getPatientById = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const patient = await prisma.user.findFirst({
			where: {
				id,
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

		if (!patient) {
			return res.status(404).json({ message: 'Paciente não encontrado.' });
		}

		res.status(200).json(patient);
	} catch (error) {
		console.error('Erro ao buscar o paciente:', error);
		res.status(500).json({ message: 'Erro ao buscar o paciente.' });
	}
};

// @desc    Atualizar os dados de um paciente
// @route   PUT /api/patients/:id
// @access  Privado (Admin)
export const updatePatient = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { name, email, phone, birthDate, gender, insurance, insuranceNumber, imageUrl, password } = req.body;

	try {
		const patient = await prisma.user.findUnique({
			where: { id },
		});

		if (!patient || patient.role !== 'PATIENT') {
			return res.status(404).json({ message: 'Paciente não encontrado.' });
		}

		const dataToUpdate: any = {
			name,
			phone,
			birthDate: birthDate ? new Date(birthDate) : undefined,
			gender,
			insurance,
			insuranceNumber,
			imageUrl,
		};

		if (password) {
			dataToUpdate.password = await bcrypt.hash(password, 10);
		}

		const updatedPatient = await prisma.user.update({
			where: { id },
			data: dataToUpdate,
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

		res.status(200).json(updatedPatient);
	} catch (error) {
		console.error('Erro ao atualizar o paciente:', error);
		res.status(500).json({ message: 'Erro ao atualizar o paciente.' });
	}
};

// @desc    Apagar um paciente
// @route   DELETE /api/patients/:id
// @access  Privado (Admin)
export const deletePatient = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const patient = await prisma.user.findUnique({
			where: { id },
		});
		if (!patient || patient.role !== 'PATIENT') {
			return res.status(404).json({ message: 'Paciente não encontrado.' });
		}

		await prisma.user.delete({
			where: { id },
		});

		res.status(200).json({ message: 'Paciente apagado com sucesso.' });
	} catch (error) {
		res.status(500).json({ message: 'Erro ao apagar paciente.' });
	}
};
