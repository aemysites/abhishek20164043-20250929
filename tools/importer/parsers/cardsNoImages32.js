/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card content from a .col-... element
  function extractCard(col) {
    // Find the title element
    const titleField = col.querySelector('.views-field-title');
    let heading = null;
    if (titleField) {
      // Use the span.field-content as the heading
      const span = titleField.querySelector('.field-content');
      if (span) {
        // Use a <strong> for heading to match block semantics
        heading = document.createElement('strong');
        heading.append(span);
      }
    }

    // Find the download link
    const linkField = col.querySelector('.views-field-field-dac-block-link');
    let cta = null;
    if (linkField) {
      const link = linkField.querySelector('a');
      if (link) {
        // Use the existing link, but wrap in a <div> for separation
        cta = document.createElement('div');
        cta.append(link);
      }
    }

    // Compose card cell content
    const cellContent = [];
    if (heading) cellContent.push(heading);
    if (cta) cellContent.push(cta);
    return cellContent;
  }

  // Get all immediate child .row > .col-... elements
  const row = element.querySelector('.row');
  if (!row) return;
  const cols = Array.from(row.children).filter(child => child.classList.contains('col-xs-12'));

  // Build the table rows
  const headerRow = ['Cards (cardsNoImages32)'];
  const rows = [headerRow];
  cols.forEach(col => {
    const cardContent = extractCard(col);
    rows.push([cardContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
