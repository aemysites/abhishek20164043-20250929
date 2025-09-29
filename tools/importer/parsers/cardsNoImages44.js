/* global WebImporter */
export default function parse(element, { document }) {
  // The block name and variant for header row
  const headerRow = ['Cards (cardsNoImages44)'];
  const rows = [headerRow];

  // Defensive: find the grid container
  const grid = element.querySelector('.views-bootstrap-grid-plugin-style');
  if (!grid) return;

  // Get all card columns (each is a card)
  const cardEls = grid.querySelectorAll(':scope > .row > .col-xs-12');

  cardEls.forEach((cardEl) => {
    // Get the title
    const nameField = cardEl.querySelector('.views-field-field-pr-block-name .field-content');
    // Get the download link
    const linkField = cardEl.querySelector('.views-field-field-pr-block-link .field-content a');

    // Compose card content
    const cardContent = document.createElement('div');
    if (nameField) {
      // Use a heading for the title
      const heading = document.createElement('strong');
      heading.textContent = nameField.textContent.trim();
      cardContent.appendChild(heading);
    }
    if (linkField) {
      // Add a line break before the link
      cardContent.appendChild(document.createElement('br'));
      // Use the link as CTA
      const cta = document.createElement('a');
      cta.href = linkField.href;
      cta.textContent = linkField.textContent.trim();
      cardContent.appendChild(cta);
    }
    rows.push([cardContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
