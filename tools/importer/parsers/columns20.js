/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the Columns block, must span all columns
  const headerRow = ['Columns (columns20)'];

  // Get the two main columns from the top-level row
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Defensive: ensure we have two columns
  const col1 = columns[0];
  const col2 = columns[1];
  if (!col1 || !col2) return;

  // First column: just use the heading (h1)
  const h1 = col1.querySelector('h1');
  const col1Content = h1 || col1;

  // Second column: use the entire "bdt-director-corner" block
  const directorCorner = col2.querySelector('.bdt-director-corner') || col2;

  // Second row: two columns, each with the relevant content
  const contentRow = [col1Content, directorCorner];

  // Build the table
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Fix: Make header row span all columns
  const thead = table.querySelector('thead');
  if (thead) {
    const th = thead.querySelector('th');
    if (th) th.setAttribute('colspan', contentRow.length);
  }

  // Replace the original element
  element.replaceWith(table);
}
