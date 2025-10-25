import { marked } from 'marked';
import React from 'react';
import ReactMarkdown from 'react-markdown';

function parseMarkdownIntoBlocks(markdown: string): string[] {
  const tokens = marked.lexer(markdown);

  return tokens.map((token) => token.raw);
}

const MemoizedMarkdownBlock = React.memo(
  ({ content }: { content: string }) => {
    return <ReactMarkdown>{content}</ReactMarkdown>;
  },
  (prevProps, nextProps) => {
    if (prevProps.content !== nextProps.content) return false;

    return true;
  },
);

MemoizedMarkdownBlock.displayName = 'MemoizedMarkdownBlock';

export const MemoizedMarkdown = React.memo(
  ({ content, id }: { content: string; id: string }) => {
    const blocks = React.useMemo(
      () => parseMarkdownIntoBlocks(content),
      [content],
    );

    return blocks.map((block, index) => (
      <MemoizedMarkdownBlock key={`${id}-block_${index}`} content={block} />
    ));
  },
);

MemoizedMarkdown.displayName = 'MemoizedMarkdown';
