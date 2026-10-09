import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { supabase } from '../services/supabaseClient';

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
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          await fetchUserProfile(session.user);
        } else {
          setCurrentUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.warn('Session check fallback to default profile:', err);
        setCurrentUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }

      // Listen for auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session && session.user) {
          await fetchUserProfile(session.user);
        } else {
          setCurrentUser(null);
          setIsAuthenticated(false);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    };
    checkAuth();
  }, []);

  const fetchUserProfile = async (supabaseUser: any) => {
    try {
      // Assuming you have a 'users' table in Supabase where id matches auth.users.id
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();
      
      if (data) {
        setCurrentUser(mapUserFromDb(data));
      } else {
        // Fallback if user record isn't in 'users' table yet
        setCurrentUser({
          ...DEFAULT_GUEST_USER,
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          name: supabaseUser.user_metadata?.full_name || 'User',
          username: supabaseUser.user_metadata?.username || supabaseUser.email?.split('@')[0] || 'user',
        });
      }
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Error fetching user profile', err);
    }
  };

  const mapUserFromDb = (dbUser: any): User => ({
    id: dbUser.id,
    name: dbUser.name || 'User',
    username: dbUser.username || 'user',
    email: dbUser.email || '',
    avatar: dbUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(dbUser.name || 'User')}&background=ef233c&color=ffffff&bold=true`,
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
    settings: dbUser.settings || DEFAULT_GUEST_USER.settings
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailOrUsername,
        password: password || '',
      });
      
      if (error) throw error;
      
      if (data.user) {
        await fetchUserProfile(data.user);
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password: password || '',
        options: {
          data: {
            full_name: name,
            username: username
          }
        }
      });
      
      if (error) throw error;

      if (data.user) {
        // Automatically insert into users table
        await supabase.from('users').insert([{
          id: data.user.id,
          name: name,
          username: username,
          email: email
        }]);

        await fetchUserProfile(data.user);
        closeAuthModal();
        return true;
      }
    } catch (err) {
      console.error('Signup error:', err);
      throw err;
    }
    return false;
  };

  const googleLogin = async (): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
      return true; // Page will redirect
    } catch (err) {
      console.error('Google login error:', err);
      throw err;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const updateProfile = async (updatedData: Partial<User>) => {
    if (!currentUser) return;
    try {
      const updates = {
        name: updatedData.name,
        username: updatedData.username,
        bio: updatedData.bio,
        avatar: updatedData.avatar,
        favorite_genres: updatedData.favoriteGenres,
        settings: updatedData.settings,
        updated_at: new Date()
      };
      
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', currentUser.id);
        
      if (error) throw error;
      
      setCurrentUser(prev => prev ? { ...prev, ...updatedData } : null);
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
