import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Copy,
  Share2,
  Lock,
  CreditCard,
  CheckCircle2,
  Users,
  User,
  ShieldCheck,
  AlertCircle,
  Eye,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TOPIC_PRESETS, PALETTES } from '../lib/palettes';
import type { PaletteId, EventItem, AuthUser } from '../types';
import { createEvent } from '../lib/supabase';
import { CardCanvasRenderer } from './CardCanvasRenderer';

interface EventCreationWizardProps {
  user: AuthUser | null;
  onNavigate: (path: string) => void;
  onOpenAuth: () => void;
}

type WizardStep = 1 | 2 | 3 | 4 | 5;

const MAX_MESSAGE_WORDS = 45;

export const EventCreationWizard: React.FC<EventCreationWizardProps> = ({
  user,
  onNavigate,
  onOpenAuth,
}) => {
  const [step, setStep] = useState<WizardStep>(1);

  // Form State
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState(TOPIC_PRESETS[0]);
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [location, setLocation] = useState('');
  const [palette, setPalette] = useState<PaletteId>('emerald');
  const [variety, setVariety] = useState<'single' | 'couple'>('couple');
  const [message, setMessage] = useState('');
  const [dressCode, setDressCode] = useState('');
  const [rsvpDeadline, setRsvpDeadline] = useState('');

  // Payment & Creation State
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [createdEvent, setCreatedEvent] = useState<EventItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Word count calculation
  const getWordCount = (text: string) => {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  };
  const wordCount = getWordCount(message);
  const isOverWordLimit = wordCount > MAX_MESSAGE_WORDS;

  // Step 1 Validation
  const canProceedStep1 = title.trim() && eventDate && location.trim();

  // Handle finalize and $1 payment
  const handleConfirmPaymentAndCreate = async () => {
    setErrorMsg('');
    setIsProcessingPayment(true);

    try {
      // Simulate card processing delay for realism
      await new Promise((res) => setTimeout(res, 900));

      const newEvt = await createEvent({
        user_id: user?.id || null,
        title: title.trim(),
        topic,
        event_date: eventDate,
        event_time: eventTime || undefined,
        location: location.trim(),
        variety,
        palette,
        message: message.trim() || undefined,
        dress_code: dressCode.trim() || undefined,
        rsvp_deadline: rsvpDeadline.trim() || undefined,
        is_paid: true,
        is_active: true,
      });

      setCreatedEvent(newEvt);
      setIsProcessingPayment(false);
      setStep(5);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        console.warn(e);
      }
    } catch (err: any) {
      console.error('Error creating event:', err);
      setIsProcessingPayment(false);
      setErrorMsg('Erreur lors de la création. Veuillez réessayer.');
    }
  };

  const handleCopyLink = () => {
    if (!createdEvent) return;
    const url = `${window.location.origin}/e/${createdEvent.id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareWhatsApp = () => {
    if (!createdEvent) return;
    const url = `${window.location.origin}/e/${createdEvent.id}`;
    const text = encodeURIComponent(
      `Bonjour ! Vous êtes convié(e) à : ${createdEvent.title}. Ouvrez votre invitation digitale ici : ${url}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const activeTheme = PALETTES[palette];

  return (
    <div className="min-h-screen bg-[#fafaf9] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={() => onNavigate('/dashboard')}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à mon espace</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-500">Tarif fixe :</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200">
              1.00 USD
            </span>
          </div>
        </div>

        {/* Stepper Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between max-w-xl mx-auto relative">
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-zinc-200 -z-0" />
            <div
              className="absolute top-1/2 left-0 -translate-y-1/2 h-1 bg-zinc-900 -z-0 transition-all duration-300"
              style={{ width: `${((step - 1) / 4) * 100}%` }}
            />

            {[
              { num: 1, label: 'Événement' },
              { num: 2, label: 'Thème & Format' },
              { num: 3, label: 'Détails & RSVP' },
              { num: 4, label: 'Paiement $1' },
              { num: 5, label: 'Prêt !' },
            ].map((s) => {
              const isPast = step > s.num;
              const isCurrent = step === s.num;
              return (
                <div key={s.num} className="flex flex-col items-center gap-1.5 z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isPast
                        ? 'bg-zinc-900 text-white'
                        : isCurrent
                        ? 'bg-zinc-900 text-white ring-4 ring-zinc-200'
                        : 'bg-white text-zinc-400 border border-zinc-200'
                    }`}
                  >
                    {isPast ? <Check className="w-4 h-4 stroke-[3]" /> : s.num}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs font-semibold hidden sm:block ${
                      isCurrent ? 'text-zinc-900' : 'text-zinc-600'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 1: Basic Event Details */}
        {step === 1 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-zinc-200/80 animate-fade-in">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-zinc-950 tracking-tight">
                Quel événement célébrez-vous ?
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Renseignez les informations essentielles qui figureront sur l'invitation.
              </p>
            </div>

            <div className="space-y-5">
              {/* Topic Selector */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                  Catégorie d'événement
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {TOPIC_PRESETS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTopic(t)}
                      className={`p-3 rounded-2xl text-xs font-bold border transition-all text-center cursor-pointer ${
                        topic === t
                          ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                          : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5" htmlFor="evt-title">
                  Titre de l'invitation *
                </label>
                <input
                  id="evt-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ex: Départ à la Retraite de Michel, Mariage de Claire & Lucas..."
                  className="w-full py-3 px-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all font-medium"
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5" htmlFor="evt-date">
                    Date de l'événement *
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                    <input
                      id="evt-date"
                      type="date"
                      required
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full py-2.5 pl-10 pr-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5" htmlFor="evt-time">
                    Heure (optionnel)
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                    <input
                      id="evt-time"
                      type="time"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      className="w-full py-2.5 pl-10 pr-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5" htmlFor="evt-location">
                  Lieu de réception / Adresse *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                  <input
                    id="evt-location"
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="ex: Pavillon Royal, 12 avenue des Cèdres, Paris"
                    className="w-full py-3 pl-10 pr-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  disabled={!canProceedStep1}
                  onClick={() => setStep(2)}
                  className="px-7 py-3.5 rounded-full bg-zinc-950 hover:bg-black text-white text-sm font-semibold shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>Continuer : Thème & Format</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Template Card & Styling */}
        {step === 2 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-zinc-200/80 animate-fade-in">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-zinc-950 tracking-tight">
                Palette de couleurs & Format d'invitation
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Choisissez l'ambiance visuelle et définissez si les invités peuvent venir avec un
                accompagnant.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Left Column: Form Controls */}
              <div className="space-y-6">
                {/* Variety Selector */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2.5">
                    Variété d'invitation
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setVariety('couple')}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        variety === 'couple'
                          ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                          : 'bg-zinc-50 text-zinc-800 border-zinc-200 hover:bg-zinc-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Users className="w-4 h-4 text-emerald-400" />
                        {variety === 'couple' && <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />}
                      </div>
                      <span className="text-xs sm:text-sm font-bold block">Couple & Plus-One</span>
                      <span className="text-[11px] opacity-75 mt-0.5 block leading-tight">
                        Option "Je viens avec M/Mme" activée sur le RSVP.
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setVariety('single')}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        variety === 'single'
                          ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                          : 'bg-zinc-50 text-zinc-800 border-zinc-200 hover:bg-zinc-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <User className="w-4 h-4 text-blue-400" />
                        {variety === 'single' && <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />}
                      </div>
                      <span className="text-xs sm:text-sm font-bold block">Individuel / Solo</span>
                      <span className="text-[11px] opacity-75 mt-0.5 block leading-tight">
                        1 personne par confirmation de présence.
                      </span>
                    </button>
                  </div>
                </div>

                {/* Color Palette Selector */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2.5">
                    Palette de couleurs
                  </label>
                  <div className="space-y-2.5">
                    {(Object.keys(PALETTES) as PaletteId[]).map((key) => {
                      const p = PALETTES[key];
                      const isSelected = palette === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setPalette(key)}
                          className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                              : 'bg-zinc-50 text-zinc-800 border-zinc-200 hover:bg-zinc-100'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-6 h-6 rounded-full border border-white/30 shadow-inner"
                              style={{ backgroundColor: p.primary }}
                            />
                            <span className="text-xs sm:text-sm font-bold">{p.name}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Live Card Preview */}
              <div className="bg-zinc-50 rounded-3xl p-6 border border-zinc-200 flex flex-col items-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-3 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-zinc-600" /> Aperçu de votre carte
                </span>

                <div
                  className="w-full max-w-[280px] rounded-[24px] p-6 shadow-2xl border border-white/20 text-white text-center transition-all duration-300"
                  style={{ backgroundColor: activeTheme.primary }}
                >
                  <span className="text-[9px] font-bold tracking-[0.25em] text-amber-300 uppercase block mb-1">
                    — {topic.toUpperCase()} —
                  </span>
                  <h4 className="text-lg font-bold font-serif text-white tracking-wide mt-1">
                    {title || 'Titre de votre événement'}
                  </h4>
                  <p className="text-[11px] text-white/80 mt-1">
                    {eventDate
                      ? new Date(eventDate).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                      : 'Date de l’événement'}
                  </p>
                  <p className="text-[10px] text-white/70 truncate mt-0.5">
                    {location || 'Lieu de réception'}
                  </p>
                  <div className="my-3 h-px bg-white/20 w-12 mx-auto" />
                  <div className="text-[10px] italic text-zinc-300/90 leading-snug">
                    Format {variety === 'couple' ? 'Couple & Accompagnant' : 'Individuel'}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-8 pt-4 border-t border-zinc-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-full text-zinc-600 hover:text-zinc-900 text-sm font-semibold flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Retour</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-7 py-3.5 rounded-full bg-zinc-950 hover:bg-black text-white text-sm font-semibold shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Continuer : Détails & RSVP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Additional Details & Word Capacity Guide */}
        {step === 3 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-zinc-200/80 animate-fade-in">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-zinc-950 tracking-tight">
                Détails complémentaires & Limite de mots
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Pour assurer une esthétique parfaite sur mobile et carton imprimé, le message est
                calibré à {MAX_MESSAGE_WORDS} mots.
              </p>
            </div>

            <div className="space-y-6">
              {/* Host message with word count tracker */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider" htmlFor="evt-message">
                    Message de bienvenue / Mot d'accueil
                  </label>
                  <span
                    className={`text-xs font-bold ${
                      isOverWordLimit ? 'text-red-600' : 'text-zinc-600'
                    }`}
                  >
                    {wordCount} / {MAX_MESSAGE_WORDS} mots
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isOverWordLimit
                        ? 'bg-red-500'
                        : wordCount > MAX_MESSAGE_WORDS * 0.8
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{
                      width: `${Math.min(100, (wordCount / MAX_MESSAGE_WORDS) * 100)}%`,
                    }}
                  />
                </div>

                <textarea
                  id="evt-message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="ex: Venez célébrer avec nous cette nouvelle page qui s'ouvre après tant de belles années partagées. Votre présence est le plus beau des cadeaux."
                  className="w-full p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all font-medium resize-none"
                />

                {isOverWordLimit && (
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1.5 mt-1.5">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>
                      Veuillez raccourcir légèrement votre message pour préserver l'élégance de la carte.
                    </span>
                  </p>
                )}
              </div>

              {/* Dress Code & Deadline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5" htmlFor="evt-dress">
                    Dress Code (optionnel)
                  </label>
                  <input
                    id="evt-dress"
                    type="text"
                    value={dressCode}
                    onChange={(e) => setDressCode(e.target.value)}
                    placeholder="ex: Chic décontracté, Tenue de gala, Blanc..."
                    className="w-full py-3 px-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5" htmlFor="evt-deadline">
                    Date limite de réponse (optionnel)
                  </label>
                  <input
                    id="evt-deadline"
                    type="text"
                    value={rsvpDeadline}
                    onChange={(e) => setRsvpDeadline(e.target.value)}
                    placeholder="ex: 15 Novembre 2026"
                    className="w-full py-3 px-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              {/* Navigation */}
              <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-full text-zinc-600 hover:text-zinc-900 text-sm font-semibold flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Retour</span>
                </button>

                <button
                  type="button"
                  disabled={isOverWordLimit}
                  onClick={() => setStep(4)}
                  className="px-7 py-3.5 rounded-full bg-zinc-950 hover:bg-black text-white text-sm font-semibold shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>Continuer : Confirmer ($1)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Final Review & $1 Payment */}
        {step === 4 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-zinc-200/80 animate-fade-in max-w-xl mx-auto">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 mb-3 border border-emerald-200">
                <CreditCard className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-950 tracking-tight">
                Confirmation & Paiement de 1$
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Frais uniques de gestion d'événement et suivi des présences en temps réel.
              </p>
            </div>

            {/* Event Summary Box */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2 mb-6 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500 font-medium">Événement :</span>
                <span className="font-bold text-zinc-900">{title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 font-medium">Catégorie :</span>
                <span className="font-bold text-zinc-900">{topic}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 font-medium">Date & Lieu :</span>
                <span className="font-bold text-zinc-900 text-right">
                  {eventDate} • {location}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 font-medium">Formule :</span>
                <span className="font-bold text-zinc-900">
                  {variety === 'couple' ? 'Couple & Accompagnant' : 'Individuel'}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-zinc-200">
                <span className="font-extrabold text-zinc-900">Montant total à régler :</span>
                <span className="font-black text-emerald-700 text-base">1.00 USD</span>
              </div>
            </div>

            {/* User Login Notice if not logged in */}
            {!user && (
              <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-amber-800">
                  <p className="font-bold">Vous n'êtes pas encore connecté.</p>
                  <p className="mt-0.5">
                    Votre invitation sera liée à votre espace local. Vous pouvez vous connecter pour
                    sauvegarder vos événements sur votre compte cloud.
                  </p>
                  <button
                    type="button"
                    onClick={onOpenAuth}
                    className="mt-2 text-xs font-bold text-zinc-900 underline hover:text-black cursor-pointer"
                  >
                    Se connecter avec Email / Google
                  </button>
                </div>
              </div>
            )}

            {errorMsg && (
              <p className="text-xs text-red-600 bg-red-50 p-3 rounded-xl mb-4 font-semibold text-center">
                {errorMsg}
              </p>
            )}

            {/* Pay Button */}
            <button
              type="button"
              disabled={isProcessingPayment}
              onClick={handleConfirmPaymentAndCreate}
              className="w-full py-4 rounded-full bg-zinc-950 hover:bg-black text-white font-semibold text-sm shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isProcessingPayment ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Activation de l'événement...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>Payer 1.00$ & Activer mon invitation</span>
                </>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-zinc-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Paiement sécurisé crypté SSL • Facturation 1$ unique</span>
            </div>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="text-xs text-zinc-500 hover:text-zinc-800 font-medium cursor-pointer"
              >
                Modifier les détails
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Success, Download Card & Shareable Link */}
        {step === 5 && createdEvent && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-zinc-200/80 animate-fade-in text-center max-w-2xl mx-auto">
            {/* Success icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mb-4 shadow-sm">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
              Félicitations ! Votre invitation est en ligne.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 mt-2 max-w-md mx-auto">
              Partagez le lien avec vos convives et suivez les réponses en direct sur votre tableau de
              bord.
            </p>

            {/* Generated Shareable Link Box */}
            <div className="my-6 p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row items-center gap-3">
              <div className="flex-1 text-left min-w-0">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
                  Lien d'invitation unique
                </span>
                <span className="text-xs sm:text-sm font-semibold text-zinc-900 truncate block">
                  {`${window.location.origin}/e/${createdEvent.id}`}
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex-1 sm:flex-none py-2 px-4 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                      <span>Copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-white" />
                      <span>Copier</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="flex-1 sm:flex-none py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-white" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Downloadable High-Res Card */}
            <div className="my-8 pt-6 border-t border-zinc-100 flex flex-col items-center">
              <span className="text-xs font-bold text-zinc-700 uppercase tracking-wider mb-4">
                Télécharger la carte d’invitation HD
              </span>
              <CardCanvasRenderer event={createdEvent} />
            </div>

            {/* CTA to Open Live Event Dashboard */}
            <div className="pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate(`/dashboard/event/${createdEvent.id}`)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-zinc-950 hover:bg-black text-white text-sm font-bold shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Ouvrir le tableau de bord en direct</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate(`/e/${createdEvent.id}`)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-zinc-100 text-zinc-800 text-sm font-semibold border border-zinc-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-zinc-600" />
                <span>Tester comme un invité</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
