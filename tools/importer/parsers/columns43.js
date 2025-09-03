/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: get the two main columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  if (columns.length < 2) return;

  // First column: social links block
  const firstCol = columns[0];
  // Second column: secretary general's corner block
  const secondCol = columns[1];

  // Compose the table rows
  const headerRow = ['Columns (columns43)'];
  const contentRow = [
    // Each cell is the content of a column
    firstCol,
    secondCol
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
