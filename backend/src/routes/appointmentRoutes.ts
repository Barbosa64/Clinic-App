import { Router } from 'express';
import { createAppointment, getAppointments, cancelAppointment } from '../controllers/appointmentController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.route('/').post(authorize('ADMIN', 'PATIENT'), createAppointment).get(getAppointments);

router.route('/:id').delete(authorize('ADMIN', 'DOCTOR'), cancelAppointment);

export default router;
