/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the required block name as the header row
  const headerRow = ['Columns (columns18)'];

  // Defensive: get all immediate column divs
  const columns = Array.from(element.querySelectorAll(':scope > .col-sm-6'));

  // For each column, grab its main content block
  const cells = columns.map((col) => {
    // Find the first field-item (the actual content)
    const fieldItem = col.querySelector('.field-item');
    // If not found, fallback to the column itself
    return fieldItem || col;
  });

  // Build the table rows: header, then one row with all columns side-by-side
  const rows = [headerRow, cells];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}
