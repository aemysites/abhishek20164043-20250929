/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as required by block spec
  const headerRow = ['Cards (cardsNoImages33)'];
  const rows = [headerRow];

  // Defensive: find the grid of cards
  // The actual cards are inside .row > .col-*
  const grid = element.querySelector('.views-bootstrap-grid-plugin-style .row');
  if (!grid) return;

  // Get all card columns
  const cardCols = Array.from(grid.querySelectorAll(':scope > .col-xs-12'));

  cardCols.forEach((col) => {
    // Each col contains a card
    // Find the title (field-name-field-block-1-name)
    const nameField = col.querySelector('.field-name-field-block-1-name .field-item');
    // Find the download link (field-name-field-block-1-link)
    const linkField = col.querySelector('.field-name-field-block-1-link a');

    // Compose card content
    const cardContent = document.createElement('div');
    if (nameField) {
      // Use a heading for the title
      const heading = document.createElement('strong');
      heading.textContent = nameField.textContent.trim();
      cardContent.appendChild(heading);
    }
    if (linkField) {
      // Add a line break before the CTA
      cardContent.appendChild(document.createElement('br'));
      // Use the original link as CTA
      const cta = document.createElement('a');
      cta.href = linkField.href;
      cta.textContent = linkField.textContent.trim();
      cta.target = '_blank';
      cardContent.appendChild(cta);
    }
    rows.push([cardContent]);
  });

  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
