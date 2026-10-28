import React, { useState, useEffect } from 'react';
import {
  Plus,
  Calendar,
  MapPin,
  Users,
  Copy,
  Check,
  Eye,
  Download,
  Sparkles,
  ArrowRight,
  Search,
} from 'lucide-react';
import type { EventItem, AuthUser } from '../types';
import { listUserEvents, listRSVPsForEvent } from '../lib/supabase';
import { PALETTES } from '../lib/palettes';
import { CardCanvasRenderer } from './CardCanvasRenderer';

interface DashboardViewProps {
  user: AuthUser | null;
  onNavigate: (path: string) => void;
  onOpenAuth: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  onNavigate,
  onOpenAuth: _onOpenAuth,
}) => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [rsvpCounts, setRsvpCounts] = useState<Record<string, number>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadModalEvent, setDownloadModalEvent] = useState<EventItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const evts = await listUserEvents(user?.id);
      setEvents(evts);

      // Load RSVP counts for each event
      const counts: Record<string, number> = {};
      await Promise.all(
        evts.map(async (ev) => {
          const rsvps = await listRSVPsForEvent(ev.id);
          const totalPeople = rsvps.reduce(
            (sum, r) => sum + (r.with_plus_one ? 2 : 1),
            0
          );
          counts[ev.id] = totalPeople;
        })
      );
      setRsvpCounts(counts);
      setIsLoading(false);
    }
    loadData();
  }, [user]);

  const handleCopyLink = (eventId: string) => {
    const link = `${window.location.origin}/e/${eventId}`;
    navigator.clipboard.writeText(link);
    setCopiedId(eventId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredEvents = events.filter((ev) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      ev.title.toLowerCase().includes(q) ||
      ev.topic.toLowerCase().includes(q) ||
      ev.location.toLowerCase().includes(q)
    );
  });

  const totalAttendeesAllEvents = Object.values(rsvpCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-[#fafaf9] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-zinc-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Espace Organisateur</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
              Bonjour, {user?.name || user?.email?.split('@')[0] || 'Organisateur'}
            </h1>
            <p className="text-sm text-zinc-600 mt-1">
              Gérez vos cartons d'invitation et visualisez les présences en temps réel.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/create')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-950 hover:bg-black text-white text-sm font-semibold shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Créer un événement ($1)</span>
            </button>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 my-8">
          <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-sm">
            <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">
              Total Événements
            </span>
            <div className="mt-2 text-3xl font-black text-zinc-950 font-sans">
              {events.length}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-sm">
            <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">
              Total Invités Confirmés
            </span>
            <div className="mt-2 text-3xl font-black text-emerald-700 font-sans">
              {totalAttendeesAllEvents}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-sm">
            <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">
              Statut du Service
            </span>
            <div className="mt-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-bold text-zinc-900">Actif en direct (Supabase)</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par titre, ville ou catégorie..."
              className="w-full py-2.5 pl-10 pr-4 rounded-2xl bg-white border border-zinc-200 text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 shadow-sm"
            />
          </div>
          <span className="text-xs font-semibold text-zinc-500 self-center">
            {filteredEvents.length} événement(s)
          </span>
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="py-20 text-center text-sm font-medium text-zinc-500">
            Chargement de vos événements...
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-zinc-300 max-w-lg mx-auto my-8">
            <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto mb-4 text-zinc-400">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900">Aucun événement trouvé</h3>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1 mb-6">
              Commencez par créer votre première invitation personnalisée pour seulement $1.
            </p>
            <button
              onClick={() => onNavigate('/create')}
              className="px-6 py-3 rounded-full bg-zinc-900 hover:bg-black text-white text-xs sm:text-sm font-semibold shadow-sm cursor-pointer"
            >
              Créer mon premier événement
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((ev) => {
              const theme = PALETTES[ev.palette] || PALETTES.emerald;
              const count = rsvpCounts[ev.id] || 0;
              const isCopied = copiedId === ev.id;

              return (
                <div
                  key={ev.id}
                  className="bg-white rounded-3xl border border-zinc-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                >
                  {/* Card Top Accent Banner */}
                  <div
                    className="h-3 w-full"
                    style={{ backgroundColor: theme.primary }}
                  />

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Topic & Variety Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-zinc-100 text-zinc-800">
                          {ev.topic}
                        </span>

                        <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/70">
                          $1 Payé • Actif
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-zinc-950 tracking-tight group-hover:text-black">
                        {ev.title}
                      </h3>

                      {/* Date & Location */}
                      <div className="mt-3 space-y-1.5 text-xs text-zinc-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-zinc-400" />
                          <span>
                            {new Date(ev.event_date).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                            {ev.event_time ? ` à ${ev.event_time}` : ''}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-zinc-400" />
                          <span className="truncate">{ev.location}</span>
                        </div>
                      </div>

                      {/* Attendee Live Stat */}
                      <div className="mt-5 p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/60 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700">
                          <Users className="w-4 h-4 text-emerald-600" />
                          <span>Présences confirmées</span>
                        </div>
                        <span className="text-base font-extrabold text-zinc-900">
                          {count} {count > 1 ? 'personnes' : 'personne'}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-6 pt-5 border-t border-zinc-100 flex flex-col gap-2.5">
                      <button
                        onClick={() => onNavigate(`/dashboard/event/${ev.id}`)}
                        className="w-full py-2.5 px-4 rounded-xl bg-zinc-950 hover:bg-black text-white text-xs font-semibold shadow-sm active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Users className="w-4 h-4" />
                        <span>Tableau de Bord Live</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <div className="grid grid-cols-3 gap-2">
                        {/* Copy Link */}
                        <button
                          type="button"
                          onClick={() => handleCopyLink(ev.id)}
                          className="py-2 px-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          title="Copier le lien public"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                              <span>Copié</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-zinc-600" />
                              <span>Lien</span>
                            </>
                          )}
                        </button>

                        {/* Preview Public Card */}
                        <button
                          type="button"
                          onClick={() => onNavigate(`/e/${ev.id}`)}
                          className="py-2 px-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          title="Voir la carte"
                        >
                          <Eye className="w-3.5 h-3.5 text-zinc-600" />
                          <span>Aperçu</span>
                        </button>

                        {/* Download HD Card */}
                        <button
                          type="button"
                          onClick={() => setDownloadModalEvent(ev)}
                          className="py-2 px-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          title="Télécharger la carte en HD"
                        >
                          <Download className="w-3.5 h-3.5 text-zinc-600" />
                          <span>Carte HD</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Download Modal */}
      {downloadModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative border border-zinc-100">
            <h3 className="text-xl font-bold text-zinc-950 mb-1">
              Télécharger la carte d’invitation
            </h3>
            <p className="text-xs text-zinc-500 mb-6">
              Fichier PNG haute résolution (1080x1560) prêt à être partagé ou imprimé.
            </p>

            <CardCanvasRenderer event={downloadModalEvent} />

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setDownloadModalEvent(null)}
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
