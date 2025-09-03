/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get tab labels and their corresponding content containers
  function getTabsAndContents(element) {
    // Get tab labels from the <ul class="tabs ...">
    const tabsList = Array.from(element.querySelectorAll(':scope > ul'))
      .find(ul => ul.classList.contains('tabs'));
    const tabLabels = [];
    if (tabsList) {
      tabsList.querySelectorAll('li > a').forEach(a => {
        // Get the label text from <span> inside <a>
        const span = a.querySelector('span');
        tabLabels.push(span ? span.textContent.trim().replace(/\s+$/, '') : a.textContent.trim());
      });
    }
    // Get tab content containers: <div class="tab-box ...">
    const tabContents = Array.from(element.querySelectorAll(':scope > div.tab-box'));
    return { tabLabels, tabContents };
  }

  // Get tab labels and content containers
  const { tabLabels, tabContents } = getTabsAndContents(element);

  // Defensive: If no tabs found, do nothing
  if (!tabLabels.length || !tabContents.length) return;

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs39)']);

  // For each tab, add a row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const content = tabContents[i];
    // Defensive: If content missing, skip
    if (!content) continue;
    // Use the tab label as string, and the tab content element directly
    rows.push([label, content]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
