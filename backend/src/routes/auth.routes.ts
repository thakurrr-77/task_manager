import { Router } from 'express';
import { register, login, refresh, logout } from '../controllers/auth.controller';
import { registerValidation, loginValidation } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/refresh', refresh);
router.post('/logout', authenticate, logout);

export default router;
