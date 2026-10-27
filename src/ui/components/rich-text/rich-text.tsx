import { RichTextHeading } from "@/ui/components/rich-text/blocks/rich-text-heading";
// import { RichTextImage } from "@/ui/components/rich-text/blocks/rich-text-image";
import { RichTextList } from "@/ui/components/rich-text/blocks/rich-text-list";
import { RichTextParagraph } from "@/ui/components/rich-text/blocks/rich-text-paragraph";
import { RichTextTable } from "@/ui/components/rich-text/blocks/rich-text-table";
import type { RichTextBlock } from "@/ui/components/rich-text/types";

const RICH_TEXT_RENDERERS: {
  [K in RichTextBlock["type"]]?: (
    block: Extract<RichTextBlock, { type: K }>,
  ) => React.ReactNode;
} = {
  paragraph: (block) => <RichTextParagraph text={block.text} />,
  heading: (block) => <RichTextHeading id={block.id} text={block.text} />,
  list: (block) => <RichTextList ordered={block.ordered} items={block.items} />,
  table: (block) => <RichTextTable rows={block.rows} />,
  // image: (block) => (
  //   <RichTextImage
  //     src={block.src}
  //     caption={block.caption}
  //     width={block.width}
  //     height={block.height}
  //   />
  // ),
};

export function RichText({ blocks }: { blocks: RichTextBlock[] }) {
  return (
    <div className="flex w-full flex-col gap-(--reading-paragraph-gap)">
      {blocks.map((block, index) => {
        const render = RICH_TEXT_RENDERERS[block.type] as
          | ((block: RichTextBlock) => React.ReactNode)
          | undefined;

        if (!render) {
          if (process.env.NODE_ENV !== "production") {
            console.warn(
              `RichText: no renderer registered for block type "${block.type}", skipping.`,
            );
          }
          return null;
        }

        return <div key={`${block.type}-${index}`}>{render(block)}</div>;
      })}
    </div>
  );
}
