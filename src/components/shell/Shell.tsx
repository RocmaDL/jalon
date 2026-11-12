// Coque : navigation latérale (bureau), barre du haut et barre du bas (mobile), colonne de résumé.

import { navigate } from "@/game/actions";
import { NAVS } from "@/game/constants";
import { S } from "@/game/store";
import { LeaguePage } from "../pages/LeaguePage";
import { LearnPage } from "../pages/LearnPage";
import { PracticePage } from "../pages/PracticePage";
import { ProfilePage } from "../pages/ProfilePage";
import { QuestsPage } from "../pages/QuestsPage";
import { ShopPage } from "../pages/ShopPage";
import { Icon } from "../ui/Icon";
import { Chips } from "./Chips";
import { Rail } from "./Rail";

function Logo() {
  return (
    <div className="logo">
      <Icon name="flag" color="var(--pri)" />
      <span>jalon</span>
    </div>
  );
}

function Page() {
  switch (S.tab) {
    case "practice":
      return <PracticePage />;
    case "league":
      return <LeaguePage />;
    case "quests":
      return <QuestsPage />;
    case "profile":
      return <ProfilePage />;
    case "shop":
      return <ShopPage />;
    default:
      return <LearnPage />;
  }
}

export function Shell() {
  return (
    <>
      <div className="app">
        <nav className="side" aria-label="Navigation principale">
          <Logo />
          {NAVS.map(([k, label, ic]) => (
            <button key={k} className={`nav ${S.tab === k ? "on" : ""}`} onClick={() => navigate(k)}>
              <Icon name={ic} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <main className="main">
          <div className="top">
            <Logo />
            <div className="chips">
              <Chips />
            </div>
          </div>
          <Page />
        </main>
        <aside className="rail" aria-label="Résumé">
          <div className="chips" style={{ justifyContent: "space-between" }}>
            <Chips />
          </div>
          <Rail />
        </aside>
      </div>
      <nav className="bottom" aria-label="Navigation">
        {NAVS.filter((n) => n[0] !== "shop").map(([k, label, ic]) => (
          <button key={k} className={`bnav ${S.tab === k ? "on" : ""}`} onClick={() => navigate(k)}>
            <Icon name={ic} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
