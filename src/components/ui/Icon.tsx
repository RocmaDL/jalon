// Icônes dessinées pour l’appli (viewBox 24×24). « C » dans un tracé est remplacé
// par la couleur demandée, pour les icônes au trait.

import type { IconName } from "@/game/types";

const IC: Record<IconName, string> = {
  flame: '<path d="M12 2c1 4 5.5 6 5.5 11.5a5.5 5.5 0 0 1-11 0c0-2.2 1-3.7 2.2-4.8.2 1.7 1 2.6 2 2.8C10 8.5 10.5 5 12 2z"/>',
  heart: '<path d="M12 21s-8-4.8-9.6-10A5.4 5.4 0 0 1 12 6.6 5.4 5.4 0 0 1 21.6 11C20 16.2 12 21 12 21z"/>',
  bolt: '<path d="M13.5 2 4.5 13.5H11L10 22l9-12h-6.5z"/>',
  coin: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6.6" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1.6"/><path d="M12 7.5l1.4 2.9 3.1.4-2.3 2.2.6 3.1L12 14.6l-2.8 1.5.6-3.1-2.3-2.2 3.1-.4z" fill="rgba(255,255,255,.92)"/>',
  star: '<path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z"/>',
  lock: '<path d="M7 10V8a5 5 0 0 1 10 0v2h1a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h1zm2 0h6V8a3 3 0 0 0-6 0v2z"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="C" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>',
  cross: '<path d="M6 6l12 12M18 6 6 18" fill="none" stroke="C" stroke-width="3" stroke-linecap="round"/>',
  chest: '<path d="M3 10a6 6 0 0 1 6-6h6a6 6 0 0 1 6 6z"/><rect x="3" y="11" width="18" height="9.5" rx="2"/><rect x="10.3" y="9" width="3.4" height="5" rx="1" fill="rgba(0,0,0,.3)"/>',
  chestOpen: '<path d="M5 3.5l12.5 2.2-1 5-13.3-2.3z" opacity=".75"/><rect x="3" y="11" width="18" height="9.5" rx="2"/><path d="M7 15h10" stroke="rgba(0,0,0,.25)" stroke-width="2" fill="none"/>',
  dumbbell: '<rect x="1.5" y="9" width="3" height="6" rx="1"/><rect x="4.5" y="6.5" width="3.5" height="11" rx="1.2"/><rect x="16" y="6.5" width="3.5" height="11" rx="1.2"/><rect x="19.5" y="9" width="3" height="6" rx="1"/><rect x="8" y="10.8" width="8" height="2.4"/>',
  trophy: '<path d="M7 3h10v5.5a5 5 0 0 1-10 0z"/><path d="M7 5H4.2v1.8A3.3 3.3 0 0 0 7.5 10M17 5h2.8v1.8a3.3 3.3 0 0 1-3.3 3.2" fill="none" stroke="C" stroke-width="2"/><rect x="11" y="13" width="2" height="4"/><rect x="7.5" y="17" width="9" height="3.5" rx="1"/>',
  book: '<path d="M3.5 5A1.5 1.5 0 0 1 5 3.5h6v17H5A1.5 1.5 0 0 1 3.5 19z"/><path d="M13 3.5h6A1.5 1.5 0 0 1 20.5 5v14a1.5 1.5 0 0 1-1.5 1.5h-6z" opacity=".65"/>',
  snow: '<path d="M12 2.5v19M3.8 7.2l16.4 9.6M3.8 16.8l16.4-9.6M9.5 4l2.5 2 2.5-2M9.5 20l2.5-2 2.5 2" fill="none" stroke="C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  home: '<path d="M3 11.2 12 3.5l9 7.7V20a1 1 0 0 1-1 1h-5.2v-6.2H9.2V21H4a1 1 0 0 1-1-1z"/>',
  target: '<circle cx="12" cy="12" r="9" fill="none" stroke="C" stroke-width="2.4"/><circle cx="12" cy="12" r="5" fill="none" stroke="C" stroke-width="2.4"/><circle cx="12" cy="12" r="1.9"/>',
  shield: '<path d="M12 2 4 5v6.2c0 5 3.4 9.3 8 10.8 4.6-1.5 8-5.8 8-10.8V5z"/>',
  scroll: '<rect x="4.5" y="3" width="15" height="18" rx="2.5"/><path d="M8.5 8.5h7M8.5 12.5h7M8.5 16.5h4" stroke="rgba(255,255,255,.85)" stroke-width="1.9" stroke-linecap="round" fill="none"/>',
  user: '<circle cx="12" cy="8" r="4.5"/><path d="M3.5 21a8.5 8.5 0 0 1 17 0z"/>',
  shop: '<path d="M4 8.5h16l-1.4 11.3a1.5 1.5 0 0 1-1.5 1.2H6.9a1.5 1.5 0 0 1-1.5-1.2z"/><path d="M8.5 8.5V7a3.5 3.5 0 0 1 7 0v1.5" fill="none" stroke="C" stroke-width="2"/>',
  crack: '<path d="M14 2 9.5 10.5h4.5L10 22" fill="none" stroke="C" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>',
  crown: '<path d="M3 8.5l4.5 4L12 5l4.5 7.5L21 8.5l-2 11H5z"/>',
  flag: '<path d="M5 2.5v19" stroke="C" stroke-width="2.4" stroke-linecap="round" fill="none"/><path d="M6.5 3.5h12l-3 4.2 3 4.2h-12z"/>',
  cards: '<rect x="3" y="6" width="13" height="15" rx="2.5" opacity=".6"/><rect x="8" y="3" width="13" height="15" rx="2.5"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13" stroke="C" stroke-width="2.4" stroke-linecap="round" fill="none"/><circle cx="4" cy="6" r="1.7"/><circle cx="4" cy="12" r="1.7"/><circle cx="4" cy="18" r="1.7"/>',
  clock: '<circle cx="12" cy="12" r="9.5" fill="none" stroke="C" stroke-width="2.4"/><path d="M12 7v5.5l3.5 2" fill="none" stroke="C" stroke-width="2.4" stroke-linecap="round"/>',
  pen: '<path d="M4 20l1-4.5L15.5 5a2.1 2.1 0 0 1 3 3L8 18.5z"/><path d="M4 20h16" stroke="C" stroke-width="2" stroke-linecap="round" fill="none"/>',
  dice: '<rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8" cy="8" r="1.6" fill="rgba(255,255,255,.9)"/><circle cx="16" cy="16" r="1.6" fill="rgba(255,255,255,.9)"/><circle cx="12" cy="12" r="1.6" fill="rgba(255,255,255,.9)"/>',
  volume: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="C" stroke-width="2" stroke-linecap="round"/>',
};

interface IconProps {
  name: IconName;
  color?: string;
  className?: string;
}

export function Icon({ name, color = "currentColor", className = "" }: IconProps) {
  // Tracés statiques internes à l’appli : aucune donnée utilisateur n’est injectée.
  return (
    <svg
      viewBox="0 0 24 24"
      className={`ic ${className}`.trim()}
      aria-hidden="true"
      fill={color}
      dangerouslySetInnerHTML={{ __html: IC[name].replaceAll('"C"', `"${color}"`) }}
    />
  );
}

/** Jeton de confiance client (monnaie de l’appli). */
export function Coin({ className = "" }: { className?: string }) {
  return <Icon name="coin" color="var(--jcc)" className={className} />;
}
