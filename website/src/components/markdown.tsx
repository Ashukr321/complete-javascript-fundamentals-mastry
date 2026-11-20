/* eslint-disable @typescript-eslint/no-unused-vars -- `node` is pulled out so it never reaches the DOM */
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

// Notes are the repo owner's own files, so raw HTML in them is trusted.
export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto">
            <table {...props} />
          </div>
        ),
        a: ({ node, href = "", ...props }) =>
          href.startsWith("/") && !href.startsWith("/content/") ? (
            <Link href={href} {...props} />
          ) : (
            <a href={href} {...props} {...(/^https?:/.test(href) ? { target: "_blank", rel: "noreferrer" } : {})} />
          ),
        // eslint-disable-next-line @next/next/no-img-element
        img: ({ node, alt = "", ...props }) => <img alt={alt} loading="lazy" {...props} />,
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
