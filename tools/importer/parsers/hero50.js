/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get the first direct child matching a selector
  function getDirectChild(parent, selector) {
    return Array.from(parent.children).find(el => el.matches(selector));
  }

  // 1. Header row
  const headerRow = ['Hero (hero50)'];

  // 2. Find the desktop background image (prefer desktop, fallback to mobile)
  let bgImg = null;
  const desktopImgField = element.querySelector('.sus-bot-img-desktop');
  if (desktopImgField) {
    bgImg = desktopImgField.querySelector('img');
  }
  if (!bgImg) {
    // fallback to mobile image
    const mobileImgField = element.querySelector('.sus-bot-img-mobile');
    if (mobileImgField) {
      bgImg = mobileImgField.querySelector('img');
    }
  }

  // 3. Find the text content (headings and paragraph)
  let textContent = null;
  const descField = element.querySelector('.sus-bot-img-desc');
  if (descField) {
    // Use the entire content block as a single cell
    const items = descField.querySelector('.field-items');
    if (items) {
      textContent = items.firstElementChild;
    }
  }

  // 4. Build the table rows
  const rows = [
    headerRow,
    [bgImg ? bgImg : ''],
    [textContent ? textContent : ''],
  ];

  // 5. Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
