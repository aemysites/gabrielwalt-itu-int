/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate column divs
  const colDivs = Array.from(element.querySelectorAll(':scope > div > div'));
  // Only keep columns with actual content
  const columns = colDivs.filter(col => col.querySelector('h2') && col.querySelector('img'));

  // Build cells for each column, including all text content
  const columnCells = columns.map(col => {
    const cellContent = [];
    // Get heading
    const heading = col.querySelector('h2');
    if (heading) cellContent.push(heading.cloneNode(true));
    // Get all content after heading up to the end of the module
    let next = heading ? heading.nextSibling : null;
    while (next) {
      // Stop if we hit another heading (shouldn't happen in this structure)
      if (next.nodeType === 1 && next.tagName === 'H2') break;
      // Only add non-empty nodes
      if (
        (next.nodeType === 1 && (next.textContent.trim() || next.querySelector('img')))
        || (next.nodeType === 3 && next.textContent.trim())
      ) {
        cellContent.push(next.cloneNode(true));
      }
      next = next.nextSibling;
    }
    return cellContent;
  });

  // Table header
  const headerRow = ['Columns (columns15)'];
  // Table second row: columns side by side
  const tableRows = [headerRow, columnCells];

  // Create table block
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace original element
  element.replaceWith(block);
}
