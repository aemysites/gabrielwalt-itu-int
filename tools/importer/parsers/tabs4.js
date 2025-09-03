/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get text content from an anchor or element
  function getText(el) {
    return el ? (el.textContent || '').trim() : '';
  }

  // Find the main nav ul
  const nav = element.querySelector('.main-nav > ul');
  if (!nav) return;

  // Prepare header row
  const headerRow = ['Tabs (tabs4)'];
  const rows = [headerRow];

  // Get all top-level nav items (li direct children of ul)
  const topLis = Array.from(nav.children).filter(li => li.tagName === 'LI');

  topLis.forEach((li) => {
    // Tab label: anchor text of the top-level li
    const tabLabelAnchor = li.querySelector(':scope > a');
    const tabLabel = getText(tabLabelAnchor);
    if (!tabLabel) return; // skip if no label

    // Tab content: if there is a submenu (ul), use its links as content
    const subUl = li.querySelector(':scope > ul');
    let tabContent = '';
    if (subUl) {
      // We'll create a fragment with all sub-nav links, separated by spaces
      const frag = document.createElement('div');
      const subLinks = Array.from(subUl.querySelectorAll('li > a'));
      subLinks.forEach((a, idx) => {
        frag.appendChild(a.cloneNode(true));
        if (idx < subLinks.length - 1) {
          frag.appendChild(document.createTextNode(' '));
        }
      });
      tabContent = frag;
    }
    // Always push two columns: label and content (empty if none)
    rows.push([tabLabel, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
