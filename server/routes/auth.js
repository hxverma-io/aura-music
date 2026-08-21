import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';

export const authRouter = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'aura_super_secure_jwt_secret_2026_key';

// Middleware to authenticate token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, userPayload) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = userPayload;
    next();
  });
};

// Optional auth middleware
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, userPayload) => {
      if (!err) req.user = userPayload;
      next();
    });
  } else {
    next();
  }
};

const sanitizeUser = (user) => {
  const { password_hash, ...safeUser } = user;
  return safeUser;
};

// Generate clean initials avatar URL
function generateInitialsAvatar(name) {
  const cleanName = encodeURIComponent(name.trim());
  return `https://ui-avatars.com/api/?name=${cleanName}&background=ef233c&color=ffffff&bold=true&size=256`;
}

// Sign Up
authRouter.post('/signup', async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ error: 'All fields (name, username, email, password) are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanUsername = username.toLowerCase().trim().replace(/[@\s]+/g, '');
    const cleanName = name.trim();

    // Check existing
    const existing = db.users.find(u => u.email === cleanEmail || u.username === cleanUsername);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email or username already exists.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync(password, salt);

    const newUser = {
      id: 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      name: cleanName,
      username: cleanUsername,
      email: cleanEmail,
      password_hash,
      avatar: generateInitialsAvatar(cleanName),
      bio: `Music enthusiast and curator on Aura Platform.`,
      favorite_genres: ['Bollywood', 'Punjabi', 'Pop', 'Lo-Fi'],
      settings: {
        audioQuality: 'lossless',
        normalizeVolume: true,
        crossfadeSeconds: 3,
        theme: 'dark',
        socialSharingEnabled: true,
        notificationsEnabled: true
      },
      created_at: new Date().toISOString()
    };

    db.users.insert(newUser);

    const token = jwt.sign({ id: newUser.id, username: newUser.username, email: newUser.email }, JWT_SECRET, {
      expiresIn: '30d'
    });

    return res.status(201).json({
      token,
      user: sanitizeUser(newUser)
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Internal server error during registration.' });
  }
});

// Sign In / Login
authRouter.post('/signin', async (req, res) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({ error: 'Please provide your email/username and password.' });
    }

    const clean = login.toLowerCase().trim().replace('@', '');
    const user = db.users.find(u => u.email === clean || u.username === clean);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials. User does not exist.' });
    }

    const isValid = bcrypt.compareSync(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid password. Please try again.' });
    }

    const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, JWT_SECRET, {
      expiresIn: '30d'
    });

    return res.json({
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error('Signin error:', error);
    return res.status(500).json({ error: 'Internal server error during sign in.' });
  }
});

// Continue with Google Authentication
authRouter.post('/google', async (req, res) => {
  try {
    const { email, name, avatar, googleId } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'Google authentication payload missing required fields.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = db.users.find(u => u.email === cleanEmail);

    if (!user) {
      // Create new Google-authenticated user
      const cleanUsername = cleanEmail.split('@')[0] + Math.floor(Math.random() * 100);
      user = {
        id: 'user-g-' + (googleId || Date.now()),
        name: name.trim(),
        username: cleanUsername,
        email: cleanEmail,
        password_hash: bcrypt.hashSync(Math.random().toString(36), 10),
        avatar: avatar || generateInitialsAvatar(name),
        bio: 'Connected via Google Account.',
        favorite_genres: ['Bollywood', 'Pop', 'Punjabi', 'Lo-Fi'],
        settings: {
          audioQuality: 'lossless',
          normalizeVolume: true,
          crossfadeSeconds: 3,
          theme: 'dark',
          socialSharingEnabled: true,
          notificationsEnabled: true
        },
        created_at: new Date().toISOString()
      };
      db.users.insert(user);
    }

    const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, JWT_SECRET, {
      expiresIn: '30d'
    });

    return res.json({
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error('Google auth error:', error);
    return res.status(500).json({ error: 'Internal server error during Google sign in.' });
  }
});

// Get Current Profile (Me)
authRouter.get('/me', authenticateToken, (req, res) => {
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User profile not found in database.' });
  }
  return res.json({ user: sanitizeUser(user) });
});

// Update Profile
authRouter.put('/profile', authenticateToken, (req, res) => {
  try {
    const { name, username, bio, avatar, favorite_genres, settings } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (username !== undefined) updates.username = username.toLowerCase().trim().replace(/[@\s]+/g, '');
    if (bio !== undefined) updates.bio = bio;
    if (avatar !== undefined) updates.avatar = avatar;
    if (favorite_genres !== undefined) updates.favorite_genres = favorite_genres;
    if (settings !== undefined) updates.settings = settings;

    const updated = db.users.update(req.user.id, updates);
    if (!updated) {
      return res.status(404).json({ error: 'User not found to update.' });
    }

    return res.json({ user: sanitizeUser(updated) });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ error: 'Failed to update user profile.' });
  }
});
