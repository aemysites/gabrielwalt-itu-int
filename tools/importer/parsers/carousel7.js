/* global WebImporter */
export default function parse(element, { document }) {
  // Find the SmallSlider-wrap inside the element
  const sliderWrap = element.querySelector('.SmallSlider-wrap');
  if (!sliderWrap) return;

  // Find all slides
  const slides = sliderWrap.querySelectorAll('.home-feature-item');
  if (!slides.length) return;

  // Helper to get absolute URL for images
  function getAbsoluteUrl(url) {
    if (!url) return '';
    const a = document.createElement('a');
    a.href = url;
    return a.href;
  }

  // Build the table rows
  const headerRow = ['Carousel (carousel7)'];
  const rows = [headerRow];

  slides.forEach((slide) => {
    // Only process slides that have an image
    const photoDiv = slide.querySelector('.SmallSlider-photo');
    const img = photoDiv && photoDiv.querySelector('img');
    if (!img) return;

    // Image cell
    const imageCell = img;

    // Text cell
    const textDiv = slide.querySelector('.SmallSlider-text');
    let textCell = '';
    if (textDiv) {
      // We'll create a fragment to hold the text content
      const frag = document.createDocumentFragment();
      // Title (h1)
      const h1 = textDiv.querySelector('h1');
      if (h1) {
        const h2 = document.createElement('h2');
        h2.innerHTML = h1.innerHTML;
        frag.appendChild(h2);
      }
      // Description (all text nodes and elements after h1)
      let node = h1 ? h1.nextSibling : textDiv.firstChild;
      while (node) {
        // If it's an element and not h1, or a text node
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'H1') {
          frag.appendChild(node.cloneNode(true));
        } else if (node.nodeType === Node.TEXT_NODE) {
          // Only add non-empty text
          if (node.textContent.trim()) {
            frag.appendChild(document.createTextNode(node.textContent));
          }
        }
        node = node.nextSibling;
      }
      textCell = frag.childNodes.length ? frag : '';
    }

    rows.push([imageCell, textCell]);
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
