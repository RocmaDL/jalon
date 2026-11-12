"use client";

// Racine de l’application (rendue uniquement dans le navigateur, voir ClientApp).

import { useEffect } from "react";
import { refreshTimers } from "@/game/actions";
import { handleKey } from "@/game/keyboard";
import { D } from "@/game/state";
import { LS, boot, useStore } from "@/game/store";
import { Lesson } from "./lesson/Lesson";
import { ConfettiCanvas } from "./overlays/Confetti";
import { Modal } from "./overlays/Modal";
import { Toasts } from "./overlays/Toasts";
import { Onboarding } from "./pages/Onboarding";
import { Shell } from "./shell/Shell";

// Lecture de la sauvegarde avant le premier affichage, pour éviter un flash de l’accueil.
boot();

export default function App() {
  useStore();

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    const iv = setInterval(refreshTimers, 15000);
    return () => {
      document.removeEventListener("keydown", handleKey);
      clearInterval(iv);
    };
  }, []);

  return (
    <>
      {!D.onboard ? <Onboarding /> : LS ? <Lesson /> : <Shell />}
      <Modal />
      <Toasts />
      <ConfettiCanvas />
    </>
  );
}
