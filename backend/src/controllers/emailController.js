// src/controllers/emailController.js
import { validationResult } from 'express-validator';
import Email from '../models/Email.js';
import User from '../models/User.js';

export const sendEmail = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { to, subject, body } = req.body;
  const from = req.user.email;

  try {
    const recipient = await User.findOne({ email: to });
    if (!recipient) {
      return res.status(400).json({ message: "Recipient not found" });
    }

    // Save sender copy
    const sentCopy = new Email({
      from,
      to,
      subject,
      body,
      folder: "sent",
      read: true,
      isTrashed: false,
    });
    await sentCopy.save();

    // Save recipient copy
    const inboxCopy = new Email({
      from,
      to,
      subject,
      body,
      folder: "inbox",
      read: false,
      isTrashed: false,
    });
    await inboxCopy.save();

    // ✅ return the inbox copy as response
    res.status(201).json({
      message: "Email sent successfully",
      mail: inboxCopy,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const getInbox = async (req, res) => {
  try {
    const emails = await Email.find({ to: req.user.email, folder: 'inbox' }).sort({ createdAt: -1 });
    res.json(emails);
  } catch (err) {
    console.error(err); res.status(500).send('Server error');
  }
};

export const getSent = async (req, res) => {
  try {
    const emails = await Email.find({ from: req.user.email, folder: 'sent' }).sort({ createdAt: -1 });
    res.json(emails);
  } catch (err) {
    console.error(err); res.status(500).send('Server error');
  }
};

export const getTrash = async (req, res) => {
  try {
    const u = req.user.email;
    const emails = await Email.find({ folder: 'trash', $or: [{ to: u }, { from: u }] }).sort({ createdAt: -1 });
    res.json(emails);
  } catch (err) {
    console.error(err); res.status(500).send('Server error');
  }
};

export const getEmailById = async (req, res) => {
  try {
    const email = await Email.findById(req.params.id);
    if (!email) return res.status(404).json({ message: 'Email not found' });
    const u = req.user.email;
    if (email.to !== u && email.from !== u) return res.status(403).json({ message: 'Not authorized' });
    res.json(email);
  } catch (err) {
    console.error(err); res.status(500).send('Server error');
  }
};

export const markRead = async (req, res) => {
  try {
    const email = await Email.findById(req.params.id);
    if (!email) return res.status(404).json({ message: 'Email not found' });
    const u = req.user.email;
    if (email.to !== u && email.from !== u) return res.status(403).json({ message: 'Not authorized' });
    email.read = !!req.body.read;
    await email.save();
    res.json(email);
  } catch (err) {
    console.error(err); res.status(500).send('Server error');
  }
};

export const moveToTrash = async (req, res) => {
  try {
    const email = await Email.findById(req.params.id);
    if (!email) return res.status(404).json({ message: 'Email not found' });
    const u = req.user.email;
    if (email.to !== u && email.from !== u) return res.status(403).json({ message: 'Not authorized' });
    email.folder = 'trash';
    await email.save();
    res.json({ message: 'Moved to trash' });
  } catch (err) {
    console.error(err); res.status(500).send('Server error');
  }
};

export const deletePermanently = async (req, res) => {
  try {
    const email = await Email.findById(req.params.id);
    if (!email) return res.status(404).json({ message: 'Email not found' });
    const u = req.user.email;
    if (email.to !== u && email.from !== u) return res.status(403).json({ message: 'Not authorized' });
    if (email.folder !== 'trash') return res.status(400).json({ message: 'Email must be in trash' });
    await Email.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted permanently' });
  } catch (err) {
    console.error(err); res.status(500).send('Server error');
  }
};
