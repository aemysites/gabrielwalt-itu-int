/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract cards from the structure
  function extractCards(root) {
    const cards = [];
    // Each card is a .flexviewerMainDiv-newsviews
    const cardDivs = root.querySelectorAll('.flexviewerMainDiv-newsviews');
    cardDivs.forEach(cardDiv => {
      // Defensive: find the image (inside .flexviewerMainDivDT-image-newsviews)
      const imgDiv = cardDiv.querySelector('.flexviewerMainDivDT-image-newsviews');
      let imgEl = null;
      if (imgDiv) {
        imgEl = imgDiv.querySelector('img');
      }
      // Defensive: find the text area (inside .flexviewerMainDivDT-textarea-newsviews)
      const textDiv = cardDiv.querySelector('.flexviewerMainDivDT-textarea-newsviews');
      let textContent = null;
      if (textDiv) {
        // Use the entire textDiv for resilience
        textContent = textDiv;
      }
      // Only add card if both image and text are present
      if (imgEl && textContent) {
        cards.push([imgEl, textContent]);
      }
    });
    return cards;
  }

  // Find the main container for cards
  // Defensive: find the first child with .flexviewerMainDiv-newsviews
  let cardsRoot = element;
  if (!element.querySelector('.flexviewerMainDiv-newsviews')) {
    // Try to find the correct child
    const possible = element.querySelector('[class*="flexviewerMainDiv-newsviews"]');
    if (possible) cardsRoot = possible.parentElement;
  }

  // Build the table rows
  const headerRow = ['Cards (cards5)'];
  const cardRows = extractCards(cardsRoot);
  const cells = [headerRow, ...cardRows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
