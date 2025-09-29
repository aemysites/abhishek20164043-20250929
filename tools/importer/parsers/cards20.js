/* global WebImporter */
export default function parse(element, { document }) {
  // Extract all card containers (one per card)
  const cardDivs = Array.from(element.querySelectorAll(':scope .row > div[class*="col-"]'));

  const rows = [];
  // Block header row as per spec
  rows.push(['Cards (cards20)']);

  cardDivs.forEach(card => {
    // --- IMAGE ---
    const imgEl = card.querySelector('.views-field-field-blog-image img');
    // Use the actual <img> element if present, else blank
    const image = imgEl || '';

    // --- TITLE ---
    const titleEl = card.querySelector('.views-field-title .field-content a');
    let title = '';
    if (titleEl && titleEl.textContent.trim()) {
      // Use <strong> for card title
      const strong = document.createElement('strong');
      strong.textContent = titleEl.textContent.trim();
      title = strong;
    }

    // --- DESCRIPTION (Estate) ---
    const descEl = card.querySelector('.views-field-field-blog-place .field-content');
    let desc = '';
    if (descEl && descEl.textContent.trim()) {
      // Use <em> for estate name
      const em = document.createElement('em');
      em.textContent = descEl.textContent.trim();
      desc = em;
    }

    // Compose text cell: title (strong), <br>, description (em) if present
    const textCell = [];
    if (title) textCell.push(title);
    if (desc) {
      textCell.push(document.createElement('br'));
      textCell.push(desc);
    }

    rows.push([
      image,
      textCell
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
