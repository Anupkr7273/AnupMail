import express from 'express';
import { check } from 'express-validator';
import { auth } from '../middleware/auth.js';
import {
  sendEmail, getInbox, getSent, getTrash, getEmailById,
  markRead, moveToTrash, deletePermanently
} from '../controllers/emailController.js';

const router = express.Router();

router.post('/send', [auth, check('to', 'Please enter valid email').isEmail()], sendEmail);
router.get('/inbox', auth, getInbox);
router.get('/sent', auth, getSent);
router.get('/trash', auth, getTrash);
router.get('/:id', auth, getEmailById);
router.put('/read/:id', auth, markRead);
router.put('/trash/:id', auth, moveToTrash);
router.delete('/delete/:id', auth, deletePermanently);

export default router;
