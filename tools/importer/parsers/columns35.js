/* global WebImporter */
export default function parse(element, { document }) {
  if (!element || !element.classList.contains('row')) return;

  // Only select immediate children columns
  const columns = Array.from(element.children).filter(col => col.classList.contains('col-sm-6'));
  if (columns.length === 0) return;

  // Always use the block name as the header row
  const headerRow = ['Columns (columns35)'];

  // Each column cell: extract the <a> if present, else fallback to text
  const contentRow = columns.map(col => {
    const link = col.querySelector('a');
    if (link) return link.cloneNode(true);
    const txt = col.textContent.trim();
    return txt ? document.createTextNode(txt) : '';
  });

  // Compose the table
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
