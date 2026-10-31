import { useState, useEffect } from 'react';
import {
  Article,
  ResourceItem,
  Motion,
  GlossaryTerm,
  Comment,
  CommentReport,
  ArticleSubmission,
  UserProfile,
  UserRole,
  SearchResultItem,
  DebateFormat,
  DifficultyLevel,
  ResourceType,
  MotionType
} from '../types';
import {
  SEED_ARTICLES,
  SEED_RESOURCES,
  SEED_MOTIONS,
  SEED_GLOSSARY_TERMS,
  SEED_COMMENTS,
  SEED_SUBMISSIONS
} from '../data/seedData';
import {
  getSupabaseClient,
  isSupabaseActive,
  getSupabaseConfig,
  setSupabaseConfig,
  testSupabaseConnection,
  SupabaseConfigState
} from './supabase';

const STORAGE_KEYS = {
  ARTICLES: 'ramz_articles_v1',
  RESOURCES: 'ramz_resources_v1',
  MOTIONS: 'ramz_motions_v1',
  GLOSSARY: 'ramz_glossary_v1',
  COMMENTS: 'ramz_comments_v1',
  REPORTS: 'ramz_reports_v1',
  SUBMISSIONS: 'ramz_submissions_v1',
  CURRENT_USER: 'ramz_user_v1',
  ACCOUNTS: 'ramz_accounts_v1',
  ASSIGNED_ADMINS: 'ramz_assigned_admins_v1'
};

export const ROOT_ADMIN_EMAIL = 'muhammadhadi.officialwork@gmail.com';

export interface UserAccount {
  id: string;
  email: string;
  passwordHash: string; // Plain/hash for simulated verification
  display_name: string;
  role: UserRole;
  institution?: string;
  format_preference?: DebateFormat;
  created_at: string;
}

const SEED_ACCOUNTS: UserAccount[] = [
  {
    id: 'usr-root-admin',
    email: ROOT_ADMIN_EMAIL,
    passwordHash: 'admin2026',
    display_name: 'Muhammad Hadi (Administrator)',
    role: 'admin',
    institution: 'Ramz-e-Fikr Editorial Board',
    format_preference: 'British Parliamentary',
    created_at: '2026-08-01T00:00:00Z'
  },
  {
    id: 'usr-debater',
    email: 'parlimentarian75@gmail.com',
    passwordHash: 'password123',
    display_name: 'Mirza Ghalib',
    role: 'debater',
    institution: 'Lahore Debating Guild',
    format_preference: 'British Parliamentary',
    created_at: '2026-09-01T00:00:00Z'
  }
];

class DataStoreService {
  private articles: Article[] = [];
  private resources: ResourceItem[] = [];
  private motions: Motion[] = [];
  private glossary: GlossaryTerm[] = [];
  private comments: Comment[] = [];
  private reports: CommentReport[] = [];
  private submissions: ArticleSubmission[] = [];
  private accounts: UserAccount[] = [];
  private currentUser: UserProfile | null = null;
  private assignedAdminEmails: string[] = [];
  private pendingVerification: { email: string; code: string; expiresAt: number } | null = null;

  private listeners: Set<() => void> = new Set();

  constructor() {
    this.initialize();
  }

