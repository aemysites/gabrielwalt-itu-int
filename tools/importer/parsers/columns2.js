/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .social block (first column)
  const social = element.querySelector('.col-18 .social');
  // Only include columns that have actual content
  const cells = [];
  if (social) {
    cells.push(social);
  }
  // Table header as per block guidelines
  const headerRow = ['Columns (columns2)'];
  // Build the table with only one column (no empty columns)
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    cells,
  ], document);
  // Replace the original element with the table
  element.replaceWith(table);
}
