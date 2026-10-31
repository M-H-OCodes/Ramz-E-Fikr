import React, { useState } from 'react';
import { Search, PenLine, Shield, User, Menu, X, ChevronDown, Check, LogIn, LogOut, UserPlus } from 'lucide-react';
import { useDataStore } from '../services/store';
import { UserRole } from '../types';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
  onOpenSupabase: () => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  onOpenSearch,
  onOpenSupabase,
  onOpenAuth
}) => {
  const store = useDataStore();
  const currentUser = store.getCurrentUser();
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Articles', path: '/articles' },
    { label: 'Resources', path: '/resources' },
    { label: 'Motions', path: '/motions' },
    { label: 'Glossary', path: '/glossary' },
    { label: 'About', path: '/about' }
  ];

  const isAdmin = currentUser ? store.isUserAdmin(currentUser.email) : false;
  const isRootAdmin = currentUser ? store.isRootAdmin(currentUser.email) : false;

  const handleSignOut = async () => {
    await store.signOut();
    setIsRoleMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F7F3EA]/95 backdrop-blur-sm border-b border-[#D8CCBB]">
      {/* 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onNavigate('/')}
          className="flex items-center gap-3 text-left group whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#681F2B]"
          aria-label="Ramz-e-Fikr Home"
        >
          <div className="w-10 h-10 rounded border border-[#B79558]/50 bg-[#681F2B] flex items-center justify-center text-[#F7F3EA] shadow-xs">
            <span className="font-urdu text-xl font-bold leading-none select-none">ف</span>
          </div>
          <div className="flex flex-col">
            <span className="font-urdu text-lg leading-tight text-[#681F2B] font-semibold tracking-wide">
              رمزِ فکر
            </span>
            <span className="font-editorial text-xs tracking-[0.2em] uppercase text-[#171717] font-bold">
              RAMZ-E-FIKR
            </span>
          </div>
        </button>

        {/* Zone 2: 5 Single-line Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#625D57]">
          {navLinks.map((link) => {
            const isActive =
              currentPath === link.path ||
              (link.path !== '/' && currentPath.startsWith(link.path));
            return (
              <button
                key={link.path}
                onClick={() => onNavigate(link.path)}
                className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'text-[#681F2B] font-semibold border-b-2 border-[#681F2B] pb-1'
                    : 'hover:text-[#171717] pb-1'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Interactive Affordances & Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Global Search Button */}
          <button
            onClick={onOpenSearch}
            className="p-2 text-[#625D57] hover:text-[#681F2B] hover:bg-[#EFE8DA] rounded border border-[#D8CCBB]/60 transition-colors"
            title="Search entire archive (Ctrl+K)"
            aria-label="Search archive"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Write / Submit Article Button */}
          <button
            onClick={() => onNavigate('/submit')}
            className={`hidden sm:flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded border transition-colors whitespace-nowrap shrink-0 ${
              currentPath === '/submit'
                ? 'bg-[#48151E] text-[#F7F3EA] border-[#48151E]'
                : 'bg-[#681F2B] hover:bg-[#48151E] text-[#F7F3EA] border-[#681F2B]'
            }`}
          >
            <PenLine className="w-3.5 h-3.5" />
            <span>Submit Essay</span>
          </button>

          {/* Admin CMS Direct Shortcut (Only visible for authorized admin email or assigned admins) */}
          {isAdmin && (
            <button
              onClick={() => onNavigate('/admin')}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border border-[#B79558]/70 transition-colors whitespace-nowrap shrink-0 ${
                currentPath.startsWith('/admin')
                  ? 'bg-[#681F2B] text-[#F7F3EA] shadow-xs'
                  : 'bg-[#EFE8DA] text-[#681F2B] hover:bg-[#D8CCBB]'
              }`}
              title={isRootAdmin ? 'Editorial CMS (Root Admin: Muhammad Hadi)' : 'Editorial CMS (Admin Desk)'}
            >
              <Shield className="w-3.5 h-3.5 text-[#B79558]" />
              <span>CMS {isRootAdmin ? '(Root Admin)' : '(Admin)'}</span>
            </button>
          )}

          {/* User Auth: If logged in, show User Menu; If not logged in, show Log In & Sign Up */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-[#EFE8DA] text-[#171717] rounded border border-[#D8CCBB] hover:border-[#B79558] transition-colors"
                aria-label="User profile and account menu"
              >
                <div className="w-4 h-4 rounded-full bg-[#681F2B] text-[#F7F3EA] flex items-center justify-center text-[10px] font-bold">
                  {currentUser.display_name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline max-w-[120px] truncate">{currentUser.display_name}</span>
                <span className="hidden md:inline text-[10px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider bg-white/70 border border-[#D8CCBB] text-[#681F2B]">
                  {isRootAdmin ? 'Root Admin' : isAdmin ? 'Admin' : 'Debater'}
                </span>
                <ChevronDown className="w-3 h-3 text-[#625D57]" />
              </button>

              {isRoleMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-[#F7F3EA] border border-[#D8CCBB] rounded-md shadow-lg py-2 z-50 text-xs"
                  onMouseLeave={() => setIsRoleMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-[#D8CCBB]/60">
                    <div className="font-semibold text-[#171717] flex items-center justify-between">
                      <span className="truncate">{currentUser.display_name}</span>
                      {isAdmin ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#681F2B] text-[#F7F3EA] font-semibold shrink-0">
                          {isRootAdmin ? 'Root Admin' : 'Admin'}
                        </span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#EFE8DA] border border-[#D8CCBB] text-[#625D57] font-medium shrink-0">
                          Debater
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#625D57] truncate mt-0.5">{currentUser.email}</div>
                    <div className="text-[11px] text-[#B79558] font-medium mt-0.5">
                      {currentUser.institution || 'Ramz-e-Fikr Scholar'}
                    </div>
                  </div>

                  <div className="pt-1">
                    {isAdmin && (
                      <button
                        onClick={() => {
                          setIsRoleMenuOpen(false);
                          onNavigate('/admin');
                        }}
                        className="w-full px-3 py-2 text-left text-[#681F2B] font-semibold hover:bg-[#EFE8DA] flex items-center gap-2 border-b border-[#D8CCBB]/50"
                      >
                        <Shield className="w-3.5 h-3.5 text-[#B79558]" />
                        <span>Editorial CMS & User Control</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setIsRoleMenuOpen(false);
                        onOpenSupabase();
                      }}
                      className="w-full px-3 py-1.5 text-left text-[#625D57] hover:text-[#171717] hover:bg-[#EFE8DA] flex items-center gap-2"
                    >
                      <span>Supabase Cloud Config</span>
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full px-3 py-1.5 text-left text-red-700 hover:bg-red-50 flex items-center gap-1.5 mt-1 border-t border-[#D8CCBB]/40 font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('signin')}
                className="px-3 py-1.5 text-xs font-semibold text-[#171717] hover:text-[#681F2B] hover:bg-[#EFE8DA] rounded border border-[#D8CCBB] transition-colors flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-[#681F2B]" />
                <span>Log In</span>
              </button>

              <button
                onClick={() => onOpenAuth('signup')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#EFE8DA] hover:bg-[#D8CCBB] text-[#681F2B] rounded border border-[#B79558]/60 transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[#625D57] hover:text-[#171717] hover:bg-[#EFE8DA] rounded"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Out Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#D8CCBB] bg-[#F7F3EA] px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigate(link.path);
              }}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-[#171717] hover:bg-[#EFE8DA] rounded"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-[#D8CCBB]/60 flex flex-col gap-2">
            {currentUser ? (
              <>
                <div className="px-3 py-1.5 bg-[#EFE8DA] rounded text-xs text-[#171717]">
                  Signed in as <strong>{currentUser.display_name}</strong> ({currentUser.role})
                </div>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate('/submit');
                  }}
                  className="w-full py-2 bg-[#681F2B] text-[#F7F3EA] text-sm font-medium rounded text-center flex items-center justify-center gap-2"
                >
                  <PenLine className="w-4 h-4" />
                  <span>Submit Article / Blog</span>
                </button>
                {isAdmin && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onNavigate('/admin');
                    }}
                    className="w-full py-2 bg-[#EFE8DA] border border-[#B79558] text-[#681F2B] text-sm font-semibold rounded text-center flex items-center justify-center gap-2"
                  >
                    <Shield className="w-4 h-4 text-[#B79558]" />
                    <span>Admin CMS & User Control</span>
                  </button>
                )}
                <button
                  onClick={handleSignOut}
                  className="w-full py-2 bg-red-50 text-red-700 border border-red-200 text-sm font-medium rounded text-center flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAuth('signin');
                  }}
                  className="py-2 bg-white border border-[#D8CCBB] text-sm font-semibold rounded text-center"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAuth('signup');
                  }}
                  className="py-2 bg-[#681F2B] text-[#F7F3EA] text-sm font-semibold rounded text-center"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
