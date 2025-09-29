/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate child columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Defensive: Expecting two columns (left and right)
  if (columns.length < 2) {
    // If not enough columns, do nothing
    return;
  }

  // LEFT COLUMN: Heading block
  const leftCol = columns[0];
  // Find the heading field inside leftCol
  const leftHeadingField = leftCol.querySelector('.gb-block2-left-top-heading');
  let leftContent = [];
  if (leftHeadingField) {
    // Use the deepest field-item
    const fieldItem = leftHeadingField.querySelector('.field-item');
    if (fieldItem) {
      leftContent.push(fieldItem);
    } else {
      leftContent.push(leftHeadingField);
    }
  } else {
    leftContent.push(leftCol);
  }

  // RIGHT COLUMN: Image + title + description
  const rightCol = columns[1];

  // Find image
  const imgField = rightCol.querySelector('.gb-block2-right-top-img');
  let imgElem = null;
  if (imgField) {
    imgElem = imgField.querySelector('img');
  }

  // Find title
  const titleField = rightCol.querySelector('.gb-block2-right-top-title');
  let titleElem = null;
  if (titleField) {
    // Usually just text, but wrap in a div for grouping
    const fieldItem = titleField.querySelector('.field-item');
    if (fieldItem) {
      titleElem = document.createElement('div');
      titleElem.append(fieldItem.cloneNode(true));
    }
  }

  // Find description
  const descField = rightCol.querySelector('.gb-block2-right-top-desc');
  let descElem = null;
  if (descField) {
    const fieldItem = descField.querySelector('.field-item');
    if (fieldItem) {
      descElem = fieldItem;
    }
  }

  // Compose right column content
  let rightContent = [];
  if (imgElem) rightContent.push(imgElem);
  if (titleElem) rightContent.push(titleElem);
  if (descElem) rightContent.push(descElem);

  // Table header
  const headerRow = ['Columns block (columns4)'];
  // Table content row: two columns
  const contentRow = [leftContent, rightContent];

  // Create block table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
