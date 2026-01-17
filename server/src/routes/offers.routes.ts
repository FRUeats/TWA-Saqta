import { Router } from 'express';
import {
    getAllOffers,
    getOfferById,
    createOffer,
    updateOffer,
    deleteOffer,
} from '../controllers/offers.controller.js';

const router = Router();

router.get('/', getAllOffers);
router.get('/:id', getOfferById);
router.post('/', createOffer);
router.put('/:id', updateOffer);
router.delete('/:id', deleteOffer);

export default router;
