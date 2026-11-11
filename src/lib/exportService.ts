import { jsPDF } from 'jspdf';
import { Sermon } from '../types';

/**
 * Downloads the sermon as a beautifully formatted Microsoft Word (.doc) file.
 */
export function exportSermonToDoc(sermon: Sermon): void {
  const formattedDate = sermon.publishedAt 
    ? new Date(sermon.publishedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    : 'Data não informada';

  // Format markdown-like content to HTML for MS Word
  const formattedHtmlContent = sermon.content
    .split('\n')
    .map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '<br/>';
      if (trimmed === '---') return '<hr style="border: none; border-top: 1pt solid #cbd5e1; margin: 15pt 0;"/>';
      if (trimmed.startsWith('## ')) {
        return `<h2 style="color: #b45309; font-size: 15pt; border-bottom: 1pt solid #e2e8f0; padding-bottom: 3pt; margin-top: 16pt; margin-bottom: 6pt;">${trimmed.replace('## ', '')}</h2>`;
      }
      if (trimmed.startsWith('### ')) {
        return `<h3 style="color: #0f172a; font-size: 13pt; margin-top: 12pt; margin-bottom: 4pt;">${trimmed.replace('### ', '')}</h3>`;
      }
      if (trimmed.startsWith('> ')) {
        return `<div style="background-color: #fef3c7; border-left: 4pt solid #d97706; padding: 8pt 12pt; margin: 10pt 0; font-style: italic; color: #78350f;">${trimmed.replace('> ', '')}</div>`;
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return `<li style="margin-bottom: 4pt; color: #334155;">${trimmed.substring(2)}</li>`;
      }
      if (/^\d+\.\s/.test(trimmed)) {
        return `<p style="margin-bottom: 6pt; font-weight: bold; color: #1e293b;">${trimmed}</p>`;
      }
      return `<p style="margin-bottom: 7pt; color: #334155; line-height: 1.6;">${trimmed}</p>`;
    })
    .join('\n');

  const docHtml = `
    <!DOCTYPE html>
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${sermon.title}</title>
      <style>
        @page { size: A4; margin: 2cm 2cm 2cm 2cm; }
        body { font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; font-size: 11pt; line-height: 1.6; color: #1e293b; }
        h1 { font-family: 'Georgia', serif; font-size: 22pt; color: #0a192f; margin-bottom: 4pt; }
        .subtitle { font-family: 'Georgia', serif; font-style: italic; font-size: 13pt; color: #475569; margin-bottom: 12pt; }
        .meta-table { width: 100%; border-collapse: collapse; background-color: #f8fafc; border: 1pt solid #cbd5e1; margin-bottom: 15pt; }
        .meta-table td { padding: 6pt 10pt; font-size: 9.5pt; color: #334155; }
        .verse-box { background-color: #fffbeb; border: 1pt solid #fde68a; border-left: 4pt solid #d97706; padding: 10pt; margin: 12pt 0; font-family: 'Georgia', serif; font-size: 11pt; color: #92400e; }
        .footer { margin-top: 25pt; padding-top: 10pt; border-top: 1pt solid #cbd5e1; font-size: 8.5pt; color: #64748b; text-align: center; }
      </style>
    </head>
    <body>
      <div style="font-size: 9pt; color: #b45309; font-weight: bold; text-transform: uppercase; letter-spacing: 1pt; margin-bottom: 8pt;">
        PregAI &bull; Sermões Top &bull; Biblioteca Gospel
      </div>
      
      <h1>${sermon.title}</h1>
      ${sermon.subtitle ? `<div class="subtitle">${sermon.subtitle}</div>` : ''}

      <table class="meta-table">
        <tr>
          <td><strong>Autor / Pregador:</strong> ${sermon.author}</td>
          <td><strong>Categoria:</strong> ${sermon.category}</td>
        </tr>
        <tr>
          <td><strong>Data:</strong> ${formattedDate}</td>
          <td><strong>Tempo de Leitura:</strong> ${sermon.readingTimeMinutes || 6} minutos</td>
        </tr>
      </table>

      ${sermon.biblicalReferences ? `
        <div class="verse-box">
          <strong style="color: #b45309; text-transform: uppercase; font-size: 9pt; display: block; margin-bottom: 3pt;">
            Texto Bíblico Base:
          </strong>
          ${sermon.biblicalReferences}
        </div>
      ` : ''}

      ${sermon.description ? `
        <div style="background-color: #f1f5f9; padding: 8pt 10pt; margin-bottom: 14pt; border-radius: 4pt; font-size: 10pt; color: #475569; font-style: italic;">
          <strong>Resumo da Mensagem:</strong> ${sermon.description}
        </div>
      ` : ''}

      <div style="margin-top: 15pt;">
        ${formattedHtmlContent}
      </div>

      <div class="footer">
        PregAI - Sermões Top &middot; Biblioteca Gospel &bull; Soli Deo Gloria &bull; ${typeof window !== 'undefined' ? window.location.origin : ''}
      </div>
    </body>
    </html>
  `;

  // UTF-8 BOM prefix (\ufeff) ensures proper character encoding in Word
  const blob = new Blob(['\ufeff', docHtml], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${sermon.slug || 'sermao'}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Downloads the sermon as a high-fidelity PDF file using jsPDF.
 */
export function exportSermonToPdf(sermon: Sermon): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 18;
  const maxWidth = pageWidth - margin * 2;
  let y = 22;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 20) {
      doc.addPage();
      y = 22;
      drawHeader();
    }
  };

  const drawHeader = () => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(180, 83, 9); // Amber 700
    doc.text('PREGAI • SERMÕES TOP | BIBLIOTECA GOSPEL', margin, 12);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, 14, pageWidth - margin, 14);
  };

  // Draw initial header
  drawHeader();

  // Title
  doc.setFont('times', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(10, 25, 47); // Navy Blue
  const titleLines = doc.splitTextToSize(sermon.title, maxWidth);
  checkPageBreak(titleLines.length * 7 + 6);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 7 + 2;

  // Subtitle
  if (sermon.subtitle) {
    doc.setFont('times', 'italic');
    doc.setFontSize(11);
    doc.setTextColor(71, 85, 105);
    const subLines = doc.splitTextToSize(sermon.subtitle, maxWidth);
    checkPageBreak(subLines.length * 5 + 4);
    doc.text(subLines, margin, y);
    y += subLines.length * 5 + 3;
  }

  // Metadata Bar (Author, Category, Date)
  y += 2;
  checkPageBreak(12);
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, maxWidth, 9, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);

  const formattedDate = sermon.publishedAt 
    ? new Date(sermon.publishedAt).toLocaleDateString('pt-BR') 
    : '';

  const metaText = `Autor: ${sermon.author}   |   Categoria: ${sermon.category}   |   ${formattedDate ? `Data: ${formattedDate}   |   ` : ''}${sermon.readingTimeMinutes || 6} min`;
  doc.text(metaText, margin + 4, y + 5.8);
  y += 14;

  // Biblical Reference Box
  if (sermon.biblicalReferences) {
    checkPageBreak(14);
    doc.setFillColor(254, 243, 199);
    doc.setDrawColor(217, 119, 6); // Amber border
    doc.roundedRect(margin, y, maxWidth, 10, 1.5, 1.5, 'FD');
    doc.setDrawColor(217, 119, 6);
    doc.setLineWidth(1);
    doc.line(margin, y, margin, y + 10);

    doc.setFont('times', 'bolditalic');
    doc.setFontSize(9.5);
    doc.setTextColor(146, 64, 14);
    doc.text(`Texto Bíblico Base: ${sermon.biblicalReferences}`, margin + 4, y + 6.5);
    y += 15;
  }

  // Sermon Content
  const rawLines = sermon.content.split('\n');
  for (const rawLine of rawLines) {
    const trimmed = rawLine.trim();

    if (!trimmed) {
      y += 3;
      continue;
    }

    if (trimmed === '---') {
      checkPageBreak(6);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.4);
      doc.line(margin, y + 1, pageWidth - margin, y + 1);
      y += 6;
      continue;
    }

    // H2 Heading
    if (trimmed.startsWith('## ')) {
      const headingText = trimmed.replace('## ', '');
      doc.setFont('times', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(180, 83, 9);
      const lines = doc.splitTextToSize(headingText, maxWidth);
      checkPageBreak(lines.length * 6 + 6);
      y += 3;
      doc.text(lines, margin, y);
      y += lines.length * 6 + 2;
      continue;
    }

    // H3 Heading
    if (trimmed.startsWith('### ')) {
      const headingText = trimmed.replace('### ', '');
      doc.setFont('times', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      const lines = doc.splitTextToSize(headingText, maxWidth);
      checkPageBreak(lines.length * 5 + 4);
      y += 2;
      doc.text(lines, margin, y);
      y += lines.length * 5 + 2;
      continue;
    }

    // Blockquotes / Bible quotes
    if (trimmed.startsWith('> ')) {
      const quoteText = trimmed.replace('> ', '').replace(/\*/g, '');
      doc.setFont('times', 'italic');
      doc.setFontSize(10);
      doc.setTextColor(120, 53, 15);
      const lines = doc.splitTextToSize(`" ${quoteText} "`, maxWidth - 10);
      const boxHeight = lines.length * 5 + 6;
      checkPageBreak(boxHeight + 2);
      
      doc.setFillColor(254, 243, 199);
      doc.setDrawColor(245, 158, 11);
      doc.roundedRect(margin, y, maxWidth, boxHeight, 1, 1, 'FD');
      doc.text(lines, margin + 5, y + 5);
      y += boxHeight + 4;
      continue;
    }

    // Bullet points
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const bulletText = trimmed.substring(2);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      const lines = doc.splitTextToSize(bulletText, maxWidth - 6);
      checkPageBreak(lines.length * 4.5 + 2);
      doc.text('•', margin + 1, y);
      doc.text(lines, margin + 5, y);
      y += lines.length * 4.5 + 1.5;
      continue;
    }

    // Numbered outline item
    if (/^\d+\.\s/.test(trimmed)) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(30, 41, 59);
      const lines = doc.splitTextToSize(trimmed, maxWidth);
      checkPageBreak(lines.length * 4.8 + 2);
      doc.text(lines, margin, y);
      y += lines.length * 4.8 + 2;
      continue;
    }

    // Regular paragraph
    doc.setFont('times', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    const lines = doc.splitTextToSize(trimmed, maxWidth);
    checkPageBreak(lines.length * 4.8 + 2);
    doc.text(lines, margin, y);
    y += lines.length * 4.8 + 2;
  }

  // Draw footer page count on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    doc.text('PregAI - Sermões Top | Biblioteca Gospel', margin, pageHeight - 8);
    doc.text(`Página ${i} de ${totalPages}`, pageWidth - margin - 22, pageHeight - 8);
  }

  // Direct download
  doc.save(`${sermon.slug || 'sermao'}.pdf`);
}
