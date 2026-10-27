export function RichTextTable({ rows }: { rows: string[][] }) {
  const [header, ...body] = rows;

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-border">
      <table className="w-full table-fixed border-collapse text-left">
        {header && (
          <thead className="bg-muted">
            <tr>
              {header.map((cell, index) => (
                <th
                  key={`${index}-${cell}`}
                  scope="col"
                  className="px-2 py-3 text-sm font-medium text-foreground first:pl-4 last:pr-4"
                >
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {body.map((row, rowIndex) => (
            <tr
              key={`${rowIndex}-${row[0]}`}
              className="border-t border-border"
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={`${cellIndex}-${cell}`}
                  className="px-2 py-3 text-sm text-muted-foreground first:pl-4 last:pr-4"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
