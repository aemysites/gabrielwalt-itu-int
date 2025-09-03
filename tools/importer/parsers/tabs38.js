/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the main nav container
  const nav = element.querySelector('.main-nav');
  if (!nav) return;

  // Find the top-level menu items (li under ul.clearfix)
  const topMenu = nav.querySelector('ul.clearfix');
  if (!topMenu) return;
  const topItems = Array.from(topMenu.children).filter(li => li.tagName === 'LI');

  // Prepare header row
  const headerRow = ['Tabs (tabs38)'];
  const rows = [headerRow];

  // For each top-level menu item
  topItems.forEach(li => {
    // Get tab label from the first <a> inside the li
    const tabLabelLink = li.querySelector('a');
    let tabLabel = '';
    if (tabLabelLink) {
      tabLabel = tabLabelLink.textContent.trim();
    }

    // Tab content: If this li has a submenu (ul), use its links as content
    let tabContent;
    const subMenu = li.querySelector('ul');
    if (subMenu) {
      // Collect all submenu links as a fragment
      const subLinks = Array.from(subMenu.querySelectorAll('a'));
      // Create a div to hold submenu links (preserve structure)
      const contentDiv = document.createElement('div');
      subLinks.forEach(link => {
        contentDiv.appendChild(link);
      });
      tabContent = contentDiv;
    } else {
      // If no submenu, just show the link itself
      tabContent = tabLabelLink;
    }

    // Add row: [Tab Label, Tab Content]
    rows.push([tabLabel, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
