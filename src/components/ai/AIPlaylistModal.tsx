import React, { useState } from 'react';
import { X, Sparkles, Wand2, Music, Check, Play } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useData } from '../../context/DataContext';
import { useAudio } from '../../context/AudioContext';
import { useAuth } from '../../context/AuthContext';
import { aiMusicService } from '../../services/aiService';
import { Playlist, Track } from '../../types';

export const AIPlaylistModal: React.FC = () => {
  const { isAiPlaylistModalOpen, setIsAiPlaylistModalOpen, tracks, createPlaylist, setSelectedPlaylist, setActiveTab } = useData();
  const { playTrack } = useAudio();
  const { currentUser } = useAuth();

  const [prompt, setPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedPlaylist, setGeneratedPlaylist] = useState<Playlist | null>(null);

  if (!isAiPlaylistModalOpen) return null;

  const quickPrompts = [
    '🇮🇳 Romantic Bollywood & Acoustic Melodies with Arijit Singh',
    '🔥 High Octane Punjabi Workout Hits with AP Dhillon',
    '💻 1 Hour Late Night Deep Coding Mix with Lo-Fi & Synth',
    '😌 Rainy Day Coffee Shop Study Session with Jazz Rhodes',
    '🎉 Global Pop & Synthwave Nightclub Party'
  ];

  const handleGenerate = (targetPrompt?: string) => {
    const textToUse = targetPrompt || prompt;
    if (!textToUse.trim()) return;

    setIsGenerating(true);
    setGeneratedPlaylist(null);

    setTimeout(() => {
      const pl = aiMusicService.generatePlaylistFromPrompt(textToUse, tracks, currentUser);
      setGeneratedPlaylist(pl);
      setIsGenerating(false);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }, 600);
  };

  const handleSaveAndPlay = async (playNow: boolean) => {
    if (!generatedPlaylist) return;
    const saved = await createPlaylist(generatedPlaylist);
    const plTracks = (saved.tracks && saved.tracks.length > 0) ? saved.tracks : tracks.filter(t => (saved.trackIds || []).includes(t.id));
    if (playNow && plTracks.length > 0) {
      playTrack(plTracks[0], plTracks);
    }
    setSelectedPlaylist(saved);
    setIsAiPlaylistModalOpen(false);
    setActiveTab('playlists');
  };

  const playlistTracks: Track[] = generatedPlaylist
    ? ((generatedPlaylist.tracks && generatedPlaylist.tracks.length > 0) ? generatedPlaylist.tracks : tracks.filter(t => generatedPlaylist.trackIds.includes(t.id)))
    : [];

  return (
    <div className="modal-backdrop" onClick={() => setIsAiPlaylistModalOpen(false)}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '50%', backgroundColor: 'rgba(239, 35, 60, 0.15)', color: 'var(--color-primary)' }}>
              <Wand2 size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>AI Playlist Generator</h2>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Describe your exact mood, activity or vibe</div>
            </div>
          </div>
          <button
            onClick={() => setIsAiPlaylistModalOpen(false)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Prompt Input Form */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <input
            type="text"
            className="search-input"
            style={{
              flex: 1,
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color-strong)',
              borderRadius: 'var(--radius-pill)',
              padding: '12px 20px',
              fontSize: '0.92rem'
            }}
            placeholder="e.g. Hindi romantic hits or focus lo-fi coding..."
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleGenerate()}
          />
          <button
            className="btn-play-hero"
            style={{ padding: '10px 22px', backgroundColor: 'var(--color-primary)', color: '#ffffff' }}
            onClick={() => handleGenerate()}
            disabled={isGenerating}
          >
            {isGenerating ? <Sparkles className="spin" size={18} /> : <Wand2 size={18} />}
            <span>{isGenerating ? 'Synthesizing...' : 'Generate'}</span>
          </button>
        </div>

        {/* Quick Inspiration Chips */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '8px' }}>
            Quick Prompts
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPrompt(p);
                  handleGenerate(p);
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-muted)',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Generated Result Preview */}
        {generatedPlaylist && (
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--color-primary)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              animation: 'slideUp 0.3s ease'
            }}
          >
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
              <img
                src={generatedPlaylist.coverArt}
                alt="Cover"
                style={{ width: '70px', height: '70px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>{generatedPlaylist.title}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>{generatedPlaylist.description}</p>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 600, marginTop: '4px' }}>
                  {playlistTracks.length} Selected Tracks
                </div>
              </div>
            </div>

            {/* Track previews */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '160px', overflowY: 'auto', marginBottom: '16px' }}>
              {playlistTracks.map((t, idx) => (
                <div
                  key={t.id || idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: 'var(--bg-card)',
                    fontSize: '0.84rem'
                  }}
                >
                  <span style={{ color: 'var(--text-subtle)', minWidth: '16px' }}>{idx + 1}</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{t.title}</span>
                  <span style={{ color: 'var(--text-muted)' }}>• {t.artist}</span>
                  <span style={{ marginLeft: 'auto', color: 'var(--color-primary)', fontSize: '0.76rem', fontWeight: 600 }}>{t.genre}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                className="btn-secondary-hero"
                onClick={() => handleSaveAndPlay(false)}
                style={{ fontSize: '0.85rem', padding: '8px 18px' }}
              >
                <Check size={16} /> Save to Library
              </button>
              <button
                className="btn-play-hero"
                onClick={() => handleSaveAndPlay(true)}
                style={{ fontSize: '0.85rem', padding: '8px 20px', backgroundColor: 'var(--color-primary)', color: '#ffffff' }}
              >
                <Play size={16} fill="currentColor" /> Save & Play Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
