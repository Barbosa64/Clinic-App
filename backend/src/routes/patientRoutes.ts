import { Router } from 'express';
import { getAllPatients } from '../controllers/patientController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

// A rota GET será acessível por ADMIN e DOCTORS

router.route('/').get(protect, authorize('ADMIN', 'DOCTOR'), getAllPatients);

export default router;
