/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Cards (cards26)'];

  // Find all direct card columns (each .col-... is a card)
  const cardDivs = element.querySelectorAll(':scope .row > .col-xs-12');

  // Build card rows
  const rows = Array.from(cardDivs).map((cardDiv) => {
    // Image: find the first img inside .views-field-field-news-image
    let imgEl = null;
    const imgField = cardDiv.querySelector('.views-field-field-news-image .field-content img');
    if (imgField) {
      imgEl = imgField;
    }

    // Title: find the link inside .views-field-title
    let titleEl = null;
    const titleField = cardDiv.querySelector('.views-field-title .field-content a');
    if (titleField) {
      // Use heading style for title
      const h3 = document.createElement('h3');
      h3.appendChild(titleField);
      titleEl = h3;
    }

    // Compose text cell
    const textCellContent = [];
    if (titleEl) textCellContent.push(titleEl);
    // No description or CTA in source, so only title

    return [imgEl, textCellContent];
  });

  // Compose table data
  const tableData = [headerRow, ...rows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace original element
  element.replaceWith(block);
}
