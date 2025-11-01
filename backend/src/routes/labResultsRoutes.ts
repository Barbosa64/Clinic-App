import { Router } from 'express';
import { authorize, protect } from '../middleware/authMiddleware';
import { uploadLabResult, getLabResults } from '../controllers/labResultsController';
import upload from '../middleware/uploadMiddleware';

const router = Router();

router
	.route('/')

	.post(protect, authorize('ADMIN', 'DOCTOR'), upload.single('file'), uploadLabResult)

	.get(protect, getLabResults);

export default router;
