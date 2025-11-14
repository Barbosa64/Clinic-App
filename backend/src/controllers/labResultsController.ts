import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const uploadLabResult = async (req: Request, res: Response) => {
	const { patientId, type } = req.body;
	const file = req.file;

	if (!file || !type || !patientId) {
		return res.status(400).json({ message: 'Por favor, selecione um arquivo e um tipo de exame.' });
	}

	// apagar
	const simulatedFileUrl = `/uploads/lab-results/${patientId}/${Date.now()}-${file.originalname}`;
	console.log(`Simulando upload do ficheiro: ${file.originalname}`);
	console.log(`URL simulado: ${simulatedFileUrl}`);

	try {
		const labResult = await prisma.labResult.create({
			data: {
				patientId,
				type,
				fileName: file.originalname,
				fileUrl: simulatedFileUrl,
			},
		});
		res.status(201).json(labResult);
	} catch (error) {
		res.status(500).json({ message: 'Erro ao guardar o resultado do exame.' });
	}
};

// @desc    Listar os resultados de um paciente
// @route   GET /api/lab-results?patientId=<id>
// @access  Privado

export const getLabResults = async (req: Request, res: Response) => {
	const { patientId } = req.query;
	const currentUser = req.user;

	if (!patientId || typeof patientId !== 'string') {
		return res.status(400).json({ message: 'ID do paciente obrigatório.' });
	}

	if (currentUser?.role === 'PATIENT' && currentUser.userId !== patientId) {
		return res.status(403).json({ message: 'Acesso negado. Pacientes só podem ver os seus próprios resultados.' });
	}

	try {
		const results = await prisma.labResult.findMany({
			where: {
				patientId,
			},
			orderBy: {
				uploadAt: 'desc',
			},
		});

		res.status(200).json(results);
	} catch (error) {
		console.error('Erro ao obter os resultados de laboratório:', error);
		res.status(500).json({ message: 'Erro interno do servidor.' });
	}
};
