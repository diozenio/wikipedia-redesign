import { ArrowRight, Languages } from "lucide-react";

const row1 = ["English", "Español", "Français"];
const row2 = ["Deutsch", "日本語"];

export function LanguagesCard() {
  return (
    <div className="flex w-full flex-col rounded-xl border border-border bg-card shadow-xs">
      <div className="flex items-center gap-2 px-5 pt-4 pb-2">
        <Languages className="size-4 text-muted-foreground" />
        <span className="text-sm font-semibold text-foreground">
          65 idiomas
        </span>
      </div>
      <div className="flex flex-col gap-2 px-5 pb-4">
        <div className="flex flex-wrap gap-2">
          {row1.map((language) => (
            <span
              key={language}
              className="rounded-md border border-border bg-card px-3 py-1.5 text-[0.8125rem] font-medium text-foreground"
            >
              {language}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {row2.map((language) => (
            <span
              key={language}
              className="rounded-md border border-border bg-card px-3 py-1.5 text-[0.8125rem] font-medium text-foreground"
            >
              {language}
            </span>
          ))}
          <span className="flex items-center gap-1 px-1 text-[0.8125rem] font-medium text-foreground">
            Ver todos
            <ArrowRight className="size-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}
