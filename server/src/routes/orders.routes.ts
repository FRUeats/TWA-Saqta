import { Router } from 'express';
import {
    createOrder,
    getUserOrders,
    getOrderById,
    completeOrder,
    validateQRCode,
} from '../controllers/orders.controller.js';

const router = Router();

router.post('/', createOrder);
router.get('/user/:userId', getUserOrders);
router.get('/qr/:qrCode', validateQRCode);
router.get('/:id', getOrderById);
router.put('/:id/complete', completeOrder);

export default router;
