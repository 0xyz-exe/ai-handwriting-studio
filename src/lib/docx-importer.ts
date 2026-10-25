import mammoth from 'mammoth';

export async function extractTextFromDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value || '';
}

export async function extractTextFromTxt(file: File): Promise<string> {
  return await file.text();
}
