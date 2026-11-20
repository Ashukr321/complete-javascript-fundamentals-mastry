"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import type { NavCategory } from "./nav-types";

type Props = { nav: NavCategory[]; onNavigate?: () => void };

export function SidebarNav({ nav, onNavigate }: Props) {
  const pathname = usePathname();
  return (
    <nav aria-label="Topics" className="space-y-0.5 p-3">
      {nav.map((cat) => (
        <CategorySection key={cat.slug} cat={cat} pathname={pathname} onNavigate={onNavigate} />
      ))}
    </nav>
  );
}

function CategorySection({ cat, pathname, onNavigate }: { cat: NavCategory; pathname: string; onNavigate?: () => void }) {
  const isActive = cat.docs.some((d) => pathname === `/${d.slug}`);
  const [toggled, setToggled] = useState<boolean | null>(null);
  const open = toggled ?? isActive;

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setToggled(!open)}
        className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm font-semibold text-neutral-800 transition hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800/70"
      >
        {cat.title}
        <ChevronRight className={`size-4 shrink-0 text-neutral-500 transition-transform duration-300 ${open ? "rotate-90" : ""}`} />
      </button>
      <div
        inert={!open}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <ul className="overflow-hidden border-l border-neutral-200 pl-2 ml-3 dark:border-neutral-800">
          {cat.docs.map((doc, i) => {
            const active = pathname === `/${doc.slug}`;
            const heading = doc.group && doc.group !== cat.docs[i - 1]?.group;
            return (
              <li key={doc.slug}>
                {heading && (
                  <p className="mt-3 mb-1 px-2 text-[0.7rem] font-semibold tracking-wider text-neutral-500 uppercase">
                    {doc.group}
                  </p>
                )}
                <Link
                  href={`/${doc.slug}`}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={`my-0.5 block rounded-md px-2 py-1.5 text-sm transition ${
                    active
                      ? "bg-neutral-100 font-medium text-accent dark:bg-neutral-800/80"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800/60 dark:hover:text-neutral-100"
                  }`}
                >
                  {doc.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
