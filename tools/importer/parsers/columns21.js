/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the actual grid block (sometimes the input element is a wrapper)
  let grid = element.querySelector('.views-bootstrap-grid-plugin-style');
  if (!grid) grid = element;

  // Get all immediate children that are columns
  const colEls = Array.from(grid.querySelectorAll(':scope > .row > .col-xs-12'));
  // If not found, try fallback for direct .col-xs-12 children
  if (colEls.length === 0) {
    // Sometimes .row is missing, try direct children
    const fallbackCols = Array.from(grid.querySelectorAll(':scope > .col-xs-12'));
    if (fallbackCols.length) colEls.push(...fallbackCols);
  }

  // Each column cell contains a title and a download link
  const columnCells = colEls.map((col) => {
    // Defensive: Get title
    const titleField = col.querySelector('.views-field-field-dac-block-name .field-content');
    // Defensive: Get download link
    const linkField = col.querySelector('.views-field-field-dac-block-link .field-content a');

    // Compose cell content
    const cellContent = [];
    if (titleField) cellContent.push(titleField);
    if (linkField) cellContent.push(document.createElement('br'), linkField);
    return cellContent;
  });

  // Table header row
  const headerRow = ['Columns (columns21)'];
  // Table body row (all columns in one row)
  const tableRows = [headerRow, columnCells];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
