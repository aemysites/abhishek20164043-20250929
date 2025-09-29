/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract cards from the grid
  function extractCards(gridEl) {
    const cards = [];
    // Get all direct card columns
    const cardEls = gridEl.querySelectorAll(':scope > .row > .col-xs-12');
    cardEls.forEach((col) => {
      // Card title
      const titleField = col.querySelector('.views-field-field-block-name-policy-blk .field-content');
      // Card CTA link
      const linkField = col.querySelector('.views-field-field-block-link-policies-blk .field-content a');
      // Compose card cell content
      const cellContent = [];
      if (titleField) {
        // Use heading for title
        const heading = document.createElement('strong');
        heading.textContent = titleField.textContent.trim();
        cellContent.push(heading);
      }
      if (linkField) {
        // Add a line break between heading and link
        cellContent.push(document.createElement('br'));
        // Add CTA link
        cellContent.push(linkField);
      }
      // Wrap in a div for vertical stacking
      const cellDiv = document.createElement('div');
      cellContent.forEach((el) => cellDiv.appendChild(el));
      cards.push([cellDiv]);
    });
    return cards;
  }

  // Find the grid block
  const grid = element.querySelector('.views-bootstrap-grid-plugin-style');
  if (!grid) return;

  // Table header row
  const headerRow = ['Cards (cardsNoImages36)'];
  // Extract all card rows
  const cardRows = extractCards(grid);
  // Compose table data
  const tableData = [headerRow, ...cardRows];
  // Create block table
  const blockTable = WebImporter.DOMUtils.createTable(tableData, document);
  // Replace original element
  element.replaceWith(blockTable);
}
