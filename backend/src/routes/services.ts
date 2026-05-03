import { Router } from 'express';
import * as serviceController from '../controllers/serviceController';

const router = Router();

router.get('/',        serviceController.getAll);
router.get('/:id',     serviceController.getById);
router.post('/',       serviceController.create);
router.put('/:id',     serviceController.update);
router.delete('/:id',  serviceController.remove);

export default router;