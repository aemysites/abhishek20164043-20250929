/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by selector
  function getDirectChild(parent, selector) {
    return Array.from(parent.children).find((el) => el.matches(selector));
  }

  // 1. Find the row containing the card content
  const row = element.querySelector('.row');
  if (!row) return;

  // 2. Get the two columns: image and text
  const cols = row.querySelectorAll(':scope > div');
  if (cols.length < 2) return;
  const imgCol = cols[0];
  const textCol = cols[1];

  // 3. Find the image element
  let img = imgCol.querySelector('img');

  // 4. Find the text content
  const textField = textCol.querySelector('.field-items .field-item');
  let textParts = [];
  if (textField) {
    // Title (h2)
    const h2 = textField.querySelector('h2');
    if (h2) textParts.push(h2);
    // Subtitle (h3)
    const h3 = textField.querySelector('h3');
    if (h3) textParts.push(h3);
    // Description (p)
    const p = textField.querySelector('p');
    if (p) textParts.push(p);
  }

  // 5. Build the table rows
  const headerRow = ['Cards (cards39)'];
  const cardRow = [img, textParts];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    cardRow,
  ], document);

  // 6. Replace the original element
  element.replaceWith(table);
}
