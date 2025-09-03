/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per block guidelines
  const headerRow = ['Hero (hero21)'];

  // There is no background image in the provided HTML, so the image row is empty
  const imageRow = [''];

  // Extract all visible text content from the element
  // Remove zero-width and invisible unicode characters
  let contentText = element.textContent.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();

  // Create a heading element for the title/subheading
  let contentCell = '';
  if (contentText) {
    const h1 = document.createElement('h1');
    h1.textContent = contentText;
    contentCell = h1;
  }

  const rows = [
    headerRow,
    imageRow,
    [contentCell],
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
