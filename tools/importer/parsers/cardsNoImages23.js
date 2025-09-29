/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the required block name and variant for header
  const headerRow = ['Cards (cardsNoImages23)'];
  const rows = [headerRow];

  // Defensive: Find the grid containing the cards
  const grid = element.querySelector('.views-bootstrap-grid-plugin-style');
  if (!grid) return;

  // Get all card columns (each card is a .col-*)
  const cardCols = grid.querySelectorAll('.row > [class*="col-"]');

  cardCols.forEach((col) => {
    // Find the card title
    const titleField = col.querySelector('.views-field-field-pob-block-name .field-content');
    // Find the download link
    const linkField = col.querySelector('.views-field-field-pob-block-link .field-content a');

    // Defensive: Only process if there's a title
    if (titleField) {
      // Create heading element
      const heading = document.createElement('strong');
      heading.textContent = titleField.textContent.trim();

      // Compose cell contents: heading and download link
      const cellContents = [heading];
      if (linkField) {
        // Add a <br> for separation
        cellContents.push(document.createElement('br'));
        cellContents.push(linkField);
      }
      rows.push([cellContents]);
    }
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
