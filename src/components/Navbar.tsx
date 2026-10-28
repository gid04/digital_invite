import React from 'react';
import { Mail, Plus, User, LogOut, LayoutDashboard, Sparkles } from 'lucide-react';
import type { AuthUser } from '../types';

interface NavbarProps {
  user: AuthUser | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
  onNavigate: (path: string) => void;
  currentPath: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenAuth,
  onSignOut,
  onNavigate,
  currentPath,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 border-b border-zinc-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => onNavigate('/')}
          className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-zinc-900 group-hover:bg-black text-white flex items-center justify-center shadow-sm transition-all duration-200 group-hover:scale-105">
            <Mail className="w-5 h-5 text-zinc-100" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-zinc-900 group-hover:text-black font-sans">
              Digit<span className="text-emerald-700">invite</span>
            </span>
            <span className="text-[10px] text-zinc-600 font-medium tracking-wider uppercase -mt-1">
              Invitations Digitales
            </span>
          </div>
        </button>

        {/* Center Nav Links (Hidden on small mobile) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-600">
          <button
            onClick={() => onNavigate('/')}
            className={`hover:text-zinc-900 transition-colors cursor-pointer ${
              currentPath === '/' ? 'text-zinc-950 font-semibold' : ''
            }`}
          >
            Accueil
          </button>
          <button
            onClick={() => onNavigate('/#demo')}
            className="hover:text-zinc-900 transition-colors cursor-pointer"
          >
            Démo Interactive
          </button>
          <button
            onClick={() => onNavigate('/#pricing')}
            className="hover:text-zinc-900 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Tarif Unique</span>
            <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
              $1
            </span>
          </button>
          {user && (
            <button
              onClick={() => onNavigate('/dashboard')}
              className={`hover:text-zinc-900 transition-colors cursor-pointer flex items-center gap-1.5 ${
                currentPath.startsWith('/dashboard') ? 'text-zinc-950 font-semibold' : ''
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Mon Espace</span>
            </button>
          )}
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => onNavigate('/dashboard')}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-xs font-semibold text-zinc-800 transition-all cursor-pointer"
                title={user.email}
              >
                <div className="w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[10px] font-bold">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="max-w-[110px] truncate">{user.name || user.email}</span>
              </button>

              <button
                onClick={() => onNavigate('/create')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-900 hover:bg-black text-white text-xs sm:text-sm font-semibold shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Créer</span>
              </button>

              <button
                onClick={onSignOut}
                title="Se déconnecter"
                className="p-2 rounded-full text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>Connexion</span>
              </button>

              <button
                onClick={() => onNavigate('/create')}
                className="flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full bg-zinc-900 hover:bg-black text-white text-xs sm:text-sm font-semibold shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Créer pour $1</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
