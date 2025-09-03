/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: get both column wrappers
  const columns = Array.from(element.querySelectorAll(':scope > .row.contentNew > .col-11'));
  if (columns.length < 2) return; // Must have at least two columns

  // Helper to extract the main content from each column
  function getColumnContent(col) {
    // Find the main module inside the column
    const module = col.querySelector(':scope > .module.module-caps.module-thumbnail');
    if (!module) return document.createElement('div');
    // Get the heading
    const heading = module.querySelector('h2');
    // Get the rich content wrapper
    const richContent = module.querySelector('.ms-rtestate-field');
    // Compose a fragment
    const frag = document.createElement('div');
    if (heading) frag.appendChild(heading);
    if (richContent) frag.appendChild(richContent);
    return frag;
  }

  // Build the table rows
  const headerRow = ['Columns (columns6)'];
  const contentRow = columns.map(getColumnContent);

  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(block);
}
