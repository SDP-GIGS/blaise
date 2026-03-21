import { useEffect, useRef } from "react";
import gsap from "gsap";

const SplashScreen = ({ onFinish }) => {
  const splashRef = useRef(null);
  const logoRef = useRef(null);
  const wordmarkRef = useRef(null);
  const subtitleRef = useRef(null);
  const lineLeftRef = useRef(null);
  const lineRightRef = useRef(null);
  const taglineRef = useRef(null);
  const gridRef = useRef(null);
  const ring1Ref = useRef(null);
  const ring2Ref = useRef(null);
  const dotsRef = useRef([]);

  useEffect(() => {
    const tl = gsap.timeline();

    // Subtle grid fade in
    gsap.fromTo(gridRef.current, { opacity: 0 }, { opacity: 1, duration: 1.5, ease: "power1.out" });

    // Rings pulse in
    gsap.fromTo(
      ring1Ref.current,
      { scale: 0.4, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.4, ease: "expo.out", delay: 0.1 }
    );
    gsap.fromTo(
      ring2Ref.current,
      { scale: 0.2, opacity: 0 },
      { scale: 1, opacity: 0.35, duration: 1.8, ease: "expo.out", delay: 0.2 }
    );

    // Slow spin on outer ring
    gsap.to(ring2Ref.current, {
      rotate: 360,
      duration: 18,
      ease: "none",
      repeat: -1,
      transformOrigin: "center center",
    });

    // Logo mark draws in
    gsap.fromTo(
      logoRef.current,
      { scale: 0.5, opacity: 0, rotate: -15 },
      { scale: 1, opacity: 1, rotate: 0, duration: 1.0, ease: "back.out(1.4)", delay: 0.3 }
    );

    // Dots stagger
    dotsRef.current.forEach((dot, i) => {
      if (!dot) return;
      gsap.fromTo(
        dot,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, delay: 0.6 + i * 0.08, ease: "back.out(2)" }
      );
    });

    // Horizontal lines expand
    tl.fromTo(
      lineLeftRef.current,
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: 0.7, ease: "power3.out" },
      0.8
    ).fromTo(
      lineRightRef.current,
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: 0.7, ease: "power3.out" },
      0.8
    );

    // Wordmark letter stagger (treat as block)
    gsap.fromTo(
      wordmarkRef.current,
      { opacity: 0, y: 20, filter: "blur(8px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, delay: 1.0, ease: "power3.out" }
    );

    // Subtitle
    gsap.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.8, delay: 1.35, ease: "power2.out" }
    );

    // Tagline
    gsap.fromTo(
      taglineRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.7, delay: 1.7, ease: "power2.out" }
    );

    // Exit
    const timeout = setTimeout(() => {
      gsap.to(splashRef.current, {
        opacity: 0,
        scale: 1.04,
        duration: 0.9,
        ease: "power3.inOut",
        onComplete: onFinish,
      });
    }, 3200);

    return () => clearTimeout(timeout);
  }, [onFinish]);

  // 8 orbital dot positions
  const orbitalDots = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * 2 * Math.PI - Math.PI / 2;
    const r = 78;
    return {
      x: 100 + r * Math.cos(angle),
      y: 100 + r * Math.sin(angle),
    };
  });

  return (
    <div
      ref={splashRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#080c14",
        overflow: "hidden",
        fontFamily: "'Georgia', 'Times New Roman', serif",
      }}
    >
      {/* Ambient glow blobs */}
      <div style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}>
        <div style={{
          position: "absolute",
          top: "-10%",
          left: "-10%",
          width: "55%",
          height: "55%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(180,140,30,0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
        }} />
        <div style={{
          position: "absolute",
          bottom: "-15%",
          right: "-10%",
          width: "60%",
          height: "60%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(30,80,180,0.10) 0%, transparent 70%)",
          filter: "blur(50px)",
        }} />
      </div>

      {/* Subtle grid overlay */}
      <div ref={gridRef} style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(180,150,40,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(180,150,40,0.04) 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
        pointerEvents: "none",
      }} />

      {/* Corner marks */}
      {[
        { top: 24, left: 24 },
        { top: 24, right: 24 },
        { bottom: 24, left: 24 },
        { bottom: 24, right: 24 },
      ].map((pos, i) => (
        <div key={i} style={{
          position: "absolute",
          width: 20,
          height: 20,
          ...pos,
          borderTop: i < 2 ? "1.5px solid rgba(180,140,30,0.4)" : "none",
          borderBottom: i >= 2 ? "1.5px solid rgba(180,140,30,0.4)" : "none",
          borderLeft: i % 2 === 0 ? "1.5px solid rgba(180,140,30,0.4)" : "none",
          borderRight: i % 2 !== 0 ? "1.5px solid rgba(180,140,30,0.4)" : "none",
        }} />
      ))}

      {/* Main content */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
        position: "relative",
      }}>

        {/* Logo emblem */}
        <div style={{ position: "relative", width: 200, height: 200, marginBottom: 8 }}>

          {/* Outer dashed ring */}
          <svg
            ref={ring2Ref}
            width="200" height="200"
            viewBox="0 0 200 200"
            style={{ position: "absolute", inset: 0 }}
          >
            <circle
              cx="100" cy="100" r="90"
              fill="none"
              stroke="rgba(180,140,30,0.35)"
              strokeWidth="1"
              strokeDasharray="4 8"
            />
          </svg>

          {/* Inner solid ring */}
          <svg
            ref={ring1Ref}
            width="200" height="200"
            viewBox="0 0 200 200"
            style={{ position: "absolute", inset: 0 }}
          >
            <circle
              cx="100" cy="100" r="70"
              fill="none"
              stroke="rgba(180,140,30,0.55)"
              strokeWidth="1.5"
            />
            {/* Thin cross hairs */}
            <line x1="100" y1="30" x2="100" y2="50" stroke="rgba(180,140,30,0.5)" strokeWidth="1.5" />
            <line x1="100" y1="150" x2="100" y2="170" stroke="rgba(180,140,30,0.5)" strokeWidth="1.5" />
            <line x1="30" y1="100" x2="50" y2="100" stroke="rgba(180,140,30,0.5)" strokeWidth="1.5" />
            <line x1="150" y1="100" x2="170" y2="100" stroke="rgba(180,140,30,0.5)" strokeWidth="1.5" />
          </svg>

          {/* Orbital dots */}
          <svg width="200" height="200" viewBox="0 0 200 200" style={{ position: "absolute", inset: 0 }}>
            {orbitalDots.map((dot, i) => (
              <circle
                key={i}
                ref={el => (dotsRef.current[i] = el)}
                cx={dot.x}
                cy={dot.y}
                r={i % 2 === 0 ? 3.5 : 2}
                fill={i % 2 === 0 ? "#c9a227" : "rgba(180,140,30,0.4)"}
              />
            ))}
          </svg>

          {/* Central logo mark */}
          <svg
            ref={logoRef}
            width="200" height="200"
            viewBox="0 0 200 200"
            style={{ position: "absolute", inset: 0 }}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background disc */}
            <circle cx="100" cy="100" r="52" fill="#0d1420" stroke="#c9a227" strokeWidth="1.5" />

            {/* I shape */}
            <rect x="78" y="68" width="44" height="7" rx="1" fill="#c9a227" />
            <rect x="78" y="125" width="44" height="7" rx="1" fill="#c9a227" />
            <rect x="96" y="75" width="8" height="57" rx="1" fill="#c9a227" />

            {/* Star accent top-right */}
            <circle cx="122" cy="78" r="4" fill="none" stroke="#c9a227" strokeWidth="1.2" />
            <line x1="122" y1="73" x2="122" y2="83" stroke="#c9a227" strokeWidth="0.8" />
            <line x1="117" y1="78" x2="127" y2="78" stroke="#c9a227" strokeWidth="0.8" />
          </svg>
        </div>

        {/* Divider lines + ILES wordmark */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 10,
          width: "100%",
          justifyContent: "center",
        }}>
          <div
            ref={lineLeftRef}
            style={{
              height: 1,
              width: 60,
              background: "linear-gradient(to left, rgba(180,140,30,0.6), transparent)",
              transformOrigin: "right center",
            }}
          />
          <div
            ref={wordmarkRef}
            style={{
              fontSize: "clamp(52px, 8vw, 72px)",
              fontWeight: 700,
              letterSpacing: "0.18em",
              color: "#e8c84a",
              lineHeight: 1,
              textShadow: "0 0 40px rgba(180,140,30,0.35)",
              fontFamily: "'Georgia', serif",
            }}
          >
            ILES
          </div>
          <div
            ref={lineRightRef}
            style={{
              height: 1,
              width: 60,
              background: "linear-gradient(to right, rgba(180,140,30,0.6), transparent)",
              transformOrigin: "left center",
            }}
          />
        </div>

        {/* Subtitle */}
        <div
          ref={subtitleRef}
          style={{
            fontSize: "clamp(11px, 1.6vw, 14px)",
            letterSpacing: "0.28em",
            color: "rgba(220,200,140,0.7)",
            textTransform: "uppercase",
            textAlign: "center",
            fontFamily: "'Georgia', serif",
            fontStyle: "italic",
          }}
        >
          Internship Logging &amp; Evaluation System
        </div>

        {/* Tagline / loading indicator */}
        <div
          ref={taglineRef}
          style={{
            marginTop: 36,
            display: "flex",
            alignItems: "center",
            gap: 10,
            opacity: 0,
          }}
        >
          <LoadingDots />
        </div>
      </div>

      {/* Bottom stamp */}
      <div style={{
        position: "absolute",
        bottom: 28,
        left: "50%",
        transform: "translateX(-50%)",
        fontSize: 10,
        letterSpacing: "0.3em",
        color: "rgba(180,140,30,0.3)",
        textTransform: "uppercase",
        fontFamily: "monospace",
        whiteSpace: "nowrap",
      }}>
        Makerere University · Academic Tools
      </div>
    </div>
  );
};

// Animated loading dots
const LoadingDots = () => {
  const dotStyle = (delay) => ({
    width: 5,
    height: 5,
    borderRadius: "50%",
    backgroundColor: "#c9a227",
    opacity: 0.5,
    animation: `dotPulse 1.2s ease-in-out ${delay}s infinite`,
  });

  return (
    <>
      <style>{`
        @keyframes dotPulse {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.3); }
        }
      `}</style>
      <div style={dotStyle(0)} />
      <div style={dotStyle(0.2)} />
      <div style={dotStyle(0.4)} />
    </>
  );
};

export default SplashScreen;