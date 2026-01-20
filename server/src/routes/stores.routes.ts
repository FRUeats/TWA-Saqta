import { Router } from 'express';
import { getAllStores, getStoreById, createOrUpdateStore } from '../controllers/stores.controller.js';

const router = Router();

router.get('/', getAllStores);
router.get('/:id', getStoreById);
router.post('/', createOrUpdateStore);

export default router;
