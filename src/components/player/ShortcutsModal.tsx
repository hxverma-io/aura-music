import React from 'react';
import { X, Command, Keyboard } from 'lucide-react';

export const ShortcutsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Space', desc: 'Play / Pause Track' },
    { key: 'ArrowRight / L', desc: 'Seek Forward 10 Seconds' },
    { key: 'ArrowLeft / J', desc: 'Seek Backward 10 Seconds' },
    { key: 'ArrowUp / Down', desc: 'Volume Up / Volume Down (10%)' },
    { key: 'N / P', desc: 'Next Track / Previous Track' },
    { key: 'M', desc: 'Mute / Unmute Audio Output' },
    { key: 'F', desc: 'Toggle Fullscreen Cinematic View' },
    { key: 'E', desc: 'Open Parametric 10-31 Band EQ' },
    { key: 'S', desc: 'Toggle Smart Intelligent Shuffle' }
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: '#0d0f17',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px',
          width: '100%',
          maxWidth: '520px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Keyboard size={22} color="#ef233c" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              Global Keyboard Shortcuts
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Shortcuts List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {shortcuts.map((sc, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 12px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.04)'
              }}
            >
              <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                {sc.desc}
              </span>
              <kbd
                style={{
                  backgroundColor: '#07080c',
                  color: '#ef233c',
                  border: '1px solid rgba(239, 35, 60, 0.3)',
                  borderRadius: '6px',
                  padding: '3px 8px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  fontFamily: 'monospace'
                }}
              >
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
