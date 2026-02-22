'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  children: string;
  className?: string;
}

export function MarkdownRenderer({ children, className }: MarkdownRendererProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ ...props }) => (
            <h1 className="text-xl font-bold mt-5 mb-3 text-foreground" {...props} />
          ),
          h2: ({ ...props }) => (
            <h2 className="text-lg font-bold mt-4 mb-2 text-foreground" {...props} />
          ),
          h3: ({ ...props }) => (
            <h3 className="text-base font-semibold mt-3 mb-1.5 text-foreground" {...props} />
          ),
          h4: ({ ...props }) => (
            <h4 className="text-sm font-semibold mt-2.5 mb-1 text-foreground" {...props} />
          ),
          p: ({ ...props }) => (
            <p className="my-2 text-foreground" {...props} />
          ),
          ul: ({ ...props }) => (
            <ul className="my-2 ml-4 list-disc list-outside text-foreground" {...props} />
          ),
          ol: ({ ...props }) => (
            <ol className="my-2 ml-4 list-decimal list-outside text-foreground" {...props} />
          ),
          li: ({ ...props }) => (
            <li className="my-0.5 pl-1 text-foreground" {...props} />
          ),
          strong: ({ ...props }) => (
            <strong className="font-semibold text-foreground" {...props} />
          ),
          em: ({ ...props }) => (
            <em className="italic text-foreground" {...props} />
          ),
          blockquote: ({ ...props }) => (
            <blockquote className="border-l-4 border-primary/30 pl-4 py-1 my-3 bg-muted/30 text-muted-foreground" {...props} />
          ),
          code: ({ className: codeClassName, children, ...props }) => {
            const match = /language-(\w+)/.exec(codeClassName || '');
            return !match ? (
              <code className="bg-muted/50 px-1.5 py-0.5 rounded text-sm font-mono text-foreground" {...props}>
                {children}
              </code>
            ) : (
              <div className="my-3">
                <pre className="bg-muted/50 p-3 rounded-lg overflow-x-auto text-sm">
                  <code className="font-mono text-foreground" {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            );
          },
          table: ({ ...props }) => (
            <div className="my-4 overflow-x-auto">
              <table className="w-full border-collapse text-sm" {...props} />
            </div>
          ),
          thead: ({ ...props }) => (
            <thead className="bg-muted/50" {...props} />
          ),
          tbody: ({ ...props }) => (
            <tbody className="divide-y divide-border" {...props} />
          ),
          tr: ({ ...props }) => (
            <tr className="border-b border-border" {...props} />
          ),
          th: ({ ...props }) => (
            <th className="px-3 py-2 text-left font-semibold text-foreground border-r border-border last:border-r-0" {...props} />
          ),
          td: ({ ...props }) => (
            <td className="px-3 py-2 text-muted-foreground border-r border-border last:border-r-0" {...props} />
          ),
          a: ({ ...props }) => (
            <a className="text-primary underline-offset-4 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
          ),
          img: ({ ...props }) => (
            <img
              className="max-w-full h-auto rounded-lg my-4 border border-border"
              loading="lazy"
              {...props}
            />
          ),
          hr: ({ ...props }) => (
            <hr className="my-4 border-border" {...props} />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
