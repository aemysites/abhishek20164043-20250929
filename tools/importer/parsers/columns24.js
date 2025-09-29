/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract all relevant images and overlay text from a column
  function getColumnContent(colDiv) {
    const cellContent = [];
    // Desktop image
    const desktopImgField = colDiv.querySelector('.field-name-field-pepper-left-top-img, .field-name-field-right-1-overlay-img');
    if (desktopImgField) {
      const desktopImg = desktopImgField.querySelector('img');
      if (desktopImg) cellContent.push(desktopImg);
    }
    // Mobile image
    const mobileImgField = colDiv.querySelector('.field-name-field-left-1-overlay-img-mobile, .field-name-field-right-1-overlay-img-mobile');
    if (mobileImgField) {
      const mobileImg = mobileImgField.querySelector('img');
      if (mobileImg) cellContent.push(mobileImg);
    }
    // Overlay text
    const textField = colDiv.querySelector('.overlay-block-text');
    if (textField) {
      const fieldItem = textField.querySelector('.field-item');
      if (fieldItem) cellContent.push(fieldItem);
    }
    // If no content, add empty string
    if (cellContent.length === 0) cellContent.push('');
    return cellContent;
  }

  // Find column divs (must be direct children)
  let colDivs = Array.from(element.children).filter(child => child.className && child.className.match(/col(-sm|-md)?-6/));
  // Defensive: fallback to any direct children with 'col' in className
  if (colDivs.length === 0) {
    colDivs = Array.from(element.children).filter(child => child.className && child.className.includes('col'));
  }

  // Build table rows
  const headerRow = ['Columns block (columns24)'];
  const contentRow = colDivs.map(getColumnContent);

  // Each cell must be a single element or fragment
  const normalizedContentRow = contentRow.map(cellArr => {
    if (cellArr.length === 1) return cellArr[0];
    // Wrap multiple nodes in a fragment
    const frag = document.createDocumentFragment();
    cellArr.forEach(node => {
      if (typeof node === 'string') {
        frag.appendChild(document.createTextNode(node));
      } else {
        frag.appendChild(node);
      }
    });
    return frag;
  });

  const tableData = [headerRow, normalizedContentRow];
  const block = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(block);
}
