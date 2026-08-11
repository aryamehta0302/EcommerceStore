const BRANDS = [
  "Northline",
  "Aurora Co",
  "Basalt",
  "Verano",
  "Studio Nine",
  "Marlow",
  "Fennec",
  "Kindred",
];

const GOLD = "var(--gold, #c9a15a)";

export default function BrandStrip() {
  return (
    <section
      className="position-relative tm-brand-strip"
      style={{
        width: "100%",
        margin: "3rem 0",
      }}
    >
      {/* Heading */}
      <div className="d-flex align-items-center justify-content-center gap-3 mb-4 px-3">
        <span
          style={{
            width: 60,
            height: 1,
            background: GOLD,
            opacity: 0.5,
          }}
        />

        <p
          className="m-0"
          style={{
            color: GOLD,
            fontSize: ".75rem",
            fontWeight: 500,
            letterSpacing: ".45em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          Maisons in Residence
        </p>

        <span
          style={{
            width: 60,
            height: 1,
            background: GOLD,
            opacity: 0.5,
          }}
        />
      </div>

      {/* Brand Track */}
      <div className="tm-brand-track">
        {BRANDS.map((brand, i) => (
          <div
            key={brand}
            className="tm-brand-item"
            style={{
              borderLeft:
                i === 0
                  ? "1px solid rgba(255,255,255,.08)"
                  : "none",
            }}
          >
            {brand}
          </div>
        ))}
      </div>

      <style>{`
        .tm-brand-track{
          width:100%;
          display:flex;
          overflow-x:auto;
          overflow-y:hidden;
          scrollbar-width:none;
          -ms-overflow-style:none;
          border-top:1px solid rgba(255,255,255,.08);
          border-bottom:1px solid rgba(255,255,255,.08);
        }

        .tm-brand-track::-webkit-scrollbar{
          display:none;
        }

        .tm-brand-item{
          flex:0 0 260px;        /* Wider cards */
          height:70px;           /* Reduced height */
          display:flex;
          align-items:center;
          justify-content:center;
          border-right:1px solid rgba(255,255,255,.08);

          font-family:'Playfair Display','Cormorant Garamond',serif;
          font-size:1.35rem;
          font-style:italic;
          font-weight:500;
          letter-spacing:.05em;

          color:var(--text-primary,#f5f0e6);
          opacity:.45;
          transition:.4s ease;
          cursor:default;
        }

        .tm-brand-item:hover{
          opacity:1;
          color:${GOLD};
          letter-spacing:.12em;
          background:rgba(255,255,255,.02);
        }

        @media(max-width:768px){
          .tm-brand-item{
            flex:0 0 180px;
            height:60px;
            font-size:1.1rem;
          }
        }
      `}</style>
    </section>
  );
}