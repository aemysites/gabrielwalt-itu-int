/* global WebImporter */
export default function parse(element, { document }) {
  // Table header: block name, one column only
  const headerRow = ['Columns (columns30)'];

  // Gather columns for the content row
  const columns = [];

  // First column: Title (h1)
  const h1 = element.querySelector('.page-heading h1');
  if (h1) columns.push(h1);

  // Second column: DIRECTOR'S CORNER link (ignore image)
  const rightCol = element.querySelector('[style*="text-align:right"]');
  if (rightCol) {
    const link = rightCol.querySelector('.ms-rtestate-field a');
    if (link) columns.push(link);
  }

  // Ensure each row is an array, and no empty rows/cells
  const cells = [headerRow, columns];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
