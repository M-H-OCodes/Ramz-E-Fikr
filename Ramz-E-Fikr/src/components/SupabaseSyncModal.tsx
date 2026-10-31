import React, { useState } from 'react';
import { Database, Check, Copy, ExternalLink, RefreshCw, X, Shield, Key } from 'lucide-react';
import { useDataStore } from '../services/store';

interface SupabaseSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseSyncModal: React.FC<SupabaseSyncModalProps> = ({ isOpen, onClose }) => {
  const store = useDataStore();
  const config = store.getSupabaseConfig();
  const [url, setUrl] = useState(config.url || '');
  const [anonKey, setAnonKey] = useState(config.anonKey || '');
  const [autoSync, setAutoSync] = useState(config.autoSync || false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'schema' | 'rls'>('config');
  const [saveStatus, setSaveStatus] = useState<string>('');

  if (!isOpen) return null;

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateSupabaseConfig({
      url: url.trim(),
      anonKey: anonKey.trim(),
      connected: !!(url.trim() && anonKey.trim()),
      autoSync
    });
    setSaveStatus('Configuration updated successfully.');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all local storage to the pristine Ramz-e-Fikr seed database? This will restore original articles, motions, and comments.')) {
      store.resetToDefaults();
      setSaveStatus('Database restored to default seed state.');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const sqlSchema = `-- ========================================================
-- RAMZ-E-FIKR (رمزِ فکر) SUPABASE POSTGRESQL SCHEMA
-- ========================================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'debater' CHECK (role IN ('visitor', 'debater', 'moderator', 'admin')),
  institution TEXT,
  format_preference TEXT DEFAULT 'British Parliamentary',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Articles Table
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  excerpt TEXT,
  body TEXT NOT NULL,
  category TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_title TEXT,
  author_institution TEXT,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  format TEXT NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  reading_time_minutes INT DEFAULT 5,
  cover_image_url TEXT,
  published_at DATE DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'pending_review', 'draft', 'rejected')),
  views_count INT DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  citations TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Resources Library Table
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  format TEXT NOT NULL,
  skill_area TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  topic TEXT NOT NULL,
  author TEXT NOT NULL,
  source TEXT,
  file_url TEXT NOT NULL,
  file_size TEXT,
  publication_year INT,
  downloads_count INT DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Motions Database Table
CREATE TABLE IF NOT EXISTS public.motions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  wording TEXT NOT NULL,
  info_slide TEXT,
  format TEXT NOT NULL CHECK (format IN ('BP', 'WSDC', 'AP', 'Australs', 'PF', 'LD', 'Policy', 'General')),
  motion_type TEXT NOT NULL,
  topic TEXT NOT NULL,
  subtopic TEXT,
  difficulty TEXT NOT NULL,
  tournament TEXT NOT NULL,
  year INT NOT NULL,
  region TEXT NOT NULL,
  round TEXT NOT NULL,
  preparation_notes TEXT,
  featured BOOLEAN DEFAULT FALSE,
  views_count INT DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Glossary Terms Table
CREATE TABLE IF NOT EXISTS public.glossary_terms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  term TEXT NOT NULL,
  short_definition TEXT NOT NULL,
  detailed_explanation TEXT NOT NULL,
  category TEXT NOT NULL,
  examples TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Threaded Comments Table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL CHECK (content_type IN ('article', 'resource', 'motion')),
  content_slug TEXT NOT NULL,
  parent_id UUID REFERENCES public.comments ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id),
  user_name TEXT NOT NULL,
  user_role TEXT NOT NULL DEFAULT 'debater',
  user_institution TEXT,
  comment_text TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('approved', 'flagged', 'hidden')),
  upvotes INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Community Submissions Table
CREATE TABLE IF NOT EXISTS public.article_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  category TEXT NOT NULL,
  format TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  body TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  author_institution TEXT,
  cover_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'approved', 'rejected')),
  editorial_notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);`;

  const rlsPolicies = `-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

-- Enable RLS on all tables
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.motions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.glossary_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_submissions ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policies (Zero Authentication Required)
CREATE POLICY "Public articles are readable by everyone" ON public.articles
  FOR SELECT USING (status = 'published');

CREATE POLICY "Resources are readable by everyone" ON public.resources
  FOR SELECT USING (true);

CREATE POLICY "Motions are readable by everyone" ON public.motions
  FOR SELECT USING (true);

CREATE POLICY "Glossary is readable by everyone" ON public.glossary_terms
  FOR SELECT USING (true);

CREATE POLICY "Approved comments are readable by everyone" ON public.comments
  FOR SELECT USING (status = 'approved');

-- 2. Authenticated Actions
CREATE POLICY "Authenticated users can submit comments" ON public.comments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can edit or delete their own comments" ON public.comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can submit an article for review" ON public.article_submissions
  FOR INSERT WITH CHECK (true);

-- 3. Admin / Moderator Full CRUD
CREATE POLICY "Admins have full CRUD on all content" ON public.articles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'moderator')
    )
  );`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-[#F7F3EA] border border-[#B79558] rounded-lg shadow-2xl p-6 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#D8CCBB]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#681F2B] text-[#F7F3EA] flex items-center justify-center">
              <Database className="w-5 h-5 text-[#B79558]" />
            </div>
            <div>
              <h3 className="font-editorial text-xl font-bold text-[#171717]">
                Supabase & PostgreSQL Architecture
              </h3>
              <p className="text-xs text-[#625D57]">
                Dual storage engine: Active local reactive store with live Supabase PostgreSQL sync
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[#625D57] hover:text-[#171717] rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex items-center gap-2 pt-4 pb-2 border-b border-[#D8CCBB]/60 text-xs font-medium">
          <button
            onClick={() => setActiveTab('config')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'config'
                ? 'bg-[#681F2B] text-[#F7F3EA] font-semibold'
                : 'text-[#625D57] hover:bg-[#EFE8DA]'
            }`}
          >
            Connection Settings
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'schema'
                ? 'bg-[#681F2B] text-[#F7F3EA] font-semibold'
                : 'text-[#625D57] hover:bg-[#EFE8DA]'
            }`}
          >
            PostgreSQL DDL Schema
          </button>
          <button
            onClick={() => setActiveTab('rls')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'rls'
                ? 'bg-[#681F2B] text-[#F7F3EA] font-semibold'
                : 'text-[#625D57] hover:bg-[#EFE8DA]'
            }`}
          >
            Row Level Security (RLS)
          </button>
        </div>

        {/* Content Area */}
        <div className="py-4 flex-1 overflow-y-auto">
          {activeTab === 'config' && (
            <div className="space-y-5 text-xs">
              <div className="p-3.5 rounded bg-[#EFE8DA] border border-[#D8CCBB] space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${config.connected ? 'bg-emerald-600 animate-pulse' : 'bg-[#B79558]'}`} />
                    <span className="font-semibold text-[#171717]">
                      {config.connected ? 'Supabase Cloud Database Connected' : 'Engine: Local Reactive Repository'}
                    </span>
                  </div>
                  {config.connected && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-300">
                      LIVE
                    </span>
                  )}
                </div>
                <p className="text-[#625D57] leading-relaxed">
                  {config.connected
                    ? `Active project endpoint: ${config.url}. Comments, submissions, and authentications synchronize with your Supabase cloud PostgreSQL database.`
                    : 'Ramz-e-Fikr runs with a fully initialized reactive in-browser repository containing authentic debate articles, resources, motions, and comments. Enter your Supabase credentials below to connect.'}
                </p>
              </div>

