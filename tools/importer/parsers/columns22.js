/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Get all direct children columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // First column: the heading (grab the h1 from the first col)
  let col1Content = null;
  if (columns[0]) {
    // Use the whole first column div for resilience
    col1Content = columns[0];
  }

  // Second column: the buttons (grab the ul from the second col)
  let col2Content = null;
  if (columns[1]) {
    // Use the whole second column div for resilience
    col2Content = columns[1];
  }

  // Build the table rows
  const headerRow = ['Columns (columns22)'];
  const contentRow = [col1Content, col2Content];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
