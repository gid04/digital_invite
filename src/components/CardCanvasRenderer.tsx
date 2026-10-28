import React, { useRef, useEffect, useState } from 'react';
import { Download, Check, Sparkles } from 'lucide-react';
import type { EventItem } from '../types';
import { PALETTES } from '../lib/palettes';

interface CardCanvasRendererProps {
  event: EventItem;
  className?: string;
  onDownloaded?: () => void;
  showPreview?: boolean;
}

export const CardCanvasRenderer: React.FC<CardCanvasRendererProps> = ({
  event,
  className = '',
  onDownloaded,
  showPreview = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High resolution canvas for sharp printing & sharing (1080 x 1560)
    const width = 1080;
    const height = 1560;
    canvas.width = width;
    canvas.height = height;

    const theme = PALETTES[event.palette] || PALETTES.emerald;

    // 1. Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, theme.primary);
    bgGrad.addColorStop(0.5, theme.secondary);
    bgGrad.addColorStop(1, '#05070a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Subtle radial glow
    const glow = ctx.createRadialGradient(width / 2, height / 2, 100, width / 2, height / 2, 600);
    glow.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
    glow.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    // 3. Ornate Double Borders
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(55, 55, width - 110, height - 110);

    // Corner decorative accents
    const drawCorner = (x: number, y: number, angle: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.strokeStyle = theme.accent;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-20, 0);
      ctx.lineTo(20, 0);
      ctx.moveTo(0, -20);
      ctx.lineTo(0, 20);
      ctx.stroke();
      ctx.restore();
    };

    drawCorner(55, 55, 0);
    drawCorner(width - 55, 55, 0);
    drawCorner(55, height - 55, 0);
    drawCorner(width - 55, height - 55, 0);

    // 4. Header: Topic tag
    ctx.textAlign = 'center';
    ctx.fillStyle = theme.accent;
    ctx.font = '600 24px "Inter", sans-serif';
    ctx.letterSpacing = '6px';
    const topicText = `— ${event.topic.toUpperCase()} —`;
    ctx.fillText(topicText, width / 2, 150);

    // 5. "Vous êtes cordialement invité(e)"
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = '300 32px "Inter", sans-serif';
    ctx.letterSpacing = '4px';
    ctx.fillText('VOUS ÊTES CORDIALEMENT INVITÉ', width / 2, 230);

    // 6. Main Event Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'italic 700 78px "Playfair Display", Georgia, serif';
    ctx.letterSpacing = '1px';

    // Word wrap for title
    const maxTitleWidth = width - 240;
    const words = event.title.split(' ');
    let line = '';
    let titleY = 350;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxTitleWidth && n > 0) {
        ctx.fillText(line.trim(), width / 2, titleY);
        line = words[n] + ' ';
        titleY += 90;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), width / 2, titleY);

    // Decorative divider line
    const divY = titleY + 70;
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 140, divY);
    ctx.lineTo(width / 2 + 140, divY);
    ctx.stroke();

    // Small diamond in center
    ctx.fillStyle = theme.accent;
    ctx.beginPath();
    ctx.moveTo(width / 2, divY - 6);
    ctx.lineTo(width / 2 + 6, divY);
    ctx.lineTo(width / 2, divY + 6);
    ctx.lineTo(width / 2 - 6, divY);
    ctx.closePath();
    ctx.fill();

    // 7. Date & Time
    let curY = divY + 90;
    ctx.fillStyle = theme.accent;
    ctx.font = '600 36px "Inter", sans-serif';
    ctx.letterSpacing = '3px';
    const formattedDate = new Date(event.event_date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const dateStr = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    ctx.fillText(dateStr, width / 2, curY);

    if (event.event_time) {
      curY += 50;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = '400 30px "Inter", sans-serif';
      ctx.letterSpacing = '2px';
      ctx.fillText(`À ${event.event_time}`, width / 2, curY);
    }

    // 8. Location / Venue
    curY += 80;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '400 24px "Inter", sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('LIEU DE RÉCEPTION', width / 2, curY);

    curY += 50;
    ctx.fillStyle = '#ffffff';
    ctx.font = '600 34px "Inter", sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText(event.location, width / 2, curY);

    // 9. Host Message
    if (event.message) {
      curY += 90;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.82)';
      ctx.font = 'italic 300 28px "Playfair Display", Georgia, serif';
      const msgWords = event.message.split(' ');
      let msgLine = '';
      for (let m = 0; m < msgWords.length; m++) {
        const testMsg = msgLine + msgWords[m] + ' ';
        if (ctx.measureText(testMsg).width > width - 300 && m > 0) {
          ctx.fillText(`“${msgLine.trim()}”`, width / 2, curY);
          msgLine = msgWords[m] + ' ';
          curY += 44;
        } else {
          msgLine = testMsg;
        }
      }
      ctx.fillText(`“${msgLine.trim()}”`, width / 2, curY);
    }

    // 10. Dress code & RSVP deadline
    curY += 100;
    if (event.dress_code || event.rsvp_deadline) {
      ctx.fillStyle = theme.accent;
      ctx.font = '500 22px "Inter", sans-serif';
      ctx.letterSpacing = '2px';
      const details = [];
      if (event.dress_code) details.push(`DRESS CODE: ${event.dress_code.toUpperCase()}`);
      if (event.rsvp_deadline) details.push(`R.S.V.P AVANT LE ${event.rsvp_deadline.toUpperCase()}`);
      ctx.fillText(details.join('  •  '), width / 2, curY);
    }

    // 11. Footer Branding
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.font = '300 20px "Inter", sans-serif';
    ctx.letterSpacing = '4px';
    ctx.fillText('CRÉÉ AVEC DIGITINVITE.COM', width / 2, height - 90);

    setIsReady(true);
  }, [event]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    const safeTitle = event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `Digitinvite-${safeTitle}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
    if (onDownloaded) onDownloaded();
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {/* Hidden high-res canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Visual Canvas preview */}
      {showPreview && isReady && canvasRef.current && (
        <div className="relative group rounded-2xl overflow-hidden shadow-2xl border border-white/20 max-w-[280px] sm:max-w-[320px] bg-black">
          <img
            src={canvasRef.current.toDataURL('image/png')}
            alt={event.title}
            className="w-full h-auto block select-none pointer-events-none transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
            <span className="text-xs text-white/90 font-medium tracking-wider uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Format HD 1080x1560
            </span>
          </div>
        </div>
      )}

      {/* Download Action Button */}
      <button
        type="button"
        onClick={handleDownload}
        disabled={!isReady}
        className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full bg-zinc-900 hover:bg-black text-white text-sm font-semibold shadow-md border border-white/10 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
      >
        {downloaded ? (
          <>
            <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
            <span>Téléchargé !</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4 text-white" />
            <span>Télécharger la carte (PNG HD)</span>
          </>
        )}
      </button>
    </div>
  );
};
