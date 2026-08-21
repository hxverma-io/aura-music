import { Track, Artist, Playlist, User, ChatMessage, Mood, Genre } from '../types';

export class AiMusicService {
  // Generate personalized recommendations based on user history and likes
  public getPersonalizedRecommendations(
    user: User | null,
    allTracks: Track[],
    limit: number = 8
  ): { track: Track; reason: string }[] {
    if (!allTracks || allTracks.length === 0) return [];

    const genreScore: Record<string, number> = {};
    const artistScore: Record<string, number> = {};

    if (user) {
      // Weight favorite genres
      (user.favoriteGenres || []).forEach(g => {
        genreScore[g] = (genreScore[g] || 0) + 3;
      });

      // Weight liked tracks
      (user.likedTrackIds || []).forEach(id => {
        const track = allTracks.find(t => t.id === id);
        if (track) {
          genreScore[track.genre] = (genreScore[track.genre] || 0) + 2;
          artistScore[track.artistId] = (artistScore[track.artistId] || 0) + 2;
        }
      });

      // Weight recently played
      (user.recentlyPlayed || []).forEach(rp => {
        const track = allTracks.find(t => t.id === rp.trackId);
        if (track) {
          genreScore[track.genre] = (genreScore[track.genre] || 0) + 1.5;
          artistScore[track.artistId] = (artistScore[track.artistId] || 0) + 1.5;
        }
      });
    }

    // Score all tracks
    const scored = allTracks.map(track => {
      let score = (genreScore[track.genre] || 0) * 1.5 + (artistScore[track.artistId] || 0) * 2;
      
      // Give small boost for high ratings
      score += (track.rating || 8.0) * 0.2;

      let reason = `Popular ${track.genre} recommendation`;
      if (user && artistScore[track.artistId]) {
        reason = `Because you enjoy music by ${track.artist}`;
      } else if (user && genreScore[track.genre]) {
        reason = `Based on your frequent ${track.genre} and ${track.mood} listening history`;
      }

      return { track, score, reason };
    });

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, limit).map(s => ({
      track: s.track,
      reason: s.reason
    }));
  }

  // AI Mood-Based Track Filter
  public getTracksByMood(mood: Mood, allTracks: Track[]): Track[] {
    return allTracks.filter(t => t.mood.toLowerCase() === mood.toLowerCase());
  }

  // Natural Language Playlist Generator
  public generatePlaylistFromPrompt(
    prompt: string,
    allTracks: Track[],
    user: User | null
  ): Playlist {
    const lower = prompt.toLowerCase();

    // Identify target moods and genres
    const detectedMoods: Mood[] = [];
    if (lower.includes('workout') || lower.includes('gym') || lower.includes('heavy') || lower.includes('pump') || lower.includes('fast')) {
      detectedMoods.push('Workout', 'Energy');
    }
    if (lower.includes('code') || lower.includes('coding') || lower.includes('focus') || lower.includes('study') || lower.includes('work')) {
      detectedMoods.push('Focus', 'Chill');
    }
    if (lower.includes('chill') || lower.includes('relax') || lower.includes('calm') || lower.includes('coffee') || lower.includes('evening')) {
      detectedMoods.push('Chill', 'Sleep');
    }
    if (lower.includes('sleep') || lower.includes('night') || lower.includes('bed') || lower.includes('rain')) {
      detectedMoods.push('Sleep', 'Chill');
    }
    if (lower.includes('party') || lower.includes('dance') || lower.includes('club') || lower.includes('festival')) {
      detectedMoods.push('Party', 'Energy');
    }
    if (lower.includes('romantic') || lower.includes('love') || lower.includes('date') || lower.includes('dinner')) {
      detectedMoods.push('Romantic');
    }

    const detectedGenres: Genre[] = [];
    if (lower.includes('hindi') || lower.includes('bollywood') || lower.includes('arijit') || lower.includes('pritam')) detectedGenres.push('Bollywood' as any);
    if (lower.includes('punjabi') || lower.includes('dhillon') || lower.includes('diljit')) detectedGenres.push('Punjabi' as any);
    if (lower.includes('synth') || lower.includes('synthwave') || lower.includes('retro') || lower.includes('80s')) detectedGenres.push('Synthwave');
    if (lower.includes('rock') || lower.includes('guitar') || lower.includes('metal')) detectedGenres.push('Rock');
    if (lower.includes('lofi') || lower.includes('lo-fi') || lower.includes('chillhop')) detectedGenres.push('Lo-Fi');
    if (lower.includes('acoustic') || lower.includes('unplugged') || lower.includes('folk')) detectedGenres.push('Indie' as any);
    if (lower.includes('electronic') || lower.includes('edm') || lower.includes('dance')) detectedGenres.push('Electronic');

    // Filter tracks
    let matchedTracks = allTracks.filter(t => {
      const moodMatch = detectedMoods.length === 0 || detectedMoods.includes(t.mood);
      const genreMatch = detectedGenres.length === 0 || detectedGenres.includes(t.genre);
      return moodMatch || genreMatch;
    });

    if (matchedTracks.length < 3) {
      matchedTracks = [...allTracks].sort(() => Math.random() - 0.5).slice(0, 5);
    }

    const playlistId = 'pl-ai-' + Date.now();
    const cleanTitle = prompt.length > 40 ? prompt.substring(0, 37) + '...' : prompt;
    
    let coverArt = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80';
    if (detectedMoods.includes('Energy') || detectedMoods.includes('Workout')) {
      coverArt = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80';
    } else if (detectedMoods.includes('Chill') || detectedGenres.includes('Lo-Fi')) {
      coverArt = 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80';
    }

    const generatedPlaylist: Playlist = {
      id: playlistId,
      title: `✨ AI Mix: ${cleanTitle}`,
      description: `AI-engineered soundtrack generated for: "${prompt}". Tailored with ${matchedTracks.length} tracks.`,
      coverArt: coverArt,
      creatorId: user?.id || 'guest',
      creatorName: user?.name ? `${user.name} (AI Generated)` : 'Aura AI Assistant',
      trackIds: matchedTracks.map(t => t.id),
      tracks: matchedTracks,
      isPublic: true,
      isCollaborative: false,
      collaboratorIds: [],
      reactions: [
        { emoji: '✨', count: 1 },
        { emoji: '🔥', count: 1 }
      ],
      isAiGenerated: true,
      aiPrompt: prompt,
      createdAt: new Date().toISOString().split('T')[0]
    };

    return generatedPlaylist;
  }

  // Conversational AI Assistant Responses
  public async respondToUserChat(
    message: string,
    context: {
      currentTrack?: Track | null;
      allTracks: Track[];
      allArtists: Artist[];
      user: User | null;
    }
  ): Promise<ChatMessage> {
    const lower = message.toLowerCase().trim();
    const { currentTrack, allTracks, allArtists, user } = context;

    await new Promise(r => setTimeout(r, 400));

    // 1. Playlist creation command
    if (lower.startsWith('create playlist') || lower.includes('make a playlist') || lower.includes('generate playlist') || lower.includes('playlist for') || lower.includes('banao')) {
      const playlist = this.generatePlaylistFromPrompt(message, allTracks, user);
      const trackObjects = allTracks.filter(t => playlist.trackIds.includes(t.id));

      return {
        id: 'msg-' + Date.now(),
        sender: 'ai',
        text: `I've compiled an AI playlist for **"${message}"**! Here are the selected streaming tracks:`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        generatedPlaylist: playlist,
        relatedTracks: trackObjects,
        suggestedAction: {
          label: 'Save Playlist to My Library',
          actionType: 'create_playlist',
          payload: playlist
        }
      };
    }

    // 2. Questions about the current song
    if (currentTrack && (lower.includes('this song') || lower.includes('current song') || lower.includes('song ke baare') || lower.includes('what is this'))) {
      return {
        id: 'msg-' + Date.now(),
        sender: 'ai',
        text: `**"${currentTrack.title}"** by **${currentTrack.artist}** is a popular **${currentTrack.genre}** track.\n\n` +
          `• **Mood & Atmosphere**: ${currentTrack.mood} vibe\n` +
          `• **Description**: ${currentTrack.description || 'High fidelity music stream'}\n` +
          `• **Plays**: ${(currentTrack.playCount || 1000000).toLocaleString()}\n\n` +
          `Would you like me to play similar songs?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        relatedTracks: allTracks.filter(t => t.genre === currentTrack.genre && t.id !== currentTrack.id).slice(0, 3),
        suggestedAction: {
          label: `Play Similar to ${currentTrack.title}`,
          actionType: 'play_track',
          payload: allTracks.find(t => t.genre === currentTrack.genre && t.id !== currentTrack.id) || currentTrack
        }
      };
    }

    // 3. Similar songs request
    if (lower.includes('similar') || lower.includes('like this') || lower.includes('recommend') || lower.includes('suggest')) {
      const sample = currentTrack || allTracks[0];
      const similar = allTracks.filter(t => t.genre === sample.genre && t.id !== sample.id).slice(0, 4);

      return {
        id: 'msg-' + Date.now(),
        sender: 'ai',
        text: `Based on your interest in **${sample.genre}**, here are recommended tracks:`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        relatedTracks: similar.length > 0 ? similar : allTracks.slice(0, 3),
        suggestedAction: {
          label: 'Listen to Recommendations',
          actionType: 'play_track',
          payload: similar[0] || allTracks[0]
        }
      };
    }

    // 4. Generic intelligent music conversational reply
    return {
      id: 'msg-' + Date.now(),
      sender: 'ai',
      text: `Hello ${user?.name || 'there'}! I'm your **Aura AI Music Assistant**.\n\nYou can ask me to:\n` +
        `• *"Create a Hindi romantic playlist"*\n` +
        `• *"Play upbeat Punjabi workout songs"*\n` +
        `• *"Find deep focus lo-fi coding music"*\n` +
        `• *"Recommend songs based on my listening history"*\n\n` +
        `What would you like to listen to?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      relatedTracks: allTracks.slice(0, 2)
    };
  }
}

export const aiMusicService = new AiMusicService();
