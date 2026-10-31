export type UserRole = 'visitor' | 'debater' | 'moderator' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  role: UserRole;
  institution?: string;
  format_preference?: DebateFormat;
  avatar_url?: string;
  created_at: string;
}

export type DebateFormat =
  | 'British Parliamentary'
  | 'World Schools'
  | 'Asian Parliamentary'
  | 'Australs'
  | 'Public Forum'
  | 'Lincoln-Douglas'
  | 'Policy'
  | 'General';

export type DebateFormatShort = 'BP' | 'WSDC' | 'AP' | 'Australs' | 'PF' | 'LD' | 'Policy' | 'General';

export type SkillArea =
  | 'Case Building'
  | 'Rebuttal'
  | 'POIs'
  | 'Public Speaking'
  | 'Research'
  | 'Adjudication'
  | 'Argumentation'
  | 'Strategy'
  | 'Whip'
  | 'Extensions'
  | 'Weighing'
  | 'Definitions'
  | 'Motion Analysis'
  | 'Critical Thinking';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type ResourceType =
  | 'PDF'
  | 'Guide'
  | 'Video'
  | 'Template'
  | 'Paper'
  | 'Cheatsheet'
  | 'Handout'
  | 'Worksheet'
  | 'Recording'
  | 'External Link';

export type MotionType =
  | 'Policy (THW)'
  | 'Value (THBT)'
  | 'Regret (THR)'
  | 'Preference (THP)'
  | 'Actor (TH, as...)';

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  body: string;
  category: string;
  author_name: string;
  author_title: string;
  author_institution: string;
  difficulty: DifficultyLevel;
  format: DebateFormat;
  featured: boolean;
  reading_time_minutes: number;
  cover_image_url: string;
  published_at: string;
  status: 'published' | 'pending_review' | 'draft' | 'rejected';
  views_count: number;
  commentary_count: number;
  citations: string[];
  tags: string[];
  related_resource_slugs?: string[];
  related_motion_slugs?: string[];
}

export interface ResourceItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  resource_type: ResourceType;
  format: DebateFormat;
  skill_area: SkillArea;
  difficulty: DifficultyLevel;
  topic: string;
  author: string;
  source: string;
  file_url: string;
  file_size?: string;
  publication_year: number;
  downloads_count: number;
  featured: boolean;
  tags: string[];
  cover_image_url?: string;
  master_pdf_url?: string;
  sample_preview_text?: string;
  related_article_slugs?: string[];
  related_motion_slugs?: string[];
}

export interface Motion {
  id: string;
  slug: string;
  wording: string;
  info_slide?: string;
  format: DebateFormatShort;
  motion_type: MotionType;
  topic: string;
  subtopic?: string;
  difficulty: DifficultyLevel;
  tournament: string;
  year: number;
  region: string;
  round: string;
  preparation_notes?: string;
  featured: boolean;
  tags: string[];
  views_count: number;
  related_article_slugs?: string[];
  related_resource_slugs?: string[];
}

export interface GlossaryTerm {
  id: string;
  slug: string;
  term: string;
  short_definition: string;
  detailed_explanation: string;
  category: string;
  examples: string[];
  related_article_slugs?: string[];
  related_motion_slugs?: string[];
  related_resource_slugs?: string[];
}

export interface Comment {
  id: string;
  content_type: 'article' | 'resource' | 'motion';
  content_slug: string;
  parent_id?: string;
  user_id: string;
  user_name: string;
  user_role: UserRole;
  user_institution?: string;
  comment_text: string;
  created_at: string;
  status: 'approved' | 'flagged' | 'hidden';
  upvotes: number;
}

export interface CommentReport {
  id: string;
  comment_id: string;
  reported_by: string;
  reason: string;
  created_at: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

export interface ArticleSubmission {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  format: DebateFormat;
  difficulty: DifficultyLevel;
  excerpt: string;
  body: string;
  author_name: string;
  author_email: string;
  author_institution: string;
  cover_image_url?: string;
  submitted_at: string;
  status: 'pending_review' | 'approved' | 'rejected';
  editorial_notes?: string;
}

export interface SearchResultItem {
  id: string;
  type: 'article' | 'resource' | 'motion' | 'glossary';
  title: string;
  snippet: string;
  url: string;
  metadata: string;
  badge?: string;
}
