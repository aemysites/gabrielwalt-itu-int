/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the inner block container
  const block = element.querySelector('.br-director-corner') || element;

  // Get image (background)
  const img = block.querySelector('img');

  // Get link (CTA)
  const link = block.querySelector('a');

  // Compose content cell for row 3: Heading (from link text), CTA (link)
  // Use link text as heading, link as CTA
  let heading = null;
  let cta = null;
  if (link && link.textContent.trim()) {
    heading = document.createElement('h1');
    heading.textContent = link.textContent.trim();
    // Clone the link to avoid moving it from DOM
    cta = link.cloneNode(true);
  }

  // Compose the content cell: heading and CTA link, if present
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (cta) contentCell.push(cta);

  // If there is any other text node in the block, include it as a paragraph
  // (to ensure all text content is included)
  const textNodes = Array.from(block.childNodes).filter(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
  textNodes.forEach(tn => {
    const p = document.createElement('p');
    p.textContent = tn.textContent.trim();
    contentCell.push(p);
  });

  // Build table rows
  const headerRow = ['Hero (hero26)'];
  const imageRow = [img ? img : ''];
  const contentRow = [contentCell.length ? contentCell : ''];

  const cells = [headerRow, imageRow, contentRow];

  // Create block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
