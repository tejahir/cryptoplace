import express from 'express';
import bcrypt from 'bcrypt';
import { createUser, findUserByEmail } from '../utils/usersStore.js';
import { createAuthToken, sanitizeUser } from '../utils/auth.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateSignupPayload = ({ name, email, password }) => {
  if (!name?.trim()) {
    return 'Full name is required.';
  }

  if (name.trim().length < 2) {
    return 'Full name must be at least 2 characters.';
  }

  if (!email?.trim() || !emailPattern.test(email.trim().toLowerCase())) {
    return 'A valid email address is required.';
  }

  if (!password || password.length < 8) {
    return 'Password must be at least 8 characters.';
  }

  return '';
};

router.post('/signup', async (req, res, next) => {
  try {
    const { name = '', email = '', password = '' } = req.body;
    const validationError = validateSignupPayload({ name, email, password });

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await createUser({ name, email, passwordHash });
    const token = createAuthToken(user);

    return res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email = '', password = '' } = req.body;

    if (!email.trim() || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = createAuthToken(user);

    return res.status(200).json({
      message: 'Logged in successfully.',
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/me', requireAuth, (req, res) =>
  res.status(200).json({
    user: req.user,
  }),
);

router.post('/logout', requireAuth, (_req, res) =>
  res.status(200).json({
    message: 'Logged out successfully.',
  }),
);

export default router;
