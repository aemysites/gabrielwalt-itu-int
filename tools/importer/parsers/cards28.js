/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract cards from the block
  function extractCards(container) {
    const cards = [];
    // Get all h2s that have a link (card title)
    const h2s = Array.from(container.querySelectorAll('h2')).filter(h2 => h2.querySelector('a'));
    for (let i = 0; i < h2s.length; i++) {
      const h2 = h2s[i];
      // Find image (img) in h2 or in previous h2
      let img = h2.querySelector('img');
      if (!img && i > 0) {
        const prevH2 = h2s[i - 1];
        img = prevH2.querySelector('img');
      }
      let cardImg = img ? img.cloneNode(true) : '';
      // Title (as heading)
      const titleLink = h2.querySelector('a');
      const textContent = [];
      if (titleLink) {
        const heading = document.createElement('strong');
        heading.appendChild(titleLink.cloneNode(true));
        textContent.push(heading);
        textContent.push(document.createElement('br'));
      }
      // Description: all nodes between h2 and next h2/hr, but stop at HR (do not include HR or anything after)
      let descNodes = [];
      let next = h2.nextSibling;
      while (next && !(next.tagName === 'H2' || next.tagName === 'HR')) {
        if (next.nodeType === 1 || (next.nodeType === 3 && next.textContent.trim())) {
          descNodes.push(next);
        }
        next = next.nextSibling;
      }
      // Find CTA link (Learn more) and remove from descNodes
      let ctaLink = null;
      descNodes = descNodes.map(node => {
        if (node.nodeType === 1 && node.querySelector) {
          const cta = node.querySelector('a.more');
          if (cta && !ctaLink) ctaLink = cta.cloneNode(true);
          if (cta) {
            const clone = node.cloneNode(true);
            const ctaToRemove = clone.querySelector('a.more');
            if (ctaToRemove) ctaToRemove.remove();
            return clone;
          }
        }
        return node.cloneNode ? node.cloneNode(true) : node;
      });
      descNodes.forEach(node => {
        textContent.push(node);
      });
      if (ctaLink) {
        textContent.push(document.createElement('br'));
        textContent.push(ctaLink);
      }
      // Only add card if at least image or text content exists
      if (cardImg || textContent.length > 0) {
        cards.push([
          cardImg,
          textContent
        ]);
      }
    }
    return cards;
  }

  // Find the main cards container
  const cardsContainer = element.querySelector('.ms-rtestate-field');
  if (!cardsContainer) return;

  // Header row
  const headerRow = ['Cards (cards28)'];
  // Extract card rows
  const cardRows = extractCards(cardsContainer);
  // Compose table
  const cells = [headerRow, ...cardRows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace element
  element.replaceWith(block);
}
