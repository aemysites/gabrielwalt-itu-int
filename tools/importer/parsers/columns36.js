/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all direct children columns
  const columns = [];
  // Find the main row container (should be the top-level element)
  // Defensive: if not .row, fallback to element itself
  const row = element.classList.contains('row') ? element : element.querySelector('.row') || element;
  // Get all direct children that are columns
  const colDivs = Array.from(row.querySelectorAll(':scope > div'));

  // For each column, extract its main content block
  colDivs.forEach((col) => {
    // Defensive: skip empty columns
    if (!col || !col.children || col.children.length === 0) return;
    // For sidebar columns, only keep the main module content
    // For main column, keep the main content block
    // Find all content blocks inside this column
    const contentBlocks = [];
    // For main content (left), grab the .contentNew._invisibleIfEmpty
    const mainContent = col.querySelector('.contentNew._invisibleIfEmpty');
    if (mainContent) {
      contentBlocks.push(mainContent);
    }
    // For sidebar, grab all .module.module-blue.module-greybg
    const modules = Array.from(col.querySelectorAll('.module.module-blue.module-greybg'));
    modules.forEach((mod) => {
      // Only add the module if it has content
      if (mod.querySelector('.contentNew.module-content._invisibleIfEmpty')) {
        contentBlocks.push(mod);
      }
    });
    // If nothing found, fallback to the column itself
    if (contentBlocks.length === 0) {
      contentBlocks.push(col);
    }
    // If multiple blocks, combine into one cell
    columns.push(contentBlocks.length === 1 ? contentBlocks[0] : contentBlocks);
  });

  // Table header row
  const headerRow = ['Columns (columns36)'];
  // Table content row (columns)
  const contentRow = columns;
  // Build table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace original element
  element.replaceWith(block);
}
