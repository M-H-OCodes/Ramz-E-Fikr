import { ResourceItem, Article } from '../types';
import { assetUrl } from './assetUrl';

/**
 * Generates an authentic, richly formatted Microsoft Word (.doc) document
 * compliant with Word's HTML document specification (MSO).
 * Opens natively in Microsoft Word, Google Docs, Apple Pages, and LibreOffice.
 */
export function downloadResourceAsWord(resource: ResourceItem): void {
  const sanitizeHtml = (str: string = '') =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

  const documentContent = resource.sample_preview_text || resource.description;

  // Format preformatted text into styled HTML paragraphs and headings
  const formattedBody = documentContent
    .split('\n\n')
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return '';

      // Main section headings (ALL CAPS or Chapter/Section)
      if (
        /^[A-Z0-9\s:—–\(\)\.\,\/]{4,}$/.test(trimmed) &&
        trimmed.length < 90 &&
        !trimmed.startsWith('-') &&
        !trimmed.startsWith('•')
      ) {
        return `<h2 style="font-family: Georgia, serif; color: #681F2B; font-size: 15pt; margin-top: 18pt; margin-bottom: 6pt; border-bottom: 1.5pt solid #B79558; padding-bottom: 3pt;">${sanitizeHtml(trimmed)}</h2>`;
      }

      // Subsection headers (e.g. "1. Claim:", "CHAPTER 1:", "## Header")
      if (/^(\d+\.|\bChapter\b|\bSection\b|\bPart\b|#{1,3})\s+/i.test(trimmed)) {
        return `<h3 style="font-family: Georgia, serif; color: #171717; font-size: 13pt; margin-top: 14pt; margin-bottom: 4pt;">${sanitizeHtml(trimmed.replace(/^#+\s*/, ''))}</h3>`;
      }

      // Blockquotes or key principles
      if (trimmed.startsWith('>') || trimmed.startsWith('“') || trimmed.startsWith('"')) {
        return `<blockquote style="margin: 12pt 0; padding: 8pt 14pt; background-color: #F7F3EA; border-left: 3pt solid #681F2B; font-style: italic; color: #403b35;">${sanitizeHtml(trimmed.replace(/^>\s*/, ''))}</blockquote>`;
      }

      // List items
      if (trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('*')) {
        const items = trimmed
          .split('\n')
          .map((line) => line.replace(/^[\-•\*]\s*/, '').trim())
          .filter(Boolean);
        return `<ul style="margin: 6pt 0 10pt 20pt; padding: 0;">${items
          .map((it) => `<li style="margin-bottom: 4pt; color: #171717;">${sanitizeHtml(it)}</li>`)
          .join('')}</ul>`;
      }

      // Standard paragraph
      return `<p style="margin: 0 0 10pt 0; line-height: 1.6; color: #171717;">${sanitizeHtml(trimmed).replace(/\n/g, '<br/>')}</p>`;
    })
    .join('\n');

  const htmlDocument = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <title>${sanitizeHtml(resource.title)} - Ramz-e-Fikr Dossier</title>
  <style>
    @page {
      size: 8.5in 11.0in;
      margin: 1.0in 1.0in 1.0in 1.0in;
      mso-header-margin: 0.5in;
      mso-footer-margin: 0.5in;
      mso-paper-source: 0;
    }
    body {
      font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.55;
      color: #171717;
      background-color: #ffffff;
    }
    .header-table {
      width: 100%;
      border-bottom: 2.5pt solid #681F2B;
      padding-bottom: 12pt;
      margin-bottom: 16pt;
    }
    .brand-title {
      font-family: 'Georgia', serif;
      font-size: 24pt;
      font-weight: bold;
      color: #681F2B;
      margin: 0;
      line-height: 1.2;
    }
    .brand-sub {
      font-size: 9.5pt;
      text-transform: uppercase;
      letter-spacing: 2pt;
      color: #625D57;
      margin-top: 3pt;
    }
    .meta-box {
      width: 100%;
      border-collapse: collapse;
      margin: 14pt 0 20pt 0;
      background-color: #F7F3EA;
      border: 1pt solid #D8CCBB;
    }
    .meta-box td {
      padding: 6pt 10pt;
      font-size: 9.5pt;
      border: 0.5pt solid #D8CCBB;
    }
    .meta-label {
      font-weight: bold;
      color: #681F2B;
      width: 25%;
    }
    .meta-value {
      color: #171717;
    }
    .overview-callout {
      background-color: #fcf9f2;
      border: 1pt solid #e6dcce;
      border-left: 4pt solid #B79558;
      padding: 10pt 14pt;
      margin-bottom: 18pt;
      font-size: 10.5pt;
      color: #383430;
      line-height: 1.6;
    }
    .footer-note {
      margin-top: 30pt;
      padding-top: 10pt;
      border-top: 0.75pt solid #D8CCBB;
      font-size: 9pt;
      color: #625D57;
      text-align: center;
    }
    .tag-span {
      display: inline-block;
      background-color: #EFE8DA;
      color: #681F2B;
      padding: 2pt 6pt;
      margin: 2pt;
      font-size: 8.5pt;
      font-weight: bold;
      border: 0.5pt solid #D8CCBB;
    }
  </style>
