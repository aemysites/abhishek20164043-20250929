/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the required block name as header
  const headerRow = ['Cards (cardsNoImages45)'];
  const rows = [headerRow];

  // Defensive: find the grid container (the one with all the cards)
  // The structure is: ... view-content > views-bootstrap-grid-plugin-style > row > col-*
  const grid = element.querySelector('.views-bootstrap-grid-plugin-style .row');
  if (!grid) return;

  // Get all card columns
  const cardCols = Array.from(grid.querySelectorAll(':scope > .col-xs-12'));

  cardCols.forEach(col => {
    // Get the card title (inside .views-field-field-agm-block-name .field-content)
    const titleField = col.querySelector('.views-field-field-agm-block-name .field-content');
    // Get the download link (inside .views-field-field-agm-block-link .field-content > a)
    const linkField = col.querySelector('.views-field-field-agm-block-link .field-content a');

    // Defensive: skip if no title
    if (!titleField) return;

    // Compose the card cell content
    const cellContent = [];

    // Title as heading (use <strong> for visual weight, as in screenshot)
    if (titleField.textContent && titleField.textContent.trim()) {
      const heading = document.createElement('strong');
      heading.textContent = titleField.textContent.trim();
      cellContent.push(heading);
    }

    // Add a line break between heading and description if both present (no description in this source)
    // In this source, there's no description, so skip

    // Add CTA link if present
    if (linkField) {
      // Add a <br> for spacing before CTA if there's a heading
      if (cellContent.length) {
        cellContent.push(document.createElement('br'));
        cellContent.push(document.createElement('br'));
      }
      // Clone the link and set text to 'Download' (as in screenshot)
      const cta = document.createElement('a');
      cta.href = linkField.href;
      cta.textContent = 'Download';
      cellContent.push(cta);
    }

    // Add this card row
    rows.push([cellContent]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
