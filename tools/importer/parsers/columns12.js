/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only process elements with expected structure
  if (!element || !document) return;

  // Helper to get immediate children by class
  const firstCol = Array.from(element.children).find(child => child.classList && child.classList.contains('col-first'));
  const lastCol = Array.from(element.children).find(child => child.classList && child.classList.contains('col-last'));

  // Defensive fallback: If structure is missing, skip
  if (!firstCol || !lastCol) return;

  // Prepare header row
  const headerRow = ['Columns (columns12)'];

  // Prepare columns: left and right
  // Left column: copyright info
  // Right column: links list
  const leftCell = firstCol;
  const rightCell = lastCol;

  // Compose the table
  const cells = [
    headerRow,
    [leftCell, rightCell]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
