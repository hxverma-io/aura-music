export interface RemoteState {
  currentTrack: any | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  activeEQPreset: string;
  queue: any[];
  timestamp: number;
}

export type RemoteCommandType =
  | 'PLAY'
  | 'PAUSE'
  | 'TOGGLE_PLAY'
  | 'NEXT'
  | 'PREV'
  | 'SEEK'
  | 'SET_VOLUME'
  | 'SET_EQ'
  | 'PLAY_TRACK'
  | 'TRIGGER_AI_DJ';

export interface RemoteCommandPayload {
  command: RemoteCommandType;
  value?: any;
}

class RemoteSyncService {
  private channel: BroadcastChannel | null = null;
  private stateListeners: ((state: RemoteState) => void)[] = [];
  private commandListeners: ((cmd: RemoteCommandPayload) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('aura_music_remote_channel');
        this.channel.onmessage = (event) => {
          if (event.data?.type === 'STATE_UPDATE') {
            this.notifyStateListeners(event.data.payload);
          } else if (event.data?.type === 'COMMAND') {
            this.notifyCommandListeners(event.data.payload);
          }
        };
      } catch (e) {
        console.warn('BroadcastChannel fallback:', e);
      }
    }

    // Storage fallback for cross-tab cross-window
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === 'aura_remote_state' && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            this.notifyStateListeners(parsed);
          } catch (err) {}
        } else if (e.key === 'aura_remote_cmd' && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            this.notifyCommandListeners(parsed);
          } catch (err) {}
        }
      });
    }
  }

  public broadcastState(state: RemoteState) {
    const data = { ...state, timestamp: Date.now() };
    try {
      if (this.channel) {
        this.channel.postMessage({ type: 'STATE_UPDATE', payload: data });
      }
      localStorage.setItem('aura_remote_state', JSON.stringify(data));
    } catch (e) {}
  }

  public sendCommand(cmd: RemoteCommandType, value?: any) {
    const payload: RemoteCommandPayload = { command: cmd, value };
    try {
      if (this.channel) {
        this.channel.postMessage({ type: 'COMMAND', payload });
      }
      localStorage.setItem('aura_remote_cmd', JSON.stringify({ ...payload, _t: Date.now() }));
    } catch (e) {}
  }

  public onStateUpdate(callback: (state: RemoteState) => void) {
    this.stateListeners.push(callback);
    return () => {
      this.stateListeners = this.stateListeners.filter(l => l !== callback);
    };
  }

  public onCommand(callback: (cmd: RemoteCommandPayload) => void) {
    this.commandListeners.push(callback);
    return () => {
      this.commandListeners = this.commandListeners.filter(l => l !== callback);
    };
  }

  private notifyStateListeners(state: RemoteState) {
    this.stateListeners.forEach(fn => fn(state));
  }

  private notifyCommandListeners(cmd: RemoteCommandPayload) {
    this.commandListeners.forEach(fn => fn(cmd));
  }
}

export const remoteSyncService = new RemoteSyncService();
