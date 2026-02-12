export default function Loader() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div className="tm-loader"></div>
      <p className="mt-3" style={{ color: "var(--text-muted)", fontWeight: 500, fontSize: "0.9rem" }}>
        Loading...
      </p>
    </div>
  );
}
