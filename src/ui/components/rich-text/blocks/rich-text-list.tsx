export function RichTextList({
  ordered,
  items,
}: {
  ordered: boolean;
  items: string[];
}) {
  const ListTag = ordered ? "ol" : "ul";

  return (
    <ListTag className="flex flex-col gap-2 pl-5 text-base leading-[1.7] text-foreground marker:text-muted-foreground">
      {items.map((item) => (
        <li key={item} className={ordered ? "list-decimal" : "list-disc"}>
          {item}
        </li>
      ))}
    </ListTag>
  );
}
