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

  // Real YouTube Music Discovery
  public async getTrendingMusic() {
    return this.request('/music/trending');
  }

  public async searchMusic(query: string) {
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
