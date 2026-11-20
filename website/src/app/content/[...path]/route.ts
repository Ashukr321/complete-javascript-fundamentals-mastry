import fs from "node:fs";
import path from "node:path";
import { CONTENT_ROOT, listAssets } from "@/lib/content";

// Only the files listed here are built; any other path is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return listAssets().map((rel) => ({ path: rel.split("/") }));
}

const TYPES: Record<string, string> = {
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
};

export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const rel = (await params).path.join("/");
  if (!listAssets().includes(rel)) return new Response("Not found", { status: 404 });
  const file = fs.readFileSync(/*turbopackIgnore: true*/ path.join(/*turbopackIgnore: true*/ CONTENT_ROOT, rel));
  return new Response(file, {
    headers: { "Content-Type": TYPES[path.extname(rel).toLowerCase()] ?? "application/octet-stream" },
  });
}
