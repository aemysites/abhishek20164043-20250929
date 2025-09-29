/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create a card cell from the column element
  function createCardCell(col) {
    // Find the title (heading)
    const titleField = col.querySelector('.views-field-field-id-block-name .field-content');
    let headingEl;
    if (titleField) {
      headingEl = document.createElement('strong');
      headingEl.textContent = titleField.textContent.trim();
    }

    // Find the CTA (Download link)
    const linkField = col.querySelector('.views-field-field-id-block-link .field-content a');
    let ctaEl;
    if (linkField) {
      ctaEl = document.createElement('a');
      ctaEl.href = linkField.href;
      ctaEl.textContent = linkField.textContent.trim();
    }

    // Compose cell content: heading, (no description), CTA
    const cellContent = [];
    if (headingEl) cellContent.push(headingEl);
    if (ctaEl) {
      // Add a <br> between heading and CTA for spacing
      cellContent.push(document.createElement('br'));
      cellContent.push(ctaEl);
    }
    return cellContent;
  }

  // Select all card columns
  const cardCols = element.querySelectorAll(':scope .row > .col-xs-12');

  // Build the table rows
  const headerRow = ['Cards (cardsNoImages46)'];
  const rows = [headerRow];

  cardCols.forEach((col) => {
    rows.push([createCardCell(col)]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
