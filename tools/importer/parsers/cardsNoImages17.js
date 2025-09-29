/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as header
  const headerRow = ['Cards (cardsNoImages17)'];
  const rows = [headerRow];

  // Defensive: Find the grid of cards
  // The cards are inside .row > .col-*
  const grid = element.querySelector('.row');
  if (!grid) return;

  // Get all card columns (skip clearfixes)
  const cardCols = Array.from(grid.children).filter((child) => child.matches('[class*="col-"]'));

  cardCols.forEach((col) => {
    // Find the title (heading)
    const titleField = col.querySelector('.field-name-field-block-1-1-name');
    let heading;
    if (titleField && titleField.textContent.trim()) {
      heading = document.createElement('strong');
      heading.textContent = titleField.textContent.trim();
    }

    // Find the download link
    const linkField = col.querySelector('.donwload-btn a');
    let cta;
    if (linkField && linkField.href && linkField.textContent.trim()) {
      cta = document.createElement('a');
      cta.href = linkField.href;
      cta.textContent = linkField.textContent.trim();
    }

    // Compose cell content: heading (strong) + CTA (link)
    const cellContent = document.createElement('div');
    if (heading) {
      cellContent.appendChild(heading);
      cellContent.appendChild(document.createElement('br'));
    }
    if (cta) {
      cellContent.appendChild(cta);
    }
    // Only add row if there's at least heading or CTA
    if (cellContent.textContent.trim()) {
      rows.push([cellContent]);
    }
  });

  // Only create the block if there are card rows
  if (rows.length > 1) {
    const block = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(block);
  }
}
