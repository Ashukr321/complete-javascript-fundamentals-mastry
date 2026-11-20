"use client";

import { useEffect } from "react";

export function SwRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => navigator.serviceWorker.ready)
      .then(async () => {
        // Assets of the first visit loaded before the worker existed; cache them so this page works offline.
        const assets = performance
          .getEntriesByType("resource")
          .map((e) => e.name)
          .filter((u) => u.startsWith(`${location.origin}/_next/static/`));
        const cache = await caches.open("jsm-v1");
        await Promise.all(assets.map((u) => cache.match(u).then((hit) => (hit ? undefined : cache.add(u)))));
      })
      .catch(() => {});
  }, []);
  return null;
}
