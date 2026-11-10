export function RichTextHeading({ id, text }: { id: string; text: string }) {
  return (
    <h3
      id={id}
      className="scroll-mt-8 text-lg font-semibold tracking-[-0.011em] text-foreground outline-none"
    >
      {text}
    </h3>
  );
}
