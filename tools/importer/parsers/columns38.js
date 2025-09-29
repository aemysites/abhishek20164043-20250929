/* global WebImporter */
export default function parse(element, { document }) {
  // Extract columns (expecting two: image and text)
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  if (columns.length < 2) return;

  // First column: image (reference the actual <img> element)
  const imageCol = columns[0];
  const img = imageCol.querySelector('img');
  // Only reference the existing image element, do not clone or create new
  const imageCell = img ? img : '';

  // Second column: text content (preserve heading levels and paragraph)
  const textCol = columns[1];
  const bodyField = textCol.querySelector('.field-name-body .field-item');
  let textCell = '';
  if (bodyField) {
    // Collect h2, h3, and p in order, referencing the original elements
    const nodes = [];
    const h2 = bodyField.querySelector('h2');
    if (h2) nodes.push(h2);
    const h3 = bodyField.querySelector('h3');
    if (h3) nodes.push(h3);
    const p = bodyField.querySelector('p');
    if (p) nodes.push(p);
    // If any nodes found, create a fragment to preserve semantics
    if (nodes.length) {
      const frag = document.createDocumentFragment();
      nodes.forEach((n) => frag.appendChild(n));
      textCell = frag;
    }
  }

  // Compose table rows
  const headerRow = ['Columns block (columns38)'];
  const contentRow = [imageCell, textCell];
  const rows = [headerRow, contentRow];

  // Create the columns block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
