// Extrahiert den Text aus einem PDF direkt im Browser (mit pdf.js), statt die
// komplette Binärdatei zum Server hochzuladen. Grund: Vercel Serverless
// Functions akzeptieren pro Anfrage nur ca. 4,5 MB Body – bei mehreren
// eingescannten Skripten war das schnell überschritten ("Load failed").
// Reiner Text ist um Größenordnungen kleiner und macht dieses Limit in der
// Praxis irrelevant.
//
// Läuft bewusst nur im Browser (dynamic import), damit die recht große
// pdf.js-Bibliothek nicht das initiale Bundle aufbläht und nicht serverseitig
// ausgeführt wird.

export interface PdfExtractionResult {
  text: string;
  pageCount: number;
  /** true, wenn kaum Text gefunden wurde – Hinweis auf ein gescanntes/Bild-PDF ohne Textebene. */
  looksScanned: boolean;
}

export async function extractPdfText(file: File): Promise<PdfExtractionResult> {
  const pdfjsLib = await import("pdfjs-dist");
  // Worker über CDN laden (Version exakt passend zur installierten
  // pdfjs-dist-Version), statt ihn zu bundeln – das umgeht bekannte
  // Next.js/Webpack-Probleme beim Auflösen der Worker-Datei.
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

  const buf = await file.arrayBuffer();
  const doc = await pdfjsLib.getDocument({ data: buf }).promise;

  const pageTexts: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item ? (item as { str: string }).str : ""))
      .join(" ");
    pageTexts.push(pageText.trim());
  }

  const text = pageTexts.join("\n\n").trim();
  const looksScanned = doc.numPages > 0 && text.length < doc.numPages * 20;

  return { text, pageCount: doc.numPages, looksScanned };
}
