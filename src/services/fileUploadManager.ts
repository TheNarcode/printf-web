import { uploadFile } from './api';

type TokenGetter = () => Promise<string | null>;

interface UploadEntry {
  promise: Promise<string>;
  fileId: string | null;
}

const uploads = new Map<string, UploadEntry>();

/**
 * Kick off background uploads for all files.
 * Safe to call multiple times — already-started files are skipped.
 */
export function startUploads(
  files: { id: string; file: File; name: string; type: string }[],
  getToken: TokenGetter,
) {
  for (const f of files) {
    if (uploads.has(f.id)) continue;

    const entry: UploadEntry = { promise: null as unknown as Promise<string>, fileId: null };

    entry.promise = (async () => {
      const token = await getToken();
      if (!token) throw new Error('No auth token for file upload');
      const { fileId } = await uploadFile(f.file, token);
      entry.fileId = fileId;
      return fileId;
    })();

    uploads.set(f.id, entry);
  }
}

export async function getFileId(localFileId: string): Promise<string> {
  const entry = uploads.get(localFileId);
  if (!entry) throw new Error(`No upload started for file ${localFileId}`);
  return entry.promise;
}

export function isAllReady(): boolean {
  for (const entry of uploads.values()) {
    if (entry.fileId === null) return false;
  }
  return uploads.size > 0;
}

export function resetUploads() {
  uploads.clear();
}
