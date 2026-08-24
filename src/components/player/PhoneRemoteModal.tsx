import React, { useState } from 'react';
import { X, Smartphone, QrCode, Copy, Check, ExternalLink, Wifi } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const PhoneRemoteModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const { setToastMessage, setActiveTab } = useData();

  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  const remoteUrl = `${currentOrigin}/#remote`;

  // Inline SVG QR Code representation
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(remoteUrl)}&color=6366f1&bgcolor=0f172a`;

  const copyLink = () => {
    navigator.clipboard.writeText(remoteUrl);
    setCopied(true);
    setToastMessage('📋 Phone Remote link copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const launchRemoteTab = () => {
    setActiveTab('remote');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px', textAlign: 'center' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Smartphone size={22} color="var(--color-primary)" />
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Connect Phone Remote</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          Scan the QR Code below with your mobile phone camera or open the link on your phone to turn it into an interactive touch controller!
        </p>

        {/* QR Code Container */}
        <div
          style={{
            backgroundColor: '#0f172a',
            border: '2px dashed var(--color-primary)',
            borderRadius: '20px',
            padding: '24px',
            display: 'inline-block',
            marginBottom: '20px',
            boxShadow: '0 10px 30px rgba(99, 102, 241, 0.2)'
          }}
        >
          <img
            src={qrSvgUrl}
            alt="Phone Remote QR Code"
            style={{ width: '180px', height: '180px', borderRadius: '12px', display: 'block', margin: '0 auto' }}
          />
        </div>

        {/* LAN Wi-Fi Connection Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '20px', color: '#10b981', fontWeight: 700, fontSize: '0.82rem' }}>
          <Wifi size={16} />
          <span>Works over local Wi-Fi & LAN tab sync</span>
        </div>

        {/* Copy Link Input */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          <input
            type="text"
            readOnly
            value={remoteUrl}
            style={{
              flex: 1,
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              padding: '10px 14px',
              borderRadius: '12px',
              fontSize: '0.82rem',
              fontWeight: 600
            }}
          />
          <button
            onClick={copyLink}
            style={{
              backgroundColor: copied ? '#10b981' : 'var(--color-primary)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '0 16px',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        {/* Interactive Mode Action */}
        <button
          onClick={launchRemoteTab}
          style={{
            width: '100%',
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)',
            padding: '12px',
            borderRadius: '14px',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <ExternalLink size={18} /> Open Interactive Remote View Here
        </button>
      </div>
    </div>
  );
};
