import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  User as UserIcon,
  Settings,
  LogOut,
  LogIn,
  UserPlus,
  X
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Genre, Mood } from '../../types';

export const TopNav: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    selectedMood,
    setSelectedMood,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    setActiveTab,
    setSelectedArtist,
    setSelectedPlaylist
  } = useData();

  const { currentUser, isAuthenticated, logout, openAuthModal } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  const categoryPills: { label: string; genre?: Genre | 'All'; mood?: Mood | 'All' }[] = [
    { label: 'All', genre: 'All', mood: 'All' },
    { label: 'Bollywood 🇮🇳', genre: 'Bollywood' as any },
    { label: 'Punjabi 🔥', genre: 'Punjabi' as any },
    { label: 'Pop 🇬🇧', genre: 'Pop' },
    { label: 'Synthwave', genre: 'Synthwave' },
    { label: 'Lo-Fi', genre: 'Lo-Fi' },
    { label: 'Rock', genre: 'Rock' },
    { label: 'Indie', genre: 'Indie' },
    { label: '❤️ Romantic', mood: 'Romantic' },
    { label: '😌 Chill', mood: 'Chill' },
    { label: '💻 Focus', mood: 'Focus' }
  ];

  // Close flyouts on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePillClick = (item: typeof categoryPills[0]) => {
    setSelectedArtist(null);
    setSelectedPlaylist(null);
    if (item.genre) {
      setSelectedGenre(item.genre);
      setSelectedMood('All');
    } else if (item.mood) {
      setSelectedMood(item.mood);
      setSelectedGenre('All');
    } else {
      setSelectedGenre('All');
      setSelectedMood('All');
    }
  };

  const isPillActive = (item: typeof categoryPills[0]) => {
    if (item.label === 'All') {
      return selectedGenre === 'All' && selectedMood === 'All';
    }
    if (item.genre) {
      return selectedGenre === item.genre;
    }
    if (item.mood) {
      return selectedMood === item.mood;
    }
    return false;
  };

  return (
    <header className="top-nav">
      {/* Search Bar Pill */}
      <div className="search-pill-container">
        <Search size={18} color="var(--text-subtle)" />
        <input
          type="text"
          className="search-input"
          placeholder="Search Hindi, Punjabi, English songs, artists..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && searchQuery.trim()) {
              setSelectedArtist(null);
              setSelectedPlaylist(null);
              setActiveTab('explore');
            }
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{ background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Category / Genre Pills */}
      <div className="category-pills">
        {categoryPills.map(pill => (
          <button
            key={pill.label}
            className={`cat-pill ${isPillActive(pill) ? 'active' : ''}`}
            onClick={() => handlePillClick(pill)}
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Right Controls */}
      <div className="top-nav-right">
        {/* Theme Toggle */}
        <button
          className="icon-circle-btn"
          onClick={toggleTheme}
          title={`Theme: ${theme}`}
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            className="icon-circle-btn"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadNotifsCount > 0 && <span className="icon-badge" />}
          </button>

          {isNotifOpen && (
            <div
              style={{
                position: 'absolute',
                top: '50px',
                right: 0,
                width: '320px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color-strong)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 60
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Notifications</span>
                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.8rem' }}
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ color: 'var(--text-subtle)', textAlign: 'center', padding: '16px 0', fontSize: '0.85rem' }}>
                    No notifications
                  </div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      style={{
                        padding: '10px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: n.read ? 'transparent' : 'rgba(239, 35, 60, 0.08)',
                        border: '1px solid var(--border-color)',
                        cursor: 'pointer',
                        display: 'flex',
                        gap: '10px'
                      }}
                    >
                      {n.avatar && (
                        <img src={n.avatar} alt="Avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>{n.title}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{n.message}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', marginTop: '4px' }}>{n.time}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Badge or Sign In / Sign Up buttons */}
        {isAuthenticated && currentUser ? (
          <div style={{ position: 'relative' }} ref={userMenuRef}>
            <div
              className="user-profile-badge"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <img
                src={currentUser.avatar || 'https://github.com/hxverma-io.png'}
                alt={currentUser.name}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://github.com/hxverma-io.png';
                }}
              />
              <span className="user-profile-name">{currentUser.name}</span>
              <ChevronDown size={15} color="var(--text-muted)" />
            </div>

            {isUserMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '46px',
                  right: 0,
                  width: '220px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color-strong)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '12px',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 60,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{ padding: '8px', borderBottom: '1px solid var(--border-color)', marginBottom: '4px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{currentUser.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>@{currentUser.username}</div>
                </div>

                <button
                  className="nav-item"
                  style={{ padding: '8px 12px', fontSize: '0.88rem' }}
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setActiveTab('profile');
                  }}
                >
                  <UserIcon size={16} /> View Profile
                </button>

                <button
                  className="nav-item"
                  style={{ padding: '8px 12px', fontSize: '0.88rem' }}
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setActiveTab('settings');
                  }}
                >
                  <Settings size={16} /> Account Settings
                </button>

                <div style={{ borderTop: '1px solid var(--border-color)', margin: '6px 0' }} />

                <button
                  className="nav-item"
                  style={{ padding: '8px 12px', fontSize: '0.88rem', color: 'var(--color-primary)' }}
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    logout();
                  }}
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => openAuthModal('signin')}
              className="btn-secondary-hero"
              style={{ padding: '7px 16px', fontSize: '0.84rem' }}
            >
              <LogIn size={15} /> Sign In
            </button>
            <button
              onClick={() => openAuthModal('signup')}
              className="btn-play-hero"
              style={{ padding: '7px 18px', fontSize: '0.84rem', backgroundColor: 'var(--color-primary)', color: '#ffffff' }}
            >
              <UserPlus size={15} /> Sign Up
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
