import React, { useState, useMemo } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Search, Eye, CheckSquare, Loader2 } from 'lucide-react';
import { MobileFrame } from './MobileFrame';

interface AdminViewProps {
  onGoToCard: () => void;
}

type FilterType = 'Tout' | 'A-Z' | 'Recents' | 'Anciens';

export const AdminView: React.FC<AdminViewProps> = ({ onGoToCard }) => {
  const invitees = useQuery(api.invitees.listInvitees);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('Tout');

  // Format date to DD/MM/YYYY
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Format guest title and name
  const formatGuestName = (inv: { civility: string; nom: string; prenoms: string; withPlusOne: boolean }) => {
    const prefix = inv.withPlusOne
      ? 'M&Mme'
      : inv.civility === 'Mme'
      ? 'Mme'
      : 'M';
    return `${prefix} ${inv.nom} ${inv.prenoms}`;
  };

  // Filtered and sorted list
  const filteredInvitees = useMemo(() => {
    if (!invitees) return [];

    let list = [...invitees];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((inv) =>
        `${inv.civility} ${inv.nom} ${inv.prenoms}`.toLowerCase().includes(q)
      );
    }

    // Sort tabs
    switch (activeFilter) {
      case 'A-Z':
        list.sort((a, b) => a.nom.localeCompare(b.nom) || a.prenoms.localeCompare(b.prenoms));
        break;
      case 'Recents':
        list.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case 'Anciens':
        list.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case 'Tout':
      default:
        list.sort((a, b) => b.createdAt - a.createdAt);
        break;
    }

    return list;
  }, [invitees, searchQuery, activeFilter]);

  const totalCount = invitees ? invitees.length : 0;
  const countDisplay = totalCount < 10 ? `0${totalCount}` : `${totalCount}`;

  return (
    <MobileFrame>
      <div className="relative w-full h-full flex flex-col justify-between bg-[#dedede] text-zinc-900 overflow-hidden font-sans select-none">
        {/* Top Header & Search Area */}
        <div className="p-6 pt-10 pb-3 flex flex-col flex-shrink-0">
          {/* Header Row: Title & Carte Button */}
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-2xl sm:text-[26px] font-black text-black tracking-tight">
              Départ à la Retraite
            </h1>

            <button
              onClick={onGoToCard}
              className="flex items-center gap-2 py-2 px-3.5 rounded-2xl bg-white hover:bg-zinc-50 active:scale-95 text-black font-semibold text-xs shadow-sm border border-zinc-200 transition-all cursor-pointer"
            >
              <span>Carte</span>
              <Eye className="w-4 h-4 text-black" />
            </button>
          </div>

          {/* Subheader: Count */}
          <h2 className="text-base font-bold text-black mb-3.5">
            Ma liste d’invités({countDisplay})
          </h2>

          {/* Search Bar */}
          <div className="relative mb-3.5">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-zinc-700" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher..."
              className="w-full py-3 pl-10 pr-4 rounded-2xl bg-white text-zinc-900 placeholder:text-zinc-500 border-none shadow-sm focus:outline-none focus:ring-2 focus:ring-black text-sm font-medium transition-all"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {(['Tout', 'A-Z', 'Recents', 'Anciens'] as FilterType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === tab
                    ? 'bg-black text-white shadow-md'
                    : 'bg-white text-zinc-900 hover:bg-zinc-100 shadow-sm'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Invitees List Area */}
        <div className="flex-1 px-6 py-2 overflow-y-auto no-scrollbar">
          {invitees === undefined ? (
            <div className="h-full flex flex-col items-center justify-center py-20 text-zinc-500 gap-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-xs font-medium">Chargement des invités...</span>
            </div>
          ) : filteredInvitees.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-24 text-zinc-600 text-sm font-medium">
              Aucun invité sur la liste
            </div>
          ) : (
            <div className="space-y-3 pb-6">
              {filteredInvitees.map((inv) => (
                <div
                  key={inv._id}
                  className="w-full bg-white rounded-2xl p-4 shadow-sm flex items-start gap-3.5 border border-zinc-100/80 transition-all hover:shadow"
                >
                  {/* Custom Checkbox Icon */}
                  <div className="mt-0.5 flex-shrink-0">
                    <div className="w-5 h-5 rounded bg-black flex items-center justify-center">
                      <CheckSquare className="w-4 h-4 text-white fill-black stroke-[2.5]" />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-black font-extrabold text-sm tracking-tight leading-snug break-words">
                      {formatGuestName(inv)}
                    </span>
                    <span className="text-zinc-500 font-medium text-xs mt-1">
                      {formatDate(inv.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 pt-1 pb-6 flex justify-center flex-shrink-0">
          <p className="text-[11px] text-zinc-600 font-medium tracking-[0.2em] uppercase select-none">
            by VANTAR STUDIOS
          </p>
        </div>
      </div>
    </MobileFrame>
  );
};
