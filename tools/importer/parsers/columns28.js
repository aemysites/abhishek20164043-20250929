/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get the first desktop image (banner)
  function getBannerImg() {
    // Try desktop first
    const desktopImg = element.querySelector('.sus-drop-block-banner-img img');
    if (desktopImg) return desktopImg;
    // Fallback to mobile
    const mobileImg = element.querySelector('.field-name-field-sus-drop-block-banner-img- img');
    if (mobileImg) return mobileImg;
    return null;
  }

  // Get the heading column (blue box)
  const headingCol = element.querySelector('.sus-drop-block-heading');
  // Get the description column (light blue box)
  const descCol = element.querySelector('.sus-drop-block-desc');

  // Defensive: If headingCol or descCol is missing, fallback to any .col-sm-6 or .col-md-4/8
  let leftCol = headingCol;
  let rightCol = descCol;
  if (!leftCol || !rightCol) {
    const rows = element.querySelectorAll('.row');
    if (rows.length > 1) {
      const cols = rows[1].querySelectorAll('div[class*="col-"]');
      leftCol = leftCol || cols[0];
      rightCol = rightCol || cols[1];
    }
  }

  // Compose table rows
  const headerRow = ['Columns (columns28)'];

  // Second row: image, heading, description (all side by side)
  const bannerImg = getBannerImg();
  const columnsRow = [bannerImg || '', leftCol || '', rightCol || ''];

  // Build the table
  const cells = [
    headerRow,
    columnsRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with block
  element.replaceWith(block);
}
