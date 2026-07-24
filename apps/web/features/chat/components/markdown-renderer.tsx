"use client";

import { Check, Copy } from "lucide-react";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

// helper function to recursively extract text from highlighted React nodes
function extractTextFromNode(node: React.ReactNode): string {
  if (typeof node === "string") return node;

  if (typeof node === "number") return String(node);

  if (Array.isArray(node)) return node.map(extractTextFromNode).join("");

  if (React.isValidElement(node)) {
    const element = node as React.ReactElement<{ children?: React.ReactNode }>;

    return extractTextFromNode(element.props.children);
  }

  return "";
}

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);

    setCopiedCode(code);

    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="w-full max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ children }) => (
            <h1 className="font-bold mt-8 mb-3 text-[1.375rem] text-foreground first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-bold mt-8 mb-3 text-[1.125rem] text-foreground first:mt-0 [&_code]:text-[0.7em] [&_code]:font-normal [&_code]:font-mono [&_code]:bg-muted/60 [&_code]:text-muted-foreground [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:align-middle [&_code]:mx-0.5">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-semibold mt-8 mb-3 pt-6 border-t border-border text-base text-foreground first:mt-0 first:pt-0 first:border-t-0 [&_code]:text-[0.72em] [&_code]:font-normal [&_code]:font-mono [&_code]:bg-muted/60 [&_code]:text-muted-foreground [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:align-middle [&_code]:mx-0.5">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="font-semibold mt-5 mb-2 text-base text-foreground first:mt-0 [&_code]:text-[0.75em] [&_code]:font-normal [&_code]:font-mono [&_code]:bg-muted/60 [&_code]:text-muted-foreground [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:align-middle [&_code]:mx-0.5">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="font-semibold mt-4 mb-2 text-sm text-foreground first:mt-0">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="font-semibold mt-4 mb-2 text-sm text-muted-foreground first:mt-0">
              {children}
            </h6>
          ),

          p: ({ children }) => (
            <p className="wrap-break-word whitespace-normal mb-3 leading-[1.65rem] text-foreground">
              {children}
            </p>
          ),

          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 hover:opacity-80"
            >
              {children}
            </a>
          ),

          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
              {children}
            </strong>
          ),

          code: ({ children, className }) => {
            const isInline = !className;

            if (isInline) {
              return (
                <code className="bg-muted text-foreground rounded px-1.5 py-0.5 text-[0.85em] font-mono">
                  {children}
                </code>
              );
            }

            return <code className={className}>{children}</code>;
          },

          pre: ({ children }) => {
            const codeElement = React.isValidElement(children)
              ? (children as React.ReactElement<{
                  className?: string;
                  children?: React.ReactNode;
                }>)
              : null;

            const className = codeElement?.props?.className ?? "";

            const language = /language-(\w+)/.exec(className)?.[1] ?? "text";

            // 2. Use the helper function here instead of String()
            const rawText = extractTextFromNode(
              codeElement?.props?.children
            ).replace(/\n$/, "");

            const isCopied = copiedCode === rawText;

            return (
              <div className="mb-3 overflow-hidden rounded-lg border border-border bg-card mt-4">
                <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-secondary">
                  <span className="text-xs font-mono text-muted-foreground">
                    {language}
                  </span>
                  <button
                    onClick={() => copyToClipboard(rawText)}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <Check className="size-3.5" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <pre className="overflow-x-auto p-4 text-sm leading-relaxed font-mono text-foreground scrollbar-thin scrollbar-thumb-foreground/10">
                  {children}
                </pre>
              </div>
            );
          },

          ul: ({ children }) => (
            <ul className="in-[li]:mb-0 in-[li]:mt-1 in-[li]:gap-1 [&:not(:last-child)_ul]:pb-1 list-disc flex flex-col gap-2 pl-8 mb-4 text-foreground">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="in-[li]:mb-0 in-[li]:mt-1 in-[li]:gap-1 [&:not(:last-child)_ol]:pb-1 list-decimal flex flex-col gap-2 pl-8 mb-4 text-foreground">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="whitespace-normal wrap-break-word pl-2 leading-[1.6rem]">
              {children}
            </li>
          ),

          blockquote: ({ children }) => (
            <blockquote className="ml-2 border-l-4 border-border pl-4 text-muted-foreground my-3">
              {children}
            </blockquote>
          ),

          hr: () => <hr className="border-t-0.5 my-4 mx-1.5 border-border" />,

          table: ({ children }) => (
            <div className="overflow-x-auto w-full px-2 mb-6 mt-2">
              <table className="min-w-full border-collapse text-sm leading-[1.7] whitespace-normal">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="text-left">{children}</thead>
          ),
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => <tr>{children}</tr>,
          th: ({ children }) => (
            <th
              scope="col"
              className="border-b-[0.5px] border-border py-2 pr-4 align-top font-bold text-foreground"
            >
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b-[0.5px] border-border py-2 pr-4 align-top text-foreground">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
