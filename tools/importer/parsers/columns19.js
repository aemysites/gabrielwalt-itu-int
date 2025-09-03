/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: get the inner content container
  const inner = element.firstElementChild || element;
  // Get all direct children
  const children = Array.from(inner.children);

  // First column: image (inside link)
  let imageCol = null;
  for (const child of children) {
    // Find the first <a> containing an <img>
    if (child.tagName === 'A' && child.querySelector('img')) {
      imageCol = child;
      break;
    }
    // Or direct <img>
    if (child.tagName === 'IMG') {
      imageCol = child;
      break;
    }
  }
  // If not found, fallback to first image
  if (!imageCol) {
    const img = inner.querySelector('img');
    if (img) imageCol = img;
  }

  // Second column: heading, paragraphs, link
  // Find the main heading
  const headings = children.filter(c => c.tagName && c.tagName.match(/^H[1-6]$/));
  // Find all paragraphs
  const paragraphs = children.filter(c => c.tagName === 'P');
  // Find any additional links (in paragraphs)
  const links = [];
  paragraphs.forEach(p => {
    const a = p.querySelector('a');
    if (a) links.push(a);
  });

  // Compose the right column content
  const rightColContent = [];
  // Heading (skip empty <h1><br></h1>)
  headings.forEach(h => {
    if (h.textContent.trim()) rightColContent.push(h);
  });
  // Paragraphs (skip empty ones)
  paragraphs.forEach(p => {
    if (p.textContent.trim()) rightColContent.push(p);
  });
  // If link is not already included, add it
  links.forEach(a => {
    if (!rightColContent.includes(a)) rightColContent.push(a);
  });

  // Defensive: if nothing found, fallback to all children except imageCol
  if (rightColContent.length === 0) {
    children.forEach(c => {
      if (c !== imageCol) rightColContent.push(c);
    });
  }

  // Table structure
  const headerRow = ['Columns (columns19)'];
  const contentRow = [imageCol, rightColContent];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element
  element.replaceWith(block);
}
