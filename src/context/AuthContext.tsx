import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/apiService';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'signin' | 'signup' | 'forgot' | 'profile';
  openAuthModal: (mode?: 'signin' | 'signup' | 'forgot' | 'profile') => void;
  closeAuthModal: () => void;
  login: (emailOrUsername: string, password?: string) => Promise<boolean>;
  signup: (name: string, username: string, email: string, password?: string) => Promise<boolean>;
  googleLogin: (payload: { email: string; name: string; avatar?: string; googleId?: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updatedData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_GUEST_USER: User = {
  id: 'user-creator',
  name: 'Himanshu Verma',
  username: 'hxverma.io',
  email: 'hxverma.io@gmail.com',
  avatar: 'https://github.com/hxverma-io.png',
  bio: 'Creator & Lead Architect of Aura Music. Open source developer building next-gen high-fidelity audio systems.',
  favoriteGenres: ['Rock', 'Synthwave', 'Indie', 'Punjabi', 'Bollywood'],
  likedTrackIds: [],
  savedAlbumIds: [],
  followedArtistIds: [],
  followedUserIds: [],
  playlistIds: [],
  pinnedPlaylistIds: [],
  recentlyPlayed: [],
  searchHistory: [],
  settings: {
    audioQuality: 'lossless',
    normalizeVolume: true,
    crossfadeSeconds: 3,
    theme: 'dark',
    socialSharingEnabled: true,
    notificationsEnabled: true,
    soundEffects: true
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(DEFAULT_GUEST_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup' | 'forgot' | 'profile'>('signin');

  // Validate session against database on initial mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = api.getToken();
        if (token) {
          const res = await api.getMe();
          if (res.user) {
            setCurrentUser(mapUserFromDb(res.user));
            setIsAuthenticated(true);
          } else {
            setCurrentUser(DEFAULT_GUEST_USER);
            setIsAuthenticated(true);
            api.setToken(null);
          }
        } else {
          setCurrentUser(DEFAULT_GUEST_USER);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.warn('Session check fallback to default profile:', err);
        setCurrentUser(DEFAULT_GUEST_USER);
        setIsAuthenticated(true);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const mapUserFromDb = (dbUser: any): User => ({
    id: dbUser.id,
    name: dbUser.name,
    username: dbUser.username,
    email: dbUser.email,
    avatar: dbUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(dbUser.name)}&background=ef233c&color=ffffff&bold=true`,
    bio: dbUser.bio || '',
    favoriteGenres: dbUser.favorite_genres || ['Bollywood', 'Punjabi', 'Pop'],
    likedTrackIds: [],
    savedAlbumIds: [],
    followedArtistIds: [],
    followedUserIds: [],
    playlistIds: [],
    pinnedPlaylistIds: [],
    recentlyPlayed: [],
    searchHistory: [],
    settings: dbUser.settings || {
      audioQuality: 'lossless',
      normalizeVolume: true,
      crossfadeSeconds: 3,
      theme: 'dark',
      socialSharingEnabled: true,
      notificationsEnabled: true,
      soundEffects: true
    }
  });

  const openAuthModal = (mode: 'signin' | 'signup' | 'forgot' | 'profile' = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (emailOrUsername: string, password?: string): Promise<boolean> => {
    try {
      const res = await api.signin({ login: emailOrUsername, password: password || '' });
      if (res.user) {
        setCurrentUser(mapUserFromDb(res.user));
        setIsAuthenticated(true);
        closeAuthModal();
        return true;
      }
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
    return false;
  };

  const signup = async (name: string, username: string, email: string, password?: string): Promise<boolean> => {
    try {
      const res = await api.signup({ name, username, email, password: password || '' });
      if (res.user) {
        setCurrentUser(mapUserFromDb(res.user));
        setIsAuthenticated(true);
        closeAuthModal();
        return true;
      }
    } catch (err) {
      console.error('Signup error:', err);
      throw err;
    }
    return false;
  };

  const googleLogin = async (payload: { email: string; name: string; avatar?: string; googleId?: string }): Promise<boolean> => {
    try {
      const res = await api.googleLogin(payload);
      if (res.user) {
        setCurrentUser(mapUserFromDb(res.user));
        setIsAuthenticated(true);
        closeAuthModal();
        return true;
      }
    } catch (err) {
      console.error('Google login error:', err);
      throw err;
    }
    return false;
  };

  const logout = () => {
    api.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const updateProfile = async (updatedData: Partial<User>) => {
    try {
      const res = await api.updateProfile({
        name: updatedData.name,
        username: updatedData.username,
        bio: updatedData.bio,
        avatar: updatedData.avatar,
        favorite_genres: updatedData.favoriteGenres,
        settings: updatedData.settings
      });
      if (res.user) {
        setCurrentUser(mapUserFromDb(res.user));
      }
    } catch (err) {
      console.error('Failed to update profile on backend:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isLoading,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        signup,
        googleLogin,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
