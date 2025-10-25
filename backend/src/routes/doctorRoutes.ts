import { Router } from 'express';
import { getAllDoctors, createDoctor } from '../controllers/doctorController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router
	.route('/')

	.get(protect, getAllDoctors) // GET /api/doctors
	.post(protect, createDoctor); // 2. Adicionar a rota POST

export default router;
