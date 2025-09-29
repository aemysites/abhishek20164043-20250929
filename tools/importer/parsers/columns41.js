/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns41)'];

  // Get the immediate column divs (should be two columns)
  const columns = Array.from(element.querySelectorAll(':scope > .col-sm-6'));

  // Defensive: If no columns found, fallback to direct children
  const columnCells = columns.length
    ? columns.map(col => {
        // Each column has a single content wrapper inside
        // We'll use the first child div (the .field) as the cell content
        const fieldDiv = col.querySelector(':scope > div');
        return fieldDiv || col;
      })
    : Array.from(element.children);

  // Build the table rows
  const rows = [
    headerRow,
    columnCells,
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
