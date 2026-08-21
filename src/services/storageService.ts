import { User, Playlist, Track } from '../types';
import { INITIAL_USERS, INITIAL_PLAYLISTS, INITIAL_TRACKS } from '../data/initialData';

const USERS_KEY = 'aura_music_users';
const PLAYLISTS_KEY = 'aura_music_playlists';
const ACTIVE_USER_ID_KEY = 'aura_music_active_user_id';
const CUSTOM_TRACKS_KEY = 'aura_music_custom_tracks';

export const storageService = {
  loadUsers(): User[] {
    try {
      const data = localStorage.getItem(USERS_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Error loading users from storage', e);
    }
    return INITIAL_USERS;
  },

  saveUsers(users: User[]) {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Error saving users to storage', e);
    }
  },

  loadActiveUserId(): string {
    return localStorage.getItem(ACTIVE_USER_ID_KEY) || INITIAL_USERS[0].id;
  },

  saveActiveUserId(id: string) {
    localStorage.setItem(ACTIVE_USER_ID_KEY, id);
  },

  loadPlaylists(): Playlist[] {
    try {
      const data = localStorage.getItem(PLAYLISTS_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Error loading playlists from storage', e);
    }
    return INITIAL_PLAYLISTS;
  },

  savePlaylists(playlists: Playlist[]) {
    try {
      localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));
    } catch (e) {
      console.error('Error saving playlists to storage', e);
    }
  },

  loadCustomTracks(): Track[] {
    try {
      const data = localStorage.getItem(CUSTOM_TRACKS_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Error loading custom tracks', e);
    }
    return INITIAL_TRACKS;
  },

  saveCustomTracks(tracks: Track[]) {
    try {
      localStorage.setItem(CUSTOM_TRACKS_KEY, JSON.stringify(tracks));
    } catch (e) {
      console.error('Error saving custom tracks', e);
    }
  },

  exportBackup(): string {
    const backup = {
      users: this.loadUsers(),
      playlists: this.loadPlaylists(),
      tracks: this.loadCustomTracks(),
      activeUserId: this.loadActiveUserId(),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(backup, null, 2);
  },

  importBackup(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.users) this.saveUsers(parsed.users);
      if (parsed.playlists) this.savePlaylists(parsed.playlists);
      if (parsed.tracks) this.saveCustomTracks(parsed.tracks);
      if (parsed.activeUserId) this.saveActiveUserId(parsed.activeUserId);
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  }
};
