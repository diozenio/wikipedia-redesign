export function HomeHero() {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium text-muted-foreground">
        A enciclopédia livre
      </span>
      <h1 className="text-[2rem] leading-tight font-semibold tracking-[-0.027em] text-foreground @min-[40rem]/page:text-[2.75rem]">
        Bem-vindo à Wikipédia
      </h1>
      <p className="max-w-[40rem] text-base leading-[1.6] text-muted-foreground @min-[40rem]/page:text-[1.0625rem]">
        Uma enciclopédia colaborativa, escrita por voluntários e livre para
        qualquer pessoa ler, editar e compartilhar. Comece pelos artigos
        selecionados abaixo.
      </p>
    </div>
  );
}
