/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Cards (cardsNoImages27)'];
  const rows = [headerRow];

  // Defensive: Find the grid container with all cards
  const grid = element.querySelector('.views-bootstrap-grid-plugin-style .row');
  if (!grid) {
    // fallback: try to find all card columns directly
    return;
  }

  // Select all card columns
  const cardColumns = grid.querySelectorAll(':scope > .col-xs-12');

  cardColumns.forEach((col) => {
    // Find title
    const titleField = col.querySelector('.views-field-field-nse-block-name .field-content');
    // Find link (if any)
    const linkField = col.querySelector('.views-field-field-nse-block-link .field-content a');

    // Build card content
    const cardContent = [];

    // Title as strong (matches visual style)
    if (titleField) {
      const strong = document.createElement('strong');
      strong.textContent = titleField.textContent.trim();
      cardContent.push(strong);
    }

    // No description in source, so skip

    // CTA link (if present)
    if (linkField) {
      // Add a <br> for spacing before CTA if title exists
      if (cardContent.length > 0) {
        cardContent.push(document.createElement('br'));
        cardContent.push(document.createElement('br'));
      }
      // Use the existing link element
      cardContent.push(linkField);
    }

    // Add the card row (always a single cell)
    rows.push([cardContent]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
