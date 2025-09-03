/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main row containing the columns
  const row = element.querySelector('.row.contentNew');
  if (!row) return;

  // Get all immediate column divs (should be three)
  const columns = Array.from(row.querySelectorAll(':scope > div'));
  if (!columns.length) return;

  // For each column, extract its main content block (the module)
  const columnContents = columns.map((col) => {
    // Find the first child with class 'module'
    const module = col.querySelector(':scope > .module');
    // Defensive: if not found, fallback to the column itself
    return module || col;
  });

  // Build the table rows
  const headerRow = ['Columns (columns34)'];
  const contentRow = columnContents;

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
