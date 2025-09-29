/* global WebImporter */
export default function parse(element, { document }) {
  // Find the row containing the columns
  const row = element.querySelector('.sus-overlay .row');
  if (!row) return;
  const columns = Array.from(row.children).filter((col) => col.classList.contains('col-sm-6'));
  if (columns.length < 2) return;

  // Extract left column content
  const leftCol = columns[0];
  const leftImg = leftCol.querySelector('.sus-overlay-left-img .field-item img');
  const leftTitle = leftCol.querySelector('.field-name-field-sus-left-top-img-title .field-item');
  const leftText = leftCol.querySelector('.sus-overlay-left-text .field-item');
  const leftCell = document.createElement('div');
  if (leftImg) leftCell.appendChild(leftImg);
  if (leftTitle) leftCell.appendChild(leftTitle);
  if (leftText) leftCell.appendChild(leftText);

  // Extract right column content
  const rightCol = columns[1];
  const rightImg = rightCol.querySelector('.sus-overlay-right-img .field-item img');
  const rightTitle = rightCol.querySelector('.field-name-field-sus-right-top-img-title .field-item');
  const rightText = rightCol.querySelector('.sus-overlay-right-text .field-item');
  const rightCell = document.createElement('div');
  if (rightImg) rightCell.appendChild(rightImg);
  if (rightTitle) rightCell.appendChild(rightTitle);
  if (rightText) rightCell.appendChild(rightText);

  // Table header must match exactly
  const headerRow = ['Columns block (columns49)'];
  const columnsRow = [leftCell, rightCell];

  // Create table using WebImporter utility
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
