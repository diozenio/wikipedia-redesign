import type {
  AudioEncoder,
  EncodedAudio,
  PcmAudio,
} from "@/server/article-audio/ports";

const MONO = 1;
const SAMPLES_PER_BLOCK = 1152 * 64;

type Mp3Encoder = {
  encodeBuffer(samples: Int16Array): ArrayBufferView;
  flush(): ArrayBufferView;
};

function toBytes(view: ArrayBufferView): Uint8Array {
  return new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
}

async function createMp3Encoder(
  sampleRate: number,
  bitrate: number,
): Promise<Mp3Encoder> {
  const lame = await import("@breezystack/lamejs");
  return new lame.Mp3Encoder(MONO, sampleRate, bitrate);
}

function encodeInBlocks(encoder: Mp3Encoder, samples: Int16Array) {
  const frames: Uint8Array[] = [];

  for (let start = 0; start < samples.length; start += SAMPLES_PER_BLOCK) {
    const block = samples.subarray(start, start + SAMPLES_PER_BLOCK);
    frames.push(toBytes(encoder.encodeBuffer(block)));
  }

  frames.push(toBytes(encoder.flush()));
  return frames;
}

function joinBytes(frames: Uint8Array[]): Uint8Array {
  return new Uint8Array(Buffer.concat(frames));
}

export class LameMp3Encoder implements AudioEncoder {
  constructor(private readonly bitrate: number) {}

  async encode(pcm: PcmAudio): Promise<EncodedAudio> {
    const encoder = await createMp3Encoder(pcm.sampleRate, this.bitrate);

    return {
      audio: joinBytes(encodeInBlocks(encoder, pcm.samples)),
      contentType: "audio/mpeg",
      extension: "mp3",
    };
  }
}
