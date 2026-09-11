import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { UserProfile, LeaderboardEntry, MatchHistoryRecord, RacerProgress, DailyMission, Achievement } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

// Realtime channels cache
const activeChannels: Map<string, RealtimeChannel> = new Map();

// Cloud broadcast channels using BroadcastChannel API or Supabase Realtime
export class CloudSyncEngine {
  private static instance: CloudSyncEngine;
  private bc: BroadcastChannel | null = null;
  private subscribers: Map<string, Set<(data: unknown) => void>> = new Map();

  private constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.bc = new BroadcastChannel('mongoltype_realtime_network');
      this.bc.onmessage = (event) => {
        const { topic, payload } = event.data;
        if (this.subscribers.has(topic)) {
          this.subscribers.get(topic)?.forEach(callback => callback(payload));
        }
      };
    }
  }

  public static getInstance(): CloudSyncEngine {
    if (!CloudSyncEngine.instance) {
      CloudSyncEngine.instance = new CloudSyncEngine();
    }
    return CloudSyncEngine.instance;
  }

  public subscribe(topic: string, callback: (data: unknown) => void): () => void {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, new Set());
    }
    this.subscribers.get(topic)?.add(callback);

    // If Supabase is configured, also subscribe to postgres_changes / broadcast
    if (supabase) {
      const channelName = `topic:${topic}`;
      let channel = activeChannels.get(channelName);
      if (!channel) {
        channel = supabase.channel(channelName);
        channel
          .on('broadcast', { event: 'update' }, (payload) => {
            callback(payload.payload);
          })
          .subscribe();
        activeChannels.set(channelName, channel);
      }
    }

    return () => {
      this.subscribers.get(topic)?.delete(callback);
    };
  }

  public broadcast(topic: string, payload: unknown) {
    // 1. Local window listeners
    if (this.subscribers.has(topic)) {
      this.subscribers.get(topic)?.forEach(cb => cb(payload));
    }

    // 2. BroadcastChannel for cross-tab sync
    if (this.bc) {
      try {
        this.bc.postMessage({ topic, payload });
      } catch (err) {
        console.error('BroadcastChannel error:', err);
      }
    }

    // 3. Supabase Realtime broadcast for internet-wide multiplayer
    if (supabase) {
      const channelName = `topic:${topic}`;
      const channel = activeChannels.get(channelName) || supabase.channel(channelName);
      channel.send({
        type: 'broadcast',
        event: 'update',
        payload,
      });
    }
  }
}

export const cloudSync = CloudSyncEngine.getInstance();
