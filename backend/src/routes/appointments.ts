import { Router } from 'express';
import * as appointmentController from '../controllers/appointmentController';

const router = Router();

router.get('/',           appointmentController.getAll);
router.get('/stats',      appointmentController.getStats);
router.post('/',          appointmentController.create);
router.patch('/:id/status', appointmentController.updateStatus);

export default router;