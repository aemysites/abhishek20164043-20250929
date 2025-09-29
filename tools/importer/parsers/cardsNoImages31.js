/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the required block name header
  const headerRow = ['Cards (cardsNoImages31)'];
  const rows = [headerRow];

  // Find the grid container (defensive: could be nested)
  const grid = element.querySelector('.views-bootstrap-grid-plugin-style');
  if (!grid) {
    // fallback: just remove the element if nothing to parse
    element.replaceWith(WebImporter.DOMUtils.createTable(rows, document));
    return;
  }

  // Select all card columns
  const cardCols = grid.querySelectorAll('.row > .col-xs-12');
  cardCols.forEach((col) => {
    // Find the card title
    const nameField = col.querySelector('.views-field-field-shp-block-name .field-content');
    // Defensive: skip if no title
    if (!nameField) return;
    // Find the download link (CTA)
    const linkField = col.querySelector('.views-field-field-shp-block-link .field-content a');

    // Build card content: Heading, (no description), CTA
    const cardContent = [];
    // Heading (always present)
    const heading = document.createElement('strong');
    heading.textContent = nameField.textContent.trim();
    cardContent.push(heading);
    // Add a <br> for spacing between heading and CTA
    cardContent.push(document.createElement('br'));
    cardContent.push(document.createElement('br'));
    // CTA (optional, but always present in this source)
    if (linkField) {
      // Use the existing link, but display its text as-is
      cardContent.push(linkField);
    }
    // Add this card as a row (single column)
    rows.push([cardContent]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
