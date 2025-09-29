/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all immediate card columns
  const cardNodes = Array.from(element.querySelectorAll(':scope .col-xs-12'));

  // Table header row as specified
  const headerRow = ['Cards (cardsNoImages43)'];
  const rows = [headerRow];

  cardNodes.forEach((col) => {
    // Defensive: find the title node
    const titleField = col.querySelector('.field-name-field-block-1-1-name .field-item');
    // Defensive: find the download link node
    const linkField = col.querySelector('.field-name-field-block-1-1link .field-item a');

    // Compose card content
    const cardContent = [];
    if (titleField) {
      // Make the title bold (as in screenshot)
      const strong = document.createElement('strong');
      strong.textContent = titleField.textContent.trim();
      cardContent.push(strong);
    }
    // Add a line break between title and link if both exist
    if (titleField && linkField) {
      cardContent.push(document.createElement('br'));
      cardContent.push(document.createElement('br'));
    }
    if (linkField) {
      // Use the existing link element, but ensure text is present
      cardContent.push(linkField);
    }
    // Each card is a single cell in a row
    rows.push([cardContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
