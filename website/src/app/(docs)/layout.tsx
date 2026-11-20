import { DocsShell } from "@/components/docs-shell";
import { getCategories } from "@/lib/content";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const nav = getCategories().map((c) => ({
    slug: c.slug,
    title: c.title,
    docs: c.docs.map((d) => ({ slug: d.slug, title: d.title, group: d.group })),
  }));
  return <DocsShell nav={nav}>{children}</DocsShell>;
}
