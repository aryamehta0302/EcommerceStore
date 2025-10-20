export default function Footer() {
  return (
    <footer className="bg-dark text-light pt-4 pb-2 mt-auto border-top border-secondary">
      <div className="container text-center">
        <div className="row gy-3">
          <div className="col-12 col-md-4">
            <h6 className="fw-bold text-uppercase mb-2">TrendMart</h6>
            <small className="text-muted">
              Made with Love ❤️ by Arya Mehta
            </small>
          </div>
          <div className="col-12 col-md-4">
            <h6 className="fw-bold text-uppercase mb-2">Contact</h6>
            <small>
              📞 +91 63533 62927 <br />
              ✉️ support@trendmart.in
            </small>
          </div>
          <div className="col-12 col-md-4">
            <h6 className="fw-bold text-uppercase mb-2">Follow Us</h6>
            <div className="d-flex justify-content-center gap-3 fs-5">
              <a href="#" className="text-light"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-light"><i className="bi bi-instagram"></i></a>
              <a href="#" className="text-light"><i className="bi bi-twitter"></i></a>
            </div>
          </div>
        </div>
        <hr className="border-secondary mt-3 mb-2" />
        <small className="text-muted">&copy; {new Date().getFullYear()} TrendMart</small>
      </div>
    </footer>
  );
}
