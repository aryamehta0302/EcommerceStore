import { motion } from "framer-motion";

// Purely decorative — a handful of gradient blobs floating in 3D space
// (perspective + rotateX/rotateY/translateZ) using CSS transforms driven
// by Framer Motion. No extra dependencies (no three.js) needed.
// pointer-events: none so it never blocks clicks on real content.
const shapes = [
  { size: 220, top: "-8%", left: "4%", hue: "var(--primary)", duration: 16, depth: 60 },
  { size: 160, top: "55%", left: "-4%", hue: "var(--accent)", duration: 20, depth: -40 },
  { size: 260, top: "8%", left: "78%", hue: "var(--accent-rose, var(--accent))", duration: 22, depth: 80 },
  { size: 140, top: "68%", left: "82%", hue: "var(--primary-light, var(--primary))", duration: 18, depth: -60 },
];

export default function Animated3DBackground({ opacity = 0.35 }) {
  return (
    <div
      aria-hidden="true"
      className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden"
      style={{ zIndex: 0, pointerEvents: "none", perspective: "1000px" }}
    >
      {shapes.map((s, i) => (
        <motion.div
          key={i}
          initial={{ rotateX: 0, rotateY: 0, translateZ: 0 }}
          animate={{
            rotateX: [0, 25, -15, 0],
            rotateY: [0, -30, 20, 0],
            translateZ: [0, s.depth, -s.depth, 0],
            y: [0, -18, 12, 0],
          }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            borderRadius: "34% 66% 62% 38% / 45% 40% 60% 55%",
            background: `radial-gradient(circle at 35% 30%, ${s.hue}, transparent 70%)`,
            filter: "blur(2px)",
            opacity,
            transformStyle: "preserve-3d",
          }}
        />
      ))}
    </div>
  );
}
