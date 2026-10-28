import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Search,
  Download,
  Copy,
  Check,
  Eye,
  ArrowLeft,
  Calendar,
  MapPin,
  CheckSquare,
  FileSpreadsheet,
  Clock,
} from 'lucide-react';
import type { EventItem, RSVPItem } from '../types';
import { getEventById, listRSVPsForEvent, subscribeToRSVPs } from '../lib/supabase';
import { CardCanvasRenderer } from './CardCanvasRenderer';

interface EventDashboardProps {
  eventId: string;
  onNavigate: (path: string) => void;
}

type FilterType = 'Tout' | 'A-Z' | 'Recents' | 'Anciens' | 'Couples';

export const EventDashboard: React.FC<EventDashboardProps> = ({ eventId, onNavigate }) => {
  const [event, setEvent] = useState<EventItem | null>(null);
  const [rsvps, setRsvps] = useState<RSVPItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('Tout');
  const [copiedLink, setCopiedLink] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);

  // Load event and RSVPs
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      const evt = await getEventById(eventId);
      if (isMounted) setEvent(evt);

      const items = await listRSVPsForEvent(eventId);
      if (isMounted) {
        setRsvps(items);
        setIsLoading(false);
      }
    }

    loadData();

    // Subscribe to live Realtime updates
    const unsubscribe = subscribeToRSVPs(eventId, async () => {
      const updatedItems = await listRSVPsForEvent(eventId);
      if (isMounted) {
        setRsvps(updatedItems);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [eventId]);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/e/${eventId}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleExportCSV = () => {
    if (!event || rsvps.length === 0) return;

    const headers = ['Civilité', 'Nom', 'Prénoms', 'Avec Accompagnant (+1)', 'Date de Confirmation'];
    const rows = rsvps.map((r) => [
      r.civility,
      r.nom,
      r.prenoms,
      r.with_plus_one ? 'Oui' : 'Non',
      new Date(r.created_at).toLocaleString('fr-FR'),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(';'), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(';'))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const safeTitle = event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.setAttribute('download', `Invites_${safeTitle}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format guest title and full name
  const formatGuestName = (inv: RSVPItem) => {
    const prefix = inv.with_plus_one
      ? 'M & Mme'
      : inv.civility === 'Mme'
      ? 'Mme'
      : 'M.';
    return `${prefix} ${inv.nom} ${inv.prenoms}`;
  };

  // Format date helper
  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Filtered & Sorted RSVPs
  const filteredRSVPs = useMemo(() => {
    let list = [...rsvps];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((r) =>
        `${r.civility} ${r.nom} ${r.prenoms}`.toLowerCase().includes(q)
      );
    }

    // Filter type
    if (activeFilter === 'Couples') {
      list = list.filter((r) => r.with_plus_one);
    }

    // Sort order
    switch (activeFilter) {
      case 'A-Z':
        list.sort((a, b) => a.nom.localeCompare(b.nom) || a.prenoms.localeCompare(b.prenoms));
        break;
      case 'Anciens':
        list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'Recents':
      case 'Tout':
      default:
        list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    return list;
  }, [rsvps, searchQuery, activeFilter]);

  // Aggregate stats
  const totalHeadcount = rsvps.reduce((sum, r) => sum + (r.with_plus_one ? 2 : 1), 0);
  const totalCouples = rsvps.filter((r) => r.with_plus_one).length;
  const totalSingles = rsvps.filter((r) => !r.with_plus_one).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center py-20 text-zinc-500 text-sm font-semibold">
        Chargement du tableau de bord de l'événement...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-zinc-900 mb-2">Événement introuvable</h2>
        <p className="text-xs text-zinc-500 mb-6">
          Cet événement n'existe pas ou n'est plus accessible.
        </p>
        <button
          onClick={() => onNavigate('/dashboard')}
          className="px-6 py-2.5 rounded-full bg-zinc-900 text-white text-xs font-semibold"
        >
          Retour au tableau de bord
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Back & Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
          <div>
            <button
              onClick={() => onNavigate('/dashboard')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900 mb-3 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour à mes événements</span>
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-zinc-100 text-zinc-800">
                {event.topic}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                <span>Live Supabase</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
              {event.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-zinc-600">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-zinc-400" />
                <span>
                  {new Date(event.event_date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                  {event.event_time ? ` à ${event.event_time}` : ''}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-zinc-400" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-white border border-zinc-200 text-zinc-800 hover:bg-zinc-50 text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  <span>Lien copié !</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-zinc-500" />
                  <span>Copier le lien public</span>
                </>
              )}
            </button>

            <button
              onClick={() => onNavigate(`/e/${event.id}`)}
              className="inline-flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-white border border-zinc-200 text-zinc-800 hover:bg-zinc-50 text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Eye className="w-4 h-4 text-zinc-500" />
              <span>Tester l'invitation</span>
            </button>

            <button
              onClick={() => setShowCardModal(true)}
              className="inline-flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Carte HD</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-8">
          <div className="bg-white rounded-3xl p-5 border border-zinc-200/80 shadow-sm">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
              Présences Totales
            </span>
            <div className="mt-1 text-3xl font-black text-emerald-700 font-sans">
              {totalHeadcount}
            </div>
            <span className="text-[11px] text-zinc-400 mt-1 block">personnes attendues</span>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-zinc-200/80 shadow-sm">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
              Réponses RSVP
            </span>
            <div className="mt-1 text-3xl font-black text-zinc-950 font-sans">
              {rsvps.length}
            </div>
            <span className="text-[11px] text-zinc-400 mt-1 block">formulaires validés</span>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-zinc-200/80 shadow-sm">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
              En Couple (+1)
            </span>
            <div className="mt-1 text-3xl font-black text-blue-700 font-sans">
              {totalCouples}
            </div>
            <span className="text-[11px] text-zinc-400 mt-1 block">({totalCouples * 2} personnes)</span>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-zinc-200/80 shadow-sm">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
              Individuels / Solo
            </span>
            <div className="mt-1 text-3xl font-black text-zinc-800 font-sans">
              {totalSingles}
            </div>
            <span className="text-[11px] text-zinc-400 mt-1 block">({totalSingles} personnes)</span>
          </div>
        </div>

        {/* Guest List Controls (Search, Filter Tabs, CSV Export) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-100">
            <div>
              <h2 className="text-xl font-bold text-zinc-950 tracking-tight">
                Liste des Invités Confirmés ({rsvps.length})
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Mis à jour en direct dès qu’un invité valide sa venue.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                disabled={rsvps.length === 0}
                className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200/70 transition-all cursor-pointer disabled:opacity-50"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                <span>Exporter en CSV</span>
              </button>
            </div>
          </div>

          {/* Search & Filter pills */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 my-5">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un invité..."
                className="w-full py-2 pl-9 pr-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {(['Tout', 'A-Z', 'Recents', 'Anciens', 'Couples'] as FilterType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeFilter === tab
                      ? 'bg-zinc-950 text-white shadow-sm'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Attendee List */}
          {filteredRSVPs.length === 0 ? (
            <div className="py-16 text-center text-zinc-500">
              <Users className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-zinc-800">Aucun invité pour le moment</p>
              <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
                Partagez votre lien d’invitation pour que vos invités puissent confirmer leur venue.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100">
              {filteredRSVPs.map((inv) => (
                <div
                  key={inv.id}
                  className="py-3.5 flex items-center justify-between gap-4 hover:bg-zinc-50/60 rounded-xl px-2 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center flex-shrink-0">
                      <CheckSquare className="w-4 h-4 text-white stroke-[2.5]" />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-extrabold text-zinc-950 truncate">
                        {formatGuestName(inv)}
                      </span>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
                        <Clock className="w-3 h-3 text-zinc-400" />
                        <span>Confirmé le {formatDate(inv.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {inv.with_plus_one ? (
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 text-[11px] font-bold border border-blue-200">
                        2 personnes (Couple)
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700 text-[11px] font-bold">
                        1 personne
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card HD Modal */}
      {showCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative border border-zinc-100">
            <h3 className="text-xl font-bold text-zinc-950 mb-1">
              Carte d’invitation officielle
            </h3>
            <p className="text-xs text-zinc-500 mb-6">
              Téléchargez votre carte au format HD 1080x1560.
            </p>

            <CardCanvasRenderer event={event} />

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setShowCardModal(false)}
                className="text-xs text-zinc-500 hover:text-zinc-800 font-semibold cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