</head>
<body>
  <!-- Academic Header -->
  <table class="header-table" cellpadding="0" cellspacing="0">
    <tr>
      <td style="vertical-align: top;">
        <div class="brand-title">RAMZ-E-FIKR (رمزِ فکر)</div>
        <div class="brand-sub">Open Access Debate &amp; Argumentation Archive · Study Dossier</div>
      </td>
      <td style="text-align: right; vertical-align: top;">
        <div style="font-family: Georgia, serif; font-size: 14pt; font-weight: bold; color: #681F2B;">ACCESSION VAULT</div>
        <div style="font-size: 9pt; color: #625D57;">Document Ref: ${sanitizeHtml(resource.slug)}</div>
      </td>
    </tr>
  </table>

  <!-- Resource Main Heading -->
  <h1 style="font-family: Georgia, serif; font-size: 20pt; color: #171717; margin: 12pt 0 4pt 0; line-height: 1.25;">
    ${sanitizeHtml(resource.title)}
  </h1>

  <div style="font-size: 11pt; color: #625D57; font-style: italic; margin-bottom: 14pt;">
    Categorized under: <strong>${sanitizeHtml(resource.topic)}</strong> · Format: <strong>${sanitizeHtml(resource.format)}</strong> · Target Level: <strong>${sanitizeHtml(resource.difficulty)}</strong>
  </div>

  <!-- Structured Accession Metadata Table -->
  <table class="meta-box" cellpadding="0" cellspacing="0">
    <tr>
      <td class="meta-label">Author / Compiler:</td>
      <td class="meta-value"><strong>${sanitizeHtml(resource.author)}</strong></td>
      <td class="meta-label">Publishing Source:</td>
      <td class="meta-value">${sanitizeHtml(resource.source)}</td>
    </tr>
    <tr>
      <td class="meta-label">Resource Classification:</td>
      <td class="meta-value">${sanitizeHtml(resource.resource_type)} (${sanitizeHtml(resource.file_size || 'Full Compendium')})</td>
      <td class="meta-label">Debate Format Focus:</td>
      <td class="meta-value">${sanitizeHtml(resource.format)}</td>
    </tr>
    <tr>
      <td class="meta-label">Skill &amp; Tactical Area:</td>
      <td class="meta-value">${sanitizeHtml(resource.skill_area)}</td>
      <td class="meta-label">Publication / Edition Year:</td>
      <td class="meta-value">${resource.publication_year}</td>
    </tr>
    <tr>
      <td class="meta-label">Tags &amp; Subject Index:</td>
      <td class="meta-value" colspan="3">
        ${(resource.tags || []).map((t) => `<span class="tag-span">${sanitizeHtml(t)}</span>`).join(' ')}
      </td>
    </tr>
  </table>

  <!-- Pedagogical Overview Callout -->
  <div class="overview-callout">
    <strong style="color: #681F2B; text-transform: uppercase; font-size: 9.5pt; letter-spacing: 1pt; display: block; margin-bottom: 4pt;">
      Executive Pedagogical Synopsis
    </strong>
    ${sanitizeHtml(resource.description)}
  </div>

  <!-- Primary Attached Document Material -->
  <div style="margin-top: 18pt;">
    <h2 style="font-family: Georgia, serif; color: #681F2B; font-size: 14pt; border-bottom: 1.5pt solid #681F2B; padding-bottom: 4pt; margin-bottom: 12pt;">
      COMPLETE ATTACHED STUDY DOSSIER &amp; TRAINING FRAMEWORK
    </h2>
    ${formattedBody}
  </div>

  <!-- Verification and Citation Footer -->
  <div class="footer-note">
    <p>
      <strong>Ramz-e-Fikr (رمزِ فکر) — Where thought becomes argument.</strong><br/>
      Archived and preserved for competitive parliamentary debaters, coaches, and academic scholars.<br/>
      Permanent Web Citation: https://ramz-e-fikr.org/resources/${sanitizeHtml(resource.slug)}
    </p>
  </div>
