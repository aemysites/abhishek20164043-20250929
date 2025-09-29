/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required
  const headerRow = ['Columns block (columns1)'];

  // Defensive: get the two main columns from the inner .row
  const mainRow = element.querySelector('.content.row > .row');
  if (!mainRow) return;
  const cols = mainRow.querySelectorAll(':scope > div');
  if (cols.length < 2) return;

  // Left column: image
  let leftColContent = [];
  const imgField = cols[0].querySelector('.field.field-name-field-pepper-bottom-right-img');
  if (imgField) {
    const img = imgField.querySelector('img');
    if (img) leftColContent.push(img);
  }

  // Right column: heading block + text block
  let rightColContent = [];
  // Heading block
  const headingField = cols[1].querySelector('.field.field-name-body');
  if (headingField) {
    const headingItem = headingField.querySelector('.field-item');
    if (headingItem) rightColContent.push(headingItem);
  }
  // Text block
  const textField = cols[1].querySelector('.field.field-name-field-pepper-bottom-text');
  if (textField) {
    const textItem = textField.querySelector('.field-item');
    if (textItem) rightColContent.push(textItem);
  }

  // Build the table: header row, then one row with two columns
  const tableRows = [
    headerRow,
    [leftColContent, rightColContent]
  ];

  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
