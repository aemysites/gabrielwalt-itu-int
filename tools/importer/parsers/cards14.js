/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card content from a .home-block element
  function extractCardContent(card) {
    // Find the image (first img in the card)
    const img = card.querySelector('img');
    // Find the block header (title)
    const header = card.querySelector('.block-header h2');
    // Find the description/call-to-action (usually inside .home-block-content or similar)
    let textContent = null;
    // Try to find the main content area
    let content = card.querySelector('.home-block-content');
    if (!content) {
      // Sometimes it's nested deeper (e.g., inside .ms-webpart-zone)
      content = card.querySelector('.ms-webpart-zone .home-block-content');
    }
    // Defensive: if not found, try to find any div with padding or text
    if (!content) {
      content = card.querySelector('div[style*="padding"]') || card;
    }
    // Compose the text cell: header (if present) + content (if present)
    const textCell = document.createElement('div');
    if (header) {
      // Use strong for heading, as in the markdown example
      const strong = document.createElement('strong');
      strong.textContent = header.textContent.trim();
      textCell.appendChild(strong);
      textCell.appendChild(document.createElement('br'));
    }
    if (content) {
      // Remove any images from content (already in first cell)
      const contentClone = content.cloneNode(true);
      contentClone.querySelectorAll('img').forEach(img => img.remove());
      // Remove empty <br> at the top/bottom
      contentClone.querySelectorAll('br').forEach(br => {
        if (!br.previousSibling && !br.nextSibling) br.remove();
      });
      // Remove empty links
      contentClone.querySelectorAll('a').forEach(a => {
        if (!a.textContent.trim()) a.remove();
      });
      // Remove empty divs
      contentClone.querySelectorAll('div').forEach(div => {
        if (!div.textContent.trim()) div.remove();
      });
      // Append the rest of the content
      Array.from(contentClone.childNodes).forEach(node => {
        // Don't append empty text nodes
        if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return;
        textCell.appendChild(node);
      });
    }
    return [img, textCell];
  }

  // Find all top-level .home-block elements (direct children of .row or .col-32)
  let cards = Array.from(element.querySelectorAll(':scope > .home-block, :scope > .col-32 > .home-block'));
  // Defensive: if not found, try to get all .home-block descendants
  if (cards.length === 0) {
    cards = Array.from(element.querySelectorAll('.home-block'));
  }

  // Build the table rows
  const rows = [];
  // Header row as per spec
  rows.push(['Cards (cards14)']);
  // Each card: [image, text content]
  cards.forEach(card => {
    rows.push(extractCardContent(card));
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
