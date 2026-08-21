import React from 'react';
import {
  Home,
  Compass,
  Heart,
  ListMusic,
  Bot,
  BarChart3,
  Users,
  User,
  Settings,
  Play,
  Pause
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAudio } from '../../context/AudioContext';
import { ActiveTab } from '../../types';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, tracks, setSelectedPlaylist, setSelectedArtist } = useData();
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home size={19} /> },
    { id: 'explore', label: 'Explore', icon: <Compass size={19} /> },
    { id: 'favorites', label: 'Favorites', icon: <Heart size={19} /> },
    { id: 'playlists', label: 'Playlists', icon: <ListMusic size={19} /> },
    { id: 'ai-chat', label: 'AI Assistant', icon: <Bot size={19} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={19} /> },
    { id: 'social', label: 'Social Feed', icon: <Users size={19} /> },
    { id: 'profile', label: 'Profile', icon: <User size={19} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={19} /> }
  ];

  const handleNavClick = (tab: ActiveTab) => {
    setSelectedPlaylist(null);
    setSelectedArtist(null);
    setActiveTab(tab);
  };

  const continueListeningTracks = tracks.slice(0, 4);

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-logo">
        <div className="logo-badge">
          <span>AURA</span>
          <span className="logo-accent">MUSIC</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="sidebar-nav">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
              {isActive && <span className="active-dot" />}
            </button>
          );
        })}
      </nav>

      {/* Continue Listening Section */}
      <div className="sidebar-section-title">Trending Hits</div>
      <div className="continue-listening-list">
        {continueListeningTracks.map(track => {
          const isThisPlaying = currentTrack?.id === track.id && isPlaying;
          return (
            <div
              key={track.id}
              className="continue-item"
              onClick={() => playTrack(track, continueListeningTracks)}
            >
              <img
                src={track.albumArt}
                alt={track.title}
                className="continue-thumb"
              />
              <div className="continue-info">
                <div className="continue-title" title={track.title}>{track.title}</div>
                <div className="continue-artist">{track.artist}</div>
              </div>
              <button
                className="continue-play-btn"
                onClick={e => {
                  e.stopPropagation();
                  if (currentTrack?.id === track.id) {
                    togglePlay();
                  } else {
                    playTrack(track, continueListeningTracks);
                  }
                }}
                aria-label="Play track"
              >
                {isThisPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
              </button>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
