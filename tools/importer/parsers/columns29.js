/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid row containing columns
  const grid = element.querySelector('.views-bootstrap-grid-plugin-style .row');
  if (!grid) return;

  // Select only direct column children
  const columns = Array.from(grid.querySelectorAll(':scope > .col-xs-12'));
  if (columns.length === 0) return;

  // Compose cell content for each column
  const cells = columns.map(col => {
    const cellParts = [];
    // Branch name
    const place = col.querySelector('.views-field-field-branch-place .field-content');
    if (place) cellParts.push(place);
    // Branch address/details (may contain multiple paragraphs)
    const addr = col.querySelector('.views-field-field-branch-addr .field-content');
    if (addr) {
      // If addr has multiple paragraphs, include all
      if (addr.querySelectorAll('p').length > 0) {
        addr.querySelectorAll('p').forEach(p => cellParts.push(p));
      } else {
        cellParts.push(addr);
      }
    }
    // Defensive: If nothing found, add an empty div
    if (cellParts.length === 0) {
      const emptyDiv = document.createElement('div');
      cellParts.push(emptyDiv);
    }
    return cellParts;
  });

  // Table header row
  const headerRow = ['Columns (columns29)'];

  // Build table rows
  const tableRows = [headerRow, cells];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(block);
}
