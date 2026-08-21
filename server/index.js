import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth.js';
import { musicRouter } from './routes/music.js';
import { userRouter } from './routes/user.js';
import { aiRouter } from './routes/ai.js';
import { socialRouter } from './routes/social.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Mount API Routers
app.use('/api/auth', authRouter);
app.use('/api/music', musicRouter);
app.use('/api/user', userRouter);
app.use('/api/ai', aiRouter);
app.use('/api/social', socialRouter);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🎵 Aura Music Backend running at http://localhost:${PORT}`);
});
