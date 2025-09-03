/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children by class
  function getChildByClass(parent, className) {
    return Array.from(parent.children).find(el => el.classList.contains(className));
  }

  // 1. HEADER ROW
  const headerRow = ['Columns (columns8)'];

  // 2. MAIN CONTENT ROW (3 columns)
  // Left column: main intro, Secretary-General, Deputy Secretary-General
  const leftCol = (() => {
    const col22 = getChildByClass(element, 'col-22');
    if (!col22) return '';
    const introWrap = getChildByClass(col22, 'contentNew');
    let introDiv = null;
    if (introWrap) {
      introDiv = introWrap.querySelector('.intro');
    }
    // Secretary-General and Deputy Secretary-General modules
    const moduleWrap = getChildByClass(col22, 'module-wrap');
    let secGenModule = null, depSecGenModule = null;
    if (moduleWrap) {
      const rowContent = getChildByClass(moduleWrap, 'row');
      if (rowContent) {
        const colFirst = getChildByClass(rowContent, 'col-first');
        const colLast = getChildByClass(rowContent, 'col-last');
        if (colFirst) {
          secGenModule = getChildByClass(colFirst, 'module');
        }
        if (colLast) {
          depSecGenModule = getChildByClass(colLast, 'module');
        }
      }
    }
    // Compose left column content
    const leftContent = [];
    if (introDiv) leftContent.push(introDiv);
    if (secGenModule) leftContent.push(secGenModule);
    if (depSecGenModule) leftContent.push(depSecGenModule);
    return leftContent;
  })();

  // Middle column: Key Objectives & General Secretariat Departments
  const middleCol = (() => {
    const col10 = getChildByClass(element, 'col-10');
    if (!col10) return '';
    // Find all modules in sidebar
    const modules = Array.from(col10.querySelectorAll(':scope > .module'));
    // Only include modules with actual content
    const sidebarContent = modules.filter(mod =>
      mod.querySelector('.module-header') || mod.querySelector('img') || mod.querySelector('ul')
    );
    // Exclude the last module (Quicklinks)
    if (sidebarContent.length > 1) {
      sidebarContent.pop();
    }
    return sidebarContent;
  })();

  // Right column: Quicklinks (the last module in sidebar)
  const rightCol = (() => {
    const col10 = getChildByClass(element, 'col-10');
    if (!col10) return '';
    // Find all modules in sidebar
    const modules = Array.from(col10.querySelectorAll(':scope > .module'));
    // Find the last module (Quicklinks)
    const quicklinksModule = modules[modules.length - 1];
    if (quicklinksModule) {
      return [quicklinksModule];
    }
    return '';
  })();

  // Compose table rows
  const cells = [
    headerRow,
    [leftCol, middleCol, rightCol]
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
