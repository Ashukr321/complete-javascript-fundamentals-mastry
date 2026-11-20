import fs from "node:fs";
import path from "node:path";
import { SITE } from "./site";

/**
 * Loads the markdown notes that live in the repo root (one level above
 * `website/`) at build time. Every page is prerendered, so nothing here runs
 * on the server at request time. The `turbopackIgnore` comments stop Turbopack
 * from tracing the whole repo into the server bundle.
 */
export const CONTENT_ROOT = process.env.CONTENT_DIR
  ? path.resolve(/*turbopackIgnore: true*/ process.env.CONTENT_DIR)
  : path.join(/*turbopackIgnore: true*/ process.cwd(), "..");

/** Repo-relative paths of images that have nothing to do with the notes. */
export const IGNORED_IMAGES: string[] = [];

const SKIP_DIRS = new Set(["website", "node_modules", ".git", ".claude"]);
const IMAGE_RE = /\.(svg|png|jpe?g|webp|gif)$/i;
const ASSET_RE = /\.(svg|png|jpe?g|webp|gif|html)$/i;
const NUM_PREFIX = /^\d+[_\-. ]+/;
const ACRONYMS: Record<string, string> = Object.fromEntries(
  [
    "API", "APIs", "DOM", "BOM", "JS", "JSON", "HTML", "CSS", "URL", "HTTP",
    "HTTPS", "TDZ", "IIFE", "CORS", "XSS", "CSRF", "CSP", "ES5", "ES6", "SEO",
    "UI", "UX", "JWT", "SQL", "OOP",
  ].map((a) => [a.toLowerCase(), a]),
);
const EMPTY_BODY = "This topic is still being written.";

export type Doc = {
  slug: string;
  title: string;
  description: string;
  /** Markdown with image and note links rewritten to site URLs. */
  body: string;
  categorySlug: string;
  categoryTitle: string;
  group?: string;
  /** Repo-relative images not linked in the body but placed on this page. */
  images: string[];
  /** Repo-relative `.html` visualizations shown on this page. */
  visualizations: string[];
  /** Repo-relative markdown file (undefined for an image-only folder page). */
  file?: string;
  /** Repo-relative folder the doc belongs to ("" = repo root). */
  dir: string;
  isIndex: boolean;
  /** Repo-relative images linked from the body. */
  linkedImages: string[];
};

export type Category = { slug: string; title: string; docs: Doc[] };

type Content = { categories: Category[]; docs: Doc[]; bySlug: Map<string, Doc> };

// ---------- helpers ----------

const abs = (rel: string) => path.join(/*turbopackIgnore: true*/ CONTENT_ROOT, rel);
const read = (rel: string) => fs.readFileSync(/*turbopackIgnore: true*/ abs(rel), "utf8");
const exists = (rel: string) => fs.existsSync(/*turbopackIgnore: true*/ abs(rel));

function listDir(rel: string) {
  return fs
    .readdirSync(/*turbopackIgnore: true*/ abs(rel), { withFileTypes: true })
    .filter((e) => !e.name.startsWith(".") && !(rel === "" && SKIP_DIRS.has(e.name)))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
}

const join = (...parts: string[]) => parts.filter(Boolean).join("/");
const stripExt = (name: string) => name.replace(/\.[^.]+$/, "");
const isReadme = (name: string) => /^readme\.md$/i.test(name);
const isMd = (name: string) => /\.md$/i.test(name);

export function slugify(name: string) {
  const base = name.replace(NUM_PREFIX, "");
  return (
    base
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || name.toLowerCase()
  );
}

