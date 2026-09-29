export type Action = {
  label: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive";
  onClick: () => void;
};
