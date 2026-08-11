import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

const AUTO_PLAY_INTERVAL = 6000;
const GOLD = "var(--gold, #c9a15a)";
const GOLD_SOFT = "var(--gold-soft, #e6c987)";

export default function HeroCarousel({ slides = [], onCtaClick }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const touchStart = useRef(0);
  const touchEnd = useRef(0);
  const videoRef = useRef(null);

  const nextSlide = useCallback(() => {
    setCurrent((p) => (p + 1) % slides.length);
    setProgress(0);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrent((p) => (p === 0 ? slides.length - 1 : p - 1));
    setProgress(0);
  }, [slides.length]);

  const goToSlide = (i) => {
    setCurrent(i);
    setProgress(0);
  };

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const t = setInterval(nextSlide, AUTO_PLAY_INTERVAL);
    return () => clearInterval(t);
  }, [paused, nextSlide, slides.length]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setProgress((p) => (p >= 100 ? 100 : p + 100 / (AUTO_PLAY_INTERVAL / 100)));
    }, 100);
    return () => clearInterval(t);
  }, [paused, current]);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
    const p = videoRef.current.play();
    if (p !== undefined) p.catch(() => {});
  }, [current]);

  useEffect(() => {
    const h = (e) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [nextSlide, prevSlide]);

  const handleTouchStart = (e) => (touchStart.current = e.targetTouches[0].clientX);
  const handleTouchMove = (e) => (touchEnd.current = e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    const d = touchStart.current - touchEnd.current;
    if (d > 70) nextSlide();
    if (d < -70) prevSlide();
  };

  if (!slides.length) return null;
  const slide = slides[current];

  return (
    <section
      className="position-relative overflow-hidden tm-hero-carousel"
      style={{
        width: "100%",
        height: "88vh",
        minHeight: 560,
        maxHeight: 900,
        background: "#0a0a0a",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="position-absolute top-0 start-0 w-100 h-100"
        >
          {slide.type === "video" ? (
            <video
              ref={videoRef}
              src={slide.src}
              poster={slide.poster}
              muted
              autoPlay
              loop
              playsInline
              preload="metadata"
              className="w-100 h-100"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <img
              src={slide.src}
              alt={slide.title}
              className="w-100 h-100"
              style={{ objectFit: "cover" }}
            />
          )}

          {/* Cinematic vignette */}
          <div
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,.85) 0%, rgba(0,0,0,.55) 40%, rgba(0,0,0,.15) 75%, rgba(0,0,0,.35) 100%)",
            }}
          />
          <div
            className="position-absolute bottom-0 start-0 w-100"
            style={{
              height: "45%",
              background:
                "linear-gradient(180deg, transparent 0%, rgba(0,0,0,.55) 100%)",
            }}
          />

          {/* Content */}
          <div
            className="position-absolute top-50 start-0 translate-middle-y w-100"
            style={{ zIndex: 2 }}
          >
            <div className="container">
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                style={{ maxWidth: 680 }}
              >
                <div
                  className="d-flex align-items-center gap-3 mb-4"
                  style={{ color: GOLD_SOFT }}
                >
                  <span
                    style={{
                      width: 42,
                      height: 1,
                      background: GOLD,
                      display: "inline-block",
                    }}
                  />
                  <span
                    style={{
                      fontSize: ".7rem",
                      letterSpacing: ".4em",
                      textTransform: "uppercase",
                      fontWeight: 500,
                    }}
                  >
                    {slide.eyebrow}
                  </span>
                </div>

                <h1
                  style={{
                    color: "#f5f0e6",
                    fontFamily: "'Playfair Display', 'Cormorant Garamond', serif",
                    fontSize: "clamp(2.8rem, 6.5vw, 5.6rem)",
                    fontWeight: 500,
                    lineHeight: 1.02,
                    letterSpacing: "-0.02em",
                    marginBottom: 22,
                  }}
                >
                  {slide.title}
                </h1>

                <p
                  style={{
                    color: "rgba(245,240,230,.78)",
                    fontSize: "1.05rem",
                    lineHeight: 1.85,
                    maxWidth: 520,
                    marginBottom: 40,
                    fontWeight: 300,
                  }}
                >
                  {slide.text}
                </p>

                <div className="d-flex gap-3 flex-wrap align-items-center">
                  <button
                    className="tm-hero-cta"
                    onClick={() => onCtaClick?.(slide)}
                  >
                    <span>{slide.cta}</span>
                    <ChevronRight size={16} strokeWidth={1.5} />
                  </button>

                  <button
                    className="tm-hero-ghost"
                    onClick={() => setPaused(!paused)}
                    aria-label={paused ? "Play" : "Pause"}
                  >
                    {paused ? <Play size={16} /> : <Pause size={16} />}
                    <span>{paused ? "Play" : "Pause"}</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="tm-hero-arrow"
        style={{ left: 24 }}
        aria-label="Previous"
      >
        <ChevronLeft size={20} strokeWidth={1.25} />
      </button>
      <button
        onClick={nextSlide}
        className="tm-hero-arrow"
        style={{ right: 24 }}
        aria-label="Next"
      >
        <ChevronRight size={20} strokeWidth={1.25} />
      </button>

      {/* Slide counter + progress (editorial) */}
      <div
        className="position-absolute d-flex align-items-center gap-3"
        style={{
          right: 40,
          bottom: 40,
          zIndex: 20,
          color: "rgba(245,240,230,.85)",
          fontFamily: "'Playfair Display', serif",
        }}
      >
        <span style={{ fontSize: "1.4rem", color: GOLD_SOFT }}>
          {String(current + 1).padStart(2, "0")}
        </span>
        <div
          style={{
            width: 90,
            height: 1,
            background: "rgba(245,240,230,.25)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <motion.div
            key={current}
            initial={{ width: 0 }}
            animate={{ width: paused ? `${progress}%` : "100%" }}
            transition={{ duration: paused ? 0 : AUTO_PLAY_INTERVAL / 1000, ease: "linear" }}
            style={{ height: "100%", background: GOLD }}
          />
        </div>
        <span style={{ fontSize: ".85rem", color: "rgba(245,240,230,.5)" }}>
          {String(slides.length).padStart(2, "0")}
        </span>
      </div>

      {/* Dots */}
      <div
        className="position-absolute d-flex gap-2"
        style={{ left: 40, bottom: 40, zIndex: 20 }}
      >
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goToSlide(i)}
            aria-label={`Slide ${i + 1}`}
            style={{
              width: current === i ? 32 : 8,
              height: 2,
              borderRadius: 0,
              border: "none",
              cursor: "pointer",
              transition: "all .45s ease",
              background: current === i ? GOLD : "rgba(245,240,230,.3)",
            }}
          />
        ))}
      </div>

      <style>{`
        .tm-hero-carousel {
          border-radius: 0 !important;
          margin: 0 !important;
        }
        .tm-hero-cta {
          display: inline-flex;
          align-items: center;
          gap: .75rem;
          padding: 1rem 2rem;
          background: linear-gradient(135deg, ${GOLD_SOFT}, ${GOLD});
          color: #0a0a0a;
          border: none;
          border-radius: 2px;
          font-size: .72rem;
          font-weight: 600;
          letter-spacing: .28em;
          text-transform: uppercase;
          cursor: pointer;
          transition: transform .4s ease, box-shadow .4s ease;
        }
        .tm-hero-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 40px -12px rgba(201,161,90,.55);
        }
        .tm-hero-ghost {
          display: inline-flex;
          align-items: center;
          gap: .6rem;
          padding: 1rem 1.5rem;
          background: transparent;
          color: rgba(245,240,230,.85);
          border: 1px solid rgba(245,240,230,.25);
          border-radius: 2px;
          font-size: .68rem;
          font-weight: 500;
          letter-spacing: .28em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all .35s ease;
        }
        .tm-hero-ghost:hover {
          border-color: ${GOLD};
          color: ${GOLD_SOFT};
        }
        .tm-hero-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: rgba(10,10,10,.35);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(245,240,230,.2);
          color: rgba(245,240,230,.9);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: all .35s ease;
        }
        .tm-hero-arrow:hover {
          background: rgba(10,10,10,.7);
          border-color: ${GOLD};
          color: ${GOLD_SOFT};
        }
      `}</style>
    </section>
  );
}