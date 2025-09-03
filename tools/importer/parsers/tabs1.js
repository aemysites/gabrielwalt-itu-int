/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get tab labels
  function getTabLabels(element) {
    const ul = element.querySelector('ul.tabs');
    if (!ul) return [];
    return Array.from(ul.querySelectorAll('li')).map(li => {
      // Get the text content of the tab label, trimming whitespace and replacing <br> with space
      const span = li.querySelector('span');
      let label = '';
      if (span) {
        label = span.innerHTML.replace(/<br\s*\/?>(\s|&nbsp;)?/gi, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
      } else {
        label = li.textContent.trim();
      }
      return label;
    });
  }

  // Helper to get tab content blocks
  function getTabContents(element) {
    // All direct children with class 'tab-box'
    return Array.from(element.querySelectorAll(':scope > .tab-box'));
  }

  // Compose the table rows
  const headerRow = ['Tabs (tabs1)'];
  const rows = [headerRow];

  const tabLabels = getTabLabels(element);
  const tabContents = getTabContents(element);

  // Defensive: Only pair as many as both exist
  const tabCount = Math.min(tabLabels.length, tabContents.length);

  for (let i = 0; i < tabCount; i++) {
    const label = tabLabels[i];
    const contentBlock = tabContents[i];
    // For content, gather all direct children except for script/style
    // We'll wrap them in a div for clarity
    const contentDiv = document.createElement('div');
    // For tab4, the content is just a <ul> (no extra wrapping divs)
    if (contentBlock.children.length === 1 && contentBlock.firstElementChild.tagName === 'UL') {
      contentDiv.appendChild(contentBlock.firstElementChild);
    } else {
      // For others, append all children except script/style
      Array.from(contentBlock.childNodes).forEach(node => {
        if (node.nodeType === 1 && ['SCRIPT', 'STYLE'].includes(node.tagName)) return;
        contentDiv.appendChild(node.cloneNode(true));
      });
    }
    rows.push([label, contentDiv]);
  }

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
