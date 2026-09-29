<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md

## Agent skills

### Skills do projeto

As skills ficam em `.agents/skills/<nome>/SKILL.md`, no formato [Agent Skills](https://agentskills.io/specification). Quando o pedido do usuário corresponder à `description` de uma skill, leia o `SKILL.md` dela e siga as instruções. Novas skills devem ser criadas nessa pasta.

- `staged-atomic-commits`: lê o diff dos arquivos em staged, tira-os do staged e os re-adiciona agrupados em commits atômicos (Conventional Commits), executando cada commit sem coautoria.
