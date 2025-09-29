/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create a card cell from a .col-... element
  function createCardCell(col) {
    // Find the card title
    const titleField = col.querySelector('.views-field-field-cgr-block-name .field-content');
    let titleText = titleField ? titleField.textContent.trim() : '';
    let titleEl;
    if (titleText) {
      titleEl = document.createElement('strong');
      titleEl.textContent = titleText;
    }

    // Find the download link
    const linkField = col.querySelector('.views-field-field-cgr-block-link .field-content a');
    let linkEl;
    if (linkField) {
      linkEl = document.createElement('a');
      linkEl.href = linkField.href;
      linkEl.textContent = linkField.textContent.trim();
      linkEl.target = '_blank';
      linkEl.rel = 'noopener noreferrer';
    }

    // Compose cell content
    const cellContent = [];
    if (titleEl) cellContent.push(titleEl);
    if (linkEl) {
      // Add a <br> between title and link if both exist
      if (titleEl) cellContent.push(document.createElement('br'));
      cellContent.push(linkEl);
    }
    return [cellContent]; // single cell row
  }

  // Find all card columns
  // Defensive: Only immediate children of the grid row
  const grid = element.querySelector('.views-bootstrap-grid-plugin-style .row');
  if (!grid) return;
  const cols = Array.from(grid.querySelectorAll(':scope > .col-xs-12'));

  // Compose table rows
  const headerRow = ['Cards (cardsNoImages19)'];
  const rows = [headerRow];
  cols.forEach((col) => {
    rows.push(createCardCell(col));
  });

  // Create block table and replace original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
