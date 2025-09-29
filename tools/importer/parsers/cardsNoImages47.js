/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as per block spec
  const headerRow = ['Cards (cardsNoImages47)'];
  const rows = [headerRow];

  // Defensive: Find the grid containing all cards
  const grid = element.querySelector('.views-bootstrap-grid-plugin-style');
  if (!grid) return;

  // Each card is a .col-... element
  const cardEls = grid.querySelectorAll(':scope > .row > .col-xs-12');

  cardEls.forEach((cardEl) => {
    // Find the card title (mandatory)
    const nameField = cardEl.querySelector('.views-field-field-pin-block-name .field-content');
    // Find the download link (optional)
    const linkField = cardEl.querySelector('.views-field-field-pin-block-link .field-content a');

    // Compose card content
    const cardContent = [];
    if (nameField) {
      // Use <strong> for heading for semantic clarity
      const heading = document.createElement('strong');
      heading.textContent = nameField.textContent.trim();
      cardContent.push(heading);
    }
    if (linkField) {
      // Add a line break before CTA if there is a heading
      cardContent.push(document.createElement('br'));
      // Use the original link element
      cardContent.push(linkField);
    }
    // Add card row (single cell)
    rows.push([cardContent]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
