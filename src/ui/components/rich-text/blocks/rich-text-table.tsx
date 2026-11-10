export function RichTextTable({ rows }: { rows: string[][] }) {
  const [header, ...body] = rows;

  return (
    <div className="flex w-full flex-col overflow-x-auto rounded-lg border border-border">
      {header && (
        <div className="flex items-center gap-4 bg-muted px-4 py-3">
          {header.map((cell, index) => (
            <span
              key={`${index}-${cell}`}
              className="min-w-0 flex-1 text-sm font-medium text-foreground"
            >
              {cell}
            </span>
          ))}
        </div>
      )}
      {body.map((row, rowIndex) => (
        <div
          key={`${rowIndex}-${row[0]}`}
          className="flex items-center gap-4 border-t border-border px-4 py-3"
        >
          {row.map((cell, cellIndex) => (
            <span
              key={`${cellIndex}-${cell}`}
              className="min-w-0 flex-1 text-sm text-muted-foreground"
            >
              {cell}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
