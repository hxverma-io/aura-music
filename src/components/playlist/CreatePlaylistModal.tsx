import React, { useState } from 'react';
import { X, ListPlus, Image, Sparkles } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const CreatePlaylistModal: React.FC = () => {
  const { isCreatePlaylistModalOpen, setIsCreatePlaylistModalOpen, createPlaylist, setSelectedPlaylist, setActiveTab } = useData();

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [coverArt, setCoverArt] = useState<string>(
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80'
  );
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [isCollaborative, setIsCollaborative] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isCreatePlaylistModalOpen) return null;

  const defaultCovers = [
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&auto=format&fit=crop&q=80'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const newPl = await createPlaylist({
        title,
        description,
        coverArt,
        isPublic,
        isCollaborative,
        trackIds: []
      });

      setIsCreatePlaylistModalOpen(false);
      setSelectedPlaylist(newPl);
      setActiveTab('playlists');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsCreatePlaylistModalOpen(false)}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ListPlus size={22} color="var(--color-primary)" />
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Create New Playlist</h2>
          </div>
          <button
            onClick={() => setIsCreatePlaylistModalOpen(false)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Title */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              Playlist Name *
            </label>
            <input
              type="text"
              className="search-input"
              style={{
                width: '100%',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px',
                fontSize: '0.9rem'
              }}
              placeholder="e.g. Midnight Highway Grooves"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              Description
            </label>
            <textarea
              style={{
                width: '100%',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px',
                fontSize: '0.88rem',
                color: '#ffffff',
                fontFamily: 'inherit',
                outline: 'none',
                minHeight: '70px',
                resize: 'none'
              }}
              placeholder="Give your playlist a story or mood description..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          {/* Cover Art Selection */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Select Cover Artwork
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {defaultCovers.map((c, i) => (
                <img
                  key={i}
                  src={c}
                  alt={`Cover ${i}`}
                  onClick={() => setCoverArt(c)}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: 'var(--radius-xs)',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    border: coverArt === c ? '2px solid var(--color-primary)' : '1px solid var(--border-color)',
                    transform: coverArt === c ? 'scale(1.05)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isPublic}
                onChange={e => setIsPublic(e.target.checked)}
                style={{ accentColor: 'var(--color-primary)' }}
              />
              <span>Public Playlist</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isCollaborative}
                onChange={e => setIsCollaborative(e.target.checked)}
                style={{ accentColor: 'var(--color-primary)' }}
              />
              <span>Collaborative</span>
            </label>
          </div>

          {/* Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-play-hero"
            style={{ width: '100%', justifyContent: 'center', backgroundColor: 'var(--color-primary)', color: '#ffffff' }}
          >
            {isSubmitting ? 'Creating...' : 'Create Playlist'}
          </button>
        </form>
      </div>
    </div>
  );
};
