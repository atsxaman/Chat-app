import express from 'express';
import {signup,login, userDetail} from '../controllers/auth.controllers.js';

const router = express.Router();

router.post('/signup',signup);
router.post('/login',login)
router.get('/otheruser/:userId',userDetail)

export default router