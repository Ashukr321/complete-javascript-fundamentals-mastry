import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllDocs, getCategories } from "@/lib/content";
import { SITE } from "@/lib/site";

const card =
  "rounded-xl border border-neutral-200 bg-neutral-50 p-5 transition hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:border-neutral-700";

export default function Home() {
  const categories = getCategories();
  const docs = getAllDocs();
  const first = docs[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-16">
      <span className="inline-flex rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
        {docs.length} topics · {categories.length} {categories.length === 1 ? "category" : "categories"}
      </span>
      <h1 className="mt-5 text-4xl font-bold tracking-tight text-balance sm:text-5xl">{SITE.name}</h1>
      <p className="mt-4 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">{SITE.description}</p>
      {first && (
        <Link
          href={`/${first.slug}`}
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          Start reading <ArrowRight className="size-4" />
        </Link>
      )}

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.length > 1
          ? categories.map((cat) => (
              <div key={cat.slug} className={card}>
                <h2 className="font-semibold">{cat.title}</h2>
                <ul className="mt-3 space-y-1.5">
                  {cat.docs.map((d) => (
                    <li key={d.slug}>
                      <Link href={`/${d.slug}`} className="text-sm text-neutral-600 hover:text-accent dark:text-neutral-400">
                        {d.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          : // One category: a card per topic reads better than a single long card.
            docs.map((d) => (
              <Link key={d.slug} href={`/${d.slug}`} className={`${card} group block`}>
                <h2 className="font-semibold group-hover:text-accent">{d.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-neutral-600 dark:text-neutral-400">{d.description}</p>
              </Link>
            ))}
      </div>
    </div>
  );
}
