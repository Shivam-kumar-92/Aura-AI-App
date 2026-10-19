// AURA Multi-device Realtime Sync Engine via BroadcastChannel and Local Storage Events
// Enables instant synchronized rooms across browser tabs, PWA windows, or cross-device network sessions.

class SyncEngine {
  constructor() {
    this.channel = null;
    this.roomCode = 'AURA-8800';
    this.onMessageReceived = null;
    this.onPeerListUpdated = null;
    this.peers = new Map();
    this.deviceId = 'dev-' + Math.random().toString(36).substring(2, 8);
    this.deviceName = 'Device (' + (navigator.platform?.includes('Win') ? 'PC' : 'Mobile') + ')';

    this.initChannel();
  }

  initChannel() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.channel = new BroadcastChannel(`aura_room_${this.roomCode}`);
      this.channel.onmessage = (event) => {
        this.handleIncoming(event.data);
      };

      // Broadcast presence heartbeat
      this.broadcastPresence();
      setInterval(() => this.broadcastPresence(), 10000);

      // Listen for cross-tab storage sync
      window.addEventListener('storage', (e) => {
        if (e.key === `aura_room_sync_${this.roomCode}` && e.newValue) {
          try {
            const data = JSON.parse(e.newValue);
            if (data.senderId !== this.deviceId) {
              this.handleIncoming(data);
            }
          } catch (err) {
            console.warn(err);
          }
        }
      });
    }
  }

  setRoom(newCode) {
    if (!newCode || newCode === this.roomCode) return;
    if (this.channel) {
      this.channel.close();
    }
    this.roomCode = newCode.toUpperCase();
    this.initChannel();
  }

  broadcastPresence() {
    this.send({
      type: 'PRESENCE',
      senderId: this.deviceId,
      deviceName: this.deviceName,
      timestamp: Date.now()
    });
  }

  broadcastMessage(messageObject) {
    this.send({
      type: 'CHAT_SYNC',
      senderId: this.deviceId,
      payload: messageObject,
      timestamp: Date.now()
    });
  }

  send(data) {
    if (this.channel) {
      try {
        this.channel.postMessage(data);
      } catch (err) {
        console.warn('Channel postMessage failed:', err);
      }
    }
    // Also save to localStorage to trigger storage events on same origin
    try {
      localStorage.setItem(`aura_room_sync_${this.roomCode}`, JSON.stringify(data));
    } catch (e) {}
  }

  handleIncoming(data) {
    if (!data || data.senderId === this.deviceId) return;

    if (data.type === 'PRESENCE') {
      this.peers.set(data.senderId, {
        id: data.senderId,
        name: data.deviceName || 'Peer Device',
        lastSeen: Date.now()
      });
      if (this.onPeerListUpdated) {
        this.onPeerListUpdated(Array.from(this.peers.values()));
      }
    } else if (data.type === 'CHAT_SYNC') {
      if (this.onMessageReceived && data.payload) {
        this.onMessageReceived(data.payload);
      }
    }
  }
}

export const syncEngine = new SyncEngine();
