/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name and variant for the header row
  const headerRow = ['Cards (cardsNoImages25)'];
  const rows = [headerRow];

  // Defensive: find the grid containing the cards
  // The cards are inside .views-bootstrap-grid-plugin-style > .row > .col-*
  const grid = element.querySelector('.views-bootstrap-grid-plugin-style .row');
  if (!grid) {
    // If not found, replace with just the header row
    const block = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(block);
    return;
  }

  // Get all direct card columns
  const cardCols = Array.from(grid.querySelectorAll(':scope > .col-xs-12'));
  cardCols.forEach((col) => {
    // Find the card title (heading)
    const nameField = col.querySelector('.views-field-field-sas-block-name .field-content');
    // Find the download link (CTA)
    const linkField = col.querySelector('.views-field-field-sas-block-link .field-content a');

    // Build card cell content
    const cellContent = [];
    if (nameField) {
      // Use a heading element for the title
      const heading = document.createElement('strong');
      heading.textContent = nameField.textContent.trim();
      cellContent.push(heading);
    }
    // No description field in source, so skip
    if (linkField) {
      // Add a line break before CTA if there's a heading
      if (cellContent.length > 0) {
        cellContent.push(document.createElement('br'));
      }
      // Use the existing link element as CTA
      cellContent.push(linkField);
    }
    // Defensive: if nothing, skip this card
    if (cellContent.length === 0) return;
    rows.push([cellContent]);
  });

  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
