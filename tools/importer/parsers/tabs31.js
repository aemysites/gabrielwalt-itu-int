/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by selector
  function getDirectChildren(parent, selector) {
    return Array.from(parent.children).filter(child => child.matches(selector));
  }

  // Get tab labels from the <ul class="tabs ...">
  const tabList = element.querySelector('ul.tabs');
  const tabLabels = tabList ? Array.from(tabList.querySelectorAll('li > a > span')).map(span => span.textContent.trim()) : [];

  // Get all tab panels (div.tab-box)
  const tabPanels = Array.from(element.querySelectorAll(':scope > div.tab-box'));

  // Compose table rows
  const rows = [];
  // Always use the required header
  rows.push(['Tabs (tabs31)']);

  // For each tab, add a row: [label, content]
  tabPanels.forEach((panel, idx) => {
    // Defensive: get label, fallback to 'Tab N'
    const label = tabLabels[idx] || `Tab ${idx + 1}`;
    // Tab content: grab everything inside the panel
    // Defensive: find the deepest content container
    let content = null;
    // Try .module-content > .content-webpart
    const moduleContent = panel.querySelector('.module-content');
    if (moduleContent) {
      // If content-webpart exists, use it
      const contentWebpart = moduleContent.querySelector('.content-webpart');
      if (contentWebpart && contentWebpart.children.length > 0) {
        content = contentWebpart;
      } else if (moduleContent.children.length > 0) {
        content = moduleContent;
      }
    }
    // Fallback: use panel itself if nothing found
    if (!content) {
      content = panel;
    }
    rows.push([label, content]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
