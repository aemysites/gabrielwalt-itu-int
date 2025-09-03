/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get all direct child .row elements
  const rows = Array.from(element.querySelectorAll(':scope > .row'));

  // Will collect each row as an array of cells (each cell is an array of elements)
  const tableRows = [];

  // --- First row: Slider block (should be 2 columns: text and photo) ---
  if (rows.length > 0) {
    const sliderRow = rows[0];
    const sliderWrap = sliderRow.querySelector('.SmallSlider-wrap');
    let sliderItem = null;
    if (sliderWrap) {
      sliderItem = sliderWrap.querySelector('.home-feature-item[style*="display: block"]');
    }
    if (sliderItem) {
      const sliderText = sliderItem.querySelector('.SmallSlider-text');
      const sliderPhoto = sliderItem.querySelector('.SmallSlider-photo');
      // Each cell should be a div containing all children for full content
      const textCell = document.createElement('div');
      if (sliderText) Array.from(sliderText.childNodes).forEach(node => textCell.appendChild(node.cloneNode(true)));
      const photoCell = document.createElement('div');
      if (sliderPhoto) Array.from(sliderPhoto.childNodes).forEach(node => photoCell.appendChild(node.cloneNode(true)));
      tableRows.push([
        [textCell],
        [photoCell]
      ]);
    }
  }

  // --- Second row: ITU News block (2 columns) ---
  if (rows.length > 1) {
    const newsRow = rows[1];
    const newsModule = newsRow.querySelector('.module-caps.module-thumbnail');
    if (newsModule) {
      const table = newsModule.querySelector('table');
      if (table) {
        const trs = table.querySelectorAll('tr');
        if (trs.length > 1) {
          const tds = trs[1].querySelectorAll('td');
          if (tds.length >= 3) {
            // Left: quicklinks
            const leftCol = document.createElement('div');
            Array.from(tds[0].childNodes).forEach(node => leftCol.appendChild(node.cloneNode(true)));
            // Right: image + special editions
            const rightCol = document.createElement('div');
            Array.from(tds[1].childNodes).forEach(node => rightCol.appendChild(node.cloneNode(true)));
            Array.from(tds[2].childNodes).forEach(node => rightCol.appendChild(node.cloneNode(true)));
            tableRows.push([
              [leftCol],
              [rightCol]
            ]);
          }
        }
      }
    }
  }

  // --- Third row: Space Services & Terrestrial Services (2 columns) ---
  if (rows.length > 2) {
    const servicesRow = rows[2];
    const cols = servicesRow.querySelectorAll('.col-11');
    if (cols.length === 2) {
      // For each module, include all children for full content
      const spaceModule = cols[0].querySelector('.module-caps.module-arrow');
      const terrestrialModule = cols[1].querySelector('.module-caps.module-arrow');
      const spaceCell = document.createElement('div');
      if (spaceModule) Array.from(spaceModule.childNodes).forEach(node => spaceCell.appendChild(node.cloneNode(true)));
      const terrestrialCell = document.createElement('div');
      if (terrestrialModule) Array.from(terrestrialModule.childNodes).forEach(node => terrestrialCell.appendChild(node.cloneNode(true)));
      tableRows.push([
        [spaceCell],
        [terrestrialCell]
      ]);
    }
  }

  // --- Fourth row: Study Groups & Radio Regulations (2 columns) ---
  if (rows.length > 3) {
    const studyRow = rows[3];
    const cols = studyRow.querySelectorAll('.col-11');
    if (cols.length === 2) {
      const studyModule = cols[0].querySelector('.module-caps.module-arrow');
      const radioModule = cols[1].querySelector('.module-caps.module-arrow');
      const studyCell = document.createElement('div');
      if (studyModule) Array.from(studyModule.childNodes).forEach(node => studyCell.appendChild(node.cloneNode(true)));
      const radioCell = document.createElement('div');
      if (radioModule) Array.from(radioModule.childNodes).forEach(node => radioCell.appendChild(node.cloneNode(true)));
      tableRows.push([
        [studyCell],
        [radioCell]
      ]);
    }
  }

  // Determine the number of columns for all rows after header (should match the first content row)
  const contentColCount = tableRows.length > 0 ? tableRows[0].length : 2;

  // Build the table cells array
  const cells = [];
  // Header row
  const headerRow = ['Columns (columns25)'];
  cells.push(headerRow);
  // Content rows
  tableRows.forEach(row => {
    // Only include as many columns as the first content row
    if (row.length === contentColCount) {
      cells.push(row.map(cell => Array.isArray(cell) ? cell : [cell]));
    }
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
