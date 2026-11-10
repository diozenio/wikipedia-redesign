import type { ReactNode } from "react";

export function ArticleSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  const headingId = `${id}-titulo`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="flex w-full scroll-mt-8 flex-col gap-4 pt-4 outline-none"
    >
      <div className="w-full border-b border-border pb-2">
        <h2
          id={headingId}
          className="text-[1.625rem] font-semibold tracking-[-0.02em] text-foreground"
        >
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
