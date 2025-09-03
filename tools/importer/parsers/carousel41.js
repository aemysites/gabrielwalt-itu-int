/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main carousel container
  const featureWrap = element.querySelector('.home-feature-wrap');
  if (!featureWrap) return;

  // Find all slides
  const featureItems = featureWrap.querySelectorAll('.home-feature-item');
  if (!featureItems.length) return;

  // Prepare the table rows
  const rows = [];
  // Header row as per block spec
  rows.push(['Carousel (carousel41)']);

  featureItems.forEach((item) => {
    // Defensive: Only process if there's an image
    const imgLink = item.querySelector('.hf-photo a');
    const img = imgLink ? imgLink.querySelector('img') : null;
    // Defensive: Only process if image exists
    if (!img) return;

    // First cell: the image (only the <img>, not the link)
    // Use the <img> element directly
    const imageCell = img;

    // Second cell: text content
    const textDiv = item.querySelector('.hf-text');
    let textCell = '';
    if (textDiv) {
      // We'll collect the heading, paragraphs, and links
      const cellContent = [];
      // Heading (h1)
      const heading = textDiv.querySelector('h1');
      if (heading) cellContent.push(heading);
      // Paragraphs (p)
      // Only include non-empty paragraphs
      const paragraphs = textDiv.querySelectorAll('p');
      paragraphs.forEach((p) => {
        // If the paragraph is empty or only contains whitespace, skip
        if (p.textContent.trim() || p.querySelector('a')) {
          cellContent.push(p);
        }
      });
      // If there is any content, use it
      if (cellContent.length) {
        textCell = cellContent;
      }
    }

    rows.push([imageCell, textCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
