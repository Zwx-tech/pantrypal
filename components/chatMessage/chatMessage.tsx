"use client";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import styles from "./chatMessage.module.css";

interface ChatMessageProps {
  source: string;
}

export default function ChatMessage({ source }: ChatMessageProps) {
  function renderMarkdown(source: string) {
    const processor = unified()
      .use(remarkParse)
      .use(remarkRehype) //* remark-rehype is a unified plugin to compile markdown to HTML
      .use(rehypeSanitize)
      .use(rehypeStringify);

    const result = processor.processSync(source);
    return result.toString();
  }

  const __html = renderMarkdown(source);
  return (
    <div className={styles.wrapper} dangerouslySetInnerHTML={{ __html }}></div>
  );
}
