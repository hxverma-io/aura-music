import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, LogIn, UserPlus, KeyRound, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    openAuthModal,
    login,
    signup,
    googleLogin
  } = useAuth();

  const [emailOrUsername, setEmailOrUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isAuthModalOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrUsername.trim() || !password.trim()) {
      setErrorMsg('Please enter both your email/username and password.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      await login(emailOrUsername, password);
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim() || !emailOrUsername.trim() || !password.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      await signup(name, username, emailOrUsername, password);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      // Real Google Identity / Demo login flow
      await googleLogin({
        email: 'user.google@auraaudio.io',
        name: 'Google User',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
        googleId: 'google-oauth-100234'
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Google authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(`Password reset instructions sent to ${emailOrUsername || 'your email'}.`);
  };

  return (
    <div className="modal-backdrop" onClick={closeAuthModal}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
              {authModalMode === 'signin' && 'Sign in to Aura'}
              {authModalMode === 'signup' && 'Create Your Account'}
              {authModalMode === 'forgot' && 'Reset Password'}
            </h2>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {authModalMode === 'signin' && 'Access your persistent playlists, likes and personal AI mixes'}
              {authModalMode === 'signup' && 'Join the next generation audio & social experience'}
              {authModalMode === 'forgot' && 'We will send a secure token to your email'}
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Feedback alerts */}
        {errorMsg && (
          <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-xs)', backgroundColor: 'rgba(239, 35, 60, 0.15)', color: 'var(--color-primary)', fontSize: '0.84rem', marginBottom: '14px' }}>
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-xs)', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontSize: '0.84rem', marginBottom: '14px' }}>
            {successMsg}
          </div>
        )}

        {/* Continue with Google Button */}
        <button
          onClick={handleGoogleAuth}
          disabled={isSubmitting}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            width: '100%',
            padding: '11px',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: '#ffffff',
            color: '#1a1a1a',
            border: 'none',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            marginBottom: '16px',
            transition: 'all 0.2s ease'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '14px 0' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
          <span style={{ fontSize: '0.74rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>or with email</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
        </div>

        {/* Sign In Form */}
        {authModalMode === 'signin' && (
          <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Email or Username
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '10px 14px' }}>
                <Mail size={16} color="var(--text-subtle)" />
                <input
                  type="text"
                  placeholder="hv496 or email@domain.com"
                  value={emailOrUsername}
                  onChange={e => setEmailOrUsername(e.target.value)}
                  style={{ background: 'none', border: 'none', color: '#ffffff', outline: 'none', width: '100%', fontSize: '0.9rem' }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Password
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '10px 14px' }}>
                <Lock size={16} color="var(--text-subtle)" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ background: 'none', border: 'none', color: '#ffffff', outline: 'none', width: '100%', fontSize: '0.9rem' }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => openAuthModal('forgot')}
                style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.78rem', cursor: 'pointer' }}
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="btn-play-hero"
              disabled={isSubmitting}
              style={{ width: '100%', justifyContent: 'center', backgroundColor: 'var(--color-primary)', color: '#ffffff', marginTop: '6px' }}
            >
              <LogIn size={18} /> {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => openAuthModal('signup')}
                style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 700, cursor: 'pointer' }}
              >
                Sign Up Free
              </button>
            </div>
          </form>
        )}

        {/* Sign Up Form */}
        {authModalMode === 'signup' && (
          <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Full Name
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '10px 14px' }}>
                <UserIcon size={16} color="var(--text-subtle)" />
                <input
                  type="text"
                  placeholder="e.g. Jordan Smith"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{ background: 'none', border: 'none', color: '#ffffff', outline: 'none', width: '100%', fontSize: '0.9rem' }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Username
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '10px 14px' }}>
                <span style={{ color: 'var(--text-subtle)', fontSize: '0.9rem' }}>@</span>
                <input
                  type="text"
                  placeholder="jordansound"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  style={{ background: 'none', border: 'none', color: '#ffffff', outline: 'none', width: '100%', fontSize: '0.9rem' }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Email Address
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '10px 14px' }}>
                <Mail size={16} color="var(--text-subtle)" />
                <input
                  type="email"
                  placeholder="jordan@domain.com"
                  value={emailOrUsername}
                  onChange={e => setEmailOrUsername(e.target.value)}
                  style={{ background: 'none', border: 'none', color: '#ffffff', outline: 'none', width: '100%', fontSize: '0.9rem' }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Create Password
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '10px 14px' }}>
                <Lock size={16} color="var(--text-subtle)" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ background: 'none', border: 'none', color: '#ffffff', outline: 'none', width: '100%', fontSize: '0.9rem' }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-play-hero"
              disabled={isSubmitting}
              style={{ width: '100%', justifyContent: 'center', backgroundColor: 'var(--color-primary)', color: '#ffffff', marginTop: '6px' }}
            >
              <UserPlus size={18} /> {isSubmitting ? 'Creating...' : 'Create Account'}
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => openAuthModal('signin')}
                style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 700, cursor: 'pointer' }}
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* Forgot Password */}
        {authModalMode === 'forgot' && (
          <form onSubmit={handleForgot} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Enter your account Email
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '10px 14px' }}>
                <Mail size={16} color="var(--text-subtle)" />
                <input
                  type="email"
                  placeholder="user@domain.com"
                  value={emailOrUsername}
                  onChange={e => setEmailOrUsername(e.target.value)}
                  style={{ background: 'none', border: 'none', color: '#ffffff', outline: 'none', width: '100%', fontSize: '0.9rem' }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-play-hero"
              style={{ width: '100%', justifyContent: 'center', backgroundColor: 'var(--color-primary)', color: '#ffffff', marginTop: '6px' }}
            >
              <KeyRound size={18} /> Send Recovery Link
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => openAuthModal('signin')}
                style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 700, cursor: 'pointer' }}
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
