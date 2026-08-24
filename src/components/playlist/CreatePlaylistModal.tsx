import React, { useState } from 'react';
import { X, ListPlus, Image, Sparkles, Filter, Check } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { SmartPlaylistRule } from '../../types';

export const CreatePlaylistModal: React.FC = () => {
  const { isCreatePlaylistModalOpen, setIsCreatePlaylistModalOpen, createPlaylist, setSelectedPlaylist, setActiveTab } = useData();

  const [mode, setMode] = useState<'standard' | 'smart'>('standard');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [coverArt, setCoverArt] = useState<string>(
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80'
  );
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [isCollaborative, setIsCollaborative] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Smart Playlist Rule State
  const [ruleField, setRuleField] = useState<'rating' | 'genre' | 'energy' | 'bpm'>('rating');
  const [ruleOperator, setRuleOperator] = useState<'greater_than' | 'equals' | 'less_than'>('greater_than');
  const [ruleValue, setRuleValue] = useState<string>('4');

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
      const smartRules: SmartPlaylistRule[] = mode === 'smart' ? [
        {
          field: ruleField,
          operator: ruleOperator,
          value: ruleValue
        }
      ] : [];

      const newPl = await createPlaylist({
        title,
        description: mode === 'smart' ? `Smart Playlist (${ruleField} ${ruleOperator} ${ruleValue})` : description,
        coverArt,
        isPublic,
        isCollaborative,
        isSmart: mode === 'smart',
        smartRules,
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
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
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

        {/* Mode Selector Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <button
            type="button"
            onClick={() => setMode('standard')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '8px',
              backgroundColor: mode === 'standard' ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.05)',
              color: mode === 'standard' ? '#ffffff' : 'var(--text-muted)',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.84rem',
              cursor: 'pointer'
            }}
          >
            Standard Playlist
          </button>
          <button
            type="button"
            onClick={() => setMode('smart')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '8px',
              backgroundColor: mode === 'smart' ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.05)',
              color: mode === 'smart' ? '#ffffff' : 'var(--text-muted)',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={14} /> Smart Playlist (Rules)
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
              placeholder={mode === 'smart' ? 'e.g. Top 4-Star Favorites' : 'e.g. Midnight Highway Grooves'}
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Smart Playlist Rule Builder */}
          {mode === 'smart' && (
            <div style={{ backgroundColor: 'rgba(239, 35, 60, 0.08)', border: '1px solid rgba(239, 35, 60, 0.2)', borderRadius: '10px', padding: '14px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ef233c', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Filter size={14} /> DYNAMIC SMART RULE
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <select
                  value={ruleField}
                  onChange={e => setRuleField(e.target.value as any)}
                  style={{ backgroundColor: '#07080c', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '6px', padding: '6px' }}
                >
                  <option value="rating">Rating</option>
                  <option value="genre">Genre</option>
                  <option value="energy">Energy %</option>
                  <option value="bpm">Tempo (BPM)</option>
                </select>

                <select
                  value={ruleOperator}
                  onChange={e => setRuleOperator(e.target.value as any)}
                  style={{ backgroundColor: '#07080c', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '6px', padding: '6px' }}
                >
                  <option value="greater_than">Greater than (&gt;)</option>
                  <option value="equals">Equals (=)</option>
                  <option value="less_than">Less than (&lt;)</option>
                </select>

                <input
                  type="text"
                  value={ruleValue}
                  onChange={e => setRuleValue(e.target.value)}
                  placeholder="e.g. 4 or Rock"
                  style={{ backgroundColor: '#07080c', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '6px', padding: '6px 8px' }}
                />
              </div>
            </div>
          )}

          {/* Description */}
          {mode === 'standard' && (
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
                  minHeight: '60px',
                  resize: 'none'
                }}
                placeholder="Give your playlist a story or mood description..."
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
          )}

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
                    width: '54px',
                    height: '54px',
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

          {/* Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-play-hero"
            style={{ width: '100%', justifyContent: 'center', backgroundColor: 'var(--color-primary)', color: '#ffffff', marginTop: '10px' }}
          >
            {isSubmitting ? 'Creating...' : (mode === 'smart' ? 'Create Smart Playlist' : 'Create Playlist')}
          </button>
        </form>
      </div>
    </div>
  );
};