  private load<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  private save(key: string, data: unknown) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }

  public initialize() {
    this.articles = this.load<Article[]>(STORAGE_KEYS.ARTICLES, SEED_ARTICLES);
    const loadedResources = this.load<ResourceItem[]>(STORAGE_KEYS.RESOURCES, SEED_RESOURCES);
    // Ensure all seed resources (including newly added compilation resources) are present
    const existingIds = new Set(loadedResources.map((r) => r.id));
    const missingSeedResources = SEED_RESOURCES.filter((r) => !existingIds.has(r.id));
    this.resources = [...missingSeedResources, ...loadedResources];

    this.motions = this.load<Motion[]>(STORAGE_KEYS.MOTIONS, SEED_MOTIONS);
    this.glossary = this.load<GlossaryTerm[]>(STORAGE_KEYS.GLOSSARY, SEED_GLOSSARY_TERMS);
    this.comments = this.load<Comment[]>(STORAGE_KEYS.COMMENTS, SEED_COMMENTS);
    this.reports = this.load<CommentReport[]>(STORAGE_KEYS.REPORTS, []);
    this.submissions = this.load<ArticleSubmission[]>(STORAGE_KEYS.SUBMISSIONS, SEED_SUBMISSIONS);
    this.accounts = this.load<UserAccount[]>(STORAGE_KEYS.ACCOUNTS, SEED_ACCOUNTS);
    this.assignedAdminEmails = this.load<string[]>(STORAGE_KEYS.ASSIGNED_ADMINS, []);
    this.currentUser = this.load<UserProfile | null>(STORAGE_KEYS.CURRENT_USER, null);

    // Enforce role integrity: only ROOT_ADMIN_EMAIL and assigned admins can have 'admin' role
    if (this.currentUser) {
      const shouldBeAdmin = this.isUserAdmin(this.currentUser.email);
      this.currentUser.role = shouldBeAdmin ? 'admin' : 'debater';
      this.save(STORAGE_KEYS.CURRENT_USER, this.currentUser);
    }

    // Ensure ROOT_ADMIN_EMAIL exists in accounts with admin role
    const rootAccount = this.accounts.find((a) => a.email.toLowerCase() === ROOT_ADMIN_EMAIL.toLowerCase());
    if (!rootAccount) {
      this.accounts = [
        {
          id: 'usr-root-admin',
          email: ROOT_ADMIN_EMAIL,
          passwordHash: 'admin2026',
          display_name: 'Muhammad Hadi (Administrator)',
          role: 'admin',
          institution: 'Ramz-e-Fikr Editorial Board',
          format_preference: 'British Parliamentary',
          created_at: '2026-08-01T00:00:00Z'
        },
        ...this.accounts
      ];
      this.save(STORAGE_KEYS.ACCOUNTS, this.accounts);
    } else if (rootAccount.role !== 'admin') {
      rootAccount.role = 'admin';
      this.save(STORAGE_KEYS.ACCOUNTS, this.accounts);
    }

    // If Supabase client is active, listen to auth state changes
    const client = getSupabaseClient();
    if (client) {
      client.auth.getSession().then(({ data: { session } }) => {
        if (session?.user && !this.currentUser) {
          const userEmail = session.user.email || '';
          const role: UserRole = this.isUserAdmin(userEmail) ? 'admin' : 'debater';
          const profile: UserProfile = {
            id: session.user.id,
            email: userEmail,
            display_name: session.user.user_metadata?.display_name || userEmail.split('@')[0] || 'Debater',
            role,
            institution: session.user.user_metadata?.institution || '',
            format_preference: session.user.user_metadata?.format_preference || 'British Parliamentary',
            created_at: session.user.created_at || new Date().toISOString()
          };
          this.currentUser = profile;
          this.save(STORAGE_KEYS.CURRENT_USER, this.currentUser);
          this.notify();
        }
      });
    }

    this.notify();
  }

  public resetToDefaults() {
    this.articles = [...SEED_ARTICLES];
    this.resources = [...SEED_RESOURCES];
    this.motions = [...SEED_MOTIONS];
    this.glossary = [...SEED_GLOSSARY_TERMS];
    this.comments = [...SEED_COMMENTS];
    this.reports = [];
    this.submissions = [...SEED_SUBMISSIONS];
    this.accounts = [...SEED_ACCOUNTS];
    this.assignedAdminEmails = [];
    this.currentUser = null;

    this.save(STORAGE_KEYS.ARTICLES, this.articles);
    this.save(STORAGE_KEYS.RESOURCES, this.resources);
    this.save(STORAGE_KEYS.MOTIONS, this.motions);
    this.save(STORAGE_KEYS.GLOSSARY, this.glossary);
    this.save(STORAGE_KEYS.COMMENTS, this.comments);
    this.save(STORAGE_KEYS.REPORTS, this.reports);
    this.save(STORAGE_KEYS.SUBMISSIONS, this.submissions);
    this.save(STORAGE_KEYS.ACCOUNTS, this.accounts);
    this.save(STORAGE_KEYS.ASSIGNED_ADMINS, this.assignedAdminEmails);
    this.save(STORAGE_KEYS.CURRENT_USER, null);
    this.notify();
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  // User & Auth Management
  public getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  public isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  // Admin Verification & Role Checks
  public isUserAdmin(email?: string): boolean {
    if (!email) return false;
    const normalized = email.trim().toLowerCase();
    if (normalized === ROOT_ADMIN_EMAIL.toLowerCase()) return true;
    return this.assignedAdminEmails.map((e) => e.toLowerCase()).includes(normalized);
  }

  public isRootAdmin(email?: string): boolean {
    if (!email) return false;
    return email.trim().toLowerCase() === ROOT_ADMIN_EMAIL.toLowerCase();
  }

  public getAssignedAdmins(): string[] {
    return [...this.assignedAdminEmails];
  }

  public getAllAccounts(): UserAccount[] {
    return [...this.accounts];
  }

  public assignAdmin(targetEmail: string): { success: boolean; message: string } {
    if (!this.currentUser || !this.isRootAdmin(this.currentUser.email)) {
      return {
        success: false,
        message: 'Permission denied. Only the root administrator (muhammadhadi.officialwork@gmail.com) can assign admins.'
      };
    }

    const emailNorm = targetEmail.trim().toLowerCase();
    if (!emailNorm || !emailNorm.includes('@')) {
      return { success: false, message: 'Please provide a valid email address.' };
    }

    if (emailNorm === ROOT_ADMIN_EMAIL.toLowerCase()) {
      return { success: false, message: 'This email is already the permanent root administrator.' };
    }

    if (!this.assignedAdminEmails.some((e) => e.toLowerCase() === emailNorm)) {
      this.assignedAdminEmails = [...this.assignedAdminEmails, emailNorm];
      this.save(STORAGE_KEYS.ASSIGNED_ADMINS, this.assignedAdminEmails);
    }

    // Update account role if existing
    this.accounts = this.accounts.map((a) =>
      a.email.toLowerCase() === emailNorm ? { ...a, role: 'admin' as UserRole } : a
    );
    this.save(STORAGE_KEYS.ACCOUNTS, this.accounts);

    // If target user is currently logged in, update role live
    if (this.currentUser && this.currentUser.email.toLowerCase() === emailNorm) {
      this.currentUser.role = 'admin';
      this.save(STORAGE_KEYS.CURRENT_USER, this.currentUser);
    }

    this.notify();
    return { success: true, message: `Admin privileges granted to ${emailNorm}.` };
  }

  public revokeAdmin(targetEmail: string): { success: boolean; message: string } {
    if (!this.currentUser || !this.isRootAdmin(this.currentUser.email)) {
      return {
        success: false,
        message: 'Permission denied. Only the root administrator (muhammadhadi.officialwork@gmail.com) can revoke admins.'
      };
    }

    const emailNorm = targetEmail.trim().toLowerCase();
    if (emailNorm === ROOT_ADMIN_EMAIL.toLowerCase()) {
      return { success: false, message: 'Cannot revoke privileges from the root administrator.' };
    }

    this.assignedAdminEmails = this.assignedAdminEmails.filter((e) => e.toLowerCase() !== emailNorm);
    this.save(STORAGE_KEYS.ASSIGNED_ADMINS, this.assignedAdminEmails);

    // Demote account to debater (normal user)
    this.accounts = this.accounts.map((a) =>
      a.email.toLowerCase() === emailNorm ? { ...a, role: 'debater' as UserRole } : a
    );
    this.save(STORAGE_KEYS.ACCOUNTS, this.accounts);

    if (this.currentUser && this.currentUser.email.toLowerCase() === emailNorm) {
      this.currentUser.role = 'debater';
      this.save(STORAGE_KEYS.CURRENT_USER, this.currentUser);
    }

    this.notify();
    return { success: true, message: `Admin privileges revoked for ${emailNorm}. User role set to debater.` };
  }

  // Two-Step Verification Code System
  public async sendVerificationCode(email: string): Promise<{ success: boolean; message: string; previewCode: string }> {
    const emailNorm = email.trim().toLowerCase();
    if (!emailNorm || !emailNorm.includes('@')) {
      return { success: false, message: 'Please enter a valid email address.', previewCode: '' };
    }

    // Generate authentic 6-digit numeric OTP code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.pendingVerification = {
      email: emailNorm,
      code,
      expiresAt: Date.now() + 15 * 60 * 1000 // 15 mins expiry
    };

    // Attempt Supabase live OTP if available
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.auth.signInWithOtp({ email: emailNorm });
      } catch (err) {
        console.warn('Supabase OTP dispatch note:', err);
      }
    }

    return {
      success: true,
      message: `A 6-digit verification code has been dispatched to ${emailNorm}.`,
      previewCode: code
    };
  }

  public getPendingVerificationCode(email: string): string | null {
    const emailNorm = email.trim().toLowerCase();
    if (
      this.pendingVerification &&
      this.pendingVerification.email === emailNorm &&
      Date.now() < this.pendingVerification.expiresAt
    ) {
      return this.pendingVerification.code;
    }
    return null;
  }

  public async verifyCodeAndSignIn(
    email: string,
    code: string,
    password?: string
  ): Promise<{ success: boolean; message: string; user?: UserProfile }> {
    const emailNorm = email.trim().toLowerCase();

    // Verify code
    if (!this.pendingVerification || this.pendingVerification.email !== emailNorm) {
      return {
        success: false,
        message: 'No pending verification code found for this email. Please request a new code.'
      };
    }

    if (Date.now() > this.pendingVerification.expiresAt) {
      return {
        success: false,
        message: 'The verification code has expired. Please request a fresh code.'
      };
    }

    if (this.pendingVerification.code !== code.trim()) {
      return {
        success: false,
        message: 'Incorrect verification code. Please check your email inbox and enter the 6-digit code.'
      };
    }

    // Determine role: ONLY root admin or assigned admins get 'admin', all others are 'debater'
    const role: UserRole = this.isUserAdmin(emailNorm) ? 'admin' : 'debater';

    let account = this.accounts.find((a) => a.email.toLowerCase() === emailNorm);
    if (!account) {
      account = {
        id: `usr-${Date.now()}`,
        email: emailNorm,
        passwordHash: password || 'verified',
        display_name: emailNorm.split('@')[0],
        role,
        institution: 'Independent Debater',
        format_preference: 'British Parliamentary',
        created_at: new Date().toISOString()
      };
      this.accounts = [...this.accounts, account];
      this.save(STORAGE_KEYS.ACCOUNTS, this.accounts);
    } else {
      // Ensure role reflects current admin status
      account.role = role;
      this.save(STORAGE_KEYS.ACCOUNTS, this.accounts);
    }

    const profile: UserProfile = {
      id: account.id,
      email: account.email,
      display_name: account.display_name,
      role,
      institution: account.institution,
      format_preference: account.format_preference,
      created_at: account.created_at
    };

    this.currentUser = profile;
    this.pendingVerification = null;
    this.save(STORAGE_KEYS.CURRENT_USER, this.currentUser);
    this.notify();

    return {
      success: true,
      message: `Email verified successfully. Welcome ${role === 'admin' ? 'Administrator' : 'Debater'}!`,
      user: profile
    };
  }

  public async verifyCodeAndSignUp(data: {
    email: string;
    code: string;
    password: string;
    display_name: string;
    institution?: string;
    format_preference?: DebateFormat;
  }): Promise<{ success: boolean; message: string; user?: UserProfile }> {
    const emailNorm = data.email.trim().toLowerCase();

    if (!this.pendingVerification || this.pendingVerification.email !== emailNorm) {
      return {
        success: false,
        message: 'No pending verification code found. Please request a code first.'
      };
    }

    if (Date.now() > this.pendingVerification.expiresAt) {
      return {
        success: false,
        message: 'The verification code has expired. Please request a new code.'
      };
    }

    if (this.pendingVerification.code !== data.code.trim()) {
      return {
        success: false,
        message: 'Incorrect verification code. Please enter the valid 6-digit code.'
      };
    }

    // Role is strictly 'admin' if email is root or assigned admin, otherwise strictly 'debater' (normal user)
    const role: UserRole = this.isUserAdmin(emailNorm) ? 'admin' : 'debater';

    const newProfile: UserProfile = {
      id: `usr-${Date.now()}`,
      email: emailNorm,
      display_name: data.display_name.trim(),
      role,
      institution: data.institution?.trim() || 'Independent Debater',
      format_preference: data.format_preference || 'British Parliamentary',
      created_at: new Date().toISOString()
    };

    const newAccount: UserAccount = {
      ...newProfile,
      passwordHash: data.password
    };

    this.accounts = [...this.accounts.filter((a) => a.email.toLowerCase() !== emailNorm), newAccount];
    this.save(STORAGE_KEYS.ACCOUNTS, this.accounts);

    // Call Supabase if active
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.auth.signUp({
          email: emailNorm,
          password: data.password,
          options: {
            data: {
              display_name: data.display_name,
              institution: data.institution,
              role
            }
          }
        });
      } catch (err) {
        console.warn('Supabase sign-up note:', err);
      }
    }

    this.currentUser = newProfile;
    this.pendingVerification = null;
    this.save(STORAGE_KEYS.CURRENT_USER, this.currentUser);
    this.notify();

    return {
      success: true,
      message: 'Account verified and registered successfully. Welcome to Ramz-e-Fikr!',
      user: newProfile
    };
  }

  public async signIn(
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string; user?: UserProfile }> {
    const emailNormalized = email.trim().toLowerCase();

    // Determine authorized role: root admin or assigned admin gets admin, everyone else gets debater
    const role: UserRole = this.isUserAdmin(emailNormalized) ? 'admin' : 'debater';

    // Attempt Supabase live authentication if active
    const client = getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client.auth.signInWithPassword({
          email: emailNormalized,
          password
        });
        if (!error && data?.user) {
          const profile: UserProfile = {
            id: data.user.id,
            email: data.user.email || emailNormalized,
            display_name: data.user.user_metadata?.display_name || emailNormalized.split('@')[0],
            role,
            institution: data.user.user_metadata?.institution || '',
            format_preference: data.user.user_metadata?.format_preference || 'British Parliamentary',
            created_at: data.user.created_at || new Date().toISOString()
          };
          this.currentUser = profile;
          this.save(STORAGE_KEYS.CURRENT_USER, this.currentUser);
          this.notify();
          return { success: true, message: 'Signed in successfully.', user: profile };
        }
      } catch (err) {
        console.warn('Supabase login check:', err);
      }
    }

    // Check local accounts registry
    const account = this.accounts.find(
      (a) => a.email.toLowerCase() === emailNormalized && a.passwordHash === password
    );

    if (account) {
      account.role = role;
      this.save(STORAGE_KEYS.ACCOUNTS, this.accounts);

      const profile: UserProfile = {
        id: account.id,
        email: account.email,
        display_name: account.display_name,
        role,
        institution: account.institution,
        format_preference: account.format_preference,
        created_at: account.created_at
      };
      this.currentUser = profile;
      this.save(STORAGE_KEYS.CURRENT_USER, this.currentUser);
      this.notify();
      return { success: true, message: 'Welcome back!', user: profile };
    }

    return {
      success: false,
      message: 'Invalid email or password. Please verify your credentials or verify via email code.'
    };
  }

  public async signOut() {
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.auth.signOut();
      } catch (err) {
        console.warn('Supabase signOut error:', err);
      }
    }

    this.currentUser = null;
    this.save(STORAGE_KEYS.CURRENT_USER, null);
    this.notify();
  }

  public updateProfile(updates: Partial<UserProfile>) {
    if (!this.currentUser) return;
    this.currentUser = { ...this.currentUser, ...updates };
    this.save(STORAGE_KEYS.CURRENT_USER, this.currentUser);
    this.notify();
  }

  // Articles
  public getArticles(includeUnpublished = false): Article[] {
    if (includeUnpublished) return [...this.articles];
    return this.articles.filter((a) => a.status === 'published');
  }

  public getArticleBySlug(slug: string): Article | undefined {
    return this.articles.find((a) => a.slug === slug);
  }

  public incrementArticleViews(slug: string) {
    this.articles = this.articles.map((a) =>
      a.slug === slug ? { ...a, views_count: a.views_count + 1 } : a
    );
    this.save(STORAGE_KEYS.ARTICLES, this.articles);
    this.notify();
  }

  // Resources
  public getResources(): ResourceItem[] {
    return [...this.resources];
  }

  public getResourceBySlug(slug: string): ResourceItem | undefined {
    return this.resources.find((r) => r.slug === slug);
  }

  public incrementResourceDownloads(slug: string) {
    this.resources = this.resources.map((r) =>
      r.slug === slug ? { ...r, downloads_count: r.downloads_count + 1 } : r
    );
    this.save(STORAGE_KEYS.RESOURCES, this.resources);
    this.notify();
  }

  // Motions
  public getMotions(): Motion[] {
    return [...this.motions];
  }

  public getMotionBySlug(slug: string): Motion | undefined {
    return this.motions.find((m) => m.slug === slug);
  }

  public getRandomMotion(format?: string, difficulty?: string, topic?: string): Motion | null {
    let pool = [...this.motions];
    if (format && format !== 'All') {
      pool = pool.filter((m) => m.format === format);
    }
    if (difficulty && difficulty !== 'All') {
      pool = pool.filter((m) => m.difficulty === difficulty);
    }
    if (topic && topic !== 'All') {
      pool = pool.filter((m) => m.topic.toLowerCase().includes(topic.toLowerCase()));
    }
    if (pool.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
  }

  // Glossary
  public getGlossaryTerms(): GlossaryTerm[] {
    return [...this.glossary].sort((a, b) => a.term.localeCompare(b.term));
  }

  public getGlossaryTermBySlug(slug: string): GlossaryTerm | undefined {
    return this.glossary.find((g) => g.slug === slug);
  }

  // Comments (Gated: requires logged-in user)
  public getComments(contentType: 'article' | 'resource' | 'motion', slug: string): Comment[] {
    return this.comments
      .filter((c) => c.content_type === contentType && c.content_slug === slug && c.status !== 'hidden')
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public addComment(
    contentType: 'article' | 'resource' | 'motion',
    slug: string,
    commentText: string,
    parentId?: string
  ): Comment {
    if (!this.currentUser) {
      throw new Error('Authentication required: You must be logged in to participate in scholarly commentary.');
    }

    const newComment: Comment = {
      id: `com-${Date.now()}`,
      content_type: contentType,
      content_slug: slug,
      parent_id: parentId,
      user_id: this.currentUser.id,
      user_name: this.currentUser.display_name,
      user_role: this.currentUser.role,
      user_institution: this.currentUser.institution,
      comment_text: commentText.trim(),
      created_at: new Date().toISOString(),
      status: 'approved',
      upvotes: 0
    };

    this.comments = [newComment, ...this.comments];
    this.save(STORAGE_KEYS.COMMENTS, this.comments);

    // Update commentary count on article if applicable
    if (contentType === 'article') {
      this.articles = this.articles.map((a) =>
        a.slug === slug ? { ...a, commentary_count: a.commentary_count + 1 } : a
      );
      this.save(STORAGE_KEYS.ARTICLES, this.articles);
    }

    // Sync to Supabase if active
    const client = getSupabaseClient();
    if (client) {
      client.from('comments').insert({
        content_type: newComment.content_type,
        content_slug: newComment.content_slug,
        parent_id: newComment.parent_id || null,
        user_name: newComment.user_name,
        user_role: newComment.user_role,
        user_institution: newComment.user_institution,
        comment_text: newComment.comment_text,
        body: newComment.comment_text,
        status: newComment.status
      }).then(({ error }) => {
        if (error) {
          // Graceful fallback for minimal comment schema
          client.from('comments').insert({
            body: newComment.comment_text,
            parent_id: newComment.parent_id || null
          }).then(undefined, () => {});
        }
      }, () => {});
    }

    this.notify();
    return newComment;
  }

  public upvoteComment(commentId: string) {
    this.comments = this.comments.map((c) =>
      c.id === commentId ? { ...c, upvotes: c.upvotes + 1 } : c
    );
    this.save(STORAGE_KEYS.COMMENTS, this.comments);
    this.notify();
  }

  public deleteComment(commentId: string) {
    this.comments = this.comments.filter((c) => c.id !== commentId);
    this.save(STORAGE_KEYS.COMMENTS, this.comments);
    this.notify();
  }

  public reportComment(commentId: string, reason: string) {
    const reporterName = this.currentUser ? this.currentUser.display_name : 'Anonymous Reader';
    const report: CommentReport = {
      id: `rep-${Date.now()}`,
      comment_id: commentId,
      reported_by: reporterName,
      reason,
      created_at: new Date().toISOString(),
      status: 'pending'
    };
    this.reports = [report, ...this.reports];
    this.save(STORAGE_KEYS.REPORTS, this.reports);

    // Flag the comment
    this.comments = this.comments.map((c) =>
      c.id === commentId ? { ...c, status: 'flagged' } : c
    );
    this.save(STORAGE_KEYS.COMMENTS, this.comments);
    this.notify();
  }

  // Article Submission Studio & Review Pipeline (Gated: requires logged-in user)
  public submitArticle(
    submission: Omit<ArticleSubmission, 'id' | 'submitted_at' | 'status'>
  ): ArticleSubmission {
    if (!this.currentUser) {
      throw new Error('Authentication required: You must be logged in to submit an essay.');
    }

    const newSubmission: ArticleSubmission = {
      ...submission,
      id: `sub-${Date.now()}`,
      submitted_at: new Date().toISOString(),
      status: 'pending_review'
    };

    this.submissions = [newSubmission, ...this.submissions];
    this.save(STORAGE_KEYS.SUBMISSIONS, this.submissions);

    // Sync to Supabase if active
    const client = getSupabaseClient();
    if (client) {
      client.from('article_submissions').insert({
        title: newSubmission.title,
        subtitle: newSubmission.subtitle,
        category: newSubmission.category,
        format: newSubmission.format,
        difficulty: newSubmission.difficulty,
        excerpt: newSubmission.excerpt,
        body: newSubmission.body,
        author_name: newSubmission.author_name,
        author_email: newSubmission.author_email,
        author_institution: newSubmission.author_institution,
        status: newSubmission.status
      }).then(({ error }) => {
        if (error) {
          // If dedicated submissions table is not present, save into articles
          client.from('articles').insert({
            slug: `sub-${Date.now()}`,
            title: newSubmission.title,
            subtitle: newSubmission.subtitle,
            excerpt: newSubmission.excerpt,
            body: newSubmission.body,
            difficulty: newSubmission.difficulty,
            debate_format: newSubmission.format
          }).then(undefined, () => {});
        }
      }, () => {});
    }

    this.notify();
    return newSubmission;
  }

  public getSubmissions(): ArticleSubmission[] {
    return [...this.submissions];
  }

  public approveSubmission(submissionId: string): Article | null {
    const sub = this.submissions.find((s) => s.id === submissionId);
    if (!sub) return null;

    // Generate unique slug
    const baseSlug = sub.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const newArticle: Article = {
      id: `art-${Date.now()}`,
      slug,
      title: sub.title,
      subtitle: sub.subtitle,
      excerpt: sub.excerpt,
      body: sub.body,
      category: sub.category,
      author_name: sub.author_name,
      author_title: 'Contributor',
      author_institution: sub.author_institution || 'Independent Researcher',
      difficulty: sub.difficulty,
      format: sub.format,
      featured: false,
      reading_time_minutes: Math.max(3, Math.ceil(sub.body.split(/\s+/).length / 200)),
      cover_image_url:
        sub.cover_image_url || '/assets/images/article_weighing_cover_1791952564020.jpg',
      published_at: new Date().toISOString().split('T')[0],
      status: 'published',
      views_count: 1,
      commentary_count: 0,
      citations: [],
      tags: [sub.category, sub.format, 'Community Contribution']
    };

    // Add to articles
    this.articles = [newArticle, ...this.articles];
    this.save(STORAGE_KEYS.ARTICLES, this.articles);

    // Update submission status
    this.submissions = this.submissions.map((s) =>
      s.id === submissionId ? { ...s, status: 'approved' as const } : s
    );
    this.save(STORAGE_KEYS.SUBMISSIONS, this.submissions);

    this.notify();
    return newArticle;
  }

  public rejectSubmission(submissionId: string, notes?: string) {
    this.submissions = this.submissions.map((s) =>
      s.id === submissionId ? { ...s, status: 'rejected' as const, editorial_notes: notes } : s
    );
    this.save(STORAGE_KEYS.SUBMISSIONS, this.submissions);
    this.notify();
  }

  // Admin CMS CRUD Operations
  public saveArticle(article: Article) {
    const exists = this.articles.some((a) => a.id === article.id);
    if (exists) {
      this.articles = this.articles.map((a) => (a.id === article.id ? article : a));
    } else {
      this.articles = [article, ...this.articles];
    }
    this.save(STORAGE_KEYS.ARTICLES, this.articles);
    this.notify();
  }

  public deleteArticle(id: string) {
    this.articles = this.articles.filter((a) => a.id !== id);
    this.save(STORAGE_KEYS.ARTICLES, this.articles);
    this.notify();
  }

  public saveMotion(motion: Motion) {
    const exists = this.motions.some((m) => m.id === motion.id);
    if (exists) {
      this.motions = this.motions.map((m) => (m.id === motion.id ? motion : m));
    } else {
      this.motions = [motion, ...this.motions];
    }
    this.save(STORAGE_KEYS.MOTIONS, this.motions);
    this.notify();
  }

  public deleteMotion(id: string) {
    this.motions = this.motions.filter((m) => m.id !== id);
    this.save(STORAGE_KEYS.MOTIONS, this.motions);
    this.notify();
  }

  public saveResource(resource: ResourceItem) {
    const exists = this.resources.some((r) => r.id === resource.id);
    if (exists) {
      this.resources = this.resources.map((r) => (r.id === resource.id ? resource : r));
    } else {
      this.resources = [resource, ...this.resources];
    }
    this.save(STORAGE_KEYS.RESOURCES, this.resources);
    this.notify();
  }

  public deleteResource(id: string) {
    this.resources = this.resources.filter((r) => r.id !== id);
    this.save(STORAGE_KEYS.RESOURCES, this.resources);
    this.notify();
  }

  public getReports(): CommentReport[] {
    return [...this.reports];
  }

  public resolveReport(reportId: string, action: 'dismiss' | 'hide_comment') {
    const report = this.reports.find((r) => r.id === reportId);
    if (!report) return;

    if (action === 'hide_comment') {
      this.comments = this.comments.map((c) =>
        c.id === report.comment_id ? { ...c, status: 'hidden' as const } : c
      );
      this.save(STORAGE_KEYS.COMMENTS, this.comments);
    } else {
      this.comments = this.comments.map((c) =>
        c.id === report.comment_id && c.status === 'flagged' ? { ...c, status: 'approved' as const } : c
      );
      this.save(STORAGE_KEYS.COMMENTS, this.comments);
    }

    this.reports = this.reports.map((r) =>
      r.id === reportId ? { ...r, status: 'resolved' as const } : r
    );
    this.save(STORAGE_KEYS.REPORTS, this.reports);
    this.notify();
  }

  // Supabase Configuration
  public getSupabaseConfig(): SupabaseConfigState {
    return getSupabaseConfig();
  }

  public async updateSupabaseConfig(config: Partial<SupabaseConfigState>) {
    const res = await setSupabaseConfig(config);
    this.notify();
    return res;
  }

  public async testSupabaseConnection(url: string, key: string) {
    return testSupabaseConnection(url, key);
  }

  // Global Search
  public searchGlobal(query: string): SearchResultItem[] {
    if (!query || query.trim().length === 0) return [];
    const q = query.toLowerCase().trim();
    const results: SearchResultItem[] = [];

    // Articles
    this.articles
      .filter((a) => a.status === 'published')
      .forEach((a) => {
        if (
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.body.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
        ) {
          results.push({
            id: a.id,
            type: 'article',
            title: a.title,
            snippet: a.excerpt,
            url: `/articles/${a.slug}`,
            metadata: `${a.category} · ${a.reading_time_minutes} min read · By ${a.author_name}`,
            badge: 'Article'
          });
        }
      });

    // Resources
    this.resources.forEach((r) => {
      if (
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.topic.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q))
      ) {
        results.push({
          id: r.id,
          type: 'resource',
          title: r.title,
          snippet: r.description,
          url: `/resources/${r.slug}`,
          metadata: `${r.resource_type} · ${r.format} · ${r.skill_area}`,
          badge: r.resource_type
        });
      }
    });

    // Motions
    this.motions.forEach((m) => {
      if (
        m.wording.toLowerCase().includes(q) ||
        (m.info_slide && m.info_slide.toLowerCase().includes(q)) ||
        m.topic.toLowerCase().includes(q) ||
        m.tournament.toLowerCase().includes(q) ||
        m.tags.some((t) => t.toLowerCase().includes(q))
      ) {
        results.push({
          id: m.id,
          type: 'motion',
          title: m.wording,
          snippet: m.info_slide || `${m.tournament} (${m.year}) - ${m.round}`,
          url: `/motions/${m.slug}`,
          metadata: `${m.format} · ${m.difficulty} · ${m.topic} (${m.year})`,
          badge: m.format
        });
      }
    });

    // Glossary
    this.glossary.forEach((g) => {
      if (
        g.term.toLowerCase().includes(q) ||
        g.short_definition.toLowerCase().includes(q) ||
        g.detailed_explanation.toLowerCase().includes(q)
      ) {
        results.push({
          id: g.id,
          type: 'glossary',
          title: g.term,
          snippet: g.short_definition,
          url: `/glossary/${g.slug}`,
          metadata: `Debate Concept · Category: ${g.category}`,
          badge: 'Glossary'
        });
      }
    });

    return results;
  }
}

export const store = new DataStoreService();

export function useDataStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setTick((t) => t + 1);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return store;
}