</body>
</html>`;

  // Trigger download with Word-compatible MIME type and .doc extension
  const blob = new Blob([htmlDocument], {
    type: 'application/msword;charset=utf-8'
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${resource.slug}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Downloads full academic article formatted for Microsoft Word.
 */
export function downloadArticleAsWord(article: Article): void {
  const sanitizeHtml = (str: string = '') =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

  const formattedBody = article.body
    .split('\n\n')
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return '';

      if (trimmed.startsWith('# ')) {
        return `<h1 style="font-family: Georgia, serif; color: #681F2B; font-size: 18pt; margin-top: 20pt; border-bottom: 1.5pt solid #681F2B; padding-bottom: 4pt;">${sanitizeHtml(trimmed.replace(/^#\s*/, ''))}</h1>`;
      }
      if (trimmed.startsWith('## ')) {
        return `<h2 style="font-family: Georgia, serif; color: #681F2B; font-size: 14pt; margin-top: 16pt; margin-bottom: 6pt;">${sanitizeHtml(trimmed.replace(/^##\s*/, ''))}</h2>`;
      }
      if (trimmed.startsWith('### ')) {
        return `<h3 style="font-family: Georgia, serif; color: #171717; font-size: 12pt; margin-top: 12pt; margin-bottom: 4pt;">${sanitizeHtml(trimmed.replace(/^###\s*/, ''))}</h3>`;
      }
      if (trimmed.startsWith('>')) {
        return `<blockquote style="margin: 12pt 0; padding: 10pt 14pt; background-color: #F7F3EA; border-left: 3pt solid #681F2B; font-style: italic; color: #403b35;">${sanitizeHtml(trimmed.replace(/^>\s*/, ''))}</blockquote>`;
      }
      if (trimmed.startsWith('-') || trimmed.startsWith('•')) {
        const items = trimmed
          .split('\n')
          .map((line) => line.replace(/^[\-•\*]\s*/, '').trim())
          .filter(Boolean);
        return `<ul style="margin: 6pt 0 10pt 20pt; padding: 0;">${items
          .map((it) => `<li style="margin-bottom: 4pt;">${sanitizeHtml(it)}</li>`)
          .join('')}</ul>`;
      }
      return `<p style="margin: 0 0 10pt 0; line-height: 1.65; color: #171717;">${sanitizeHtml(trimmed).replace(/\n/g, '<br/>')}</p>`;
    })
    .join('\n');

  const htmlDocument = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>${sanitizeHtml(article.title)} - Ramz-e-Fikr Article</title>
  <style>
    @page { size: 8.5in 11.0in; margin: 1.0in; }
    body { font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; font-size: 11pt; line-height: 1.6; color: #171717; }
    .brand-title { font-family: 'Georgia', serif; font-size: 22pt; font-weight: bold; color: #681F2B; }
    .meta-box { width: 100%; border-collapse: collapse; margin: 14pt 0 20pt 0; background-color: #F7F3EA; border: 1pt solid #D8CCBB; }
    .meta-box td { padding: 6pt 10pt; font-size: 9.5pt; border: 0.5pt solid #D8CCBB; }
    .meta-label { font-weight: bold; color: #681F2B; width: 25%; }
  </style>
</head>
<body>
  <div class="brand-title">RAMZ-E-FIKR (رمزِ فکر)</div>
  <div style="font-size: 9pt; text-transform: uppercase; letter-spacing: 2pt; color: #625D57; margin-bottom: 16pt;">
    The Open Debate &amp; Argumentation Archive
  </div>

  <h1 style="font-family: Georgia, serif; font-size: 22pt; color: #171717; margin: 0 0 6pt 0;">
    ${sanitizeHtml(article.title)}
  </h1>
  <div style="font-size: 13pt; color: #625D57; font-style: italic; margin-bottom: 14pt;">
    ${sanitizeHtml(article.subtitle)}
  </div>

  <table class="meta-box" cellpadding="0" cellspacing="0">
    <tr>
      <td class="meta-label">Author:</td>
      <td><strong>${sanitizeHtml(article.author_name)}</strong> (${sanitizeHtml(article.author_institution)})</td>
      <td class="meta-label">Category:</td>
      <td>${sanitizeHtml(article.category)}</td>
    </tr>
    <tr>
      <td class="meta-label">Format:</td>
      <td>${sanitizeHtml(article.format)}</td>
      <td class="meta-label">Reading Time:</td>
      <td>${article.reading_time_minutes} minutes</td>
    </tr>
    <tr>
      <td class="meta-label">Published:</td>
      <td>${article.published_at}</td>
      <td class="meta-label">Difficulty:</td>
      <td>${article.difficulty}</td>
    </tr>
  </table>

  <div style="background-color: #fcf9f2; border-left: 4pt solid #B79558; padding: 10pt 14pt; margin-bottom: 18pt;">
    <strong>Executive Abstract:</strong> ${sanitizeHtml(article.excerpt)}
  </div>

  <div>${formattedBody}</div>

  <div style="margin-top: 24pt; border-top: 1pt solid #D8CCBB; padding-top: 12pt;">
    <h3 style="font-family: Georgia, serif; color: #681F2B; font-size: 12pt;">References &amp; Citations</h3>
    <ul>
      ${(article.citations || []).map((c) => `<li>${sanitizeHtml(c)}</li>`).join('')}
    </ul>
  </div>
</body>
</html>`;

  const blob = new Blob([htmlDocument], {
    type: 'application/msword;charset=utf-8'
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${article.slug}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Triggers a browser-native print preview dialog formatted for high-resolution PDF saving.
 * Works inside sandboxed iframes without requiring window.open or external servers.
 */
export function printOrSaveResourceAsPdf(resource: ResourceItem): void {
  const sanitizeHtml = (str: string = '') =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

  const documentContent = resource.sample_preview_text || resource.description;

  const printableHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${sanitizeHtml(resource.title)} - Ramz-e-Fikr Master PDF</title>
  <style>
    @page {
      size: letter;
      margin: 20mm 15mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #171717;
      margin: 0;
      padding: 10px;
    }
    .header-rule {
      border-bottom: 2px solid #681F2B;
      padding-bottom: 8px;
      margin-bottom: 16px;
    }
    .org-title {
      font-family: Georgia, serif;
      font-size: 18pt;
      font-weight: bold;
      color: #681F2B;
      margin: 0;
    }
    .doc-title {
      font-family: Georgia, serif;
      font-size: 16pt;
      color: #171717;
      margin-top: 8px;
      margin-bottom: 4px;
    }
    .meta-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
      font-size: 9.5pt;
      background-color: #f7f3ea;
      border: 1px solid #d8ccbb;
    }
    .meta-table td {
      padding: 5px 8px;
      border: 1px solid #d8ccbb;
    }
    .meta-label {
      font-weight: bold;
      color: #681F2B;
      width: 18%;
    }
    .content-body {
      font-size: 10pt;
      line-height: 1.65;
      white-space: pre-wrap;
      font-family: Georgia, serif;
    }
    .footer {
      margin-top: 24px;
      padding-top: 8px;
      border-top: 1px solid #d8ccbb;
      font-size: 8.5pt;
      color: #625D57;
      text-align: center;
    }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="header-rule">
    <div class="org-title">RAMZ-E-FIKR (رمزِ فکر) · DEBATE ARCHIVE</div>
    <div style="font-size: 9pt; color: #625D57; text-transform: uppercase; letter-spacing: 1px;">
      Master Study Dossier &amp; Adjudication Compendium
    </div>
  </div>

  <h1 class="doc-title">${sanitizeHtml(resource.title)}</h1>

  <table class="meta-table">
    <tr>
      <td class="meta-label">Type:</td>
      <td>${sanitizeHtml(resource.resource_type)}</td>
      <td class="meta-label">Format:</td>
      <td>${sanitizeHtml(resource.format)}</td>
    </tr>
    <tr>
      <td class="meta-label">Author:</td>
      <td>${sanitizeHtml(resource.author)}</td>
      <td class="meta-label">Source:</td>
      <td>${sanitizeHtml(resource.source)}</td>
    </tr>
    <tr>
      <td class="meta-label">Skill Area:</td>
      <td>${sanitizeHtml(resource.skill_area)}</td>
      <td class="meta-label">Difficulty:</td>
      <td>${sanitizeHtml(resource.difficulty)}</td>
    </tr>
  </table>

  <div class="content-body">${sanitizeHtml(documentContent)}</div>

  <div class="footer">
    Ramz-e-Fikr Debate Research Vault · Authentic Open Knowledge Platform · https://ramz-e-fikr.org
  </div>
</body>
</html>`;

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) return;

  doc.open();
  doc.write(printableHtml);
  doc.close();

  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (e) {
      console.warn('Print preview fallback', e);
    }
    setTimeout(() => {
      try {
        document.body.removeChild(iframe);
      } catch {}
    }, 2000);
  }, 400);
}

/**
 * Safely downloads a master PDF as a local binary blob directly to the user's computer.
 * Bypasses Chrome PDF viewer errors and iframe proxy authentication drops.
 */
export async function downloadPdfBinary(
  url: string,
  filename: string,
  fallbackResource?: ResourceItem
): Promise<boolean> {
  const safeFilename = filename.toLowerCase().endsWith('.pdf') ? filename : `${filename}.pdf`;

  // If local asset or relative path, fetch in-session binary
  if (url.startsWith('/assets/') || url.startsWith('/') || url.startsWith(window.location.origin)) {
    try {
      const response = await fetch(assetUrl(url), {
        method: 'GET',
        headers: {
          Accept: 'application/pdf,*/*'
        }
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const blob = await response.blob();

      if (blob.size === 0) {
        throw new Error('Downloaded file is empty');
      }

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = safeFilename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        try {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(blobUrl);
        } catch {}
      }, 30000);

      return true;
    } catch (err) {
      console.warn('Direct PDF binary download failed, attempting fallback print dossier:', err);
      if (fallbackResource) {
        printOrSaveResourceAsPdf(fallbackResource);
        return true;
      }
      return false;
    }
  }

  // If external URL (e.g. ICC treaty, official UN / WSDC repository)
  try {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      try {
        document.body.removeChild(link);
      } catch {}
    }, 1000);
    return true;
  } catch (err) {
    console.error('Failed to open external PDF link:', err);
    if (fallbackResource) {
      printOrSaveResourceAsPdf(fallbackResource);
    }
    return false;
  }
}
