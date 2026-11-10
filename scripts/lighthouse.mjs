import { mkdir, writeFile } from "node:fs/promises";
import { createServer } from "node:net";
import path from "node:path";
import lighthouse, { desktopConfig } from "lighthouse";
import { chromium } from "playwright";

const url =
  process.env.LIGHTHOUSE_URL ??
  "http://localhost:3000/articles/Sistema_de_informa%C3%A7%C3%A3o";
const preset =
  process.env.LIGHTHOUSE_PRESET === "desktop" ? "desktop" : "mobile";
const minAccessibility = Number(process.env.LIGHTHOUSE_MIN_A11Y ?? 0.95);
const outputDir = path.resolve("reports", "lighthouse");
const categories = ["accessibility", "performance", "best-practices"];

function freePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.unref();
    server.on("error", reject);
    server.listen(0, () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

const port = await freePort();
const browser = await chromium.launch({
  channel: "chromium",
  args: [`--remote-debugging-port=${port}`],
});

try {
  const result = await lighthouse(
    url,
    {
      port,
      output: ["html", "json"],
      onlyCategories: categories,
      logLevel: "error",
    },
    preset === "desktop" ? desktopConfig : undefined,
  );

  if (!result) throw new Error(`Lighthouse não retornou resultado para ${url}`);

  const [html, json] = result.report;
  const name = `${preset}-${new Date().toISOString().replaceAll(":", "-")}`;
  await mkdir(outputDir, { recursive: true });
  await writeFile(path.join(outputDir, `${name}.html`), html);
  await writeFile(path.join(outputDir, `${name}.json`), json);

  const { categories: scores, audits } = result.lhr;
  console.log(`Lighthouse (${preset}) ${url}`);
  for (const id of categories) {
    console.log(`  ${scores[id].title}: ${Math.round(scores[id].score * 100)}`);
  }

  const failing = scores.accessibility.auditRefs
    .map((ref) => audits[ref.id])
    .filter((audit) => audit.score !== null && audit.score < 1);
  for (const audit of failing) {
    console.log(`  ✗ ${audit.id}: ${audit.title}`);
  }

  console.log(
    `Relatórios em ${path.relative(process.cwd(), outputDir)}/${name}.{html,json}`,
  );

  if (scores.accessibility.score < minAccessibility) {
    console.error(
      `Acessibilidade ${scores.accessibility.score} abaixo do mínimo ${minAccessibility}`,
    );
    process.exitCode = 1;
  }
} finally {
  await browser.close();
}
