export function RichTextHeading({ id, text }: { id: string; text: string }) {
  return (
    <h3
      id={id}
      className="scroll-mt-8 text-lg outline-none font-semibold tracking-[-0.2px] text-foreground"
    >
      {text}
    </h3>
  );
}
