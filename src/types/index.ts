export type Genre = 
  | 'Bollywood'
  | 'Punjabi'
  | 'Synthwave'
  | 'Rock'
  | 'Metal'
  | 'Heavy Metal'
  | 'Indie Rock'
  | 'Alternative'
  | 'Electronic'
  | 'Lo-Fi'
  | 'Pop'
  | 'Hip-Hop'
  | 'Indie'
  | 'Ambient'
  | 'Classical'
  | 'Cinematic'
  | 'Soundtrack'
  | 'Cyberpunk'
  | 'Acoustic'
  | 'R&B'
  | 'Popular';

export type Mood = 
  | 'Chill'
  | 'Energy'
  | 'Focus'
  | 'Romantic'
  | 'Sleep'
  | 'Workout'
  | 'Party';

export type LyricsSource = 'embedded' | 'user' | 'provider' | 'file';

export type LyricsStatus =
  | 'idle'
  | 'loading'
  | 'verified_synced'
  | 'verified_plain'
  | 'user_provided'
  | 'instrumental'
  | 'unavailable'
  | 'error';

export interface LyricsLine {
  id: string;
  startTime?: number;
  endTime?: number;
  text: string;
}

export interface LyricsResult {
  trackId: string;
  isrc?: string;
  language?: string;
  script?: string;
  synced: boolean;
  isInstrumental?: boolean;
  verified: boolean;
  source: LyricsSource;
  status: LyricsStatus;
  lines: LyricsLine[];
  plainText?: string;
  errorMessage?: string;
}

export interface SongDNA {
  energy: number; // 0 - 100
  bpm: number; // e.g. 120
  danceability: number; // 0 - 100
  acousticness: number; // 0 - 100
  instrumentalness: number; // 0 - 100
  vocalIntensity: number; // 0 - 100
  mood: Mood;
  genre: Genre;
  era: string;
  language: string;
}

export interface SmartPlaylistRule {
  field: 'rating' | 'genre' | 'playCount' | 'energy' | 'bpm' | 'year';
  operator: 'greater_than' | 'less_than' | 'equals' | 'contains';
  value: any;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  album: string;
  albumArt: string;
  audioUrl: string;
  youtubeVideoId?: string;
  duration: number; // in seconds
  genre: Genre;
  mood: Mood;
  year: number;
  isInstrumental?: boolean;
  lyrics?: string[];
  lyricsResult?: LyricsResult;
  playCount: number;
  likesCount: number;
  rating?: number;
  description?: string;
  songDna?: SongDNA;
  synthPreset?: {
    type: 'synthwave' | 'ambient' | 'rock' | 'lofi' | 'energy';
    bpm: number;
    baseFreq: number;
  };
}

export interface Artist {
  id: string;
  name: string;
  avatar: string;
  banner?: string;
  bio: string;
  genres: Genre[];
  monthlyListeners: number;
  followersCount?: number;
  topTrackIds: string[];
  albumIds?: string[];
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  coverArt: string;
  year: number;
  genre: Genre;
  trackIds: string[];
}

export interface PlaylistReaction {
  emoji: string;
  count: number;
  userReacted?: boolean;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverArt: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar?: string;
  trackIds: string[];
  tracks?: Track[];
  isPublic: boolean;
  isCollaborative: boolean;
  collaboratorIds?: string[];
  reactions: PlaylistReaction[];
  isPinned?: boolean;
  isAiGenerated?: boolean;
  aiPrompt?: string;
  isSmart?: boolean;
  smartRules?: SmartPlaylistRule[];
  createdAt: string;
}

export interface FriendActivity {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  trackId: string;
  trackTitle: string;
  artistName: string;
  albumArt: string;
  timestamp: string;
  isPlaying: boolean;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  favoriteGenres: Genre[];
  likedTrackIds: string[];
  savedAlbumIds: string[];
  followedArtistIds: string[];
  followedUserIds: string[];
  playlistIds: string[];
  pinnedPlaylistIds: string[];
  recentlyPlayed: { trackId: string; playedAt: string }[];
  searchHistory: string[];
  settings: UserSettings;
}

export interface UserSettings {
  audioQuality: '128k' | '256k' | 'lossless';
  normalizeVolume: boolean;
  crossfadeSeconds: number;
  theme: 'dark' | 'light' | 'amoled';
  socialSharingEnabled: boolean;
  notificationsEnabled: boolean;
  soundEffects: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    actionType: 'play_track' | 'create_playlist' | 'open_artist' | 'view_genre';
    payload: any;
  };
  relatedTracks?: Track[];
  generatedPlaylist?: Playlist;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'release' | 'follow' | 'playlist' | 'system' | 'social';
  read: boolean;
  avatar?: string;
}

export interface EqualizerBand {
  label: string;
  freq: number;
  gain: number;
  type: BiquadFilterType;
  q?: number;
}

export interface RadioStation {
  id: string;
  name: string;
  genre: string;
  streamUrl: string;
  coverArt: string;
  listenersCount: number;
  bitrate: string;
  country: string;
}

export interface ABRepeat {
  active: boolean;
  start: number | null;
  end: number | null;
}

export type ActiveTab = 
  | 'home'
  | 'explore'
  | 'favorites'
  | 'playlists'
  | 'library'
  | 'lyrics'
  | 'ai-chat'
  | 'analytics'
  | 'social'
  | 'profile'
  | 'settings'
  | 'tv-mode'
  | 'remote';

