export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;

  const pageNumbers = [];
  const maxVisible = 5; // show 5 pages at a time

  const start = Math.max(1, page - Math.floor(maxVisible / 2));
  const end = Math.min(pages, start + maxVisible - 1);

  for (let i = start; i <= end; i++) pageNumbers.push(i);

  return (
    <nav className="d-flex justify-content-center my-4">
      <ul className="pagination pagination-sm flex-wrap justify-content-center mb-0">
        {/* Prev */}
        <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onChange(page - 1)}>
            ‹ Prev
          </button>
        </li>

        {/* First + Ellipsis */}
        {start > 1 && (
          <>
            <li className="page-item">
              <button className="page-link" onClick={() => onChange(1)}>1</button>
            </li>
            {start > 2 && (
              <li className="page-item disabled">
                <span className="page-link">…</span>
              </li>
            )}
          </>
        )}

        {/* Center Pages */}
        {pageNumbers.map((num) => (
          <li key={num} className={`page-item ${num === page ? "active" : ""}`}>
            <button className="page-link" onClick={() => onChange(num)}>
              {num}
            </button>
          </li>
        ))}

        {/* Ellipsis + Last */}
        {end < pages && (
          <>
            {end < pages - 1 && (
              <li className="page-item disabled">
                <span className="page-link">…</span>
              </li>
            )}
            <li className="page-item">
              <button className="page-link" onClick={() => onChange(pages)}>
                {pages}
              </button>
            </li>
          </>
        )}

        {/* Next */}
        <li className={`page-item ${page === pages ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onChange(page + 1)}>
            Next ›
          </button>
        </li>
      </ul>
    </nav>
  );
}
