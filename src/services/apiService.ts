const API_BASE = '/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('aura_jwt_token');
  }

  public setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('aura_jwt_token', token);
    } else {
      localStorage.removeItem('aura_jwt_token');
    }
  }

  public getToken(): string | null {
    return this.token || localStorage.getItem('aura_jwt_token');
  }

  public async request(endpoint: string, options: RequestInit = {}) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || `Request failed with status ${res.status}`);
    }
    return data;
  }

  // Auth Endpoints
  public async signup(userData: { name: string; username: string; email: string; password: string }) {
    const data = await this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    if (data.token) this.setToken(data.token);
    return data;
  }

  public async signin(credentials: { login: string; password: string }) {
    const data = await this.request('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    if (data.token) this.setToken(data.token);
    return data;
  }

  public async googleLogin(googlePayload: { email: string; name: string; avatar?: string; googleId?: string }) {
    const data = await this.request('/auth/google', {
      method: 'POST',
      body: JSON.stringify(googlePayload)
    });
    if (data.token) this.setToken(data.token);
    return data;
  }

  public async getMe() {
    return this.request('/auth/me');
  }

  public async updateProfile(profileUpdates: any) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileUpdates)
    });
  }

  public logout() {
    this.setToken(null);
  }

  // User Library & Data
  public async getLibrary() {
    return this.request('/user/library');
  }

  public async toggleLike(trackId: string, trackData?: any) {
    return this.request('/user/likes/toggle', {
      method: 'POST',
      body: JSON.stringify({ trackId, trackData })
    });
  }

  public async recordHistory(trackId: string, trackData?: any, durationSeconds?: number) {
    return this.request('/user/history/record', {
      method: 'POST',
      body: JSON.stringify({ trackId, trackData, durationSeconds })
    });
  }

  public async getAnalytics() {
    return this.request('/user/analytics');
  }

  public async createPlaylist(playlistData: any) {
    return this.request('/user/playlists', {
      method: 'POST',
      body: JSON.stringify(playlistData)
    });
  }

  public async updatePlaylist(id: string, updates: any) {
    return this.request(`/user/playlists/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  public async deletePlaylist(id: string) {
    return this.request(`/user/playlists/${id}`, {
      method: 'DELETE'
    });
  }

  public async toggleFollowUser(targetUserId: string) {
    return this.request('/user/follow/user', {
      method: 'POST',
      body: JSON.stringify({ targetUserId })
    });
  }

  public async toggleFollowArtist(artistId: string) {
    return this.request('/user/follow/artist', {
      method: 'POST',
      body: JSON.stringify({ artistId })
    });
  }

  private mapSaavnToTracks(results: any[]) {
    return results.map((item: any) => {
      // Handle saavn.dev API response format
      const highResImage = Array.isArray(item.image) ? (item.image.find((i: any) => i.quality === '500x500') || item.image[item.image.length - 1])?.url : item.image;
      const highResAudio = Array.isArray(item.downloadUrl) ? (item.downloadUrl.find((d: any) => d.quality === '320kbps') || item.downloadUrl[item.downloadUrl.length - 1])?.url : item.downloadUrl;
      
      return {
        id: 'track-' + item.id,
        title: item.name || 'Unknown',
        artist: item.primaryArtists || 'Unknown Artist',
        artistId: 'art-' + item.id,
        album: item.album?.name || 'Single',
        albumArt: highResImage || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
        audioUrl: highResAudio || '',
        duration: parseInt(item.duration) || 180,
        genre: 'Pop',
        mood: 'Energy',
        year: parseInt(item.year) || 2024,
        playCount: Math.floor(Math.random() * 5000000) + 1500000,
        likesCount: Math.floor(Math.random() * 400000) + 75000,
        rating: 9.9,
        description: `${item.name} by ${item.primaryArtists}.`
      };
    }).filter((t: any) => t.audioUrl);
  }

  // Real YouTube/Saavn Music Discovery
  public async getTrendingMusic() {
    try {
      const res = await fetch('https://saavn.dev/api/search/songs?query=trending+hindi+english');
      const data = await res.json();
      if (data && data.success && data.data && data.data.results) {
         return { tracks: this.mapSaavnToTracks(data.data.results) };
      }
    } catch (e) {
      console.warn("Public API trending fetch failed", e);
    }
    return this.request('/music/trending');
  }

  public async searchMusic(query: string) {
    try {
      const res = await fetch(`https://saavn.dev/api/search/songs?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data && data.success && data.data && data.data.results) {
         return { tracks: this.mapSaavnToTracks(data.data.results) };
      }
    } catch (e) {
      console.warn("Public API search fetch failed", e);
    }
    return this.request(`/music/search?q=${encodeURIComponent(query)}`);
  }

  // AI Assistant & Playlists
  public async getAiRecommendations(prompt: string) {
    return this.request('/ai/recommend', {
      method: 'POST',
      body: JSON.stringify({ prompt })
    });
  }

  public async generateAiPlaylist(prompt: string) {
    return this.request('/ai/generate-playlist', {
      method: 'POST',
      body: JSON.stringify({ prompt })
    });
  }

  // Social & Creator Profile
  public async getSocialFeed() {
    return this.request('/social/feed');
  }

  public async getCreatorProfile() {
    return this.request('/social/creator');
  }
}

export const api = new ApiService();
