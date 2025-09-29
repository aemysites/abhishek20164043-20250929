/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to safely get the first matching descendant
  function getFirstDescendant(parent, selector) {
    const el = parent.querySelector(selector);
    return el || null;
  }

  // 1. Header row
  const headerRow = ['Hero (hero37)'];

  // 2. Background image row
  // Find the image in the right column
  let imageEl = null;
  const groupRight = element.querySelector('.group-right');
  if (groupRight) {
    imageEl = getFirstDescendant(groupRight, 'img');
  }
  const imageRow = [imageEl ? imageEl : ''];

  // 3. Content row: title, subheading, (no CTA in this source)
  // Find the left column
  const groupLeft = element.querySelector('.group-left');
  let titleEl = null;
  let subtitleEl = null;
  if (groupLeft) {
    // Title
    const headingField = getFirstDescendant(groupLeft, '.field-name-field-heading .field-item');
    if (headingField) {
      titleEl = document.createElement('h1');
      titleEl.textContent = headingField.textContent.trim();
    }
    // Subheading
    const subheadingField = getFirstDescendant(groupLeft, '.field-name-field-sub-heading .field-item');
    if (subheadingField) {
      subtitleEl = document.createElement('p');
      subtitleEl.textContent = subheadingField.textContent.trim();
    }
  }
  // Compose content cell
  const contentCell = [];
  if (titleEl) contentCell.push(titleEl);
  if (subtitleEl) contentCell.push(subtitleEl);
  const contentRow = [contentCell.length ? contentCell : ''];

  // Compose table
  const tableCells = [
    headerRow,
    imageRow,
    contentRow,
  ];
  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}
