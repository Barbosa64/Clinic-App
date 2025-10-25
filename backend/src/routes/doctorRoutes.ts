import { Router } from 'express';
import { getAllDoctors, createDoctor, getDoctorById } from '../controllers/doctorController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

router
	.route('/')

	.get(protect, getAllDoctors) // GET /api/doctors
	.post(protect, authorize('ADMIN'), createDoctor); // só admin pode criar

router.route('/:id').get(protect, getDoctorById);

export default router;
