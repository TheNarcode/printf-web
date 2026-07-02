/**
 * Parse a page range string like "1-5, 8, 11-13" into an array of 0-indexed page numbers.
 * Returns all pages (0..totalPages-1) if rangeStr is 'all' or empty.
 */
export function parsePageRange(rangeStr: string, totalPages: number): number[] {
  if (!rangeStr || rangeStr.trim() === '' || rangeStr.trim().toLowerCase() === 'all') {
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  const result: Set<number> = new Set();
  const parts = rangeStr.split(',');

  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.includes('-')) {
      const [startStr, endStr] = trimmed.split('-');
      const start = parseInt(startStr.trim(), 10);
      const end = parseInt(endStr.trim(), 10);
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = Math.max(1, start); i <= Math.min(totalPages, end); i++) {
          result.add(i - 1);
        }
      }
    } else {
      const p = parseInt(trimmed, 10);
      if (!isNaN(p) && p >= 1 && p <= totalPages) {
        result.add(p - 1);
      }
    }
  }

  const sorted = Array.from(result).sort((a, b) => a - b);
  return sorted.length > 0 ? sorted : Array.from({ length: totalPages }, (_, i) => i);
}

export function getSheetPages(allPages: number[], pagesPerSheet: number, sheetIndex: number): number[] {
  const start = sheetIndex * pagesPerSheet;
  return allPages.slice(start, start + pagesPerSheet);
}

export function getTotalSheets(allPages: number[], pagesPerSheet: number): number {
  return Math.max(1, Math.ceil(allPages.length / pagesPerSheet));
}

/**
 * Get the page count of a PDF File using pdf-lib (browser-compatible).
 */
export async function getPdfPageCount(file: File): Promise<number> {
  try {
    const { PDFDocument } = await import('pdf-lib');
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    return pdfDoc.getPageCount();
  } catch (err) {
    console.warn('Failed to parse PDF for page count:', err);
    return 1;
  }
}

/**
 * Generate PDF page thumbnail data URLs using pdfjs-dist (browser-compatible).
 * Returns an object mapping 0-indexed page numbers to canvas data URLs.
 */
export async function generatePdfThumbnails(
  file: File,
  pageIndices: number[],
): Promise<Record<number, string>> {
  const thumbnails: Record<number, string> = {};

  try {
    const pdfjsLib = await import('pdfjs-dist');
    // Use locally bundled worker (copied to /public during build) to avoid CDN fetch errors
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    for (const pageIdx of pageIndices) {
      try {
        // pdfjs is 1-indexed
        const page = await pdf.getPage(pageIdx + 1);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        await page.render({ canvasContext: ctx as unknown as CanvasRenderingContext2D, viewport, canvas } as Parameters<typeof page.render>[0]).promise;
        thumbnails[pageIdx] = canvas.toDataURL('image/jpeg', 0.8);

        // Clean up
        canvas.remove();
      } catch (e) {
        console.warn(`Failed to generate thumbnail for page ${pageIdx}:`, e);
      }
    }
  } catch (err) {
    console.warn('Failed to initialize pdfjs:', err);
  }

  return thumbnails;
}
