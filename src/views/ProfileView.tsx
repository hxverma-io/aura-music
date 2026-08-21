import React, { useState } from 'react';
import { User as UserIcon, Edit3, Heart, ListMusic, Users, Clock, Check, Sparkles, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useAudio } from '../context/AudioContext';
import { Genre } from '../types';

export const ProfileView: React.FC = () => {
  const { currentUser, updateProfile, openAuthModal, isAuthenticated } = useAuth();
  const { tracks, playlists, setSelectedPlaylist, setActiveTab, likedTracks } = useData();
  const { playTrack } = useAudio();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [name, setName] = useState<string>(currentUser?.name || '');
  const [username, setUsername] = useState<string>(currentUser?.username || '');
  const [bio, setBio] = useState<string>(currentUser?.bio || '');
  const [avatar, setAvatar] = useState<string>(currentUser?.avatar || '');
  const [favoriteGenres, setFavoriteGenres] = useState<Genre[]>(currentUser?.favoriteGenres || []);

  const allGenres: Genre[] = ['Bollywood' as any, 'Punjabi' as any, 'Pop', 'Synthwave', 'Rock', 'Electronic', 'Lo-Fi', 'Indie', 'Acoustic'];

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="content-body" style={{ textAlign: 'center', padding: '80px 20px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ padding: '20px', borderRadius: '50%', backgroundColor: 'rgba(239, 35, 60, 0.15)', color: 'var(--color-primary)', width: 'fit-content', margin: '0 auto 20px auto' }}>
          <UserIcon size={44} />
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Your Profile Studio</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', margin: '10px 0 24px 0' }}>
          Sign in or create a free account to customize your profile, sync your playlists, and track personal music analytics.
        </p>
        <button
          onClick={() => openAuthModal('signin')}
          className="btn-play-hero"
          style={{ padding: '12px 28px', fontSize: '0.92rem', backgroundColor: 'var(--color-primary)', color: '#ffffff', margin: '0 auto' }}
        >
          <LogIn size={18} /> Sign In / Create Account
        </button>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name,
      username,
      bio,
      avatar,
      favoriteGenres
    });
    setIsEditing(false);
  };

  const toggleGenre = (genre: Genre) => {
    if (favoriteGenres.includes(genre)) {
      setFavoriteGenres(prev => prev.filter(g => g !== genre));
    } else {
      setFavoriteGenres(prev => [...prev, genre]);
    }
  };

  const userPlaylists = playlists.filter(p => p.creatorId === currentUser.id || (p as any).user_id === currentUser.id);

  return (
    <div className="content-body">
      {/* Profile Banner */}
      <div
        style={{
          display: 'flex',
          gap: '32px',
          alignItems: 'center',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: '32px',
          position: 'relative'
        }}
      >
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          style={{ width: '110px', height: '110px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color-primary)' }}
        />

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>{currentUser.name}</h1>
            <span style={{ fontSize: '0.88rem', color: 'var(--text-subtle)' }}>@{currentUser.username}</span>
          </div>

          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginTop: '6px', maxWidth: '600px' }}>
            {currentUser.bio || 'Music listener and curator on Aura Platform.'}
          </p>

          <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '0.88rem', color: 'var(--text-main)' }}>
            <span><strong>{(currentUser.followedUserIds?.length || 0)}</strong> <span style={{ color: 'var(--text-muted)' }}>Followers</span></span>
            <span><strong>{(currentUser.followedArtistIds?.length || 0) + (currentUser.followedUserIds?.length || 0)}</strong> <span style={{ color: 'var(--text-muted)' }}>Following</span></span>
            <span><strong>{likedTracks.length}</strong> <span style={{ color: 'var(--text-muted)' }}>Liked Songs</span></span>
          </div>
        </div>

        <button
          className="btn-secondary-hero"
          onClick={() => setIsEditing(!isEditing)}
          style={{ alignSelf: 'flex-start' }}
        >
          <Edit3 size={16} /> {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {/* Profile Edit Form */}
      {isEditing && (
        <form
          onSubmit={handleSave}
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--color-primary)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            animation: 'slideUp 0.2s ease'
          }}
        >
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Edit Account Profile</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Display Name
              </label>
              <input
                type="text"
                className="search-input"
                style={{ width: '100%', backgroundColor: 'var(--bg-surface)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Username
              </label>
              <input
                type="text"
                className="search-input"
                style={{ width: '100%', backgroundColor: 'var(--bg-surface)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              Bio Description
            </label>
            <textarea
              style={{ width: '100%', backgroundColor: 'var(--bg-surface)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', color: '#ffffff', outline: 'none', resize: 'none', minHeight: '60px' }}
              value={bio}
              onChange={e => setBio(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              Avatar Image URL
            </label>
            <input
              type="text"
              className="search-input"
              style={{ width: '100%', backgroundColor: 'var(--bg-surface)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
              value={avatar}
              onChange={e => setAvatar(e.target.value)}
            />
          </div>

          {/* Favorite Genres Selection */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
              Favorite Genres for AI Personalization
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {allGenres.map(genre => {
                const isSelected = favoriteGenres.includes(genre);
                return (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => toggleGenre(genre)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-pill)',
                      backgroundColor: isSelected ? 'var(--color-primary)' : 'var(--bg-surface)',
                      color: isSelected ? '#ffffff' : 'var(--text-muted)',
                      border: '1px solid ' + (isSelected ? 'var(--color-primary)' : 'var(--border-color)'),
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      fontWeight: 600
                    }}
                  >
                    {isSelected ? '✓ ' : ''}{genre}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <button type="button" className="btn-secondary-hero" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-play-hero" style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}>
              Save Profile Changes
            </button>
          </div>
        </form>
      )}

      {/* User's Created Playlists */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h2 className="section-title">Created & Curated Playlists</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
          {userPlaylists.length === 0 ? (
            <div style={{ color: 'var(--text-subtle)', padding: '20px 0' }}>
              No playlists created yet. Click "+ New Playlist" to start curating.
            </div>
          ) : (
            userPlaylists.map(pl => (
              <div
                key={pl.id}
                onClick={() => {
                  setSelectedPlaylist(pl);
                  setActiveTab('playlists');
                }}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px',
                  cursor: 'pointer'
                }}
              >
                <img src={pl.coverArt || (pl as any).cover_art || pl.tracks?.[0]?.albumArt || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80'} alt={pl.title} style={{ width: '100%', height: '140px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                <div style={{ fontWeight: 800, fontSize: '0.95rem', marginTop: '8px', color: 'var(--text-main)' }}>{pl.title}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{pl.tracks?.length || pl.trackIds?.length || 0} Songs</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
