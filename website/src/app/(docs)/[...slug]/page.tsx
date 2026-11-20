import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronRight, Maximize2 } from "lucide-react";
import { Markdown } from "@/components/markdown";
import { contentUrl, getAdjacent, getAllDocs, getCategories, getDoc, humanize } from "@/lib/content";
import { SITE } from "@/lib/site";

type Props = { params: Promise<{ slug: string[] }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllDocs().map((d) => ({ slug: d.slug.split("/") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const doc = getDoc((await params).slug.join("/"));
  if (!doc) return {};
  const title = `${doc.title} — ${doc.categoryTitle}`;
  return {
    title,
    description: doc.description,
    alternates: { canonical: `/${doc.slug}` },
    openGraph: { type: "article", title, description: doc.description, url: `/${doc.slug}`, siteName: SITE.name },
  };
}

const fileLabel = (rel: string) => humanize(rel.split("/").at(-1)!);

export default async function DocPage({ params }: Props) {
  const doc = getDoc((await params).slug.join("/"));
  if (!doc) notFound();
  const { prev, next } = getAdjacent(doc.slug);
  const categoryHome = getCategories().find((c) => c.slug === doc.categorySlug)!.docs[0];

  return (
    <article className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm text-neutral-500">
        <Link href="/" className="hover:text-neutral-900 dark:hover:text-neutral-100">
          {SITE.shortName}
        </Link>
        <ChevronRight className="size-3.5" />
        <Link href={`/${categoryHome.slug}`} className="hover:text-neutral-900 dark:hover:text-neutral-100">
          {doc.categoryTitle}
        </Link>
        {doc.group && (
          <>
            <ChevronRight className="size-3.5" />
            <span>{doc.group}</span>
          </>
        )}
        <ChevronRight className="size-3.5" />
        <span className="text-neutral-800 dark:text-neutral-200" aria-current="page">
          {doc.title}
        </span>
      </nav>

      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{doc.title}</h1>

      <div className="prose prose-neutral mt-6 max-w-none dark:prose-invert prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-code:rounded prose-code:bg-neutral-100 prose-code:px-1 prose-code:py-0.5 prose-code:font-normal prose-code:before:content-none prose-code:after:content-none dark:prose-code:bg-neutral-800 prose-pre:border prose-pre:border-neutral-800 prose-pre:bg-neutral-900 [&_pre_code]:bg-transparent [&_pre_code]:p-0 prose-img:rounded-lg">
        <Markdown>{doc.body}</Markdown>

        {doc.images.map((img) => (
          <figure key={img}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={contentUrl(img)} alt={fileLabel(img)} loading="lazy" className="mx-auto rounded-lg border border-neutral-200 bg-white dark:border-neutral-800" />
            <figcaption className="text-center">{fileLabel(img)}</figcaption>
          </figure>
        ))}

        {doc.visualizations.map((v) => (
          <figure key={v} className="not-prose my-8">
            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
              <span className="font-medium">{fileLabel(v)}</span>
              <a href={contentUrl(v)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-accent hover:underline">
                Open full screen <Maximize2 className="size-3.5" />
              </a>
            </div>
            <iframe
              src={contentUrl(v)}
              sandbox="allow-scripts"
              title={fileLabel(v)}
              loading="lazy"
              className="h-[480px] w-full rounded-lg border border-neutral-200 bg-white dark:border-neutral-800"
            />
          </figure>
        ))}
      </div>

      <nav aria-label="Pagination" className="mt-12 grid gap-4 border-t border-neutral-200 pt-6 sm:grid-cols-2 dark:border-neutral-800">
        {prev ? (
          <Link href={`/${prev.slug}`} className="group rounded-xl border border-neutral-200 p-4 transition hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600">
            <span className="flex items-center gap-1 text-xs text-neutral-500">
              <ArrowLeft className="size-3.5" /> Previous
            </span>
            <span className="mt-1 block font-medium group-hover:text-accent">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/${next.slug}`} className="group rounded-xl border border-neutral-200 p-4 text-right transition hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600">
            <span className="flex items-center justify-end gap-1 text-xs text-neutral-500">
              Next <ArrowRight className="size-3.5" />
            </span>
            <span className="mt-1 block font-medium group-hover:text-accent">{next.title}</span>
          </Link>
        )}
      </nav>
    </article>
  );
}
