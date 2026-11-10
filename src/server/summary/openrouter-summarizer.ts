const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "google/gemini-2.5-flash-lite";
const TIMEOUT_MS = 8000;

const SYSTEM_PROMPT = [
  "Você resume artigos de enciclopédia para leitores que precisam de linguagem simples.",
  "Escreva em português do Brasil, em no máximo 3 frases curtas e diretas.",
  "Use palavras do dia a dia e explique termos difíceis de forma simples.",
  "Use apenas fatos presentes no texto. Não invente nem acrescente informações.",
  "Responda só com o resumo, em texto corrido, sem markdown, listas ou títulos.",
].join(" ");

export class SummarizerNotConfiguredError extends Error {
  constructor() {
    super("OPENROUTER_API_KEY is not configured");
  }
}

export class SummarizerUpstreamError extends Error {}

export function isSummarizerConfigured(): boolean {
  return Boolean(process.env.OPENROUTER_API_KEY);
}

function readContent(payload: unknown): string | null {
  const choices = (payload as { choices?: unknown })?.choices;
  if (!Array.isArray(choices)) return null;
  const content = (choices[0] as { message?: { content?: unknown } })?.message
    ?.content;
  return typeof content === "string" ? content.trim() : null;
}

export async function summarizeWithOpenRouter(
  title: string,
  text: string,
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new SummarizerNotConfiguredError();

  let response: Response;
  try {
    response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "X-Title": "Wikipedia Redesign",
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || DEFAULT_MODEL,
        temperature: 0.2,
        max_tokens: 220,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Artigo: ${title}\n\n${text}` },
        ],
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    throw new SummarizerUpstreamError("OpenRouter request failed", {
      cause: error,
    });
  }

  if (!response.ok) {
    throw new SummarizerUpstreamError(
      `OpenRouter responded with ${response.status}`,
    );
  }

  const summary = readContent(await response.json().catch(() => null));
  if (!summary) throw new SummarizerUpstreamError("OpenRouter returned empty");

  return summary;
}
