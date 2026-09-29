@AGENTS.md

## Skills

As skills do projeto ficam em `.agents/skills/` (formato [Agent Skills](https://agentskills.io/specification), compartilhado entre todos os agentes). Não use `.claude/skills/`.

- Cada skill é uma pasta `.agents/skills/<nome>/` com um `SKILL.md` (frontmatter `name` + `description`).
- Quando o pedido do usuário corresponder à `description` de uma skill, leia o `SKILL.md` dela e siga as instruções.
- Novas skills devem ser criadas em `.agents/skills/`.
