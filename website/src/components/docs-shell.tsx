"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { Menu, PanelLeft, Search, X } from "lucide-react";
import { SITE } from "@/lib/site";
import { SidebarNav } from "./sidebar-nav";
import { SearchPalette } from "./search-palette";
import { ThemeToggle } from "./theme-toggle";
import type { NavCategory } from "./nav-types";

const noopSubscribe = () => () => {};
const useModKey = () =>
  useSyncExternalStore(
    noopSubscribe,
    () => (/Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent) ? "⌘" : "Ctrl"),
    () => "Ctrl",
  );

const isTyping = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));

const Logo = ({ onClick }: { onClick?: () => void }) => (
  <Link href="/" onClick={onClick} className="flex shrink-0 items-center gap-2 font-semibold tracking-tight">
    <span className="grid size-7 place-items-center rounded-md bg-[#f7df1e] font-mono text-xs font-black text-neutral-950">JS</span>
    <span className="text-sm">{SITE.shortName}</span>
  </Link>
);

export function DocsShell({ nav, children }: { nav: NavCategory[]; children: React.ReactNode }) {
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const mod = useModKey();

  const toggleSidebar = useCallback(() => {
    if (window.matchMedia("(min-width: 1024px)").matches) setDesktopOpen((o) => !o);
    else setMobileOpen((o) => !o);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && !e.altKey && e.code === "KeyK") {
        e.preventDefault();
        setSearchOpen(true);
      } else if (mod && !e.altKey && !e.shiftKey && e.code === "KeyB") {
        e.preventDefault();
        toggleSidebar();
      } else if (!mod && !e.altKey && e.code === "Slash" && !isTyping(e.target)) {
        e.preventDefault();
        if (e.shiftKey) toggleSidebar();
        else setSearchOpen(true);
      } else if (e.key === "Escape") {
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleSidebar]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-neutral-200 bg-white/80 px-3 backdrop-blur sm:gap-3 sm:px-4 dark:border-neutral-800 dark:bg-neutral-950/80">
        <div className="lg:w-56">
          <Logo />
        </div>
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          title={`Toggle sidebar (${mod} B)`}
          className="rounded-md p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
        >
          <PanelLeft className="hidden size-4 lg:block" />
          <Menu className="size-4 lg:hidden" />
        </button>
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm text-neutral-500 transition hover:border-neutral-300 sm:max-w-xs dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
        >
          <Search className="size-4 shrink-0" />
          <span className="truncate">Search topics...</span>
          <kbd className="ml-auto hidden rounded border border-neutral-300 px-1.5 font-mono text-[0.7rem] sm:inline dark:border-neutral-700">
            {mod} K
          </kbd>
        </button>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </header>

      <div className="flex">
        {/* Desktop: width animates, the fixed-width inner wrapper keeps links from reflowing. */}
        <aside
          className={`sticky top-14 hidden h-[calc(100vh-3.5rem)] shrink-0 overflow-hidden border-neutral-200 transition-[width,visibility] duration-300 ease-in-out lg:block dark:border-neutral-800 ${
            desktopOpen ? "w-64 border-r" : "invisible w-0"
          }`}
        >
          <div className="h-full w-64 overflow-y-auto">
            <SidebarNav nav={nav} />
          </div>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>

      {/* Mobile: off-canvas drawer. */}
      <div className={`fixed inset-0 z-40 lg:hidden ${mobileOpen ? "" : "pointer-events-none"}`} inert={!mobileOpen}>
        <div
          onClick={closeMobile}
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${mobileOpen ? "opacity-100" : "opacity-0"}`}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Topics"
          className={`absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r border-neutral-200 bg-white transition-transform duration-300 ease-in-out dark:border-neutral-800 dark:bg-neutral-950 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-neutral-200 px-3 dark:border-neutral-800">
            <Logo onClick={closeMobile} />
            <button
              type="button"
              onClick={closeMobile}
              aria-label="Close sidebar"
              className="rounded-md p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="overflow-y-auto">
            <SidebarNav nav={nav} onNavigate={closeMobile} />
          </div>
        </div>
      </div>

      <SearchPalette nav={nav} open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}
