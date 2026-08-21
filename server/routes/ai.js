import express from 'express';
import { db } from '../db.js';
import { optionalAuth } from './auth.js';
import { searchMusicCatalog } from './music.js';

export const aiRouter = express.Router();

// AI Lyrics-to-Song Finder & Music Recommendation
aiRouter.post('/recommend', optionalAuth, async (req, res) => {
  try {
    const { prompt } = req.body;
    const userId = req.user?.id;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    const cleanPrompt = prompt.trim();
    const lower = cleanPrompt.toLowerCase();

    // Heuristics for famous lyrics queries
    let searchQuery = cleanPrompt;
    if (lower.includes('marry on a cross') || lower.includes('mary on a cross') || lower.includes('bloody mary')) {
      searchQuery = 'mary on a cross ghost';
    } else if (lower.includes('i wanna be your') || lower.includes('vacuum cleaner') || lower.includes('ford cortina')) {
      searchQuery = 'i wanna be yours arctic monkeys';
    } else if (lower.includes('die with a smile') || lower.includes('if the world was ending')) {
      searchQuery = 'die with a smile lady gaga bruno mars';
    } else if (lower.includes('pal pal') || lower.includes('jina muhal') || lower.includes('jeena mahal')) {
      searchQuery = 'pal pal talwinder';
    } else if (lower.includes('chan tak raah') || lower.includes('kehndi hundi si') || lower.includes('taare ne pasand')) {
      searchQuery = 'excuses ap dhillon';
    } else if (lower.includes('kesariya tera') || lower.includes('rabba ne tujhko banane')) {
      searchQuery = 'kesariya arijit singh';
    } else if (lower.includes('motherfuckin starboy') || lower.includes('cleaner than your church shoes')) {
      searchQuery = 'starboy the weeknd';
    }

    const tracks = await searchMusicCatalog(searchQuery, 8);

    let explanation = `I analyzed the lyrics / prompt "${cleanPrompt}" and found ${tracks.length} matching full-length tracks.`;
    if (tracks.length > 0) {
      explanation = `🎵 Found the exact match: **${tracks[0].title}** by **${tracks[0].artist}**! You can play it right now with full 320kbps audio or add it to your playlist.`;
    }

    return res.json({
      prompt: cleanPrompt,
      tracks,
      explanation
    });
  } catch (error) {
    console.error('AI recommend error:', error);
    return res.status(500).json({ error: 'Failed to find music by lyrics.' });
  }
});

// AI Playlist Compiler (Saves full track objects with direct audioUrl to database)
aiRouter.post('/generate-playlist', optionalAuth, async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    const tracks = await searchMusicCatalog(prompt, 12);
    const cleanTitle = prompt.length > 35 ? prompt.substring(0, 32) + '...' : prompt;

    const newPlaylist = {
      id: 'pl-ai-' + Date.now(),
      user_id: req.user?.id || 'guest',
      creatorName: 'Aura AI Assistant',
      title: `✨ AI: ${cleanTitle}`,
      description: `AI-synthesized playlist for: "${prompt}". Compiled with ${tracks.length} streaming tracks in full 320kbps.`,
      coverArt: tracks[0]?.albumArt || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
      trackIds: tracks.map(t => t.id),
      tracks: tracks,
      isPublic: true,
      isCollaborative: false,
      reactions: [
        { emoji: '✨', count: 1 },
        { emoji: '🔥', count: 1 }
      ],
      isPinned: false,
      isAiGenerated: true,
      ai_prompt: prompt,
      created_at: new Date().toISOString()
    };

    if (req.user?.id) {
      db.playlists.insert(newPlaylist);
    }

    return res.status(201).json({
      playlist: newPlaylist,
      tracks
    });
  } catch (error) {
    console.error('AI playlist error:', error);
    return res.status(500).json({ error: 'Failed to generate AI playlist.' });
  }
});
