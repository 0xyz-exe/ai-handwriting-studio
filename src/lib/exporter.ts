import { PaperSize } from '@/types';
import jsPDF from 'jspdf';
import { PAPER_DIMENSIONS_MM } from './paper-templates';

export async function exportPagesToPdf(
  canvases: HTMLCanvasElement[],
  paperSize: PaperSize,
  filename = 'catatan-tulisan-tangan.pdf'
): Promise<void> {
  if (canvases.length === 0) return;

  const { widthMm, heightMm } = PAPER_DIMENSIONS_MM[paperSize] || PAPER_DIMENSIONS_MM.A4;
  const isLandscape = widthMm > heightMm;

  const pdf = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'mm',
    format: [widthMm, heightMm],
  });

  for (let i = 0; i < canvases.length; i++) {
    const canvas = canvases[i];
    if (i > 0) {
      pdf.addPage([widthMm, heightMm], isLandscape ? 'landscape' : 'portrait');
    }

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    pdf.addImage(imgData, 'JPEG', 0, 0, widthMm, heightMm);
  }

  pdf.save(filename);
}

export function exportCanvasToImage(
  canvas: HTMLCanvasElement,
  format: 'png' | 'jpeg' = 'png',
  filename = 'halaman-tulisan-tangan.png'
): void {
  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  const dataUrl = canvas.toDataURL(mimeType, 0.95);

  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
