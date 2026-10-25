import { createWorker } from 'tesseract.js';

export interface OcrProgress {
  status: string;
  progress: number;
}

export async function extractTextFromImage(
  imageFile: File | Blob | string,
  lang = 'ind+eng',
  onProgress?: (p: OcrProgress) => void
): Promise<string> {
  const worker = await createWorker(lang, 1, {
    logger: (m) => {
      if (onProgress && m.status && typeof m.progress === 'number') {
        onProgress({ status: m.status, progress: Math.round(m.progress * 100) });
      }
    },
  });

  try {
    const {
      data: { text },
    } = await worker.recognize(imageFile);
    return text.trim();
  } finally {
    await worker.terminate();
  }
}
