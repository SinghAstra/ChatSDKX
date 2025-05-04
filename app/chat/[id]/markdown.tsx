import Pre from "@/components/markdown/pre";
import { cn } from "@/lib/utils";
import React, { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  const components = {
    h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1 className={cn("font-heading text-4xl ", className)} {...props} />
    ),
    h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2
        className={cn("font-heading text-3xl font-medium  w-fit", className)}
        {...props}
      />
    ),
    h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3 className={cn("font-heading text-lg w-fit", className)} {...props} />
    ),
    h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h4 className={cn("font-heading text-lg ", className)} {...props} />
    ),
    h5: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h5 className={cn("scroll-m-20 text-lg ", className)} {...props} />
    ),
    h6: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h6 className={cn(" text-base", className)} {...props} />
    ),
    strong: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <strong className={cn("font-normal inline", className)} {...props} />
    ),
    ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
      <ul className={cn("ml-2py-0  my-0", className)} {...props} />
    ),
    ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
      <ol className={cn("  ml-2", className)} {...props} />
    ),
    li: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <li className={cn("py-0 my-0", className)} {...props} />
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
      <p className={cn(" py-0 m-0 font-thin ", className)} {...props} />
    ),
    pre: Pre,
    code: ({ className, ...props }: React.ComponentProps<"code">) => (
      <code
        className={`${className} text-sm bg-zinc-800 py-0.5 px-1 rounded-md overflow-x-auto`}
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
