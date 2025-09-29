/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all immediate children of a node by selector
  function getDirectChildren(parent, selector) {
    return Array.from(parent.querySelectorAll(':scope > ' + selector));
  }

  // Get the main row containing columns
  const row = element.querySelector('.row');
  if (!row) return;

  // Get the two main columns
  const cols = getDirectChildren(row, 'div');
  if (cols.length !== 2) return;

  // --- LEFT COLUMN ---
  // Find both images in the left column
  const leftImages = [];
  // Top image
  const leftTopImgField = cols[0].querySelector('.sus-left-top-img');
  if (leftTopImgField) {
    const img = leftTopImgField.querySelector('img');
    if (img) leftImages.push(img);
  }
  // Bottom image
  const leftBottomImgField = cols[0].querySelector('.sus-left-bottom-img');
  if (leftBottomImgField) {
    const img = leftBottomImgField.querySelector('img');
    if (img) leftImages.push(img);
  }

  // --- RIGHT COLUMN ---
  // Find the title block (h3, h1)
  let rightTitleBlock = null;
  const rightTopTitleField = cols[1].querySelector('.sus-right-top-title');
  if (rightTopTitleField) {
    const titleItem = rightTopTitleField.querySelector('.field-item');
    if (titleItem) {
      // Wrap both h3 and h1 in a div for grouping
      const titleDiv = document.createElement('div');
      const h3 = titleItem.querySelector('h3');
      const h1 = titleItem.querySelector('h1');
      if (h3) titleDiv.appendChild(h3);
      if (h1) titleDiv.appendChild(h1);
      rightTitleBlock = titleDiv.childNodes.length ? titleDiv : null;
    }
  }

  // Find right bottom image
  let rightBottomImg = null;
  const rightBottomImgField = cols[1].querySelector('.sus-right-bottom-img');
  if (rightBottomImgField) {
    const img = rightBottomImgField.querySelector('img');
    if (img) rightBottomImg = img;
  }

  // Find description paragraph
  let rightDesc = null;
  const rightDescField = cols[1].querySelector('.sus-right-bottom-desc');
  if (rightDescField) {
    const descItem = rightDescField.querySelector('.field-item p');
    if (descItem) rightDesc = descItem;
  }

  // --- Compose columns ---
  // Left column: both images stacked
  const leftCol = leftImages;

  // Right column: title block, image, description
  const rightCol = [];
  if (rightTitleBlock) rightCol.push(rightTitleBlock);
  if (rightBottomImg) rightCol.push(rightBottomImg);
  if (rightDesc) rightCol.push(rightDesc);

  // --- Build table ---
  const headerRow = ['Columns block (columns16)'];
  const columnsRow = [leftCol, rightCol];

  const cells = [headerRow, columnsRow];

  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
