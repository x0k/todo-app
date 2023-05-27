import { fileOpen, fileSave } from 'browser-fs-access'

export const JSON_MIME_TYPE = 'text/json'

export function makeJSONBlob(data: string): Blob {
  return new Blob([data], { type: JSON_MIME_TYPE })
}

export async function blobSave(fileName: string, blob: Blob): Promise<void> {
  await fileSave(blob, {
    fileName,
  })
}

export async function blobOpen(mimeTypes?: string[]): Promise<Blob> {
  return await fileOpen({
    mimeTypes,
  })
}

export async function parseJSONBlob<R = unknown>(blob: Blob): Promise<R> {
  return JSON.parse(await blob.text()) as R
}
