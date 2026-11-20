// @vitest-environment node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterAll, describe, expect, it, vi } from "vitest";

type ContentModule = typeof import("@/lib/content");

/** Import a fresh copy of the loader pointed at `dir` (undefined = the real notes). */
async function load(dir?: string): Promise<ContentModule> {
  vi.resetModules();
  if (dir) process.env.CONTENT_DIR = dir;
  else delete process.env.CONTENT_DIR;
  return import("@/lib/content");
}

// A small notes repo in the numbered-folder layout, to cover what the real notes don't have yet.
const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "notes-"));
const files: Record<string, string> = {
  "README.md": "# My Notes\n\nRoot intro paragraph.",
  "01_Intro/README.md": "# Intro\n\nWelcome. See [concept](./concept.md) and [gone](./missing.md).",
  "01_Intro/concept.md": "# Concept\n\nThe idea behind XSS.",
  "01_Intro/validation-vs-sanitization.md": "Validation and sanitization differ.\n\n![flow](<my flow.png>)",
  "01_Intro/validation.svg": "<svg xmlns='http://www.w3.org/2000/svg'/>",
  "01_Intro/my flow.png": "png",
  "01_Intro/empty.md": "",
  "02_web-security/README.md": "Security overview.",
  "02_web-security/viz.html": "<p>viz</p>",
  "02_web-security/csrf_attacks/notes.md": "# CSRF in practice\n\nTokens.",
  "02_web-security/csrf_attacks/stray.png": "png",
  "02_web-security/diagrams/only.svg": "<svg xmlns='http://www.w3.org/2000/svg'/>",
  "website/leak.png": "png",
  ".claude/leak.png": "png",
  ".git/leak.png": "png",
};
for (const [rel, body] of Object.entries(files)) {
  fs.mkdirSync(path.join(fixture, path.dirname(rel)), { recursive: true });
  fs.writeFileSync(path.join(fixture, rel), body);
}
afterAll(() => fs.rmSync(fixture, { recursive: true, force: true }));

describe.each([
  ["real notes", undefined],
  ["fixture", fixture],
])("content loader (%s)", (_name, dir) => {
  it("gives every doc a unique, URL-safe slug and a title", async () => {
    const docs = (await load(dir)).getAllDocs();
    expect(docs.length).toBeGreaterThan(0);
    const slugs = docs.map((d) => d.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const d of docs) {
      expect(d.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*(\/[a-z0-9]+(-[a-z0-9]+)*)*$/);
      expect(d.title.trim()).not.toBe("");
      expect(d.title).not.toBe("Concept");
      expect(d.description.length).toBeLessThanOrEqual(160);
    }
  });

  it("returns undefined for a missing doc", async () => {
    expect((await load(dir)).getDoc("does/not/exist")).toBeUndefined();
  });

  it("shows every repo image on at least one page", async () => {
    const c = await load(dir);
    const shown = new Set(c.getAllDocs().flatMap((d) => [...d.images, ...d.linkedImages]));
    for (const img of c.listImages()) expect(shown, img).toContain(img);
  });

  it("never serves assets from website/, .git or .claude", async () => {
    const assets = (await load(dir)).listAssets();
    expect(assets.filter((a) => /^(website|\.git|\.claude|node_modules)\//.test(a))).toEqual([]);
  });
});

describe("content loader (real notes, no category folders)", () => {
  it("splits the root README into an overview plus one page per topic", async () => {
    const c = await load();
    const docs = c.getAllDocs();
    expect(docs[0]).toMatchObject({ slug: "fundamentals", title: "Overview" });
    expect(c.getDoc("fundamentals/destructuring")?.title).toBe("Destructuring");
    expect(c.getDoc("fundamentals/nullish-coalescing")?.body).toContain("??");
  });

  it("keeps interview questions in their own sidebar section after the README topics", async () => {
    const cats = (await load()).getCategories();
    expect(cats.map((c) => c.slug)).toEqual(["fundamentals", "interview-questions"]);
    const interview = cats[1].docs;
    expect(interview[0]).toMatchObject({ slug: "interview-questions", title: "Interview Questions" });
    expect(interview).toHaveLength(17);
    expect(interview.at(-1)).toMatchObject({ slug: "interview-questions/typeof-vs-instanceof", title: "typeof vs instanceof" });
    // README table links point at the site pages.
    expect(interview[0].body).toContain("](/interview-questions/data-type)");
  });
});

describe("content loader (fixture)", () => {
  it("maps a README to its folder URL and the root README to an Overview page", async () => {
    const c = await load(fixture);
    expect(c.getDoc("intro")).toMatchObject({ title: "Intro", file: "01_Intro/README.md" });
    expect(c.getDoc("web-security")).toMatchObject({ title: "Web Security", file: "02_web-security/README.md" });
    expect(c.getDoc("intro/overview")).toMatchObject({ title: "Overview", file: "README.md" });
    expect(c.getAllDocs()[0].slug).toBe("intro/overview");
  });

  it("titles concept.md after its folder and upper-cases acronyms", async () => {
    const c = await load(fixture);
    expect(c.getDoc("intro/concept")?.title).toBe("Intro");
    expect(c.getDoc("web-security/csrf-attacks/notes")).toMatchObject({ title: "CSRF in practice", group: "CSRF Attacks" });
  });

  it("rewrites note links and turns links to missing notes into plain text", async () => {
    const body = (await load(fixture)).getDoc("intro")!.body;
    expect(body).toContain("[concept](/intro/concept)");
    expect(body).toContain("and gone.");
    expect(body).not.toContain("missing.md");
  });

  it("resolves linked images with spaces and places related or unlinked ones", async () => {
    const c = await load(fixture);
    const vs = c.getDoc("intro/validation-vs-sanitization")!;
    expect(vs.body).toContain("/content/01_Intro/my%20flow.png");
    expect(vs.images).toContain("01_Intro/validation.svg");
    expect(c.getDoc("web-security/csrf-attacks/notes")!.images).toContain("02_web-security/csrf_attacks/stray.png");
  });

  it("gives an image-only folder its own page", async () => {
    const doc = (await load(fixture)).getDoc("web-security/diagrams");
    expect(doc).toMatchObject({ title: "Diagrams", images: ["02_web-security/diagrams/only.svg"] });
  });

  it("embeds HTML visualizations on the README page and fills empty notes", async () => {
    const c = await load(fixture);
    expect(c.getDoc("web-security")!.visualizations).toEqual(["02_web-security/viz.html"]);
    expect(c.getDoc("intro/empty")!.body).toBe("This topic is still being written.");
  });
});
