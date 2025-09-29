/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image and title for each card
  function extractCardContent(col) {
    // Find the image (inside a link)
    const imgWrapper = col.querySelector('.views-field-field-news-image .field-content');
    let imgEl = null;
    if (imgWrapper) {
      imgEl = imgWrapper.querySelector('img');
    }

    // Find the title (inside .views-field-title .field-content > a)
    const titleWrapper = col.querySelector('.views-field-title .field-content');
    let titleEl = null;
    if (titleWrapper) {
      const a = titleWrapper.querySelector('a');
      if (a) {
        // Wrap the title in a <strong> to mimic heading style
        titleEl = document.createElement('strong');
        titleEl.textContent = a.textContent.trim();
      }
    }

    // Compose the text cell (title only, no description in this source)
    let textCell = [];
    if (titleEl) {
      textCell.push(titleEl);
    }

    return [imgEl, textCell];
  }

  // Get all immediate card columns
  const cols = element.querySelectorAll(':scope .row > div[class*="col-"]');

  // Build the table rows
  const rows = [];
  // Header row
  rows.push(['Cards (cards48)']);

  // Card rows
  cols.forEach((col) => {
    const [imgEl, textCell] = extractCardContent(col);
    if (imgEl && textCell.length > 0) {
      rows.push([imgEl, textCell]);
    }
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
