"use client";

// L’application vit dans localStorage et dépend de l’heure locale :
// on la rend uniquement côté navigateur pour éviter tout écart d’hydratation.

import dynamic from "next/dynamic";

const App = dynamic(() => import("./App"), { ssr: false });

export default function ClientApp() {
  return <App />;
}
