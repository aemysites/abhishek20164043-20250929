/* global WebImporter */
export default function parse(element, { document }) {
  if (!element || element.tagName !== 'FOOTER') return;

  // Table header row
  const headerRow = ['Columns block (columns7)'];

  // Extract left menu links as elements
  const leftMenu = element.querySelector('.navbar-left');
  let leftMenuCell = '';
  if (leftMenu) {
    const ul = leftMenu.cloneNode(true);
    leftMenuCell = ul;
  }

  // Extract right menu as elements
  const rightMenu = element.querySelector('.navbar-right');
  let rightMenuCell = '';
  if (rightMenu) {
    const ul = rightMenu.cloneNode(true);
    rightMenuCell = ul;
  }

  // Extract copyright region as elements
  const copyrightRegion = element.querySelector('.copyright-region');
  let copyrightCell = '';
  if (copyrightRegion) {
    const section = copyrightRegion.querySelector('section');
    if (section) {
      copyrightCell = section.cloneNode(true);
    }
  }

  // Build the table rows
  const tableRows = [
    headerRow,
    [leftMenuCell, rightMenuCell, copyrightCell],
  ];

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(blockTable);
}
