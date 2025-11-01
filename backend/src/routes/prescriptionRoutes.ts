import { Router } from 'express';
import { createPrescription, getPrescriptions } from '../controllers/prescriptionController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.route('/').post(authorize('ADMIN', 'DOCTOR'), createPrescription).get(getPrescriptions);

export default router;
