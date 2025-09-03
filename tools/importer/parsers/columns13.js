/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the required header row
  const headerRow = ['Columns (columns13)'];

  // Find the three main columns by their order in the .row
  const columns = Array.from(element.children).filter((child) => child.tagName === 'DIV');
  if (columns.length < 2) return;

  // For each column, extract the main visible content block
  const contentRow = columns.map((col) => {
    // Try to find the main content area for each column
    let mainBlock = col.querySelector(':scope > .home-block');
    // For Events column, it's nested deeper
    if (!mainBlock) {
      mainBlock = col.querySelector('.ms-webpart-zone, .ms-webpart-chrome, .ms-webpart-chrome-fullWidth');
    }
    // Fallback: use the column itself
    if (!mainBlock) mainBlock = col;
    // Clone to avoid moving nodes out of the DOM
    return mainBlock.cloneNode(true);
  });

  // Build the table with the header and one row with as many columns as needed
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element with the new table
  if (table) element.replaceWith(table);
}
