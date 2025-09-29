/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract text content safely
  function getTextContent(el) {
    if (!el) return '';
    if (el.nodeType === Node.ELEMENT_NODE) {
      return el.textContent.trim();
    }
    return String(el).trim();
  }

  // Find the carousel wrapper
  const carousel = element.querySelector('.owl-carousel-block4.owl-carousel');
  if (!carousel) return;

  // Get all slides
  const slideItems = carousel.querySelectorAll('.owl-item > div');
  if (!slideItems.length) return;

  // Table header
  const headerRow = ['Carousel (carousel12)'];
  const rows = [headerRow];

  // For each slide
  slideItems.forEach((slide) => {
    // --- IMAGE CELL ---
    // Prefer desktop image, fallback to mobile if needed
    let imgEl = slide.querySelector('.views-field-field-slide-image img');
    if (!imgEl) {
      imgEl = slide.querySelector('.views-field-field-mobile-image img');
    }
    // Defensive: if no image found, skip this slide
    if (!imgEl) return;

    // --- TEXT CELL ---
    const textCellContent = [];
    // Title (as heading)
    const titleField = slide.querySelector('.views-field-title .field-content');
    if (titleField && getTextContent(titleField)) {
      const h2 = document.createElement('h2');
      h2.textContent = getTextContent(titleField);
      textCellContent.push(h2);
    }
    // CTA link (optional)
    const ctaField = slide.querySelector('.views-field-field-cta .field-content a');
    if (ctaField) {
      // Place CTA link at the bottom of the cell
      textCellContent.push(ctaField);
    }

    // Add row: [image, text cell]
    rows.push([
      imgEl,
      textCellContent.length ? textCellContent : ''
    ]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
