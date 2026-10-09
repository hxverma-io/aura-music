import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Track,
  Artist,
  Album,
  Playlist,
  FriendActivity,
  NotificationItem,
  ActiveTab,
  Mood,
  Genre
} from '../types';
import {
  INITIAL_ARTISTS,
  INITIAL_ALBUMS,
  INITIAL_NOTIFICATIONS,
  INITIAL_TRACKS,
  INITIAL_PLAYLISTS
} from '../data/initialData';
import { api } from '../services/apiService';
import { offlineService, OfflineRecord } from '../services/offlineService';
import { useAuth } from './AuthContext';

interface DataContextType {
  tracks: Track[];
  artists: Artist[];
  albums: Album[];
  playlists: Playlist[];
  likedTracks: Track[];
  likedTrackIds: string[];
  downloadedTracks: Track[];
  downloadedRecords: OfflineRecord[];
  downloadingTrackIds: string[];
  friendActivities: FriendActivity[];
  notifications: NotificationItem[];
  creatorProfile: any;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedMood: Mood | 'All';
  setSelectedMood: (mood: Mood | 'All') => void;
  selectedGenre: Genre | 'All';
  setSelectedGenre: (genre: Genre | 'All') => void;
  selectedArtist: Artist | null;
  setSelectedArtist: (artist: Artist | null) => void;
  selectedAlbum: Album | null;
  setSelectedAlbum: (album: Album | null) => void;
  selectedPlaylist: Playlist | null;
  setSelectedPlaylist: (playlist: Playlist | null) => void;
  isCreatePlaylistModalOpen: boolean;
  setIsCreatePlaylistModalOpen: (open: boolean) => void;
  isAiPlaylistModalOpen: boolean;
  setIsAiPlaylistModalOpen: (open: boolean) => void;
  activeTrackForPlaylist: Track | null;
  isAddToPlaylistModalOpen: boolean;
  openAddToPlaylistModal: (track: Track) => void;
  closeAddToPlaylistModal: () => void;
  isSearching: boolean;
  toastMessage: string | null;
  setToastMessage: (msg: string | null) => void;
  toggleLikeTrack: (track: Track) => Promise<void>;
  downloadTrack: (track: Track) => Promise<void>;
  removeDownloadedTrack: (trackId: string) => Promise<void>;
  isTrackDownloaded: (trackId: string) => boolean;
  toggleFollowArtist: (artistId: string) => Promise<void>;
  toggleFollowUser: (userId: string) => Promise<void>;
  createPlaylist: (playlist: Partial<Playlist>) => Promise<Playlist>;
  updatePlaylist: (id: string, updates: Partial<Playlist>) => Promise<void>;
  deletePlaylist: (id: string) => Promise<void>;
  addTrackToPlaylist: (playlistId: string, track: Track) => Promise<void>;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => Promise<void>;
  togglePinPlaylist: (playlistId: string) => void;
  reactToPlaylist: (playlistId: string, emoji: string) => void;
  recordTrackPlayed: (track: Track, durationSeconds?: number) => Promise<void>;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  refreshLibrary: () => Promise<void>;
  openArtistPage: (artist: Artist | { id: string; name: string; avatar?: string }) => void;
  updateTrackMetadata: (trackId: string, updates: Partial<Track>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, currentUser } = useAuth();

  const [tracks, setTracks] = useState<Track[]>([]);
  const [artists, setArtists] = useState<Artist[]>(INITIAL_ARTISTS);
  const [albums, setAlbums] = useState<Album[]>(INITIAL_ALBUMS);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [likedTracks, setLikedTracks] = useState<Track[]>([]);
  const [likedTrackIds, setLikedTrackIds] = useState<string[]>([]);
  const [downloadedRecords, setDownloadedRecords] = useState<OfflineRecord[]>([]);
  const [downloadingTrackIds, setDownloadingTrackIds] = useState<string[]>([]);
  const [friendActivities, setFriendActivities] = useState<FriendActivity[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [creatorProfile, setCreatorProfile] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMood, setSelectedMood] = useState<Mood | 'All'>('All');
  const [selectedGenre, setSelectedGenre] = useState<Genre | 'All'>('All');

  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

