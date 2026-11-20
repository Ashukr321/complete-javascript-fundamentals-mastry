"use client";

import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { FileText, Search } from "lucide-react";
import type { NavCategory } from "./nav-types";

// Every typed word must appear: cmdk's default fuzzy match is far too loose for titles.
export function matchAllWords(value: string, search: string, keywords: string[] = []) {
  const hay = [value, ...keywords].join(" ").toLowerCase();
  return search.toLowerCase().split(/\s+/).filter(Boolean).every((w) => hay.includes(w)) ? 1 : 0;
}

type Props = { nav: NavCategory[]; open: boolean; onOpenChange: (open: boolean) => void };

export function SearchPalette({ nav, open, onOpenChange }: Props) {
  const router = useRouter();
  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Search topics"
      filter={matchAllWords}
      overlayClassName="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
      contentClassName="fixed inset-x-4 top-[12vh] z-50 mx-auto max-w-xl overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div className="flex items-center gap-2 border-b border-neutral-200 px-3 dark:border-neutral-800">
        <Search className="size-4 text-neutral-500" />
        <Command.Input
          placeholder="Search topics..."
          className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-neutral-500"
        />
      </div>
      <Command.List className="max-h-[60vh] overflow-y-auto p-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-neutral-500">
        <Command.Empty className="py-8 text-center text-sm text-neutral-500">No topics found.</Command.Empty>
        {nav.map((cat) => (
          <Command.Group key={cat.slug} heading={cat.title}>
            {cat.docs.map((doc) => (
              <Command.Item
                key={doc.slug}
                value={doc.slug}
                keywords={[doc.title, doc.group ?? "", cat.title]}
                onSelect={() => {
                  onOpenChange(false);
                  router.push(`/${doc.slug}`);
                }}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm data-[selected=true]:bg-neutral-100 dark:data-[selected=true]:bg-neutral-800"
              >
                <FileText className="size-4 shrink-0 text-neutral-500" />
                <span className="truncate">{doc.title}</span>
                {doc.group && <span className="ml-auto shrink-0 text-xs text-neutral-500">{doc.group}</span>}
              </Command.Item>
            ))}
          </Command.Group>
        ))}
      </Command.List>
    </Command.Dialog>
  );
}
