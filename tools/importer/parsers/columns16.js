/* global WebImporter */
export default function parse(element, { document }) {
  // Only process tables with at least one row and two columns
  if (!element || element.tagName !== 'TABLE') return;
  const rows = element.querySelectorAll('tbody > tr');
  if (rows.length === 0) return;
  const firstRow = rows[0];
  const cells = firstRow.querySelectorAll('td');
  if (cells.length < 2) return;

  // Header row as required
  const headerRow = ['Columns (columns16)'];

  // For each cell, extract its child nodes (not the <td> itself)
  const contentRow = Array.from(cells).map((cell) => Array.from(cell.childNodes));

  // Build the table
  const blockTable = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element
  element.replaceWith(blockTable);
}