  const [isCreatePlaylistModalOpen, setIsCreatePlaylistModalOpen] = useState<boolean>(false);
  const [isAiPlaylistModalOpen, setIsAiPlaylistModalOpen] = useState<boolean>(false);
  const [activeTrackForPlaylist, setActiveTrackForPlaylist] = useState<Track | null>(null);
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const openAddToPlaylistModal = (track: Track) => {
    setActiveTrackForPlaylist(track);
    setIsAddToPlaylistModalOpen(true);
  };

  const closeAddToPlaylistModal = () => {
    setActiveTrackForPlaylist(null);
    setIsAddToPlaylistModalOpen(false);
  };

  // Auto-dismiss toast after 3 seconds
  useEffect(() => {
    if (toastMessage) {
      const t = setTimeout(() => setToastMessage(null), 3500);
      return () => clearTimeout(t);
    }
  }, [toastMessage]);

  // Load Initial Offline Cache from IndexedDB
  const refreshOfflineTracks = async () => {
    try {
      const records = await offlineService.getAllOfflineTracks();
      setDownloadedRecords(records);
    } catch (e) {
      console.warn('Could not load offline cache records:', e);
    }
  };

  useEffect(() => {
    refreshOfflineTracks();
  }, []);

  // Load Initial Trending Hindi + English Catalog & Social Feed from Backend
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const trendingRes = await api.getTrendingMusic().catch(() => null);
        if (trendingRes && trendingRes.tracks && trendingRes.tracks.length > 0) {
          setTracks(trendingRes.tracks);
        } else {
          // Fallback to static data directly for Cloudflare Pages (no backend needed)
          setTracks(INITIAL_TRACKS);
        }

