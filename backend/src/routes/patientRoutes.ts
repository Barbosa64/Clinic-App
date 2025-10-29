import { Router } from 'express';
import { getAllPatients, getPatientById, updatePatient, deletePatient } from '../controllers/patientController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

// A rota GET será acessível por ADMIN e DOCTORS

router.route('/').get(protect, authorize('ADMIN', 'DOCTOR'), getAllPatients);

router.route('/:id').get(protect, authorize('ADMIN', 'DOCTOR'), getPatientById).put(protect, authorize('ADMIN'), updatePatient).delete(protect, authorize('ADMIN'), deletePatient);

export default router;
