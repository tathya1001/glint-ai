'use client';

import React, { Suspense } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';

import { cn } from '@/lib/utils';
import { CopyButton } from '@/components/ui/copy-button';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-roboto',
  display: 'swap',
});

interface MarkdownRendererProps {
  children: string;
}

export function MarkdownRenderer({ children }: MarkdownRendererProps) {
  return (
    <div className="space-y-3">
      <Markdown remarkPlugins={[remarkGfm]} components={COMPONENTS}>
        {children}
      </Markdown>
    </div>
  );
}

interface HighlightedPreProps extends React.HTMLAttributes<HTMLPreElement> {
  children: string;
  language: string;
  className?: string;
}

const HighlightedPre = React.memo(
  (props: HighlightedPreProps) => {
    const AsyncHighlightedPre = React.lazy(async () => {
      try {
        const { codeToTokens, bundledLanguages } = await import('shiki');

        const { children, language, className, ...rest } = props;

        // Fallback if language is not supported
        if (!(language in bundledLanguages)) {
          return {
            default: () => <pre className={className} {...rest}>{children}</pre>,
          };
        }

        const { tokens } = await codeToTokens(children, {
          lang: language as keyof typeof bundledLanguages,
          defaultColor: false,
          themes: {
            light: 'github-light',
            dark: 'github-dark',
          },
        });

        const Highlighted = () => (
          <pre className={className} {...rest}>
            <code>
              {tokens.map((line, lineIndex) => (
                <span key={lineIndex}>
                  {line.map((token, tokenIndex) => {
                    const style = typeof token.htmlStyle === 'string' ? undefined : token.htmlStyle;

                    return (
                      <span
                        key={tokenIndex}
                        className="text-shiki-light bg-shiki-light-bg dark:text-shiki-dark dark:bg-shiki-dark-bg border-none bg-gray-800"
                        style={style}
                      >
                        {token.content}
                      </span>
                    );
                  })}
                  {lineIndex !== tokens.length - 1 && '\n'}
                </span>
              ))}
            </code>
          </pre>
        );

        return { default: Highlighted };
      } catch (error) {
        console.error('Failed to load shiki or render code:', error);
        return {
          default: () => <pre className={props.className} {...props}>{props.children}</pre>,
        };
      }
    });

    return (
      <Suspense
        fallback={
          <pre className={props.className} {...props}>
            {props.children}
          </pre>
        }
      >
        <AsyncHighlightedPre />
      </Suspense>
    );
  },
  (prev, next) =>
    prev.children === next.children &&
    prev.language === next.language &&
    prev.className === next.className
);
HighlightedPre.displayName = 'HighlightedPre';

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  children: React.ReactNode;
  className?: string;
  language: string;
}

const CodeBlock = ({ children, className, language, ...restProps }: CodeBlockProps) => {
  const code =
    typeof children === 'string' ? children : childrenTakeAllStringContents(children);

  const preClass = cn(
    'overflow-x-scroll rounded-md border-none bg-gray-800 text-gray-100 p-4 font-mono text-sm [scrollbar-width:none]',
    className
  );

  return (
    <div className="group/code relative mb-4">
      <HighlightedPre language={language} className={preClass} {...restProps}>
        {code}
      </HighlightedPre>
      <div className="invisible absolute right-2 top-2 flex space-x-1 rounded-lg p-1 opacity-0 transition-all duration-200 group-hover/code:visible group-hover/code:opacity-100">
        <CopyButton content={code} copyMessage="Copied code to clipboard" />
      </div>
    </div>
  );
};

function childrenTakeAllStringContents(element: any): string {
  if (typeof element === 'string') return element;

  if (element?.props?.children) {
    const children = element.props.children;
    return Array.isArray(children)
      ? children.map((child: any) => childrenTakeAllStringContents(child)).join('')
      : childrenTakeAllStringContents(children);
  }

  return '';
}

// Define the withClass function with proper typing
function withClass<T extends keyof React.JSX.IntrinsicElements>(
  Tag: T,
  classes: string
): React.FC<React.JSX.IntrinsicElements[T]> {
  const Component: React.FC<React.JSX.IntrinsicElements[T]> = (props) => {
    return React.createElement(Tag, {
      ...props,
      className: cn(classes, (props as any).className),
    });
  };

  Component.displayName = `withClass(${String(Tag)})`;
  return Component;
}

const COMPONENTS: Components = {
  h1: withClass('h1', 'text-2xl font-semibold'),
  h2: withClass('h2', 'font-semibold text-xl'),
  h3: withClass('h3', 'font-semibold text-lg'),
  h4: withClass('h4', 'font-semibold text-base'),
  h5: withClass('h5', 'font-medium'),
  strong: withClass('strong', 'font-semibold'),
  a: withClass('a', 'text-primary underline underline-offset-2'),
  blockquote: withClass('blockquote', 'border-l-2 border-primary pl-4'),
  code: ({ children, className, ...rest }) => {
    const match = /language-(\w+)/.exec(className || '');
    return match ? (
      <CodeBlock className={className} language={match[1]} {...rest}>
        {children}
      </CodeBlock>
    ) : (
      <code
        className={cn(
          'font-mono [:not(pre)>&]:rounded-md [:not(pre)>&]:py-0.5 border-none bg-gray-800 px-2',
          className
        )}
        {...rest}
      >
        {children}
      </code>
    );
  },
  pre: ({ children }) => <>{children}</>,
  ol: withClass('ol', 'list-decimal space-y-2 pl-6'),
  ul: withClass('ul', 'list-disc space-y-2 pl-6'),
  li: withClass('li', 'my-1.5'),
  table: withClass(
    'table',
    'w-full border-collapse overflow-y-auto rounded-md border border-foreground/20'
  ),
  th: withClass(
    'th',
    'border border-foreground/20 px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right'
  ),
  td: withClass(
    'td',
    'border border-foreground/20 px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right'
  ),
  tr: withClass('tr', 'm-0 border-t p-0 even:bg-muted'),
  p: withClass('p', 'whitespace-pre-wrap'),
  hr: withClass('hr', 'border-foreground/20'),
};

export default MarkdownRenderer;