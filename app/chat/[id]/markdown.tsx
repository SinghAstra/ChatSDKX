import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  const components = {
    h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1
        className={cn(
          "font-heading mt-8 scroll-m-20 text-4xl leading-[3.25rem]",
          className
        )}
        {...props}
      />
    ),
    h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2
        className={cn(
          "font-heading text-3xl font-medium  text-green-400 scroll-m-20  first:mt-0 border-b border-dashed w-fit",
          className
        )}
        {...props}
      />
    ),
    h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3
        className={cn(
          "font-heading mt-6 scroll-m-20 text-lg first:mt-0 border-b border-dashed w-fit",
          className
        )}
        {...props}
      />
    ),
    h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h4
        className={cn("font-heading mt-6 scroll-m-20 text-lg ", className)}
        {...props}
      />
    ),
    h5: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h5 className={cn("mt-6 scroll-m-20 text-lg ", className)} {...props} />
    ),
    h6: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h6 className={cn("mt-6 scroll-m-20 text-base", className)} {...props} />
    ),
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <pre
          {...props}
          className={`${className} text-sm w-[80dvw] md:max-w-[500px] overflow-x-scroll p-3 rounded-lg mt-2 bg-zinc-800`}
        >
          <code className={match[1]}>{children}</code>
        </pre>
      ) : (
        <code
          className={`${className} text-sm bg-zinc-800 py-0.5 px-1 rounded-md`}
          {...props}
        >
          {children}
        </code>
      );
    },
    strong: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <strong className={cn("font-normal", className)} {...props} />
    ),
    ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
      <ul
        className={cn(
          "border border-pink-400 ml-6 py-0 list-disc my-0",
          className
        )}
        {...props}
      />
    ),
    ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
      <ol
        className={cn(" border border-yellow-400 list-decimal ml-6", className)}
        {...props}
      />
    ),
    li: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <li
        className={cn("border border-green-400 py-0 my-0", className)}
        {...props}
      />
    ),
    a: ({ className, ...props }: React.HTMLAttributes<HTMLAnchorElement>) => (
      <a
        className={cn("font-medium underline underline-offset-4", className)}
        target="_blank"
        {...props}
      />
    ),
    p: ({
      className,
      ...props
    }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p
        className={cn(
          " text-cyan-400 py-0 m-0 font-thin inline align-middle",
          className
        )}
        {...props}
      />
    ),
  };

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children
);