              <form onSubmit={handleSaveConfig} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-[#171717]">
                      Supabase Project URL or Project Reference ID
                    </label>
                    <span className="text-[10px] text-[#625D57]">e.g. ysgaudtjzmzwnmwbtjta</span>
                  </div>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://ysgaudtjzmzwnmwbtjta.supabase.co or ysgaudtjzmzwnmwbtjta"
                    className="w-full px-3 py-2 bg-white border border-[#D8CCBB] rounded text-[#171717] focus:border-[#681F2B] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#171717] mb-1">
                    Supabase Anon Public API Key
                  </label>
                  <input
                    type="password"
                    value={anonKey}
                    onChange={(e) => setAnonKey(e.target.value)}
                    placeholder="sb_publishable_... or eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full px-3 py-2 bg-white border border-[#D8CCBB] rounded text-[#171717] focus:border-[#681F2B] focus:outline-none font-mono text-[11px]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="autosync"
                    checked={autoSync}
                    onChange={(e) => setAutoSync(e.target.checked)}
                    className="rounded border-[#D8CCBB] text-[#681F2B] focus:ring-[#681F2B]"
                  />
                  <label htmlFor="autosync" className="text-[#171717] cursor-pointer">
                    Enable automatic push of new comments and community submissions to Supabase
                  </label>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#681F2B] hover:bg-[#48151E] text-[#F7F3EA] font-semibold rounded transition-colors text-xs cursor-pointer"
                  >
                    Save & Connect Project
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      setSaveStatus('Testing connection to Supabase...');
                      const testRes = await store.testSupabaseConnection(url.trim(), anonKey.trim());
                      setSaveStatus(testRes.message);
                    }}
                    className="px-3 py-2 bg-white hover:bg-[#D8CCBB] text-[#171717] border border-[#D8CCBB] font-semibold rounded transition-colors text-xs cursor-pointer"
                  >
                    Test Live Connection
                  </button>

                  <button
                    type="button"
                    onClick={handleResetData}
                    className="px-3 py-2 text-[#681F2B] hover:bg-[#EFE8DA] rounded border border-[#D8CCBB] transition-colors flex items-center gap-1.5 text-xs ml-auto cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Restore Seed Data</span>
                  </button>
                </div>

                {saveStatus && (
                  <div className={`p-2.5 rounded text-xs border ${
                    saveStatus.toLowerCase().includes('failed') || saveStatus.toLowerCase().includes('required')
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}>
                    {saveStatus}
                  </div>
                )}
              </form>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#625D57]">
                <span>Run this SQL script in your Supabase SQL Editor to provision tables:</span>
                <button
                  onClick={() => handleCopy(sqlSchema)}
                  className="flex items-center gap-1 text-[#681F2B] font-semibold hover:underline"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard' : 'Copy SQL Schema'}</span>
                </button>
              </div>
              <pre className="p-3 text-[11px] font-mono bg-[#171717] text-[#EFE8DA] rounded-md overflow-x-auto max-h-[350px]">
                {sqlSchema}
              </pre>
            </div>
          )}

          {activeTab === 'rls' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#625D57]">
                <span>Row Level Security (RLS) policies enforcing open reading & protected commenting:</span>
                <button
                  onClick={() => handleCopy(rlsPolicies)}
                  className="flex items-center gap-1 text-[#681F2B] font-semibold hover:underline"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard' : 'Copy RLS Policies'}</span>
                </button>
              </div>
              <pre className="p-3 text-[11px] font-mono bg-[#171717] text-[#EFE8DA] rounded-md overflow-x-auto max-h-[350px]">
                {rlsPolicies}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#D8CCBB] flex items-center justify-between text-xs text-[#625D57]">
          <span>Ramz-e-Fikr Database Architecture</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[#EFE8DA] text-[#171717] hover:bg-[#D8CCBB] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
