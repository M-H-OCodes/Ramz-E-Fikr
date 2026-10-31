export const SUPABASE_POSTGRES_SCHEMA = `-- ============================================================
-- RAMZ-E-FIKR (رمزِ فکر) — PRODUCTION SUPABASE POSTGRESQL SCHEMA
-- Generated for Open-Access Intellectual Publication & Knowledge Archive
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES & USERS
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT NOT NULL,
  institution TEXT,
  role TEXT NOT NULL DEFAULT 'debater' CHECK (role IN ('visitor', 'debater', 'moderator', 'admin')),
  avatar_url TEXT,
  format_preference TEXT DEFAULT 'British Parliamentary',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ARTICLES TABLE
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  body TEXT NOT NULL,
  category TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_institution TEXT NOT NULL,
  author_bio TEXT,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  debate_format TEXT NOT NULL,
  reading_time_minutes INTEGER NOT NULL DEFAULT 5,
  cover_image_url TEXT,
  published_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending_review' CHECK (status IN ('published', 'pending_review', 'draft', 'rejected')),
  featured BOOLEAN DEFAULT FALSE,
  views_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  reference_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RESOURCES TABLE
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  format TEXT NOT NULL,
  skill_area TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  topic TEXT NOT NULL,
  author TEXT NOT NULL,
  source TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size TEXT NOT NULL,
  publication_year INTEGER NOT NULL,
  download_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  pdf_pages TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. MOTIONS TABLE
CREATE TABLE IF NOT EXISTS public.motions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  wording TEXT NOT NULL,
  info_slide TEXT,
  format TEXT NOT NULL,
  motion_type TEXT NOT NULL,
  topic TEXT NOT NULL,
  subtopic TEXT,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  tournament TEXT NOT NULL,
  year INTEGER NOT NULL,
  region TEXT NOT NULL,
  round TEXT NOT NULL,
  source TEXT NOT NULL,
  preparation_notes TEXT,
  featured BOOLEAN DEFAULT FALSE,
  views_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. GLOSSARY TERMS
CREATE TABLE IF NOT EXISTS public.glossary_terms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  term TEXT NOT NULL,
  short_definition TEXT NOT NULL,
  detailed_explanation TEXT NOT NULL,
  category TEXT NOT NULL,
  related_article_slugs TEXT[] DEFAULT '{}',
  related_motion_slugs TEXT[] DEFAULT '{}',
  related_resource_slugs TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. COMMENTS TABLE
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  content_type TEXT NOT NULL CHECK (content_type IN ('article', 'resource', 'motion')),
  content_id TEXT NOT NULL,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_role TEXT NOT NULL DEFAULT 'debater',
  user_institution TEXT,
  comment_text TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('approved', 'flagged', 'hidden')),
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. COMMENT REPORTS
CREATE TABLE IF NOT EXISTS public.comment_reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  reported_by TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES FOR INSTANT RETRIEVAL
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status);
CREATE INDEX IF NOT EXISTS idx_resources_slug ON public.resources(slug);
CREATE INDEX IF NOT EXISTS idx_resources_format ON public.resources(format);
CREATE INDEX IF NOT EXISTS idx_motions_slug ON public.motions(slug);
CREATE INDEX IF NOT EXISTS idx_motions_format ON public.motions(format);
CREATE INDEX IF NOT EXISTS idx_motions_topic ON public.motions(topic);
CREATE INDEX IF NOT EXISTS idx_comments_content ON public.comments(content_type, content_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.motions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.glossary_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_reports ENABLE ROW LEVEL SECURITY;

-- Public can read all published articles, resources, motions, glossary
CREATE POLICY "Public articles access" ON public.articles FOR SELECT USING (status = 'published');
CREATE POLICY "Public resources access" ON public.resources FOR SELECT USING (true);
CREATE POLICY "Public motions access" ON public.motions FOR SELECT USING (true);
CREATE POLICY "Public glossary access" ON public.glossary_terms FOR SELECT USING (true);
CREATE POLICY "Public approved comments" ON public.comments FOR SELECT USING (status != 'hidden');

-- Authenticated users can insert comments and submit articles
CREATE POLICY "Auth users post comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Auth users submit articles" ON public.articles FOR INSERT WITH CHECK (status = 'pending_review');

-- Users can delete only their own comments
CREATE POLICY "Users delete own comments" ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- Admins full access policy (checks profile role = 'admin')
CREATE POLICY "Admin full articles" ON public.articles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
`;
