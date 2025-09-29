/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by selector
  function getDirectChild(parent, selector) {
    return Array.from(parent.children).find((el) => el.matches(selector));
  }

  // 1. Find the two columns in the .row
  const row = element.querySelector('.row');
  if (!row) return;
  const cols = row.querySelectorAll(':scope > .col-sm-6, :scope > .col-md-6');
  if (cols.length !== 2) return;

  // --- LEFT COLUMN: image ---
  let leftContent = null;
  const leftImgField = cols[0].querySelector('.field-name-field-gb-bottom-block5-img .field-item img');
  if (leftImgField) {
    leftContent = leftImgField;
  } else {
    // fallback: grab all content
    leftContent = cols[0];
  }

  // --- RIGHT COLUMN: heading + desc ---
  // We'll combine the heading and desc blocks into a single fragment
  const rightCol = cols[1];
  // Heading
  const headingField = rightCol.querySelector('.field-name-field-gb-bottom-block5-heading .field-item');
  // Description
  const descField = rightCol.querySelector('.field-name-field-gb-bottom-block5-desc .field-item');
  // Compose right cell content
  const rightContent = document.createElement('div');
  if (headingField) rightContent.appendChild(headingField);
  if (descField) rightContent.appendChild(descField);

  // Table rows
  const headerRow = ['Columns block (columns34)'];
  const contentRow = [leftContent, rightContent];

  // Build and replace
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);
  element.replaceWith(table);
}
