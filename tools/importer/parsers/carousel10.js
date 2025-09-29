/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract all carousel slides
  function getSlides(root) {
    // Defensive: find the owl-carousel container
    const carousel = root.querySelector('.owl-carousel');
    if (!carousel) return [];
    // Get all direct .owl-item children
    return Array.from(carousel.querySelectorAll(':scope > .owl-wrapper-outer > .owl-wrapper > .owl-item'));
  }

  // Helper to extract image from left column
  function extractImage(slide) {
    // Defensive: find image in left column
    const leftCol = slide.querySelector('.gb-carousel-left');
    if (!leftCol) return null;
    const img = leftCol.querySelector('img');
    return img || null;
  }

  // Helper to extract text content from right column
  function extractTextContent(slide) {
    const rightCol = slide.querySelector('.gb-carousel-right');
    if (!rightCol) return null;
    // Find the field-item with text
    const fieldItem = rightCol.querySelector('.field-item');
    if (!fieldItem) return null;
    // Defensive: find heading and paragraph(s)
    const heading = fieldItem.querySelector('h3');
    const paragraphs = Array.from(fieldItem.querySelectorAll('p'));
    // Compose content array
    const content = [];
    if (heading) content.push(heading);
    if (paragraphs.length > 0) content.push(...paragraphs);
    // If there are links (call-to-action), add them at the end
    const links = Array.from(fieldItem.querySelectorAll('a'));
    if (links.length > 0) content.push(...links);
    // If nothing found, return null
    return content.length > 0 ? content : null;
  }

  // Build table rows
  const headerRow = ['Carousel (carousel10)'];
  const rows = [headerRow];

  // Find all slides
  const slides = getSlides(element);
  slides.forEach((slide) => {
    // Each slide contains the actual content in a child .item-*
    const item = slide.querySelector(':scope > div');
    if (!item) return;
    // Extract image and text
    const img = extractImage(item);
    const textContent = extractTextContent(item);
    // Always put image in first cell, text in second cell
    // If no text, cell is empty string
    rows.push([
      img || '',
      textContent || ''
    ]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
