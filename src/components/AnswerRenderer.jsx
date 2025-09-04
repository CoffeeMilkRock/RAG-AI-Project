// src/components/AnswerRenderer.jsx
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

export function AnswerRenderer({ content }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        p: ({ children }) => (
          <p style={{ marginBottom: "12px", lineHeight: "1.6" }}>{children}</p>
        ),
        li: ({ children }) => (
          <li style={{ marginLeft: "24px", listStyle: "disc" }}>{children}</li>
        ),
        strong: ({ children }) => (
          <strong style={{ fontWeight: "600" }}>{children}</strong>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
