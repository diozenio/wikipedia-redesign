import { Compass, CornerDownRight } from "lucide-react";
import { SidebarCard } from "@/ui/components/article-sidebar/sidebar-card";
import { cn, focusRing } from "@/ui/lib/utils";

const items = [
  {
    label: "Tecnologia da informação",
    href: "https://pt.wikipedia.org/wiki/Tecnologia_da_informação",
  },
  {
    label: "Banco de dados",
    href: "https://pt.wikipedia.org/wiki/Banco_de_dados",
  },
  {
    label: "Gestão do conhecimento",
    href: "https://pt.wikipedia.org/wiki/Gestão_do_conhecimento",
  },
  {
    label: "Engenharia de software",
    href: "https://pt.wikipedia.org/wiki/Engenharia_de_software",
  },
];

export function SeeAlsoCard() {
  return (
    <SidebarCard icon={Compass} title="Ver também">
      <ul className="flex flex-col px-5 pb-4">
        {items.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-md py-1.5 text-sm text-foreground hover:underline",
                focusRing,
              )}
            >
              <CornerDownRight className="size-3.5 text-muted-foreground" />
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </SidebarCard>
  );
}
