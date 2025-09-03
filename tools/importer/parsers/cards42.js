/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract cards from the provided HTML structure
  function extractCards(root) {
    // Select all card blocks
    return Array.from(root.querySelectorAll('.flexviewerMainDiv-indepth'));
  }

  // Extract all card elements
  const cards = extractCards(element);

  // Prepare table rows
  const rows = [];

  // Always use the block name as header
  const headerRow = ['Cards (cards42)'];
  rows.push(headerRow);

  // For each card, extract image and text content
  cards.forEach(card => {
    // Defensive selectors for image and text
    let imgCell = null;
    let textCell = null;

    // Image cell: find the first img inside the card
    const imgDiv = card.querySelector('.flexviewerMainDivDT-image-indepth');
    if (imgDiv) {
      const imgLink = imgDiv.querySelector('a');
      if (imgLink && imgLink.querySelector('img')) {
        imgCell = imgLink.querySelector('img');
      }
    }

    // Text cell: find the text area div
    const textDiv = card.querySelector('.flexviewerMainDivDT-textarea-indepth');
    if (textDiv) {
      // Use the entire textDiv for resilience (includes <p> and <a>)
      textCell = textDiv;
    }

    // Defensive fallback: if either cell is missing, skip this card
    if (imgCell && textCell) {
      rows.push([imgCell, textCell]);
    }
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new block
  element.replaceWith(block);
}
