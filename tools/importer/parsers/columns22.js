/* global WebImporter */
export default function parse(element, { document }) {
  // Header row with block name
  const headerRow = ['Columns block (columns22)'];

  // Defensive: Find the main row containing columns
  const row = element.querySelector('.row');
  if (!row) return;

  // Get immediate column children
  const columns = Array.from(row.children).filter(col => col.className && col.className.includes('col-sm-'));
  if (columns.length < 2) return; // Expecting at least 2 columns

  // First column: image
  let imageCellContent = null;
  const imageField = columns[0].querySelector('.field-type-image');
  if (imageField) {
    const img = imageField.querySelector('img');
    if (img) imageCellContent = img;
  }

  // Second column: text content
  let textCellContent = null;
  const textField = columns[1].querySelector('.field-type-text-with-summary');
  if (textField) {
    // Use the entire field-item (preserves headings, paragraphs, etc)
    const fieldItem = textField.querySelector('.field-item');
    if (fieldItem) textCellContent = fieldItem;
  }

  // Build the table rows
  const cells = [
    headerRow,
    [imageCellContent, textCellContent],
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
