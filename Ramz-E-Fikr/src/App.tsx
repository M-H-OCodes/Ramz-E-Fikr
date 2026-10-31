import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SupabaseSyncModal } from './components/SupabaseSyncModal';
import { AuthModal } from './components/AuthModal';
import { HomeView } from './views/HomeView';
import { ArticlesView } from './views/ArticlesView';
import { ArticleDetailView } from './views/ArticleDetailView';
import { ResourcesView } from './views/ResourcesView';
import { ResourceDetailView } from './views/ResourceDetailView';
import { MotionsView } from './views/MotionsView';
import { MotionDetailView } from './views/MotionDetailView';
import { GlossaryView } from './views/GlossaryView';
import { SubmitArticleView } from './views/SubmitArticleView';
import { AdminCmsView } from './views/AdminCmsView';
import { AboutView } from './views/AboutView';
import { GlobalSearchView } from './views/GlobalSearchView';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');
  const [searchParams, setSearchParams] = useState<Record<string, string>>(() => {
    const params: Record<string, string> = {};
    const search = new URLSearchParams(window.location.search);
    search.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  });

  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

  const handleOpenAuth = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      const params: Record<string, string> = {};
      const search = new URLSearchParams(window.location.search);
      search.forEach((value, key) => {
        params[key] = value;
      });
      setSearchParams(params);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        navigate('/search');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigate = (fullPath: string) => {
    const [path, queryString] = fullPath.split('?');
    const params: Record<string, string> = {};
    if (queryString) {
      const search = new URLSearchParams(queryString);
      search.forEach((value, key) => {
        params[key] = value;
      });
    }

    window.history.pushState(null, '', fullPath);
    setCurrentPath(path);
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route dispatcher
  const renderCurrentView = () => {
    // 1. Articles routes
    if (currentPath.startsWith('/articles/')) {
      const slug = currentPath.replace('/articles/', '');
      return (
        <ArticleDetailView
          slug={slug}
          onNavigate={navigate}
          onOpenAuth={handleOpenAuth}
        />
      );
    }
    if (currentPath === '/articles') {
      return <ArticlesView onNavigate={navigate} initialParams={searchParams} />;
    }

    // 2. Resources routes
    if (currentPath.startsWith('/resources/')) {
      const slug = currentPath.replace('/resources/', '');
      return (
        <ResourceDetailView
          slug={slug}
          onNavigate={navigate}
          onOpenAuth={handleOpenAuth}
        />
      );
    }
    if (currentPath === '/resources') {
      return <ResourcesView onNavigate={navigate} initialParams={searchParams} />;
    }

    // 3. Motions routes
    if (currentPath.startsWith('/motions/')) {
      const slug = currentPath.replace('/motions/', '');
      return (
        <MotionDetailView
          slug={slug}
          onNavigate={navigate}
          onOpenAuth={handleOpenAuth}
        />
      );
    }
    if (currentPath === '/motions') {
      return <MotionsView onNavigate={navigate} initialParams={searchParams} />;
    }

    // 4. Glossary
    if (currentPath === '/glossary' || currentPath.startsWith('/glossary/')) {
      return <GlossaryView onNavigate={navigate} />;
    }

    // 5. Submit Article / Blog
    if (currentPath === '/submit' || currentPath === '/contribute') {
      return (
        <SubmitArticleView
          onNavigate={navigate}
          onOpenAuth={handleOpenAuth}
        />
      );
    }

    // 6. Admin CMS & Editorial Review Queue
    if (currentPath === '/admin' || currentPath.startsWith('/admin/')) {
      return (
        <AdminCmsView
          onNavigate={navigate}
          onOpenSupabase={() => setIsSupabaseModalOpen(true)}
        />
      );
    }

    // 7. Global Search
    if (currentPath === '/search') {
      return <GlobalSearchView onNavigate={navigate} initialQuery={searchParams.q || ''} />;
    }

    // 8. About
    if (currentPath === '/about') {
      return <AboutView onNavigate={navigate} />;
    }

    // Default: Home View
    return <HomeView onNavigate={navigate} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F3EA] text-[#171717] font-body">
      {/* 3-Zone Top Bar Navigation */}
      <Navbar
        currentPath={currentPath}
        onNavigate={navigate}
        onOpenSearch={() => navigate('/search')}
        onOpenSupabase={() => setIsSupabaseModalOpen(true)}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main Viewport Content */}
      <main className="flex-1">{renderCurrentView()}</main>

      {/* Institutional Editorial Broadsheet Footer */}
      <Footer
        onNavigate={navigate}
        onOpenSupabase={() => setIsSupabaseModalOpen(true)}
      />

      {/* Supabase Connection & Schema DDL Modal */}
      <SupabaseSyncModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />

      {/* Authentication Modal (Sign In / Register) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </div>
  );
}
