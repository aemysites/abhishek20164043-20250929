/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get direct child by class name
  function getDirectChildByClass(parent, className) {
    return Array.from(parent.children).find((el) => el.classList.contains(className));
  }

  // 1. Find the main row containing the two columns
  const row = element.querySelector('.row');
  if (!row) return;

  // 2. Get the two column divs (left: image, right: text)
  const columns = row.querySelectorAll(':scope > div');
  if (columns.length < 2) return;

  // 2a. Left column: find the image element
  let leftImg = null;
  const leftImgBlock = columns[0].querySelector('.field-type-image');
  if (leftImgBlock) {
    leftImg = leftImgBlock.querySelector('img');
  }

  // 2b. Right column: find the text/ul content
  let rightContent = null;
  const rightDescBlock = columns[1].querySelector('.field-type-text-with-summary');
  if (rightDescBlock) {
    // The content is likely the first child of .field-items
    const fieldItem = rightDescBlock.querySelector('.field-item');
    if (fieldItem) {
      rightContent = fieldItem;
    }
  }

  // Defensive: fallback if not found
  if (!leftImg && !rightContent) return;

  // 3. Build the table rows
  const headerRow = ['Columns block (columns11)'];
  const contentRow = [
    leftImg ? leftImg : '',
    rightContent ? rightContent : '',
  ];

  // 4. Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // 5. Replace the original element
  element.replaceWith(table);
}
