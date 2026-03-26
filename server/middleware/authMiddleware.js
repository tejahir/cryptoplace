import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { findUserById } from '../utils/usersStore.js';
import { sanitizeUser } from '../utils/auth.js';

export const requireAuth = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization || '';
    const [scheme, token] = authorizationHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const payload = jwt.verify(token, config.jwtSecret);
    const user = await findUserById(payload.sub);

    if (!user) {
      return res.status(401).json({ message: 'Invalid authentication token.' });
    }

    req.user = sanitizeUser(user);
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired authentication token.' });
  }
};
