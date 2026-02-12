export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;

  const pageNumbers = [];
  const maxVisible = 5;
  const start = Math.max(1, page - Math.floor(maxVisible / 2));
  const end = Math.min(pages, start + maxVisible - 1);
  for (let i = start; i <= end; i++) pageNumbers.push(i);

  return (
    <nav className="d-flex justify-content-center my-4">
      <ul className="tm-pagination">
        {/* Prev */}
        <li>
          <button
            className="tm-page-btn"
            disabled={page === 1}
            onClick={() => onChange(page - 1)}
          >
            ‹
          </button>
        </li>

        {/* First + Ellipsis */}
        {start > 1 && (
          <>
            <li>
              <button className="tm-page-btn" onClick={() => onChange(1)}>1</button>
            </li>
            {start > 2 && (
              <li><span className="tm-page-btn" style={{ cursor: "default", border: "none" }}>…</span></li>
            )}
          </>
        )}

        {/* Center Pages */}
        {pageNumbers.map((num) => (
          <li key={num}>
            <button
              className={`tm-page-btn ${num === page ? "active" : ""}`}
              onClick={() => onChange(num)}
            >
              {num}
            </button>
          </li>
        ))}

        {/* Ellipsis + Last */}
        {end < pages && (
          <>
            {end < pages - 1 && (
              <li><span className="tm-page-btn" style={{ cursor: "default", border: "none" }}>…</span></li>
            )}
            <li>
              <button className="tm-page-btn" onClick={() => onChange(pages)}>
                {pages}
              </button>
            </li>
          </>
        )}

        {/* Next */}
        <li>
          <button
            className="tm-page-btn"
            disabled={page === pages}
            onClick={() => onChange(page + 1)}
          >
            ›
          </button>
        </li>
      </ul>
    </nav>
  );
}
