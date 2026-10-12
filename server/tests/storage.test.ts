import fs from 'fs';
import os from 'os';
import path from 'path';
import { Readable } from 'stream';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { createFileStorage, imageContentType, MAX_FILE_BYTES, newFilename } from '../src/config/storage';

const env = { STORAGE_PROVIDER: 'r2', R2_ACCOUNT_ID: 'a'.repeat(32), R2_BUCKET: 'synthetic-qa', R2_ACCESS_KEY_ID: 'synthetic', R2_SECRET_ACCESS_KEY: 'synthetic' };

describe('Private file storage', () => {
  afterEach(() => jest.restoreAllMocks());

  it('writes and reads private R2 objects with stable keys', async () => {
    const objects = new Map<string, Buffer>();
    const send = jest.spyOn(S3Client.prototype, 'send').mockImplementation((async (command: any) => {
      if (command instanceof PutObjectCommand) {
        expect(command.input.ACL).toBeUndefined();
        objects.set(command.input.Key!, Buffer.from(command.input.Body as Buffer));
        return {};
      }
      expect(command).toBeInstanceOf(GetObjectCommand);
      return { Body: Readable.from([objects.get(command.input.Key)!]) };
    }) as any);
    const storage = createFileStorage(env);
    await storage.save('synthetic.pdf', Buffer.from('private receipt'));
    expect((await storage.read('synthetic.pdf')).toString()).toBe('private receipt');
    expect(send).toHaveBeenCalledTimes(2);
    expect(objects.has('uploads/synthetic.pdf')).toBe(true);
  });

  it('fails configuration validation instead of silently using temporary disk', () => {
    expect(() => createFileStorage({ STORAGE_PROVIDER: 'r2' })).toThrow('R2 storage requires');
    expect(() => createFileStorage({ STORAGE_PROVIDER: 'other' })).toThrow('STORAGE_PROVIDER');
  });

  it('blocks path traversal before any remote request', async () => {
    const send = jest.spyOn(S3Client.prototype, 'send');
    const storage = createFileStorage(env);
    for (const filename of ['../secret', 'a/b', 'a\\b', '%2fsecret', '..']) {
      await expect(storage.read(filename)).rejects.toMatchObject({ statusCode: 400 });
      await expect(storage.save(filename, Buffer.from('data'))).rejects.toMatchObject({ statusCode: 400 });
    }
    expect(send).not.toHaveBeenCalled();
  });

  it('maps missing objects to 404 and provider failures to 503 without leaking credentials', async () => {
    const send = jest.spyOn(S3Client.prototype, 'send');
    const storage = createFileStorage(env);
    send.mockRejectedValueOnce(Object.assign(new Error('secret details'), { name: 'NoSuchKey' }) as never);
    await expect(storage.read('missing')).rejects.toMatchObject({ statusCode: 404, message: 'File not found.' });
    send.mockRejectedValueOnce(new Error('secret details') as never);
    await expect(storage.save('failed', Buffer.from('data'))).rejects.toMatchObject({ statusCode: 503, message: 'File storage is unavailable. Please try again.' });
    send.mockRejectedValueOnce(new Error('secret details') as never);
    await expect(storage.read('failed')).rejects.toMatchObject({ statusCode: 503 });
  });

  it('bounds upload and download memory consumption', async () => {
    const send = jest.spyOn(S3Client.prototype, 'send');
    const storage = createFileStorage(env);
    await expect(storage.save('large', Buffer.alloc(MAX_FILE_BYTES + 1))).rejects.toMatchObject({ statusCode: 413 });
    expect(send).not.toHaveBeenCalled();
    send.mockResolvedValueOnce({ Body: Readable.from([Buffer.alloc(MAX_FILE_BYTES), Buffer.from('x')]) } as never);
    await expect(storage.read('large')).rejects.toMatchObject({ statusCode: 404 });
  });

  it('preserves the local development backend and does not overwrite existing files', async () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'hr-storage-qa-'));
    const storage = createFileStorage({ UPLOAD_DIR: directory });
    try {
      await storage.save('synthetic.txt', Buffer.from('local'));
      expect((await storage.read('synthetic.txt')).toString()).toBe('local');
      await expect(storage.save('synthetic.txt', Buffer.from('overwrite'))).rejects.toMatchObject({ statusCode: 503 });
      await expect(storage.read('missing')).rejects.toMatchObject({ statusCode: 404 });
    } finally {
      fs.unlinkSync(path.join(directory, 'synthetic.txt'));
      fs.rmdirSync(directory);
    }
  });

  it('uses random safe filenames and rejects active content disguised as a photo', () => {
    expect(newFilename('receipt.pdf')).toMatch(/^[a-f0-9-]+\.pdf$/);
    expect(newFilename('receipt.pdf')).not.toBe(newFilename('receipt.pdf'));
    expect(imageContentType(Buffer.from('<svg onload="alert(1)"></svg>'))).toBeUndefined();
    expect(imageContentType(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))).toBe('image/png');
  });
});
