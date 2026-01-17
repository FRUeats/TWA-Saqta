import express from 'express';
import { login, vendorRegister, getMe, switchRole } from '../controllers/auth.controller.js';

const router = express.Router();

// POST /api/auth/login - Login/Register as buyer
router.post('/login', login);

// POST /api/auth/vendor/register - Register as vendor
router.post('/vendor/register', vendorRegister);

// GET /api/auth/me - Get current user
router.get('/me', getMe);

// PUT /api/auth/role - Switch role (dev only)
router.put('/role', switchRole);

export default router;
