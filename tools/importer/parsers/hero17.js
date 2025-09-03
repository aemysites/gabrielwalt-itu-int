/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the required header row
  const headerRow = ['Hero (hero17)'];

  // Find background image (optional)
  let image = element.querySelector('img');
  // The image row should only be included if an image exists
  const rows = [headerRow];
  if (image) {
    rows.push([image]);
  }

  // Compose content row: title, subheading, CTA (all optional)
  const contentCell = [];
  // Title (h1)
  const h1 = element.querySelector('h1');
  if (h1) contentCell.push(h1);
  // Subheading (h2, h3, h4)
  const subheading = element.querySelector('h2, h3, h4');
  if (subheading) contentCell.push(subheading);
  // CTA (a link)
  const cta = element.querySelector('a');
  if (cta) contentCell.push(cta);
  // If no content, cell must still exist
  rows.push([contentCell.length ? contentCell : '']);

  // Build table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
