import type { PcmAudio, SpeechSynthesizer } from "@/server/article-audio/ports";

export type OpenAICompatibleOptions = {
  baseUrl: string;
  apiKey?: string;
  model: string;
  voice: string;
  sampleRate: number;
};

function toSamples(buffer: ArrayBuffer): Int16Array {
  const evenLength = buffer.byteLength - (buffer.byteLength % 2);
  return new Int16Array(buffer, 0, evenLength / 2);
}

export class OpenAICompatibleSpeechSynthesizer implements SpeechSynthesizer {
  readonly voiceId: string;

  constructor(private readonly options: OpenAICompatibleOptions) {
    this.voiceId = `${options.model}:${options.voice}`;
  }

  async synthesize(text: string): Promise<PcmAudio> {
    const response = await this.requestSpeech(text);
    await this.assertOk(response);
    return this.toPcm(response);
  }

  private requestSpeech(text: string): Promise<Response> {
    return fetch(this.speechUrl(), {
      method: "POST",
      headers: this.headers(),
      body: this.body(text),
    });
  }

  private speechUrl(): URL {
    return new URL("/v1/audio/speech", this.options.baseUrl);
  }

  private headers(): HeadersInit {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (this.options.apiKey) {
      headers.Authorization = `Bearer ${this.options.apiKey}`;
    }
    return headers;
  }

  private body(text: string): string {
    return JSON.stringify({
      model: this.options.model,
      voice: this.options.voice,
      input: text,
      response_format: "pcm",
    });
  }

  private async assertOk(response: Response) {
    if (response.ok) return;

    const details = await response.text();
    throw new Error(`Speech synthesis failed (${response.status}): ${details}`);
  }

  private async toPcm(response: Response): Promise<PcmAudio> {
    return {
      samples: toSamples(await response.arrayBuffer()),
      sampleRate: this.options.sampleRate,
    };
  }
}
