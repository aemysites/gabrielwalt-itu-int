/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the correct header row
  const headerRow = ['Columns (columns3)'];

  // Find the three main column boxes
  const threeBoxWrapper = element.querySelector('.MC-div-wrapper-3box');
  const blueThreeBoxWrapper = element.querySelector('.MC-blue-div-wrapper-3box');

  // Helper to extract all content from a box (not just the box element)
  function extractBoxContent(box) {
    if (!box) return '';
    // Create a fragment and append all children (to avoid missing text)
    const frag = document.createElement('div');
    Array.from(box.childNodes).forEach(node => frag.appendChild(node.cloneNode(true)));
    return frag;
  }

  // Defensive: If not found, fallback to empty fragments
  const threeBoxes = threeBoxWrapper
    ? [
        threeBoxWrapper.querySelector('.MC-div-3box-left-box'),
        threeBoxWrapper.querySelector('.MC-div-3box-center-box'),
        threeBoxWrapper.querySelector('.MC-div-3box-right-box'),
      ]
    : [];
  const blueThreeBoxes = blueThreeBoxWrapper
    ? [
        blueThreeBoxWrapper.querySelector('.MC-blue-div-3box-left-box'),
        blueThreeBoxWrapper.querySelector('.MC-blue-div-3box-center-box'),
        blueThreeBoxWrapper.querySelector('.MC-blue-div-3box-right-box'),
      ]
    : [];

  // Compose the first row: the three image columns (with full content)
  const firstRowCells = [0,1,2].map(i => extractBoxContent(threeBoxes[i]));
  // Compose the second row: the three blue text columns (with full content)
  const secondRowCells = [0,1,2].map(i => extractBoxContent(blueThreeBoxes[i]));

  // Defensive: If not found, fallback to empty cells
  while (firstRowCells.length < 3) firstRowCells.push('');
  while (secondRowCells.length < 3) secondRowCells.push('');

  // Build the table rows
  const rows = [headerRow, firstRowCells, secondRowCells];

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
