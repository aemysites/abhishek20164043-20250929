/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by selector
  function getDirectChildren(parent, selector) {
    return Array.from(parent.children).filter((el) => el.matches(selector));
  }

  // Find the row containing the columns
  const row = element.querySelector('.row');
  if (!row) return;

  // Get all column divs (ignore clearfixes)
  const columns = Array.from(row.children).filter((col) => col.classList.contains('col-xs-6'));

  // Defensive: if no columns found, bail
  if (columns.length === 0) return;

  // For each column, extract the image and the title (as a link)
  const columnCells = columns.map((col) => {
    // Find the image anchor (with image inside)
    const imgField = col.querySelector('.views-field-field-image .field-content a');
    let imgEl = null;
    if (imgField && imgField.querySelector('img')) {
      imgEl = imgField.querySelector('img');
    }

    // Find the title anchor
    const titleField = col.querySelector('.views-field-title .field-content a');
    let titleEl = null;
    if (titleField) {
      // We'll use the anchor element directly
      titleEl = titleField;
    }

    // Compose cell content: image (if present) and title (if present)
    const cellContent = [];
    if (imgEl) cellContent.push(imgEl);
    if (titleEl) cellContent.push(document.createElement('br'), titleEl);
    // Remove empty <br> if no title
    if (cellContent.length === 2 && !titleEl) cellContent.pop();
    return cellContent;
  });

  // Build the table rows
  const headerRow = ['Columns block (columns3)'];
  const contentRow = columnCells;
  const tableCells = [headerRow, contentRow];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace the original element
  element.replaceWith(table);
}
