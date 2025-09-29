/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name and variant as the header row
  const headerRow = ['Cards (cardsNoImages5)'];
  const rows = [headerRow];

  // Defensive: Find the grid container
  const grid = element.querySelector('.views-bootstrap-grid-plugin-style');
  if (!grid) {
    // If not found, do nothing
    return;
  }

  // Get all card columns (each card is a col-*)
  const cardNodes = grid.querySelectorAll('.row > .col-xs-12');

  cardNodes.forEach((card) => {
    // Find the title (heading)
    const nameField = card.querySelector('.views-field-field-shp-block-name .field-content');
    // Find the download link
    const linkField = card.querySelector('.views-field-field-shp-block-link .field-content a');

    // Compose the card cell contents
    const cellContent = [];

    // Heading (if present)
    if (nameField) {
      // Use a <strong> for heading for semantic clarity
      const heading = document.createElement('strong');
      heading.textContent = nameField.textContent.trim();
      cellContent.push(heading);
    }

    // Add a line break between heading and CTA if both exist
    if (nameField && linkField) {
      cellContent.push(document.createElement('br'));
    }

    // CTA (Download link)
    if (linkField) {
      // Use the existing link, but ensure it's text only (no class)
      const cta = document.createElement('a');
      cta.href = linkField.href;
      cta.target = linkField.target || '_blank';
      cta.textContent = linkField.textContent.trim();
      cellContent.push(cta);
    }

    // Add the card row (single cell)
    rows.push([cellContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
