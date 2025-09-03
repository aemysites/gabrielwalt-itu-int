/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content container
  const mainContent = element.querySelector('.contentNew.module-content');
  if (!mainContent) return;

  // Find the card container (the div with background and padding)
  const cardContainer = mainContent.querySelector('.ms-rtestate-field > div');
  if (!cardContainer) return;

  // Find the image (first img inside cardContainer)
  const imgLink = cardContainer.querySelector('a[href]');
  const img = imgLink ? imgLink.querySelector('img') : null;

  // Find the title (from the module-header)
  const header = mainContent.querySelector('.module-header h2');

  // Find the description (the first span with color:#000000)
  let descSpan = null;
  cardContainer.querySelectorAll('span').forEach((span) => {
    if ((span.style && (span.style.color === 'rgb(0, 0, 0)' || span.style.color === '#000000')) && !descSpan) {
      descSpan = span;
    }
  });

  // Find the CTA (the bold link with underline)
  let cta = null;
  const ctaSpan = cardContainer.querySelector('.xms-rteStyle-ITUXCommuLearnMoreLink');
  if (ctaSpan) {
    cta = ctaSpan.querySelector('a');
  }

  // Build the text cell content
  const textCell = document.createElement('div');
  if (header) {
    const strong = document.createElement('strong');
    strong.textContent = header.textContent.trim();
    textCell.appendChild(strong);
    textCell.appendChild(document.createElement('br'));
    textCell.appendChild(document.createElement('br'));
  }
  if (descSpan) {
    textCell.appendChild(document.createTextNode(descSpan.textContent.trim()));
    textCell.appendChild(document.createElement('br'));
    textCell.appendChild(document.createElement('br'));
  }
  if (cta) {
    textCell.appendChild(cta);
  }

  // Compose the table rows
  const headerRow = ['Cards (cards27)'];
  const cardRow = [img, textCell];
  const cells = [headerRow, cardRow];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
