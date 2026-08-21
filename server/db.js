import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed data
const DEFAULT_DB = {
  users: [
    {
      id: 'user-creator',
      name: 'Himanshu Verma',
      username: 'hxverma.io',
      email: 'hxverma.io@gmail.com',
      password_hash: '$2a$10$w1qC7p5W4BqjXFmOQYyV6.zVbF3bHl2b6q0Yl5Zl3z7sV1o7J5w5q', // password: password123
      avatar: 'https://github.com/hxverma-io.png',
      bio: 'Creator & Lead Architect of Aura Music. Open source developer building next-gen high-fidelity audio systems.',
      favorite_genres: ['Rock', 'Synthwave', 'Indie', 'Punjabi', 'Bollywood'],
      settings: {
        audioQuality: 'lossless',
        normalizeVolume: true,
        crossfadeSeconds: 3,
        theme: 'dark',
        socialSharingEnabled: true,
        notificationsEnabled: true
      },
      created_at: new Date().toISOString()
    },
    {
      id: 'user-alex',
      name: 'Alex Morgan',
      username: 'alexmorgan',
      email: 'alex@soundstream.io',
      password_hash: '$2a$10$w1qC7p5W4BqjXFmOQYyV6.zVbF3bHl2b6q0Yl5Zl3z7sV1o7J5w5q', // password: password123
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
      bio: 'Software engineer & music producer. Addicted to Synthwave, Lo-Fi beats, and ambient soundtracks.',
      favorite_genres: ['Synthwave', 'Lo-Fi', 'Electronic', 'Rock'],
      settings: {
        audioQuality: 'lossless',
        normalizeVolume: true,
        crossfadeSeconds: 3,
        theme: 'dark',
        socialSharingEnabled: true,
        notificationsEnabled: true
      },
      created_at: new Date().toISOString()
    }
  ],
  likes: [
    {
      id: 'like-1',
      user_id: 'user-creator',
      track_id: 'yt-jfKfPfyJRdk',
      track_data: {
        id: 'yt-jfKfPfyJRdk',
        title: 'Lofi Hip Hop Radio - Beats to Relax/Study to',
        artist: 'Lofi Girl',
        artistId: 'art-lofigirl',
        album: 'ChilledCow Sessions',
        albumArt: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80',
        audioUrl: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
        youtubeVideoId: 'jfKfPfyJRdk',
        duration: 240,
        genre: 'Lo-Fi',
        mood: 'Focus',
        year: 2024,
        playCount: 142000000,
        likesCount: 8900000
      },
      created_at: new Date().toISOString()
    },
    {
      id: 'like-2',
      user_id: 'user-creator',
      track_id: 'yt-4xDzrJKXOOY',
      track_data: {
        id: 'yt-4xDzrJKXOOY',
        title: 'Synthwave Radio - Chill Synth / Retro Beats',
        artist: 'Lofi Girl Synthwave',
        artistId: 'art-synth',
        album: 'Cyber Sunset',
        albumArt: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        audioUrl: 'https://www.youtube.com/watch?v=4xDzrJKXOOY',
        youtubeVideoId: '4xDzrJKXOOY',
        duration: 218,
        genre: 'Synthwave',
        mood: 'Energy',
        year: 2024,
        playCount: 45000000,
        likesCount: 3200000
      },
      created_at: new Date().toISOString()
    }
  ],
  playlists: [
    {
      id: 'pl-creator-official',
      user_id: 'user-creator',
      title: '⚡ HV Official: Cyberpunk & Deep Focus',
      description: 'The master curated playlist by HV (Platform Creator) with driving synth basslines and atmospheric focus beats.',
      cover_art: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
      track_ids: ['yt-4xDzrJKXOOY', 'yt-jfKfPfyJRdk', 'yt-5qap5aO4i9A'],
      is_public: true,
      is_collaborative: true,
      collaborator_ids: ['user-alex'],
      reactions: [
        { emoji: '🔥', count: 48 },
        { emoji: '❤️', count: 35 },
        { emoji: '⚡', count: 29 }
      ],
      is_pinned: true,
      is_ai_generated: false,
      created_at: '2024-03-01'
    }
  ],
  listening_history: [
    {
      id: 'hist-1',
      user_id: 'user-creator',
      track_id: 'yt-4xDzrJKXOOY',
      track_data: {
        id: 'yt-4xDzrJKXOOY',
        title: 'Synthwave Radio - Chill Synth / Retro Beats',
        artist: 'Lofi Girl Synthwave',
        genre: 'Synthwave',
        albumArt: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
      },
      duration_seconds: 218,
      played_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'hist-2',
      user_id: 'user-creator',
      track_id: 'yt-jfKfPfyJRdk',
      track_data: {
        id: 'yt-jfKfPfyJRdk',
        title: 'Lofi Hip Hop Radio - Beats to Relax/Study to',
        artist: 'Lofi Girl',
        genre: 'Lo-Fi',
        albumArt: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80'
      },
      duration_seconds: 240,
      played_at: new Date(Date.now() - 7200000).toISOString()
    }
  ],
  follows: [
    {
      id: 'f-1',
      follower_user_id: 'user-alex',
      following_user_id: 'user-creator',
      following_artist_id: null,
      created_at: new Date().toISOString()
    }
  ]
};

