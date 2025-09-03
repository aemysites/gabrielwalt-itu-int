/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children by class
  function getChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // Get the three main columns: nav, main, sidebar
  const columns = [];

  // 1. Left navigation (col-6 lhs-nav)
  const lhsNav = getChildByClass(element, 'col-6');
  if (lhsNav) {
    columns.push(lhsNav);
  }

  // 2. Main content (col-16)
  const mainCol = getChildByClass(element, 'col-16');
  if (mainCol) {
    columns.push(mainCol);
  }

  // 3. Sidebar (col-10 sidebar)
  const sidebarCol = getChildByClass(element, 'col-10');
  if (sidebarCol) {
    columns.push(sidebarCol);
  }

  // Defensive: Only keep non-empty columns
  const filteredColumns = columns.filter(Boolean);

  // Table header
  const headerRow = ['Columns (columns23)'];
  // Table content row: one cell per column
  const contentRow = filteredColumns;

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
