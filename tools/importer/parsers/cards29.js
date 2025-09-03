/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract cards from a module row
  function extractCardsFromModuleRow(row) {
    const cards = [];
    // Each card is in a col-11 or col-11.col-first/col-11.col-last
    const cols = row.querySelectorAll(':scope > .col-11, :scope > .col-11.col-first, :scope > .col-11.col-last');
    cols.forEach(col => {
      // Find the main module
      const module = col.querySelector('.module-caps.module-thumbnail');
      if (!module) return;
      // Find the rich content field
      const richField = module.querySelector('.ms-rtestate-field');
      if (!richField) return;
      // Find image (may be inside a link)
      let img = richField.querySelector('img');
      if (!img) return;
      // Find heading
      let heading = module.querySelector('h2');
      // Compose description: get all content after the image (including text, <em>, <br>, etc)
      let descParts = [];
      let foundImg = false;
      richField.childNodes.forEach(node => {
        // Check if node is the image or contains the image
        if (!foundImg) {
          if (node === img || (node.nodeType === Node.ELEMENT_NODE && node.querySelector && node.querySelector('img') === img)) {
            foundImg = true;
            return;
          }
        } else {
          // Collect all non-empty text and elements except links with .more (handled separately)
          if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            descParts.push(document.createTextNode(node.textContent));
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            // Skip .more links (handled as CTA)
            if (!(node.tagName === 'A' && node.classList.contains('more'))) {
              descParts.push(node);
            }
          }
        }
      });
      // Find CTA links ("More", "Homepage", "Webinar series")
      const ctas = Array.from(richField.querySelectorAll('a.more'));
      // Compose text cell
      const cellContent = [];
      if (heading) cellContent.push(heading);
      descParts.forEach(part => cellContent.push(part));
      ctas.forEach(link => cellContent.push(link));
      // Defensive: ensure all text content is included
      // If no heading, try to get first <strong> or <em> as title
      if (!heading) {
        const strongOrEm = richField.querySelector('strong, em');
        if (strongOrEm) cellContent.unshift(strongOrEm);
      }
      cards.push([img, cellContent]);
    });
    return cards;
  }

  // Find all module rows with cards
  const cardsRows = Array.from(element.querySelectorAll('.module-wrap > .row'));
  let cards = [];
  cardsRows.forEach(row => {
    cards = cards.concat(extractCardsFromModuleRow(row));
  });

  // Defensive: If no cards found, do nothing
  if (!cards.length) return;

  // Table header
  const headerRow = ['Cards (cards29)'];
  const tableRows = [headerRow, ...cards];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
