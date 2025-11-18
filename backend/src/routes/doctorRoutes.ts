import { Router } from 'express';
import { getAllDoctors, createDoctor, getDoctorById, updateDoctor, deleteDoctor, getDoctorAvailability } from '../controllers/doctorController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

router
	.route('/')

	.get(protect, getAllDoctors) // GET /api/doctors
	.post(protect, authorize('ADMIN'), createDoctor); // só admin pode criar

router.route('/:id/availability').get(protect, getDoctorAvailability);
router
	.route('/:id')

	.get(protect, authorize('ADMIN', 'DOCTOR'), getDoctorById)
	.put(protect, authorize('ADMIN'), updateDoctor)
	.delete(protect, authorize('ADMIN'), deleteDoctor);

export default router;