        const creatorRes = await api.getCreatorProfile().catch(() => ({}));
        if (creatorRes.creator) {
          setCreatorProfile(creatorRes.creator);
        }
        if (playlists.length === 0) {
          setPlaylists(creatorRes.playlists || INITIAL_PLAYLISTS);
        }
      } catch (err) {
        console.warn('Could not fetch backend trending data:', err);
      }
    };
    loadInitialData();
  }, []);

  // Fetch or Restore User Library from DB when user authenticates
  const refreshLibrary = async () => {
    if (!isAuthenticated) return;
    try {
      const lib = await api.getLibrary().catch(() => null);
      if (lib) {
        setLikedTracks(lib.likes || []);
        setLikedTrackIds(lib.likedTrackIds || []);
        if (lib.playlists && lib.playlists.length > 0) {
          setPlaylists(lib.playlists);
        }
      } else {
         // Fallback to static playlists if backend is unavailable
         if (playlists.length === 0) {
           setPlaylists(INITIAL_PLAYLISTS);
         }
      }
    } catch (err) {
      console.warn('Error refreshing library from database:', err);
    }
  };

  useEffect(() => {
    refreshLibrary();
  }, [isAuthenticated, currentUser?.id]);

  // Live Real Music Search Debounced
  useEffect(() => {
    if (!searchQuery.trim()) {
      api.getTrendingMusic().then(res => {
        if (res && res.tracks && res.tracks.length > 0) {
          setTracks(res.tracks);
        } else {
          setTracks(INITIAL_TRACKS);
        }
      }).catch(() => setTracks(INITIAL_TRACKS));
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const searchRes = await api.searchMusic(searchQuery).catch(() => null);
        if (searchRes && searchRes.tracks && searchRes.tracks.length > 0) {
          setTracks(searchRes.tracks);
        } else {
          // Fallback to static search if backend is unavailable
          const q = searchQuery.toLowerCase();
          const results = INITIAL_TRACKS.filter(t => 
            t.title.toLowerCase().includes(q) || 
            t.artist.toLowerCase().includes(q)
          );
          setTracks(results);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const openArtistPage = (artistData: Artist | { id: string; name: string; avatar?: string }) => {
    const found = artists.find(a => a.id === artistData.id || a.name.toLowerCase() === artistData.name.toLowerCase());
    if (found) {
      setSelectedArtist(found);
    } else {
      setSelectedArtist({
        id: artistData.id || 'art-' + Date.now(),
        name: artistData.name,
        avatar: artistData.avatar || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
        genres: ['Popular'],
        bio: `${artistData.name} on Aura Music.`,
        monthlyListeners: 2400000,
        topTrackIds: []
      });
    }
    setSelectedPlaylist(null);
    setActiveTab('explore');
  };

  const isTrackDownloaded = (trackId: string): boolean => {
    return downloadedRecords.some(r => r.id === trackId);
  };

  // 1-Click Audio Download: Saves file to device Downloads folder AND saves to in-app IndexedDB offline cache
  const downloadTrack = async (track: Track) => {
    if (downloadingTrackIds.includes(track.id)) return;

    setDownloadingTrackIds(prev => [...prev, track.id]);
    setToastMessage(`⬇️ Downloading "${track.title}" in 256kbps audio...`);

    try {
      // 1. Save to in-app IndexedDB offline cache
      const savedRecord = await offlineService.saveTrackOffline(track);
      await refreshOfflineTracks();

      // 2. Trigger browser direct file download to local Downloads folder
      const downloadUrl = `/api/music/download/${track.id}?url=${encodeURIComponent(track.audioUrl)}&title=${encodeURIComponent(track.title)}&artist=${encodeURIComponent(track.artist)}`;
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${track.title} - ${track.artist}.m4a`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setToastMessage(`✅ "${track.title}" downloaded & cached for offline playback (${offlineService.formatBytes(savedRecord.sizeBytes)})!`);
    } catch (err) {
      console.error('Download error:', err);
      // Fallback: direct blob download
      try {
        const resp = await fetch(track.audioUrl);
        const blob = await resp.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `${track.title} - ${track.artist}.m4a`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setToastMessage(`✅ "${track.title}" downloaded to your device!`);
      } catch (fallbackErr) {
        setToastMessage(`⚠️ Could not complete audio download.`);
      }
    } finally {
      setDownloadingTrackIds(prev => prev.filter(id => id !== track.id));
    }
  };

  const removeDownloadedTrack = async (trackId: string) => {
    try {
      await offlineService.removeOfflineTrack(trackId);
      await refreshOfflineTracks();
      setToastMessage('🗑️ Track removed from offline cache.');
    } catch (e) {
      console.error(e);
    }
  };

  const toggleLikeTrack = async (track: Track) => {
    const isCurrentlyLiked = likedTrackIds.includes(track.id);
    
    // Optimistic update
    if (isCurrentlyLiked) {
      setLikedTrackIds(prev => prev.filter(id => id !== track.id));
      setLikedTracks(prev => prev.filter(t => t.id !== track.id));
      setToastMessage(`Removed "${track.title}" from Liked Songs`);
    } else {
      setLikedTrackIds(prev => [...prev, track.id]);
      setLikedTracks(prev => [track, ...prev]);
      setToastMessage(`❤️ Added "${track.title}" to Liked Songs`);
    }

    try {
      await api.toggleLike(track.id, track);
    } catch (err) {
      console.error('Failed to sync like with database:', err);
      refreshLibrary();
    }
  };

  const recordTrackPlayed = async (track: Track, durationSeconds?: number) => {
    try {
      await api.recordHistory(track.id, track, durationSeconds || track.duration || 180);
    } catch (err) {
      console.warn('Failed to log play history to database:', err);
    }
  };

  const createPlaylist = async (playlistData: Partial<Playlist>): Promise<Playlist> => {
    try {
      const res = await api.createPlaylist(playlistData);
      const created = res.playlist || {
        id: `pl-local-${Date.now()}`,
        title: playlistData.title || 'New Playlist',
        description: playlistData.description || '',
        coverArt: playlistData.coverArt || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
        creatorId: 'local-user',
        creatorName: 'You',
        trackIds: playlistData.trackIds || [],
        isPublic: playlistData.isPublic ?? true,
        isCollaborative: playlistData.isCollaborative ?? false,
        isSmart: playlistData.isSmart ?? false,
        smartRules: playlistData.smartRules || [],
        reactions: [],
        createdAt: new Date().toISOString()
      };
      setPlaylists(prev => [created, ...prev]);
      setToastMessage(`✨ Playlist "${created.title}" saved to library!`);
      return created;
    } catch (err) {
      console.warn('Backend sync failed, creating local playlist:', err);
      const created: Playlist = {
        id: `pl-local-${Date.now()}`,
        title: playlistData.title || 'New Playlist',
        description: playlistData.description || '',
        coverArt: playlistData.coverArt || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
        creatorId: 'local-user',
        creatorName: 'You',
        trackIds: playlistData.trackIds || [],
        isPublic: playlistData.isPublic ?? true,
        isCollaborative: playlistData.isCollaborative ?? false,
        isSmart: playlistData.isSmart ?? false,
        smartRules: playlistData.smartRules || [],
        reactions: [],
        createdAt: new Date().toISOString()
      };
      setPlaylists(prev => [created, ...prev]);
      setToastMessage(`✨ Playlist "${created.title}" saved to library!`);
      return created;
    }
  };

  const updatePlaylist = async (id: string, updates: Partial<Playlist>) => {
    try {
      const res = await api.updatePlaylist(id, updates);
      if (res.playlist) {
        setPlaylists(prev => prev.map(p => (p.id === id ? res.playlist : p)));
        if (selectedPlaylist && selectedPlaylist.id === id) {
          setSelectedPlaylist(res.playlist);
        }
      }
    } catch (err) {
      console.error('Failed to update playlist in database:', err);
    }
  };

  const deletePlaylist = async (id: string) => {
    try {
      await api.deletePlaylist(id);
      setPlaylists(prev => prev.filter(p => p.id !== id));
      if (selectedPlaylist && selectedPlaylist.id === id) {
        setSelectedPlaylist(null);
      }
      setToastMessage('🗑️ Playlist deleted.');
    } catch (err) {
      console.error('Failed to delete playlist from database:', err);
    }
  };

  const addTrackToPlaylist = async (playlistId: string, track: Track) => {
    let targetPlaylistTitle = 'Playlist';
    setPlaylists(prev => {
      return prev.map(p => {
        if (p.id !== playlistId) return p;
        targetPlaylistTitle = p.title;
        const existingTracks = p.tracks || [];
        const updatedTracks = existingTracks.some(t => t.id === track.id) ? existingTracks : [...existingTracks, track];
        const existingTrackIds = p.trackIds || (p as any).track_ids || [];
        const updatedTrackIds = existingTrackIds.includes(track.id) ? existingTrackIds : [...existingTrackIds, track.id];
        const updated = { ...p, trackIds: updatedTrackIds, tracks: updatedTracks };
        if (selectedPlaylist && selectedPlaylist.id === playlistId) {
          setSelectedPlaylist(updated);
        }
        return updated;
      });
    });

    setToastMessage(`✓ Added "${track.title}" to ${targetPlaylistTitle}`);

    try {
      const target = playlists.find(p => p.id === playlistId);
      const existingTracks = target?.tracks || [];
      const updatedTracks = existingTracks.some(t => t.id === track.id) ? existingTracks : [...existingTracks, track];
      const existingTrackIds = target?.trackIds || (target as any)?.track_ids || [];
      const updatedTrackIds = existingTrackIds.includes(track.id) ? existingTrackIds : [...existingTrackIds, track.id];
      await api.updatePlaylist(playlistId, { trackIds: updatedTrackIds, tracks: updatedTracks });
    } catch (err) {
      console.warn('Playlist update backend sync fallback:', err);
    }
  };

  const removeTrackFromPlaylist = async (playlistId: string, trackId: string) => {
    let targetPlaylistTitle = 'Playlist';

    setPlaylists(prev => {
      return prev.map(p => {
        if (p.id !== playlistId) return p;
        targetPlaylistTitle = p.title;
        const updatedTracks = (p.tracks || []).filter(t => t.id !== trackId);
        const existingTrackIds = p.trackIds || (p as any).track_ids || [];
        const updatedTrackIds = existingTrackIds.filter((id: string) => id !== trackId);
        const updated = { ...p, trackIds: updatedTrackIds, tracks: updatedTracks };
        if (selectedPlaylist && selectedPlaylist.id === playlistId) {
          setSelectedPlaylist(updated);
        }
        return updated;
      });
    });

    setToastMessage(`Removed track from ${targetPlaylistTitle}`);

    try {
      const target = playlists.find(p => p.id === playlistId);
      const updatedTracks = (target?.tracks || []).filter(t => t.id !== trackId);
      const existingTrackIds = target?.trackIds || (target as any)?.track_ids || [];
      const updatedTrackIds = existingTrackIds.filter((id: string) => id !== trackId);
      await api.updatePlaylist(playlistId, { trackIds: updatedTrackIds, tracks: updatedTracks });
    } catch (err) {
      console.warn('Playlist remove backend sync fallback:', err);
    }
  };

  const toggleFollowUser = async (targetUserId: string) => {
    try {
      await api.toggleFollowUser(targetUserId);
    } catch (err) {
      console.error('Failed to follow user in database:', err);
    }
  };

  const toggleFollowArtist = async (artistId: string) => {
    try {
      await api.toggleFollowArtist(artistId);
    } catch (err) {
      console.error('Failed to follow artist in database:', err);
    }
  };

  const togglePinPlaylist = (playlistId: string) => {
    setPlaylists(prev =>
      prev.map(p => (p.id === playlistId ? { ...p, isPinned: !p.isPinned } : p))
    );
  };

  const reactToPlaylist = (playlistId: string, emoji: string) => {
    setPlaylists(prev =>
      prev.map(p => {
        if (p.id !== playlistId) return p;
        const exists = p.reactions?.find(r => r.emoji === emoji);
        let updatedReactions;
        if (exists) {
          updatedReactions = p.reactions.map(r =>
            r.emoji === emoji ? { ...r, count: r.count + 1, userReacted: true } : r
          );
        } else {
          updatedReactions = [...(p.reactions || []), { emoji, count: 1, userReacted: true }];
        }
        return { ...p, reactions: updatedReactions };
      })
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const downloadedTracks = downloadedRecords.map(r => r.track);

  const updateTrackMetadata = (trackId: string, updates: Partial<Track>) => {
    setTracks(prev =>
      prev.map(t => (t.id === trackId ? { ...t, ...updates } : t))
    );
  };

  return (
    <DataContext.Provider
      value={{
        tracks,
        artists,
        albums,
        playlists,
        likedTracks,
        likedTrackIds,
        downloadedTracks,
        downloadedRecords,
        downloadingTrackIds,
        friendActivities,
        notifications,
        creatorProfile,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        selectedMood,
        setSelectedMood,
        selectedGenre,
        setSelectedGenre,
        selectedArtist,
        setSelectedArtist,
        selectedAlbum,
        setSelectedAlbum,
        selectedPlaylist,
        setSelectedPlaylist,
        isCreatePlaylistModalOpen,
        setIsCreatePlaylistModalOpen,
        isAiPlaylistModalOpen,
        setIsAiPlaylistModalOpen,
        activeTrackForPlaylist,
        isAddToPlaylistModalOpen,
        openAddToPlaylistModal,
        closeAddToPlaylistModal,
        isSearching,
        toastMessage,
        setToastMessage,
        toggleLikeTrack,
        downloadTrack,
        removeDownloadedTrack,
        isTrackDownloaded,
        toggleFollowArtist,
        toggleFollowUser,
        createPlaylist,
        updatePlaylist,
        deletePlaylist,
        addTrackToPlaylist,
        removeTrackFromPlaylist,
        togglePinPlaylist: (id: string) => {
          setPlaylists(prev => prev.map(p => p.id === id ? { ...p, isPinned: !p.isPinned } : p));
        },
        reactToPlaylist,
        recordTrackPlayed,
        markNotificationRead,
        clearAllNotifications,
        refreshLibrary,
        openArtistPage,
        updateTrackMetadata
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
