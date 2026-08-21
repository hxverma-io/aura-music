import express from 'express';
import { db } from '../db.js';
import { authenticateToken, optionalAuth } from './auth.js';

export const userRouter = express.Router();

// Get user library state from DB
userRouter.get('/library', optionalAuth, (req, res) => {
  try {
    const userId = req.user?.id || 'user-creator';
    const likes = db.likes.findByUser(userId);
    const playlists = db.playlists.findByUser(userId);
    const history = db.history.findByUser(userId);
    const follows = db.follows.findByUser(userId);

    return res.json({
      likes: likes.map(l => l.track_data || { id: l.track_id }),
      likedTrackIds: likes.map(l => l.track_id),
      playlists: playlists,
      history: history,
      followedUserIds: follows.filter(f => f.following_user_id).map(f => f.following_user_id),
      followedArtistIds: follows.filter(f => f.following_artist_id).map(f => f.following_artist_id)
    });
  } catch (error) {
    console.error('Error fetching library:', error);
    return res.status(500).json({ error: 'Failed to fetch user library from database.' });
  }
});

// Toggle Like Song (Persists complete trackData so liked songs always render with artwork & sound)
userRouter.post('/likes/toggle', authenticateToken, (req, res) => {
  try {
    const { trackId, trackData } = req.body;
    if (!trackId) {
      return res.status(400).json({ error: 'trackId is required.' });
    }

    const result = db.likes.toggle(req.user.id, trackId, trackData);
    return res.json(result);
  } catch (error) {
    console.error('Toggle like error:', error);
    return res.status(500).json({ error: 'Failed to toggle like.' });
  }
});

// Record Listening History & Duration
userRouter.post('/history/record', authenticateToken, (req, res) => {
  try {
    const { trackId, trackData, durationSeconds } = req.body;
    if (!trackId) {
      return res.status(400).json({ error: 'trackId is required.' });
    }

    const entry = db.history.record(req.user.id, trackId, trackData, durationSeconds || 180);
    return res.json({ success: true, entry });
  } catch (error) {
    console.error('Record history error:', error);
    return res.status(500).json({ error: 'Failed to record history.' });
  }
});

// Get User Analytics computed dynamically from DB
userRouter.get('/analytics', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const history = db.history.findByUser(userId);
    const likes = db.likes.findByUser(userId);

    // Total listening seconds
    const totalSeconds = history.reduce((sum, h) => sum + (h.duration_seconds || 180), 0);
    const totalMinutes = Math.round(totalSeconds / 60);
    const totalHours = (totalMinutes / 60).toFixed(1);

    // Calculate top played tracks
    const playCounts = {};
    history.forEach(h => {
      const id = h.track_id;
      if (!playCounts[id]) {
        playCounts[id] = { count: 0, track: h.track_data || { id, title: 'Music Track', artist: 'Artist' } };
      }
      playCounts[id].count++;
    });

    const topTracks = Object.values(playCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(item => ({ ...item.track, playCount: item.count }));

    // Genre stats
    const genreCounts = {};
    history.forEach(h => {
      const g = h.track_data?.genre || 'Bollywood';
      genreCounts[g] = (genreCounts[g] || 0) + 1;
    });

    const totalGenres = Object.values(genreCounts).reduce((a, b) => a + b, 0) || 1;
    const genreDistribution = Object.keys(genreCounts).map(genre => ({
      genre,
      percent: Math.round((genreCounts[genre] / totalGenres) * 100)
    })).sort((a, b) => b.percent - a.percent);

    // Calculate active streak
    const uniqueDays = new Set(history.map(h => h.played_at.split('T')[0]));
    const streakDays = uniqueDays.size || 1;

    return res.json({
      totalMinutes,
      totalHours,
      totalPlays: history.length,
      likedCount: likes.length,
      streakDays,
      topTracks,
      genreDistribution: genreDistribution.length > 0 ? genreDistribution : [{ genre: 'Bollywood', percent: 45 }, { genre: 'Punjabi', percent: 30 }, { genre: 'Synthwave', percent: 25 }]
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return res.status(500).json({ error: 'Failed to compute analytics.' });
  }
});

// Playlists CRUD (Stores full tracks list so playlists never render blank)
userRouter.post('/playlists', optionalAuth, (req, res) => {
  try {
    const { title, description, coverArt, cover_art, trackIds, track_ids, tracks, isPublic, is_public, isCollaborative, is_collaborative } = req.body;
    const userId = req.user?.id || 'user-creator';
    const user = db.users.find(u => u.id === userId);

    const actualTracks = tracks || [];
    const actualTrackIds = trackIds || track_ids || actualTracks.map(t => t.id) || [];

    const newPlaylist = {
      id: 'pl-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      user_id: userId,
      creatorId: userId,
      creatorName: user?.name || 'Himanshu Verma',
      title: title || 'My Custom Playlist',
      description: description || `Curated by ${user?.name || 'Himanshu Verma'}`,
      coverArt: coverArt || cover_art || (actualTracks[0]?.albumArt) || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
      trackIds: actualTrackIds,
      tracks: actualTracks,
      isPublic: isPublic ?? is_public ?? true,
      isCollaborative: isCollaborative ?? is_collaborative ?? false,
      collaborator_ids: [],
      reactions: [
        { emoji: '🔥', count: 1 },
        { emoji: '❤️', count: 1 }
      ],
      isPinned: false,
      isAiGenerated: false,
      created_at: new Date().toISOString()
    };

    db.playlists.insert(newPlaylist);
    return res.status(201).json({ playlist: newPlaylist });
  } catch (error) {
    console.error('Create playlist error:', error);
    return res.status(500).json({ error: 'Failed to create playlist in database.' });
  }
});

userRouter.put('/playlists/:id', optionalAuth, (req, res) => {
  try {
    const updated = db.playlists.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Playlist not found.' });
    }
    return res.json({ playlist: updated });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update playlist.' });
  }
});

userRouter.delete('/playlists/:id', optionalAuth, (req, res) => {
  try {
    db.playlists.delete(req.params.id);
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete playlist.' });
  }
});

// Follow / Unfollow user
userRouter.post('/follow/user', authenticateToken, (req, res) => {
  try {
    const { targetUserId } = req.body;
    const result = db.follows.toggleFollowUser(req.user.id, targetUserId);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to follow user.' });
  }
});

// Follow / Unfollow artist
userRouter.post('/follow/artist', authenticateToken, (req, res) => {
  try {
    const { artistId } = req.body;
    const result = db.follows.toggleFollowArtist(req.user.id, artistId);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to follow artist.' });
  }
});