export function humanize(name: string) {
  return stripExt(name)
    .replace(NUM_PREFIX, "")
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((w) => ACRONYMS[w.toLowerCase()] ?? w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const alphaWords = (s: string) =>
  s.toLowerCase().split(/[^a-z0-9]+/).filter((w) => /[a-z]/.test(w));

/** Run `fn` on the markdown outside fenced code blocks only. */
function outsideCode(md: string, fn: (chunk: string) => string) {
  return md
    .split(/(^(?:```|~~~)[^\n]*\n[\s\S]*?^(?:```|~~~)[ \t]*$)/m)
    .map((part, i) => (i % 2 ? part : fn(part)))
    .join("");
}

/** Resolve a link from a doc folder to a repo-relative path, or null if outside the repo. */
function resolveRel(dir: string, href: string) {
  let decoded = href;
  try {
    decoded = decodeURIComponent(href);
  } catch {}
  const p = path.posix.normalize(path.posix.join(dir || ".", decoded));
  return p.startsWith("..") || path.posix.isAbsolute(p) ? null : p.replace(/^\.\//, "");
}

const isExternal = (href: string) => /^([a-z]+:|\/\/|#|\/)/i.test(href);
export const contentUrl = (rel: string) => "/content/" + rel.split("/").map(encodeURIComponent).join("/");

function extractTitle(md: string) {
  const lines = md.split("\n");
  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    if (/^(```|~~~)/.test(lines[i])) inFence = !inFence;
    if (inFence) continue;
    const m = /^#\s+(.+?)\s*#*\s*$/.exec(lines[i]);
    if (m) return { title: m[1], body: [...lines.slice(0, i), ...lines.slice(i + 1)].join("\n") };
  }
  return null;
}

function plain(s: string) {
  return s
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/[`*_]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function describe(md: string) {
  const lines = md.replace(/^(```|~~~)[\s\S]*?^(```|~~~)\s*$/gm, "").split("\n");
  const para: string[] = [];
  const items: string[] = [];
  for (const line of lines) {
    const t = line.trim();
    if (!t) {
      if (para.length) break;
      continue;
    }
    const item = /^(?:[-*+]|\d+\.)\s+(.*)/.exec(t);
    if (item) {
      if (para.length) break;
      if (items.length < 3 && !/^\s{2,}/.test(line)) items.push(plain(item[1]));
      continue;
    }
    if (/^(#|\||>|<|!\[|---|\*\*\*)/.test(t)) {
      if (para.length) break;
      continue;
    }
    para.push(t);
  }
  const text = plain(para.join(" ")) || items.filter(Boolean).join("; ");
  return text.length > 160 ? text.slice(0, 157).trimEnd() + "…" : text;
}

/** Split a README into its preamble and `## ` sections (ignoring code fences). */
function splitSections(md: string) {
  const lines = md.split("\n");
  const sections: { heading: string; lines: string[] }[] = [];
  const intro: string[] = [];
  let inFence = false;
  for (const line of lines) {
    if (/^(```|~~~)/.test(line)) inFence = !inFence;
    const m = !inFence && /^##\s+(.+?)\s*#*\s*$/.exec(line);
    if (m) sections.push({ heading: m[1], lines: [] });
    else (sections.at(-1)?.lines ?? intro).push(line);
  }
  return { intro: intro.join("\n"), sections: sections.map((s) => ({ heading: s.heading, body: s.lines.join("\n") })) };
}

// ---------- building ----------

type Draft = Omit<Doc, "description" | "linkedImages" | "body"> & { raw: string };

function fileDoc(file: string, slug: string, cat: Category, group: string | undefined, isIndex: boolean): Draft {
  const dir = path.posix.dirname(file) === "." ? "" : path.posix.dirname(file);
  const name = path.posix.basename(file);
  const raw = read(file);
  const named = isReadme(name) || /^concept\.md$/i.test(name);
  const fallback = humanize(named ? path.posix.basename(dir || CONTENT_ROOT) : name);
  const h1 = extractTitle(raw);
  const usable = h1 && h1.title.length <= 60 && !/^(concept|readme)$/i.test(h1.title.trim());
  return {
    slug,
    title: usable ? h1.title : fallback,
    raw: usable ? h1.body : raw,
    categorySlug: cat.slug,
    categoryTitle: cat.title,
    group,
    images: [],
    visualizations: isIndex ? htmlNextTo(dir) : [],
    file,
    dir,
    isIndex,
  };
}

const htmlNextTo = (dir: string) =>
  listDir(dir)
    .filter((e) => e.isFile() && /\.html$/i.test(e.name))
    .map((e) => join(dir, e.name));

function walk(dir: string, slugParts: string[], cat: Category, groupParts: string[], out: Draft[]) {
  const entries = listDir(dir);
  const files = entries.filter((e) => e.isFile());
  const mds = files.filter((e) => isMd(e.name));
  const readme = mds.find((e) => isReadme(e.name));
  const group = groupParts.length ? groupParts.join(" › ") : undefined;
  const slug = slugParts.join("/");

  if (readme) out.push(fileDoc(join(dir, readme.name), slug, cat, group, true));
  else if (!mds.length && files.some((e) => IMAGE_RE.test(e.name) && !IGNORED_IMAGES.includes(join(dir, e.name)))) {
    // A folder with diagrams but no notes still gets a page.
    out.push({
      slug,
      title: humanize(path.posix.basename(dir)),
      raw: "",
      categorySlug: cat.slug,
      categoryTitle: cat.title,
      group,
      images: [],
      visualizations: htmlNextTo(dir),
      dir,
      isIndex: true,
    });
  }
  for (const e of mds) {
    if (e === readme) continue;
    out.push(fileDoc(join(dir, e.name), join(slug, slugify(stripExt(e.name))), cat, group, false));
  }
  for (const e of entries) {
    if (e.isDirectory()) walk(join(dir, e.name), [...slugParts, slugify(e.name)], cat, [...groupParts, humanize(e.name)], out);
  }
}

function listFiles(dir: string, re: RegExp): string[] {
  return listDir(dir).flatMap((e) =>
    e.isDirectory() ? listFiles(join(dir, e.name), re) : re.test(e.name) ? [join(dir, e.name)] : [],
  );
}

/** Every repo file the `/content` route may serve. */
export const listAssets = () => listFiles("", ASSET_RE).filter((f) => !IGNORED_IMAGES.includes(f));
export const listImages = () => listAssets().filter((f) => IMAGE_RE.test(f));

function build(): Content {
  const catDirs = listDir("").filter((e) => e.isDirectory() && NUM_PREFIX.test(e.name));
  const categories: Category[] = [];
  const drafts: Draft[] = [];
  const rootReadme = exists("README.md") ? "README.md" : undefined;

  const tocRe = /^(topics|contents|table of contents)$/i;
  const { intro, sections } = splitSections(rootReadme ? read(rootReadme) : "");
  const splitReadme = sections.filter((s) => !tocRe.test(s.heading)).length >= 2;

  if (rootReadme && splitReadme) {
    // A root README that holds the topics as `## ` sections is the first category, one page per section.
    const cat: Category = { slug: "fundamentals", title: "Fundamentals", docs: [] };
    categories.push(cat);
    const overview = [intro, ...sections.filter((s) => tocRe.test(s.heading)).map((s) => `## ${s.heading}\n${s.body}`)]
      .join("\n")
      .replace(/<h1[^>]*>[\s\S]*?<\/h1>/gi, "")
      .replace(/^#\s+.*$/m, "");
    const base = { categorySlug: cat.slug, categoryTitle: cat.title, images: [], visualizations: [], file: rootReadme, dir: "" };
    drafts.push({ ...base, slug: cat.slug, title: "Overview", raw: overview, isIndex: true, visualizations: htmlNextTo("") });
    const used = new Set([cat.slug]);
    for (const s of sections.filter((s) => !tocRe.test(s.heading))) {
      let slug = join(cat.slug, slugify(s.heading));
      for (let n = 2; used.has(slug); n++) slug = join(cat.slug, `${slugify(s.heading)}-${n}`);
      used.add(slug);
      drafts.push({ ...base, slug, title: s.heading, raw: s.body, isIndex: false, images: [] });
    }
  }

  for (const e of catDirs) {
    const cat: Category = { slug: slugify(e.name), title: humanize(e.name), docs: [] };
    const docs: Draft[] = [];
    walk(e.name, [cat.slug], cat, [], docs);
    if (!categories.length && rootReadme) {
      const d = fileDoc(rootReadme, join(cat.slug, "overview"), cat, undefined, true);
      docs.unshift({ ...d, title: "Overview" });
    }
    categories.push(cat);
    drafts.push(...docs);
  }

  // Map note files (and folders, via their README) to URLs for link rewriting.
  const fileToSlug = new Map<string, string>();
  for (const d of drafts) {
    if (!d.file || fileToSlug.has(d.file)) continue;
    fileToSlug.set(d.file, d.slug);
    if (d.isIndex && d.dir) fileToSlug.set(d.dir, d.slug);
  }

  const docs: Doc[] = drafts.map(({ raw, ...d }) => {
    const linked = new Set<string>();
    const img = (src: string) => {
      if (isExternal(src) || src.startsWith("data:")) return src;
      const rel = resolveRel(d.dir, src.split(/[?#]/)[0]);
      if (!rel || !exists(rel)) return src;
      linked.add(rel);
      return contentUrl(rel);
    };
    const body = outsideCode(raw, (chunk) =>
      chunk
        // `<...>` destinations may contain spaces.
        .replace(/!\[([^\]]*)\]\(\s*(?:<([^>]+)>|([^)\s]+))((?:\s+"[^"]*")?)\s*\)/g, (_, alt, a, b, t) => `![${alt}](${img(a ?? b)}${t})`)
        .replace(/(<img\b[^>]*?\bsrc=)(["'])(.*?)\2/gi, (_, pre, q, src) => `${pre}${q}${img(src)}${q}`)
        .replace(/(?<!!)\[([^\]]*)\]\(\s*(?:<([^>]+)>|([^)\s]+))(?:\s+"[^"]*")?\s*\)/g, (whole, text, a, b) => {
          const href: string = a ?? b;
          const [target, hash] = href.split("#");
          if (isExternal(href) || !/\.md$/i.test(target)) return whole;
          const rel = resolveRel(d.dir, target);
          const slug = rel && (fileToSlug.get(rel) ?? fileToSlug.get(rel.replace(/\/readme\.md$/i, "")));
          return slug ? `[${text}](/${slug}${hash ? "#" + hash : ""})` : text;
        }),
    );
    const trimmed = body.trim();
    return {
      ...d,
      body: trimmed ? body : EMPTY_BODY,
      description: (trimmed && describe(body)) || `${d.title} — ${SITE.name}`,
      linkedImages: [...linked],
    };
  });

  placeImages(docs);

  for (const d of docs) categories.find((c) => c.slug === d.categorySlug)!.docs.push(d);
  return { categories, docs, bySlug: new Map(docs.map((d) => [d.slug, d])) };
}

function placeImages(docs: Doc[]) {
  const linkedAnywhere = new Set(docs.flatMap((d) => d.linkedImages));
  for (const img of listImages()) {
    let placed = linkedAnywhere.has(img);
    const words = alphaWords(stripExt(path.posix.basename(img)));
    if (words.length) {
      for (const d of docs) {
        const docWords = new Set(alphaWords(d.slug.split("/").at(-1)!));
        if (!d.linkedImages.includes(img) && words.every((w) => docWords.has(w))) {
          d.images.push(img);
          placed = true;
        }
      }
    }
    if (placed) continue;
    // Unlinked: nearest doc in its folder, else the nearest parent folder.
    for (let dir = path.posix.dirname(img); ; dir = path.posix.dirname(dir)) {
      const key = dir === "." ? "" : dir;
      const here = docs.filter((d) => d.dir === key);
      const target = here.find((d) => d.isIndex) ?? here[0];
      if (target) {
        target.images.push(img);
        break;
      }
      if (!key) break;
    }
  }
}

// Builds memoise; `next dev` re-reads the notes on each request so new files show up without a restart.
let cache: Content | undefined;
const content = () => (process.env.NODE_ENV === "development" ? build() : (cache ??= build()));

export const getCategories = () => content().categories;
export const getAllDocs = () => content().docs;
export const getDoc = (slug: string) => content().bySlug.get(slug);

export function getAdjacent(slug: string) {
  const docs = content().docs;
  const i = docs.findIndex((d) => d.slug === slug);
  return { prev: i > 0 ? docs[i - 1] : undefined, next: i >= 0 ? docs[i + 1] : undefined };
}
