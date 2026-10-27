import {
  CreateBucketCommand,
  GetObjectCommand,
  type GetObjectCommandOutput,
  HeadBucketCommand,
  NoSuchKey,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import type { AudioStorage, StoredAudio } from "@/server/article-audio/ports";

export type S3StorageOptions = {
  endpoint: string;
  region: string;
  accessKey: string;
  secretKey: string;
  bucket: string;
};

function createS3Client(options: S3StorageOptions): S3Client {
  return new S3Client({
    endpoint: options.endpoint,
    region: options.region,
    forcePathStyle: true,
    credentials: {
      accessKeyId: options.accessKey,
      secretAccessKey: options.secretKey,
    },
  });
}

function toStoredAudio(object: GetObjectCommandOutput): StoredAudio | null {
  if (!object.Body) return null;

  return {
    body: object.Body.transformToWebStream(),
    contentType: object.ContentType ?? "application/octet-stream",
    contentLength: object.ContentLength ?? 0,
    contentRange: object.ContentRange,
  };
}

export class S3AudioStorage implements AudioStorage {
  private readonly client: S3Client;
  private bucketReady?: Promise<void>;

  constructor(private readonly options: S3StorageOptions) {
    this.client = createS3Client(options);
  }

  async put(key: string, audio: Uint8Array, contentType: string) {
    await this.ensureBucket();
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.options.bucket,
        Key: key,
        Body: audio,
        ContentType: contentType,
      }),
    );
  }

  async get(key: string, range?: string): Promise<StoredAudio | null> {
    try {
      return toStoredAudio(await this.getObject(key, range));
    } catch (error) {
      if (error instanceof NoSuchKey) return null;
      throw error;
    }
  }

  private getObject(key: string, range?: string) {
    return this.client.send(
      new GetObjectCommand({
        Bucket: this.options.bucket,
        Key: key,
        Range: range,
      }),
    );
  }

  private ensureBucket(): Promise<void> {
    this.bucketReady ??= this.createBucketIfMissing();
    return this.bucketReady;
  }

  private async createBucketIfMissing() {
    if (await this.bucketExists()) return;
    await this.client.send(
      new CreateBucketCommand({ Bucket: this.options.bucket }),
    );
  }

  private async bucketExists(): Promise<boolean> {
    try {
      await this.client.send(
        new HeadBucketCommand({ Bucket: this.options.bucket }),
      );
      return true;
    } catch {
      return false;
    }
  }
}
