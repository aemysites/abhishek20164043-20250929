/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Cards (cardsNoImages2)'];
  const rows = [headerRow];

  // Defensive: find the grid containing cards
  const grid = element.querySelector('.views-bootstrap-grid-plugin-style');
  if (!grid) {
    // If grid not found, replace with empty block
    const block = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(block);
    return;
  }

  // Get all card columns
  const cardEls = Array.from(grid.querySelectorAll('.row > .col-xs-12'));

  cardEls.forEach(cardEl => {
    // Find the title (heading)
    const titleField = cardEl.querySelector('.views-field-field-block-name-credit-name .field-content');
    let titleText = titleField ? titleField.textContent.trim() : '';

    // Find the download link
    const linkField = cardEl.querySelector('.views-field-field-block-link-credit-blk .field-content a');
    let linkEl = null;
    if (linkField) {
      // Create a new link element for clarity and avoid moving the original
      linkEl = document.createElement('a');
      linkEl.href = linkField.href;
      linkEl.textContent = linkField.textContent.trim();
      linkEl.target = '_blank';
    }

    // Compose card cell: heading + CTA link
    const cellContent = [];
    if (titleText) {
      const heading = document.createElement('strong');
      heading.textContent = titleText;
      cellContent.push(heading);
    }
    if (linkEl) {
      // Add a line break before CTA if heading exists
      if (cellContent.length) cellContent.push(document.createElement('br'));
      cellContent.push(linkEl);
    }

    rows.push([cellContent]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
