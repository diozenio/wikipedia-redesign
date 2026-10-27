FROM node:24-alpine

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml prisma.config.ts tsconfig.json ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile

COPY src ./src
RUN pnpm db:generate

CMD ["sh", "-c", "pnpm exec prisma migrate deploy && pnpm exec tsx src/server/worker.ts"]
