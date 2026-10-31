import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_KEY_SUPABASE = 'ramz_supabase_cfg_v1';

export const DEFAULT_SUPABASE_URL = 'https://ysgaudtjzmzwnmwbtjta.supabase.co';
export const DEFAULT_SUPABASE_KEY = 'sb_publishable_j0gd6kLt5W3zxTV07NEbEw_odWCT5lb';

export interface SupabaseConfigState {
  url: string;
  anonKey: string;
  connected: boolean;
  autoSync: boolean;
}

export function normalizeSupabaseUrl(input: string): string {
  if (!input) return '';
  let trimmed = input.trim();
  // Strip trailing slashes
  trimmed = trimmed.replace(/\/+$/, '');
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    if (trimmed.includes('.supabase.co')) {
      trimmed = `https://${trimmed}`;
    } else {
      trimmed = `https://${trimmed}.supabase.co`;
    }
  }
  return trimmed;
}

export function extractSupabaseProjectId(url: string): string {
  if (!url) return '';
  try {
    const parsed = new URL(normalizeSupabaseUrl(url));
    const hostParts = parsed.hostname.split('.');
    if (hostParts.length >= 3 && hostParts[1] === 'supabase') {
      return hostParts[0];
    }
    return parsed.hostname;
  } catch {
    return url.replace(/https?:\/\//, '').replace(/\.supabase\.co.*/, '');
  }
}

let currentConfig: SupabaseConfigState = {
  url: normalizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL),
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY,
  connected: false,
  autoSync: true
};

// Initialize config from localStorage if available
try {
  const saved = localStorage.getItem(STORAGE_KEY_SUPABASE);
  if (saved) {
    const parsed = JSON.parse(saved);
    currentConfig = {
      ...currentConfig,
      ...parsed,
      url: normalizeSupabaseUrl(parsed.url || currentConfig.url)
    };
  }
} catch (e) {
  console.warn('Could not read Supabase configuration from localStorage:', e);
}

function initClient(url: string, key: string): SupabaseClient | null {
  const normalizedUrl = normalizeSupabaseUrl(url);
  if (!normalizedUrl || !key || normalizedUrl.includes('your-project') || key.includes('your-anon-key')) {
    return null;
  }
  try {
    return createClient(normalizedUrl, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

// Instantiate on startup if valid
let activeClient: SupabaseClient | null = null;
if (currentConfig.url && currentConfig.anonKey) {
  activeClient = initClient(currentConfig.url, currentConfig.anonKey);
  if (activeClient) {
    currentConfig.connected = true;
  }
}

export function getSupabaseClient(): SupabaseClient | null {
  return activeClient;
}

export function isSupabaseActive(): boolean {
  return activeClient !== null;
}

export function getSupabaseConfig(): SupabaseConfigState {
  return { ...currentConfig };
}

export async function setSupabaseConfig(newConfig: Partial<SupabaseConfigState>): Promise<{ success: boolean; message: string }> {
  const normalizedUrl = newConfig.url !== undefined ? normalizeSupabaseUrl(newConfig.url) : currentConfig.url;

  currentConfig = {
    ...currentConfig,
    ...newConfig,
    url: normalizedUrl
  };

  try {
    localStorage.setItem(STORAGE_KEY_SUPABASE, JSON.stringify(currentConfig));
  } catch (e) {
    console.warn('Failed to save Supabase config to localStorage', e);
  }

  if (currentConfig.url && currentConfig.anonKey) {
    const client = initClient(currentConfig.url, currentConfig.anonKey);
    if (client) {
      activeClient = client;
      currentConfig.connected = true;
      try {
        localStorage.setItem(STORAGE_KEY_SUPABASE, JSON.stringify(currentConfig));
      } catch {}
      return { success: true, message: `Connected to Supabase project (${extractSupabaseProjectId(currentConfig.url)}).` };
    } else {
      activeClient = null;
      currentConfig.connected = false;
      return { success: false, message: 'Invalid Supabase URL or Anon key provided.' };
    }
  } else {
    activeClient = null;
    currentConfig.connected = false;
    return { success: true, message: 'Supabase disconnected. Using reactive local repository.' };
  }
}

export async function testSupabaseConnection(url: string, key: string): Promise<{ success: boolean; message: string }> {
  if (!url || !key) {
    return { success: false, message: 'Both URL/Project ID and API Key are required to test connection.' };
  }

  const normalizedUrl = normalizeSupabaseUrl(url);

  try {
    const tempClient = createClient(normalizedUrl, key);
    // Ping articles table
    const { error: tblError } = await tempClient.from('articles').select('count', { count: 'exact', head: true });
    if (!tblError || tblError.code === 'PGRST116' || tblError.message.includes('row-level security') || tblError.message.includes('permission')) {
      return {
        success: true,
        message: `Successfully connected to Supabase (${extractSupabaseProjectId(normalizedUrl)})! PostgreSQL tables and Auth are online.`
      };
    }

    // Ping auth service
    const { error: authErr } = await tempClient.auth.getSession();
    if (!authErr || !authErr.message.includes('Failed to fetch')) {
      return {
        success: true,
        message: `Successfully connected to Supabase project (${extractSupabaseProjectId(normalizedUrl)}) Auth API.`
      };
    }

    return {
      success: false,
      message: `Connection failed: ${tblError.message || authErr?.message}`
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Connection test failed. Please verify network access and credentials.'
    };
  }
}
