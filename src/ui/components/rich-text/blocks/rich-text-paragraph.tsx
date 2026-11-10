"use client";

import { Fragment } from "react";
import { RichTextNote } from "@/ui/components/rich-text/blocks/rich-text-note";
import { chunkSegments } from "@/ui/components/rich-text/paragraph-chunks";
import type { RichTextInline } from "@/ui/components/rich-text/types";
import { useAppearance } from "@/ui/contexts/appearance-context";

const PARAGRAPH_CLASS = "reading-text text-base text-foreground";

function Inline({ segments }: { segments: RichTextInline[] }) {
  return segments.map((segment, index) =>
    segment.type === "note" ? (
      <RichTextNote
        key={segment.id}
        id={segment.id}
        number={segment.number}
        targetId={segment.targetId}
      />
    ) : (
      // biome-ignore lint/suspicious/noArrayIndexKey: segments are static and never reordered
      <Fragment key={`text-${index}`}>{segment.text}</Fragment>
    ),
  );
}

export function RichTextParagraph({
  text,
  segments,
}: {
  text: string;
  segments?: RichTextInline[];
}) {
  const { appearance } = useAppearance();
  const inline = segments ?? [{ type: "text", text }];

  if (!appearance.easyReading) {
    return (
      <p className={PARAGRAPH_CLASS}>
        <Inline segments={inline} />
      </p>
    );
  }

  const chunks = chunkSegments(text, inline);

  return (
    <div className="flex flex-col gap-3">
      {chunks.map((chunk, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: chunks derive from static text and are never reordered
        <p key={index} className={PARAGRAPH_CLASS}>
          <Inline segments={chunk} />
        </p>
      ))}
    </div>
  );
}