class Database {
  constructor() {
    this.data = this.read();
  }

  read() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('Error reading database file, using default seed:', err);
    }
    this.write(DEFAULT_DB);
    return DEFAULT_DB;
  }

  write(data) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing to database file:', err);
    }
  }

  get users() {
    return {
      find: (predicate) => this.data.users.find(predicate),
      filter: (predicate) => this.data.users.filter(predicate),
      all: () => this.data.users,
      insert: (user) => {
        this.data.users.push(user);
        this.write(this.data);
        return user;
      },
      update: (id, updates) => {
        const idx = this.data.users.findIndex(u => u.id === id);
        if (idx !== -1) {
          this.data.users[idx] = { ...this.data.users[idx], ...updates };
          this.write(this.data);
          return this.data.users[idx];
        }
        return null;
      }
    };
  }

  get likes() {
    return {
      findByUser: (userId) => this.data.likes.filter(l => l.user_id === userId),
      isLiked: (userId, trackId) => this.data.likes.some(l => l.user_id === userId && l.track_id === trackId),
      toggle: (userId, trackId, trackData) => {
        const idx = this.data.likes.findIndex(l => l.user_id === userId && l.track_id === trackId);
        if (idx !== -1) {
          this.data.likes.splice(idx, 1);
          this.write(this.data);
          return { liked: false };
        } else {
          const newLike = {
            id: 'like-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
            user_id: userId,
            track_id: trackId,
            track_data: trackData,
            created_at: new Date().toISOString()
          };
          this.data.likes.push(newLike);
          this.write(this.data);
          return { liked: true, like: newLike };
        }
      }
    };
  }

  get playlists() {
    return {
      all: () => this.data.playlists,
      findByUser: (userId) => this.data.playlists.filter(p => p.user_id === userId || p.collaborator_ids?.includes(userId)),
      findById: (id) => this.data.playlists.find(p => p.id === id),
      insert: (playlist) => {
        this.data.playlists.unshift(playlist);
        this.write(this.data);
        return playlist;
      },
      update: (id, updates) => {
        const idx = this.data.playlists.findIndex(p => p.id === id);
        if (idx !== -1) {
          this.data.playlists[idx] = { ...this.data.playlists[idx], ...updates };
          this.write(this.data);
          return this.data.playlists[idx];
        }
        return null;
      },
      delete: (id) => {
        this.data.playlists = this.data.playlists.filter(p => p.id !== id);
        this.write(this.data);
        return true;
      }
    };
  }

  get history() {
    return {
      findByUser: (userId) => this.data.listening_history.filter(h => h.user_id === userId).sort((a, b) => new Date(b.played_at).getTime() - new Date(a.played_at).getTime()),
      record: (userId, trackId, trackData, durationSeconds = 180) => {
        const entry = {
          id: 'hist-' + Date.now(),
          user_id: userId,
          track_id: trackId,
          track_data: trackData,
          duration_seconds: durationSeconds,
          played_at: new Date().toISOString()
        };
        this.data.listening_history.unshift(entry);
        this.write(this.data);
        return entry;
      }
    };
  }

  get follows() {
    return {
      findByUser: (userId) => this.data.follows.filter(f => f.follower_user_id === userId),
      toggleFollowUser: (followerId, targetUserId) => {
        const idx = this.data.follows.findIndex(f => f.follower_user_id === followerId && f.following_user_id === targetUserId);
        if (idx !== -1) {
          this.data.follows.splice(idx, 1);
          this.write(this.data);
          return { following: false };
        } else {
          this.data.follows.push({
            id: 'f-' + Date.now(),
            follower_user_id: followerId,
            following_user_id: targetUserId,
            following_artist_id: null,
            created_at: new Date().toISOString()
          });
          this.write(this.data);
          return { following: true };
        }
      },
      toggleFollowArtist: (followerId, artistId) => {
        const idx = this.data.follows.findIndex(f => f.follower_user_id === followerId && f.following_artist_id === artistId);
        if (idx !== -1) {
          this.data.follows.splice(idx, 1);
          this.write(this.data);
          return { following: false };
        } else {
          this.data.follows.push({
            id: 'fa-' + Date.now(),
            follower_user_id: followerId,
            following_user_id: null,
            following_artist_id: artistId,
            created_at: new Date().toISOString()
          });
          this.write(this.data);
          return { following: true };
        }
      }
    };
  }
}

export const db = new Database();
