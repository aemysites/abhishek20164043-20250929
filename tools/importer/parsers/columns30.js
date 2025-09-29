/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate col-sm-6 children (columns)
  const columns = Array.from(element.querySelectorAll(':scope > .col-sm-6'));

  // Defensive fallback: if no columns, use direct children
  const cells = columns.length > 0 ? columns : Array.from(element.children);

  // For each cell, extract the main field-item content (h3 + p), preserving semantic HTML
  const rowCells = cells.map((col) => {
    const fieldItem = col.querySelector('.field-item.even');
    if (fieldItem) {
      // Use the fieldItem directly (includes heading and paragraph)
      return fieldItem;
    }
    // Fallback: use the column itself
    return col;
  });

  // Table rows: header, then columns
  const tableRows = [
    ['Columns block (columns30)'], // header row as per target block name
    rowCells
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
