/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create a card cell
  function createCardCell(titleDiv, linkDiv) {
    // Defensive: ensure both elements exist
    const cellContent = [];
    if (titleDiv) {
      // Use a <strong> for the heading
      const heading = document.createElement('strong');
      heading.textContent = titleDiv.textContent.trim();
      cellContent.push(heading);
    }
    if (linkDiv) {
      // Find the <a> inside linkDiv
      const a = linkDiv.querySelector('a');
      if (a) {
        // Place link on a new line
        cellContent.push(document.createElement('br'));
        cellContent.push(a);
      }
    }
    return cellContent;
  }

  // Find the grid container
  const grid = element.querySelector('.views-bootstrap-grid-plugin-style .row');
  if (!grid) return;

  // Get all card columns
  const cardDivs = Array.from(grid.querySelectorAll(':scope > .col-xs-12'));

  // Build the table rows
  const rows = [];
  // Header row as required
  const headerRow = ['Cards (cardsNoImages8)'];
  rows.push(headerRow);

  cardDivs.forEach((col) => {
    // Find the title and link fields
    const titleField = col.querySelector('.views-field-field-unclaim-block-name .field-content');
    const linkField = col.querySelector('.views-field-field-unclaim-block-link .field-content');
    if (titleField || linkField) {
      const cardCell = createCardCell(titleField, linkField);
      rows.push([cardCell]);
    }
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
