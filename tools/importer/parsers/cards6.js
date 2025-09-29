/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children with a selector
  function getDirectChildren(parent, selector) {
    return Array.from(parent.querySelectorAll(':scope > ' + selector));
  }

  // Table header
  const headerRow = ['Cards (cards6)'];
  const rows = [headerRow];

  // Find the grid container
  const grid = element.querySelector('.views-bootstrap-grid-plugin-style .row');
  if (!grid) return;

  // Get all card columns
  const cols = getDirectChildren(grid, 'div.col-xs-12');

  cols.forEach((col) => {
    // Get image (mandatory)
    let img = null;
    const imgField = col.querySelector('.views-field-field-blog-image .field-content img');
    if (imgField) {
      img = imgField;
    }

    // Get title (mandatory)
    let title = '';
    const titleField = col.querySelector('.views-field-title .field-content a');
    if (titleField) {
      // Use strong for heading style
      const strong = document.createElement('strong');
      strong.textContent = titleField.textContent.trim();
      title = strong;
    }

    // Get description (optional)
    let desc = '';
    const descField = col.querySelector('.views-field-field-blog-place .field-content');
    if (descField) {
      // Use a div for description
      const descDiv = document.createElement('div');
      descDiv.textContent = descField.textContent.trim();
      desc = descDiv;
    }

    // Compose text cell
    const textCell = [];
    if (title) textCell.push(title);
    if (desc) textCell.push(desc);

    // Add row: [image, text]
    rows.push([img, textCell]);
  });

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
