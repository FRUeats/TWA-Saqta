import { Router } from 'express';
import { getAllStores, getStoreById } from '../controllers/stores.controller.js';

const router = Router();

router.get('/', getAllStores);
router.get('/:id', getStoreById);

export default router;
