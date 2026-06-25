"use client";

import { useEffect, useRef } from "react";

interface MermaidBlockProps {
  code: string;
}

export function MermaidBlock({ code }: MermaidBlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rendered = useRef(false);

  useEffect(() => {
    if (!ref.current || rendered.current) return;
    rendered.current = true;

    import("mermaid").then((mermaid) => {
      mermaid.default.initialize({ startOnLoad: false, theme: "dark" });
      ref.current!.innerHTML = `<pre class="mermaid">${code}</pre>`;
      mermaid.default.run({ nodes: [ref.current!] }).catch(() => {});
    });
  }, [code]);

  return (
    <div ref={ref} className="my-3 flex justify-center overflow-x-auto rounded-lg bg-surface-elevated p-4 border border-border/50" />
  );
}
