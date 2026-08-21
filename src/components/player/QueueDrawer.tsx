import React from 'react';
import { X, Trash2, Play, Music, ListPlus } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

export const QueueDrawer: React.FC = () => {
  const {
    isQueueOpen,
    setIsQueueOpen,
    queue,
    queueIndex,
    currentTrack,
    playTrack,
    removeFromQueue,
    clearQueue
  } = useAudio();

  if (!isQueueOpen) return null;

  return (
    <div className="modal-backdrop" onClick={() => setIsQueueOpen(false)}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '480px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Now Playing Queue</h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{queue.length} Tracks in Line</div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {queue.length > 0 && (
              <button
                onClick={clearQueue}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.82rem',
                  fontWeight: 600
                }}
              >
                <Trash2 size={15} /> Clear
              </button>
            )}
            <button
              onClick={() => setIsQueueOpen(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tracks List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {queue.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-subtle)', padding: '40px 0' }}>
              Queue is empty. Pick a song to begin.
            </div>
          ) : (
            queue.map((track, idx) => {
              const isCurrent = currentTrack?.id === track.id;
              return (
                <div
                  key={`${track.id}-${idx}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isCurrent ? 'rgba(239, 35, 60, 0.12)' : 'var(--bg-surface)',
                    border: '1px solid ' + (isCurrent ? 'var(--color-primary)' : 'var(--border-color)'),
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: isCurrent ? 'var(--color-primary)' : 'var(--text-subtle)', minWidth: '18px' }}>
                    {idx + 1}
                  </span>

                  <img
                    src={track.albumArt}
                    alt={track.title}
                    style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-xs)', objectFit: 'cover' }}
                  />

                  <div
                    style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}
                    onClick={() => playTrack(track, queue)}
                  >
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: isCurrent ? 'var(--color-primary)' : 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {track.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {track.artist}
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromQueue(idx)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-subtle)',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                    title="Remove from queue"
                  >
                    <X size={16} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
