import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

dotenv.config();

// Local development and legacy path resolution. Public URLs remain stable.
export const uploadsDirectory = path.resolve(process.env.UPLOAD_DIR || 'uploads');
export const MAX_FILE_BYTES = 10 * 1024 * 1024;

export class StorageError extends Error {
  constructor(message: string, public readonly statusCode: number) { super(message); }
}

export function assertFilename(filename: string) {
  if (!/^[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9]+)?$/.test(filename)) {
    throw new StorageError('Invalid file name.', 400);
  }
}

export function newFilename(originalName = '') {
  const extension = path.extname(originalName).toLowerCase();
  return randomUUID() + (/^\.[a-z0-9]{1,10}$/.test(extension) ? extension : '');
}

// Detect image bytes rather than trusting a user-supplied MIME type or extension.
export function imageContentType(bytes: Buffer): string | undefined {
  if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return 'image/png';
  if (bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return 'image/jpeg';
  if (['GIF87a', 'GIF89a'].includes(bytes.subarray(0, 6).toString('ascii'))) return 'image/gif';
  if (bytes.subarray(0, 4).toString('ascii') === 'RIFF' && bytes.subarray(8, 12).toString('ascii') === 'WEBP') return 'image/webp';
  return undefined;
}

export function createFileStorage(env: NodeJS.ProcessEnv, injectedClient?: S3Client) {
  const provider = env.STORAGE_PROVIDER || 'local';
  if (!['local', 'r2', 's3'].includes(provider)) throw new Error('STORAGE_PROVIDER must be local, r2 or s3.');
  const directory = path.resolve(env.UPLOAD_DIR || 'uploads');
  let client: S3Client | undefined;
  const bucket = provider === 's3' ? env.S3_BUCKET : env.R2_BUCKET;
  if (provider === 'r2') {
    if (!/^[a-f0-9]{32}$/.test(env.R2_ACCOUNT_ID || '') || !bucket || !env.R2_ACCESS_KEY_ID || !env.R2_SECRET_ACCESS_KEY) {
      throw new Error('R2 storage requires a valid R2_ACCOUNT_ID, R2_BUCKET, R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY.');
    }
    client = injectedClient || new S3Client({
      region: 'auto', endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId: env.R2_ACCESS_KEY_ID, secretAccessKey: env.R2_SECRET_ACCESS_KEY },
      requestChecksumCalculation: 'WHEN_REQUIRED', responseChecksumValidation: 'WHEN_REQUIRED',
    });
  } else if (provider === 's3') {
    if (!bucket || !env.AWS_REGION) throw new Error('S3 storage requires S3_BUCKET and AWS_REGION.');
    if (!!env.AWS_ACCESS_KEY_ID !== !!env.AWS_SECRET_ACCESS_KEY) {
      throw new Error('Set both AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY, or use an AWS workload role.');
    }
    // Standard AWS endpoint and credential chain; no arbitrary endpoint or public ACL.
    client = injectedClient || new S3Client({ region: env.AWS_REGION,
      ...(env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY ? { credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID, secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        ...(env.AWS_SESSION_TOKEN ? { sessionToken: env.AWS_SESSION_TOKEN } : {}),
      } } : {}),
    });
  } else {
    fs.mkdirSync(directory, { recursive: true });
  }
  return {
    async save(filename: string, bytes: Buffer, contentType = 'application/octet-stream') {
      assertFilename(filename);
      if (bytes.length > MAX_FILE_BYTES) throw new StorageError('File exceeds the 10 MB limit.', 413);
      try {
        if (client) await client.send(new PutObjectCommand({ Bucket: bucket, Key: `uploads/${filename}`, Body: bytes, ContentType: contentType }));
        else await fs.promises.writeFile(path.join(directory, filename), bytes, { flag: 'wx' });
      } catch { throw new StorageError('File storage is unavailable. Please try again.', 503); }
    },
    async read(filename: string): Promise<Buffer> {
      assertFilename(filename);
      try {
        if (!client) {
          const filePath = path.join(directory, filename);
          const stat = await fs.promises.stat(filePath);
          if (!stat.isFile() || stat.size > MAX_FILE_BYTES) throw new StorageError('File is unavailable.', 404);
          return await fs.promises.readFile(filePath);
        }
        const result = await client.send(new GetObjectCommand({ Bucket: bucket, Key: `uploads/${filename}` }));
        if (!result.Body) throw new StorageError('File not found.', 404);
        const chunks: Buffer[] = [];
        let size = 0;
        for await (const chunk of result.Body as AsyncIterable<Uint8Array>) {
          size += chunk.length;
          if (size > MAX_FILE_BYTES) {
            if ('destroy' in result.Body) (result.Body as import('stream').Readable).destroy();
            throw new StorageError('File is unavailable.', 404);
          }
          chunks.push(Buffer.from(chunk));
        }
        return Buffer.concat(chunks);
      } catch (error: unknown) {
        if (error instanceof StorageError) throw error;
        const failure = error as { code?: string; name?: string; $metadata?: { httpStatusCode?: number } };
        if (failure.code === 'ENOENT' || failure.name === 'NoSuchKey' || failure.$metadata?.httpStatusCode === 404) throw new StorageError('File not found.', 404);
        throw new StorageError('File storage is unavailable. Please try again.', 503);
      }
    },
  };
}

export const fileStorage = createFileStorage(process.env);
