/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create a card cell from a block of elements
  function createCardCell(link, strong, descText) {
    const frag = document.createElement('div');
    if (link) frag.appendChild(link);
    if (strong) frag.appendChild(strong);
    if (descText) {
      frag.appendChild(document.createTextNode(descText));
    }
    return frag;
  }

  // Get the main content node
  const main = element.querySelector('#ctl00_SPWebPartManager1_g_c5929123_9dd5_4237_ac26_097ac4ace574');
  const nodes = Array.from(main.childNodes);

  // Find the first card (after heading and <br>s)
  let startIdx = 0;
  let brCount = 0;
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].nodeType === Node.ELEMENT_NODE && nodes[i].tagName === 'H2') continue;
    if (nodes[i].nodeType === Node.ELEMENT_NODE && nodes[i].tagName === 'BR') {
      brCount++;
      continue;
    }
    if (brCount >= 3) {
      startIdx = i;
      break;
    }
  }

  // Parse cards: each card is <a>, <strong>, text node, <hr>
  const rows = [];
  let idx = startIdx;
  while (idx < nodes.length) {
    // Find <a>
    while (idx < nodes.length && !(nodes[idx].nodeType === Node.ELEMENT_NODE && nodes[idx].tagName === 'A')) {
      idx++;
    }
    if (idx >= nodes.length) break;
    const link = nodes[idx];
    idx++;
    // Find <strong>
    let strong = null;
    if (idx < nodes.length && nodes[idx].nodeType === Node.ELEMENT_NODE && nodes[idx].tagName === 'STRONG') {
      strong = nodes[idx];
      idx++;
    }
    // Find description text (text node)
    let descText = '';
    if (idx < nodes.length && nodes[idx].nodeType === Node.TEXT_NODE) {
      descText = nodes[idx].textContent.trim();
      idx++;
    }
    // Skip <hr>
    if (idx < nodes.length && nodes[idx].nodeType === Node.ELEMENT_NODE && nodes[idx].tagName === 'HR') {
      idx++;
    }
    // Add card row
    const cardCell = createCardCell(link, strong, descText);
    rows.push([cardCell]);
  }

  // Find the 'More Press Releases' link ONLY (not the whole div)
  const moreLink = main.querySelector('a.ms-rteStyle-ITUXCommuLearnMoreLink');
  if (moreLink) {
    rows.push([moreLink]);
  }

  // Build the table
  const headerRow = ['Cards (cardsNoImages10)'];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
