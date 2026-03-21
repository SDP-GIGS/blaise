import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { label: "Student Interns", value: "500+", sub: "Across all departments" },
  { label: "Supervisors", value: "120+", sub: "Workplace & academic" },
  { label: "Evaluations Done", value: "2,400+", sub: "Logged & reviewed" },
  { label: "Institutions", value: "18", sub: "Partner organisations" },
];

const pillars = [
  {
    code: "01",
    title: "Place",
    desc: "Structured placement workflow with validation gates and deadline tracking.",
  },
  {
    code: "02",
    title: "Log",
    desc: "Weekly logbook submissions with rich evidence attachments.",
  },
  {
    code: "03",
    title: "Review",
    desc: "Supervisor sign-off and academic commentary in a single interface.",
  },
  {
    code: "04",
    title: "Score",
    desc: "Automated weighted computation with transparent grade breakdowns.",
  },
];

const HeroSection = () => {
  const sectionRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headLine1Ref = useRef(null);
  const headLine2Ref = useRef(null);
  const headLine3Ref = useRef(null);
  const taglineRef = useRef(null);
  const ctaRef = useRef(null);
  const statsRef = useRef([]);
  const pillarsRef = useRef([]);
  const scrollIndRef = useRef(null);
  const ring1Ref = useRef(null);
  const ring2Ref = useRef(null);
  const gridRef = useRef(null);
  const separatorRef = useRef(null);
  const scrollBadgeRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    /* ── BG elements ── */
    gsap.fromTo(
      gridRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 2, ease: "power1.out" },
    );
    gsap.fromTo(
      ring1Ref.current,
      { scale: 0.6, opacity: 0 },
      { scale: 1, opacity: 1, duration: 2.2, ease: "expo.out", delay: 0.2 },
    );
    gsap.fromTo(
      ring2Ref.current,
      { scale: 0.3, opacity: 0 },
      { scale: 1, opacity: 0.5, duration: 2.6, ease: "expo.out", delay: 0.4 },
    );
    // Slow drift on rings
    gsap.to(ring1Ref.current, {
      rotate: 360,
      duration: 30,
      ease: "none",
      repeat: -1,
      transformOrigin: "center",
    });
    gsap.to(ring2Ref.current, {
      rotate: -360,
      duration: 50,
      ease: "none",
      repeat: -1,
      transformOrigin: "center",
    });

    /* ── Eyebrow tag ── */
    tl.fromTo(
      eyebrowRef.current,
      { opacity: 0, y: -16, letterSpacing: "0.6em" },
      { opacity: 1, y: 0, letterSpacing: "0.35em", duration: 1.0 },
      0.3,
    );

    /* ── Headline lines: staggered clip reveal ── */
    [headLine1Ref, headLine2Ref, headLine3Ref].forEach((ref, i) => {
      tl.fromTo(
        ref.current,
        { opacity: 0, y: 48, skewY: 3 },
        { opacity: 1, y: 0, skewY: 0, duration: 0.95, ease: "expo.out" },
        0.55 + i * 0.18,
      );
    });

    /* ── Separator line draw ── */
    tl.fromTo(
      separatorRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 1.1, ease: "expo.inOut" },
      1.1,
    );

    /* ── Tagline ── */
    tl.fromTo(
      taglineRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.9 },
      1.3,
    );

    /* ── CTA ── */
    tl.fromTo(
      ctaRef.current?.querySelectorAll("a") || [],
      { opacity: 0, y: 24, scale: 0.92 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: "back.out(1.6)",
        stagger: 0.12,
      },
      1.55,
    );

    /* ── Scroll badge ── */
    tl.fromTo(
      scrollBadgeRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.6 },
      2.1,
    );

    /* ── Stats: scroll-triggered stagger ── */
    if (statsRef.current.length) {
      gsap.fromTo(
        statsRef.current.filter(Boolean),
        { opacity: 0, y: 40, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "back.out(1.4)",
          stagger: 0.1,
          scrollTrigger: {
            trigger: statsRef.current[0],
            start: "top 88%",
            toggleActions: "play none none none",
          },
        },
      );
    }

    /* ── Pillars: scroll-triggered horizontal slide ── */
    if (pillarsRef.current.length) {
      gsap.fromTo(
        pillarsRef.current.filter(Boolean),
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.13,
          scrollTrigger: {
            trigger: pillarsRef.current[0],
            start: "top 86%",
            toggleActions: "play none none none",
          },
        },
      );
    }

    /* ── Scroll indicator float loop ── */
    if (scrollIndRef.current) {
      gsap.to(scrollIndRef.current, {
        y: 10,
        duration: 1.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }

    /* ── Parallax on BG rings as user scrolls ── */
    gsap.to([ring1Ref.current, ring2Ref.current], {
      y: -120,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 2,
      },
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor: "#080c14",
        paddingTop: 100,
        paddingBottom: 80,
      }}
    >
      {/* ── Background: photo + dark overlay ── */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1600"
          alt=""
          aria-hidden="true"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.07,
            filter: "grayscale(100%) contrast(1.2)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, #080c14 0%, rgba(8,12,20,0.6) 40%, rgba(8,12,20,0.85) 70%, #080c14 100%)",
          }}
        />
      </div>

      {/* ── Grid texture ── */}
      <div
        ref={gridRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          backgroundImage: `
          linear-gradient(rgba(180,150,40,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(180,150,40,0.04) 1px, transparent 1px)
        `,
          backgroundSize: "48px 48px",
          pointerEvents: "none",
        }}
      />

      {/* ── Ambient rings ── */}
      <div
        ref={ring1Ref}
        style={{
          position: "absolute",
          zIndex: 1,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 700,
          height: 700,
          borderRadius: "50%",
          border: "1px solid rgba(180,140,30,0.12)",
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(180,140,30,0.02) 20px, rgba(180,140,30,0.02) 21px)",
          pointerEvents: "none",
        }}
      />
      <div
        ref={ring2Ref}
        style={{
          position: "absolute",
          zIndex: 1,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 1000,
          height: 1000,
          borderRadius: "50%",
          border: "1px dashed rgba(180,140,30,0.08)",
          pointerEvents: "none",
        }}
      />

      {/* ── Ambient glow ── */}
      <div
        style={{
          position: "absolute",
          zIndex: 1,
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 500,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(180,140,30,0.1) 0%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      {/* ── Main content ── */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 880,
          margin: "0 auto",
          padding: "0 28px",
          textAlign: "center",
          width: "100%",
        }}
      >
        {/* Eyebrow */}
        <div
          ref={eyebrowRef}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 36,
            fontSize: 11,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "rgba(180,140,30,0.6)",
            fontFamily: "monospace",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 28,
              height: 1,
              background: "rgba(180,140,30,0.4)",
            }}
          />
          College of Computing &amp; IT · Makerere University · 2026
          <span
            style={{
              display: "inline-block",
              width: 28,
              height: 1,
              background: "rgba(180,140,30,0.4)",
            }}
          />
        </div>

        {/* Headline */}
        <div style={{ marginBottom: 8, overflow: "hidden" }}>
          <h1
            ref={headLine1Ref}
            style={{
              fontSize: "clamp(40px, 7vw, 80px)",
              fontWeight: 800,
              fontFamily: "'Georgia', serif",
              color: "#e8dfc8",
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              margin: 0,
            }}
          >
            Track. Evaluate.
          </h1>
        </div>
        <div style={{ marginBottom: 8, overflow: "hidden" }}>
          <h1
            ref={headLine2Ref}
            style={{
              fontSize: "clamp(40px, 7vw, 80px)",
              fontWeight: 800,
              fontFamily: "'Georgia', serif",
              color: "#c9a227",
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              margin: 0,
              textShadow: "0 0 60px rgba(180,140,30,0.35)",
            }}
          >
            Excel.
          </h1>
        </div>
        <div style={{ marginBottom: 36, overflow: "hidden" }}>
          <p
            ref={headLine3Ref}
            style={{
              fontSize: "clamp(16px, 2.2vw, 24px)",
              fontFamily: "'Georgia', serif",
              fontStyle: "italic",
              color: "rgba(232,223,200,0.5)",
              lineHeight: 1.4,
              margin: 0,
              letterSpacing: "0.01em",
            }}
          >
            — Internship Logging &amp; Evaluation System
          </p>
        </div>

        {/* Separator */}
        <div
          ref={separatorRef}
          style={{
            height: 1,
            maxWidth: 340,
            margin: "0 auto 32px",
            background:
              "linear-gradient(to right, transparent, #c9a227 30%, #c9a227 70%, transparent)",
            transformOrigin: "center",
          }}
        />

        {/* Tagline */}
        <p
          ref={taglineRef}
          style={{
            fontSize: "clamp(14px, 1.6vw, 17px)",
            color: "rgba(232,223,200,0.6)",
            lineHeight: 1.85,
            maxWidth: 620,
            margin: "0 auto 44px",
            letterSpacing: "0.01em",
          }}
        >
          ILES is a full-stack workflow platform built for Makerere University's
          internship programme. It connects students with their supervisors and
          academic coordinators — enabling structured logbook submissions,
          real-time review, and transparent grade computation across every
          placement cycle.
        </p>

        {/* CTA */}
        <div
          ref={ctaRef}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 14,
            justifyContent: "center",
            marginBottom: 64,
          }}
        >
          <a
            href="/login"
            style={{
              padding: "15px 38px",
              background: "#c9a227",
              color: "#080c14",
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textDecoration: "none",
              borderRadius: 2,
              fontFamily: "Georgia, serif",
              boxShadow: "0 4px 24px rgba(180,140,30,0.35)",
              transition: "all 0.22s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#e8c84a";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 8px 32px rgba(180,140,30,0.5)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#c9a227";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 24px rgba(180,140,30,0.35)";
            }}
          >
            Get Started
          </a>
          <a
            href="#modules"
            style={{
              padding: "15px 38px",
              background: "transparent",
              color: "#c9a227",
              fontWeight: 600,
              fontSize: 14,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textDecoration: "none",
              borderRadius: 2,
              border: "1px solid rgba(180,140,30,0.4)",
              fontFamily: "Georgia, serif",
              transition: "all 0.22s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(180,140,30,0.08)";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
              e.target.style.transform = "translateY(0)";
            }}
          >
            Explore System
          </a>
          <a
            href="/signup"
            style={{
              padding: "15px 38px",
              background: "transparent",
              color: "rgba(232,223,200,0.5)",
              fontWeight: 500,
              fontSize: 14,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
              borderRadius: 2,
              border: "1px solid rgba(232,223,200,0.1)",
              fontFamily: "Georgia, serif",
              transition: "all 0.22s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.color = "#e8dfc8";
              e.target.style.borderColor = "rgba(232,223,200,0.28)";
            }}
            onMouseLeave={(e) => {
              e.target.style.color = "rgba(232,223,200,0.5)";
              e.target.style.borderColor = "rgba(232,223,200,0.1)";
            }}
          >
            Create Account
          </a>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 1,
            maxWidth: 760,
            margin: "0 auto 80px",
            border: "1px solid rgba(180,140,30,0.15)",
            borderRadius: 4,
            overflow: "hidden",
            background: "rgba(180,140,30,0.06)",
          }}
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              ref={(el) => (statsRef.current[i] = el)}
              style={{
                padding: "28px 20px",
                textAlign: "center",
                borderRight:
                  i < stats.length - 1
                    ? "1px solid rgba(180,140,30,0.1)"
                    : "none",
                background: "rgba(8,12,20,0.6)",
                backdropFilter: "blur(12px)",
                transition: "background 0.25s",
                cursor: "default",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(180,140,30,0.06)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(8,12,20,0.6)")
              }
            >
              <div
                style={{
                  fontSize: "clamp(26px, 3.5vw, 36px)",
                  fontWeight: 800,
                  color: "#c9a227",
                  fontFamily: "Georgia, serif",
                  letterSpacing: "-0.01em",
                  textShadow: "0 0 20px rgba(180,140,30,0.3)",
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "rgba(232,223,200,0.75)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginTop: 4,
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(232,223,200,0.35)",
                  letterSpacing: "0.05em",
                  marginTop: 3,
                  fontStyle: "italic",
                }}
              >
                {s.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Workflow pillars */}
        <div
          style={{
            maxWidth: 760,
            margin: "0 auto 20px",
            textAlign: "left",
          }}
        >
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "rgba(180,140,30,0.4)",
              fontFamily: "monospace",
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span>The ILES workflow</span>
            <div
              style={{
                flex: 1,
                height: 1,
                background: "rgba(180,140,30,0.12)",
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 12,
            }}
          >
            {pillars.map((p, i) => (
              <div
                key={p.code}
                ref={(el) => (pillarsRef.current[i] = el)}
                style={{
                  padding: "20px 18px",
                  border: "1px solid rgba(180,140,30,0.13)",
                  borderRadius: 2,
                  background: "rgba(14,20,32,0.8)",
                  backdropFilter: "blur(10px)",
                  transition: "border-color 0.25s, transform 0.25s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(180,140,30,0.45)";
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(180,140,30,0.13)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.25em",
                    color: "rgba(180,140,30,0.45)",
                    fontFamily: "monospace",
                    marginBottom: 8,
                  }}
                >
                  {p.code}
                </div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    fontFamily: "Georgia, serif",
                    color: "#e8c84a",
                    marginBottom: 6,
                  }}
                >
                  {p.title}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "rgba(232,223,200,0.5)",
                    lineHeight: 1.6,
                  }}
                >
                  {p.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollBadgeRef}
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          zIndex: 2,
          cursor: "default",
        }}
      >
        <span
          style={{
            fontSize: 9,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "rgba(180,140,30,0.35)",
            fontFamily: "monospace",
          }}
        >
          Scroll
        </span>
        <div
          ref={scrollIndRef}
          style={{
            width: 1,
            height: 40,
            background:
              "linear-gradient(to bottom, rgba(180,140,30,0.5), transparent)",
          }}
        />
      </div>
    </section>
  );
};

export default HeroSection;
