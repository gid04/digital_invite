import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Send,
  Users,
  Eye,
  CheckCircle2,
  Palette,
  ShieldCheck,
  ChevronRight,
  Smartphone,
  Layers,
  Heart,
  Cake,
  GlassWater,
  Briefcase,
  ExternalLink,
} from 'lucide-react';
import { PALETTES } from '../lib/palettes';
import type { PaletteId } from '../types';

interface LandingPageProps {
  onStartCreation: () => void;
  onOpenDemoCard: () => void;
  onOpenAuth?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartCreation,
  onOpenDemoCard,
  onOpenAuth: _onOpenAuth,
}) => {
  const [selectedDemoPalette, setSelectedDemoPalette] = useState<PaletteId>('emerald');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const demoTheme = PALETTES[selectedDemoPalette];

  const features = [
    {
      icon: <Layers className="w-6 h-6 text-emerald-600" />,
      title: 'Enveloppe Interactive & Tactile',
      description:
        'Vos convives ouvrent un pli digital avec sceau de cire animé et rabats fluides comme une vraie enveloppe haut de gamme.',
    },
    {
      icon: <Users className="w-6 h-6 text-blue-600" />,
      title: 'Suivi des Présences en Direct',
      description:
        'Votre tableau de bord se remplit instantanément dès qu’un invité valide sa venue (seul ou avec accompagnant).',
    },
    {
      icon: <Palette className="w-6 h-6 text-purple-600" />,
      title: 'Palettes & Thèmes Raffinés',
      description:
        'Personnalisez l’ambiance chromatique, les textes guidés et la formule (invitations solo ou couples) en 3 minutes.',
    },
    {
      icon: <Smartphone className="w-6 h-6 text-amber-600" />,
      title: 'Partage Instantané WhatsApp & SMS',
      description:
        'Un lien unique et léger, sans aucune application à installer pour vos invités. Fonctionne sur tous les smartphones.',
    },
    {
      icon: <Send className="w-6 h-6 text-rose-600" />,
      title: 'Téléchargement HD Inclus',
      description:
        'Générez et téléchargez votre carte d’invitation au format PNG haute définition (1080x1560) prête à imprimer ou conserver.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      title: 'Sans Abonnement Caché',
      description:
        'Payez uniquement 1$ par événement créé. Accès à vie à votre tableau de bord et à vos listes d’invités exportables.',
    },
  ];

  const topics = [
    { name: 'Mariages', icon: <Heart className="w-4 h-4 text-rose-500" /> },
    { name: 'Anniversaires', icon: <Cake className="w-4 h-4 text-amber-500" /> },
    { name: 'Baptêmes & Naissances', icon: <Sparkles className="w-4 h-4 text-cyan-500" /> },
    { name: 'Départs à la Retraite', icon: <Briefcase className="w-4 h-4 text-emerald-500" /> },
    { name: 'Galas & Soirées', icon: <GlassWater className="w-4 h-4 text-purple-500" /> },
  ];

  const faqs = [
    {
      q: 'Comment fonctionne la confirmation des invités ?',
      a: 'Vos invités reçoivent votre lien unique Digitinvite. En cliquant dessus sur leur téléphone, ils ouvrent l’enveloppe interactive, découvrent votre carte, et cliquent sur « Je confirme ma présence ». Leurs noms et présences apparaissent en temps réel dans votre tableau de bord.',
    },
    {
      q: 'Y a-t-il une limite du nombre d’invités pour 1$ ?',
      a: 'Non, aucune limite ! Vous pouvez inviter 10 ou 1000 personnes pour votre événement. Le tarif unique de 1$ couvre l’événement complet et toutes ses confirmations.',
    },
    {
      q: 'Puis-je exporter ma liste pour le jour J ?',
      a: 'Absolument. Votre espace vous permet d’exporter la liste complète des invités confirmés en CSV ou de la consulter en direct le jour de la réception.',
    },
    {
      q: 'Les invités doivent-ils créer un compte ou télécharger une application ?',
      a: 'Aucune inscription ni téléchargement n’est requis pour vos invités. Le lien s’ouvre directement et instantanément dans leur navigateur mobile ou ordinateur.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafaf9] text-zinc-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Soft Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none opacity-60">
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl" />
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-amber-100/60 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-zinc-200/90 shadow-sm text-xs font-semibold text-zinc-800 mb-6 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>La référence de l’invitation digitale moderne</span>
              <span className="text-zinc-300">|</span>
              <span className="text-emerald-700 font-bold">1$ par événement</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-950 font-sans leading-[1.12]">
              Créez des invitations digitales inoubliables. <br />
              <span className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-900 bg-clip-text text-transparent">
                Suivez vos présences en direct.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-base sm:text-lg text-zinc-600 leading-relaxed max-w-2xl">
              Fini les cartons perdus et les relances manuelles. Créez votre carte avec enveloppe
              interactive, partagez votre lien WhatsApp ou SMS, et voyez votre liste d'invités se
              remplir en temps réel.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-md">
              <button
                onClick={onStartCreation}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-zinc-950 hover:bg-black text-white font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
              >
                <Sparkles className="w-4 h-4 text-amber-300 transition-transform group-hover:rotate-12" />
                <span>Créer mon invitation (1$)</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onOpenDemoCard}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white hover:bg-zinc-100 text-zinc-800 font-semibold text-sm sm:text-base border border-zinc-200 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-zinc-600" />
                <span>Tester l’enveloppe</span>
              </button>
            </div>

            {/* Trust badges */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Sans engagement
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Suivi RSVP temps réel
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Téléchargement HD offert
              </span>
            </div>
          </div>

          {/* Interactive Envelope & Card Teaser Preview */}
          <div id="demo" className="mt-14 max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-zinc-200/80">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Left: Palette Switcher & Intro */}
                <div className="flex-1 text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Aperçu tactile en direct</span>
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-900 tracking-tight">
                    Choisissez votre palette de couleur
                  </h3>
                  <p className="text-sm text-zinc-600 mt-2 leading-relaxed">
                    Chaque événement dispose de sa propre atmosphère chromatique, adaptée au thème de
                    votre fête.
                  </p>

                  {/* Palette Selector Buttons */}
                  <div className="mt-5 space-y-2">
                    {(Object.keys(PALETTES) as PaletteId[]).map((key) => {
                      const p = PALETTES[key];
                      const isSelected = selectedDemoPalette === key;
                      return (
                        <button
                          key={key}
                          onClick={() => setSelectedDemoPalette(key)}
                          className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                              : 'bg-zinc-50 text-zinc-800 border-zinc-200 hover:bg-zinc-100'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-5 h-5 rounded-full border border-white/20 shadow-inner"
                              style={{ backgroundColor: p.primary }}
                            />
                            <span className="text-xs sm:text-sm font-semibold">{p.name}</span>
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <button
                      onClick={onOpenDemoCard}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 hover:bg-black text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
                    >
                      <span>Ouvrir l’enveloppe complète</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Right: Simulated Mobile Card Display */}
                <div className="flex-shrink-0 w-full sm:w-[320px] flex flex-col items-center">
                  <div
                    className={`w-full rounded-[28px] p-6 shadow-2xl border border-white/20 text-white transition-all duration-500 ${demoTheme.cardBg}`}
                    style={{ backgroundColor: demoTheme.primary }}
                  >
                    <div className="text-center">
                      <span className="text-[10px] font-bold tracking-[0.25em] text-amber-300 uppercase block mb-1">
                        — INVITATION —
                      </span>
                      <h4 className="text-xl font-bold font-serif tracking-wide text-white mt-1">
                        Départ à la Retraite
                      </h4>
                      <p className="text-xs text-white/80 mt-1">Vendredi 20 Novembre 2026</p>
                      <div className="my-3 h-px bg-white/20 w-16 mx-auto" />
                      <p className="text-[11px] italic text-white/90 leading-relaxed px-2">
                        “Venez célébrer avec nous cette nouvelle page qui s'ouvre.”
                      </p>
                      <div className="mt-5">
                        <div
                          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold text-center tracking-wide border border-white/20 ${demoTheme.buttonClass}`}
                        >
                          Je confirme ma présence
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] text-zinc-600 mt-3 font-medium">
                    Aperçu interactif • Thème {demoTheme.name}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Topics Carousel Pill Bar */}
          <div className="mt-12 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wider mr-2">
              Parfait pour :
            </span>
            {topics.map((t) => (
              <div
                key={t.name}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-zinc-200/80 text-xs font-semibold text-zinc-800 shadow-sm"
              >
                {t.icon}
                <span>{t.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 sm:py-24 bg-white border-y border-zinc-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold tracking-[0.2em] text-emerald-700 uppercase">
              Fonctionnalités Clés
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight mt-2">
              Tout ce dont vous avez besoin pour gérer vos invités sans stress.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="p-7 rounded-3xl bg-zinc-50/70 border border-zinc-200/80 hover:bg-zinc-50 hover:border-zinc-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white border border-zinc-200/80 flex items-center justify-center shadow-sm mb-5">
                    {feat.icon}
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 tracking-tight mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-zinc-600 leading-relaxed">{feat.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transparent $1 Pricing Section */}
      <section id="pricing" className="py-20 sm:py-28 bg-[#fafaf9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-zinc-200 text-center relative overflow-hidden">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-200">
              <span>Tarif Unique & Transparent</span>
            </div>

            <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
              1$ par événement créé
            </h2>
            <p className="text-sm text-zinc-600 mt-2">
              Pas d’abonnement récurrent. Pas de frais par invité.
            </p>

            <div className="my-8 flex items-baseline justify-center gap-2">
              <span className="text-6xl font-black text-zinc-950 font-sans tracking-tight">$1</span>
              <span className="text-sm font-semibold text-zinc-600">/ événement</span>
            </div>

            <div className="space-y-3 text-left max-w-sm mx-auto mb-8">
              {[
                'Enveloppe interactive avec ouverture animée',
                'Nombre d’invités & confirmations illimité',
                'Tableau de bord de présence en temps réel',
                'Formulaire RSVP adapté (seul ou avec accompagnant)',
                'Téléchargement de la carte en haute résolution (PNG)',
                'Export de la liste des invités au format CSV',
                'Partage en 1 clic via WhatsApp, SMS & Réseaux',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-xs sm:text-sm text-zinc-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <button
              onClick={onStartCreation}
              className="w-full py-4 rounded-full bg-zinc-950 hover:bg-black text-white font-semibold text-sm shadow-lg active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Créer mon événement maintenant ($1)</span>
            </button>
            <p className="text-[11px] text-zinc-600 mt-3 font-medium">
              Paiement unique sécurisé • Activation instantanée
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24 bg-white border-t border-zinc-200/80">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
              Questions Fréquentes
            </h2>
            <p className="text-sm text-zinc-600 mt-2">
              Tout ce qu'il faut savoir sur l'expérience Digitinvite
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = activeFaq === i;
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-zinc-200/80 bg-zinc-50/50 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : i)}
                    className="w-full p-5 text-left flex items-center justify-between font-semibold text-sm sm:text-base text-zinc-900 hover:text-black cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronRight
                      className={`w-4 h-4 text-zinc-600 transition-transform duration-200 ${
                        isOpen ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-zinc-600 leading-relaxed border-t border-zinc-200/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-[#fafaf9] border-t border-zinc-200 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black tracking-tight text-zinc-900">
              Digit<span className="text-emerald-700">invite</span>
            </span>
            <span className="text-xs text-zinc-600">• Invitations digitales & gestion des présences</span>
          </div>

          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} Digitinvite. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
};
