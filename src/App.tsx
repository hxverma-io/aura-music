import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { AudioProvider, useAudio } from './context/AudioContext';

import { Sidebar } from './components/layout/Sidebar';
import { TopNav } from './components/layout/TopNav';
import { FloatingDock } from './components/layout/FloatingDock';

import { FullscreenPlayer } from './components/player/FullscreenPlayer';
import { EqualizerModal } from './components/player/EqualizerModal';
import { QueueDrawer } from './components/player/QueueDrawer';
import { MultiRoomModal } from './components/player/MultiRoomModal';
import { PhoneRemoteModal } from './components/player/PhoneRemoteModal';
import { ShortcutsModal } from './components/player/ShortcutsModal';

import { AIPlaylistModal } from './components/ai/AIPlaylistModal';
import { CreatePlaylistModal } from './components/playlist/CreatePlaylistModal';
import { AddToPlaylistModal } from './components/playlist/AddToPlaylistModal';
import { AuthModal } from './components/auth/AuthModal';

import { SyncedLyricsView } from './components/lyrics/SyncedLyricsView';

import { HomeView } from './views/HomeView';
import { ExploreView } from './views/ExploreView';
import { LibraryView } from './views/LibraryView';
import { TVModeView } from './views/TVModeView';
import { PhoneRemoteView } from './views/PhoneRemoteView';
import { AIChatView } from './views/AIChatView';
import { AnalyticsView } from './views/AnalyticsView';
import { SocialView } from './views/SocialView';
import { ProfileView } from './views/ProfileView';
import { SettingsView } from './views/SettingsView';
import { ArtistView } from './views/ArtistView';

const MainAppContent: React.FC = () => {
  const { activeTab, selectedArtist, setSelectedArtist, activeTrackForPlaylist, isAddToPlaylistModalOpen, closeAddToPlaylistModal, setActiveTab } = useData();
  const {
    currentTrack,
    togglePlay,
    toggleMute,
    toggleSmartShuffle,
    setIsEqualizerOpen,
    setIsFullscreenPlayer,
    seekForward,
    seekBackward,
    nextTrack,
    prevTrack,
    toggleRepeat,
    setVolume,
    volume
  } = useAudio();
  
  const [isMultiRoomOpen, setIsMultiRoomOpen] = useState(false);
  const [isPhoneRemoteOpen, setIsPhoneRemoteOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;

      if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsOpen(prev => !prev);
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'ArrowRight' || e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        seekForward(10);
      } else if (e.key === 'ArrowLeft' || e.key === 'j' || e.key === 'J') {
        e.preventDefault();
        seekBackward(10);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setVolume(Math.min(1, volume + 0.1));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setVolume(Math.max(0, volume - 0.1));
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleMute();
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        nextTrack();
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        prevTrack();
      } else if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        setIsEqualizerOpen(true);
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        toggleSmartShuffle();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        setIsFullscreenPlayer(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, toggleMute, toggleSmartShuffle, setIsEqualizerOpen, setIsFullscreenPlayer, setActiveTab, seekForward, seekBackward, nextTrack, prevTrack, setVolume, volume]);

  const renderActiveView = () => {
    if (selectedArtist) {
      return <ArtistView artist={selectedArtist} onBack={() => setSelectedArtist(null)} />;
    }

    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'explore':
        return <ExploreView />;
      case 'library':
      case 'favorites':
      case 'playlists':
        return <LibraryView />;
      case 'lyrics':
        return (
          <div className="content-body" style={{ height: 'calc(100vh - 180px)' }}>
            <SyncedLyricsView track={currentTrack} />
          </div>
        );
      case 'tv-mode':
        return <TVModeView />;
      case 'remote':
        return <PhoneRemoteView />;
      case 'ai-chat':
        return <AIChatView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'social':
        return <SocialView />;
      case 'profile':
        return <ProfileView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="app-container">
      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Shell */}
      <main className="main-shell">
        <TopNav />
        {renderActiveView()}
      </main>

      {/* Floating Bottom Dock & Mini Player */}
      <FloatingDock
        onOpenMultiRoom={() => setIsMultiRoomOpen(true)}
        onOpenPhoneRemote={() => setIsPhoneRemoteOpen(true)}
      />

      {/* Overlays, Drawers & Modals */}
      <FullscreenPlayer />
      <EqualizerModal />
      <QueueDrawer />
      <MultiRoomModal isOpen={isMultiRoomOpen} onClose={() => setIsMultiRoomOpen(false)} />
      <PhoneRemoteModal isOpen={isPhoneRemoteOpen} onClose={() => setIsPhoneRemoteOpen(false)} />
      <ShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />
      <AIPlaylistModal />
      <CreatePlaylistModal />
      <AddToPlaylistModal
        track={activeTrackForPlaylist}
        isOpen={isAddToPlaylistModalOpen}
        onClose={closeAddToPlaylistModal}
      />
      <AuthModal />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <AudioProvider>
            <MainAppContent />
          </AudioProvider>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
