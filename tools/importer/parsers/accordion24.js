/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the accordion block
  const accordion = element.querySelector('.accordion');
  if (!accordion) return;

  // Find all <dt> and <dd> pairs inside the accordion
  const dl = accordion.querySelector('dl');
  if (!dl) return;
  const dts = Array.from(dl.querySelectorAll('dt'));
  const dds = Array.from(dl.querySelectorAll('dd'));

  // Defensive: ensure pairs
  const rows = [];
  const headerRow = ['Accordion (accordion24)'];
  rows.push(headerRow);

  for (let i = 0; i < dts.length; i++) {
    const dt = dts[i];
    const dd = dds[i];
    if (!dt || !dd) continue;

    // Title cell: clone the dt, but remove icon spans for cleaner output
    const title = document.createElement('div');
    // Only keep text content (strip icons)
    Array.from(dt.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'SPAN') {
        title.append(node.cloneNode(true));
      }
    });
    // Remove trailing <br> if present
    if (title.lastChild && title.lastChild.nodeName === 'BR') {
      title.removeChild(title.lastChild);
    }
    title.textContent = title.textContent.trim();

    // Content cell: use the <dd> content
    const content = document.createElement('div');
    // Defensive: only append children if any
    Array.from(dd.childNodes).forEach((node) => {
      content.append(node.cloneNode(true));
    });

    rows.push([title, content]);
  }

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
