/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the target block name as the header row
  const headerRow = ['Cards (cardsNoImages42)'];
  const rows = [headerRow];

  // Defensive: find the grid containing cards
  const grid = element.querySelector('.views-bootstrap-grid-plugin-style');
  if (!grid) return;

  // Get all card columns
  const cardEls = Array.from(grid.querySelectorAll(':scope > .row > .col-xs-12'));

  cardEls.forEach((cardEl) => {
    // Find the title (heading)
    const nameField = cardEl.querySelector('.views-field-field-sh-block-name .field-content');
    // Find the download link
    const linkField = cardEl.querySelector('.views-field-field-sh-block-link .field-content a');

    // Compose card cell
    const cellContent = document.createElement('div');
    if (nameField) {
      // Use a heading for the title
      const heading = document.createElement('strong');
      heading.textContent = nameField.textContent.trim();
      cellContent.appendChild(heading);
    }
    if (linkField) {
      cellContent.appendChild(document.createElement('br'));
      // Use the link as CTA
      const cta = document.createElement('a');
      cta.href = linkField.href;
      cta.textContent = linkField.textContent.trim();
      cellContent.appendChild(cta);
    }
    rows.push([cellContent]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
