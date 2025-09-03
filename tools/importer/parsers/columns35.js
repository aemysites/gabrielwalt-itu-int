/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: get all direct children of the main block
  const children = Array.from(element.querySelectorAll(':scope > div'));

  // If there is only one child, use it as the content container
  const contentDiv = children.length === 1 ? children[0] : element;

  // Find the image link (first column)
  let imgCell = null;
  const imgLink = contentDiv.querySelector('a[href]');
  if (imgLink && imgLink.querySelector('img')) {
    // Use the <a> containing the <img> directly
    imgCell = imgLink;
  } else {
    // Fallback: find any image
    const img = contentDiv.querySelector('img');
    if (img) imgCell = img;
  }

  // Gather all non-image content for the second column
  // We'll exclude the image link from the content
  const columnContent = [];
  for (const node of contentDiv.childNodes) {
    // Exclude the image link and its whitespace
    if (node === imgLink || node === imgCell) continue;
    // Exclude whitespace-only text nodes
    if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) continue;
    columnContent.push(node);
  }

  // Table header
  const headerRow = ['Columns (columns35)'];
  // Table content row: [image/link, everything else]
  const contentRow = [imgCell, columnContent];

  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(block);
}
