/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get immediate child divs
  const childDivs = Array.from(element.querySelectorAll(':scope > div'));

  // Find the image element (first .field-type-image img)
  let imgEl = null;
  const imgField = childDivs.find(div => div.classList.contains('field-type-image'));
  if (imgField) {
    imgEl = imgField.querySelector('img');
  }

  // Find the title (first .field-name-field-gb-left-bottom-title)
  let titleText = '';
  const titleField = childDivs.find(div => div.classList.contains('field-name-field-gb-left-bottom-title'));
  if (titleField) {
    const item = titleField.querySelector('.field-item');
    if (item) titleText = item.textContent.trim();
  }

  // Find the description (first .field-name-field-gb-left-bottom-desc)
  let descContent = null;
  const descField = childDivs.find(div => div.classList.contains('field-name-field-gb-left-bottom-desc'));
  if (descField) {
    // Use the first .field-item inside
    const descItem = descField.querySelector('.field-item');
    if (descItem) {
      // We'll use the children (h2, p, etc) as content
      descContent = Array.from(descItem.childNodes).filter(n => {
        // Only include element nodes and non-empty text nodes
        return n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim());
      });
    }
  }

  // Compose the text cell
  const textCellContent = [];
  if (titleText) {
    const h2 = document.createElement('h2');
    h2.textContent = titleText;
    textCellContent.push(h2);
  }
  if (descContent && descContent.length > 0) {
    descContent.forEach(node => {
      // If it's an h2 and we already have a title, skip
      if (node.nodeType === 1 && node.tagName.toLowerCase() === 'h2' && titleText) return;
      textCellContent.push(node);
    });
  }

  // Build the table rows
  const headerRow = ['Carousel (carousel40)'];
  const slideRow = [imgEl, textCellContent];
  const tableCells = [headerRow, slideRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace the original element
  element.replaceWith(block);
}
