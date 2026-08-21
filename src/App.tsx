import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { AudioProvider } from './context/AudioContext';

import { Sidebar } from './components/layout/Sidebar';
import { TopNav } from './components/layout/TopNav';
import { FloatingDock } from './components/layout/FloatingDock';

import { FullscreenPlayer } from './components/player/FullscreenPlayer';
import { EqualizerModal } from './components/player/EqualizerModal';
import { QueueDrawer } from './components/player/QueueDrawer';

import { AIPlaylistModal } from './components/ai/AIPlaylistModal';
import { CreatePlaylistModal } from './components/playlist/CreatePlaylistModal';
import { AddToPlaylistModal } from './components/playlist/AddToPlaylistModal';
import { AuthModal } from './components/auth/AuthModal';

import { HomeView } from './views/HomeView';
import { ExploreView } from './views/ExploreView';
import { LibraryView } from './views/LibraryView';
import { AIChatView } from './views/AIChatView';
import { AnalyticsView } from './views/AnalyticsView';
import { SocialView } from './views/SocialView';
import { ProfileView } from './views/ProfileView';
import { SettingsView } from './views/SettingsView';
import { ArtistView } from './views/ArtistView';

const MainAppContent: React.FC = () => {
  const { activeTab, selectedArtist, setSelectedArtist, activeTrackForPlaylist, isAddToPlaylistModalOpen, closeAddToPlaylistModal } = useData();

  const renderActiveView = () => {
    if (selectedArtist) {
      return <ArtistView artist={selectedArtist} onBack={() => setSelectedArtist(null)} />;
    }

    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'explore':
        return <ExploreView />;
      case 'favorites':
      case 'playlists':
        return <LibraryView />;
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
      <FloatingDock />

      {/* Overlays, Drawers & Modals */}
      <FullscreenPlayer />
      <EqualizerModal />
      <QueueDrawer />
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
