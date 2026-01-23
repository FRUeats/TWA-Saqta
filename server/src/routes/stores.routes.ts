import { Router } from 'express';
import { getAllStores, getStoreById, createOrUpdateStore, getVendorStore } from '../controllers/stores.controller.js';

const router = Router();

router.get('/', getAllStores);
router.get('/vendor/:merchantId', getVendorStore);
router.get('/:id', getStoreById);
router.post('/', createOrUpdateStore);

export default router;
