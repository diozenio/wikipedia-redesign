import { Heart, House, Newspaper, Shuffle, Star } from "lucide-react";

export const siteNavItems = [
  { label: "Página principal", icon: House, href: "/" },
  {
    label: "Conteúdo destacado",
    icon: Star,
    href: "https://pt.wikipedia.org/wiki/Portal:Conteúdo_destacado",
  },
  {
    label: "Eventos atuais",
    icon: Newspaper,
    href: "https://pt.wikipedia.org/wiki/Portal:Eventos_atuais",
  },
  {
    label: "Página aleatória",
    icon: Shuffle,
    href: "https://pt.wikipedia.org/wiki/Especial:Aleatória",
  },
  {
    label: "Fazer uma doação",
    icon: Heart,
    href: "https://donate.wikimedia.org/?uselang=pt",
  },
] as const;
