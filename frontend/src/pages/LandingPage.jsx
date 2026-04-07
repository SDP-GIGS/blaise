import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import ModulesSection from "../components/ModulesSection";
import RolesSection from "../components/RolesSection";
import Footer from "../components/Footer";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText"; // optional, gracefully skipped if unavailable

gsap.registerPlugin(ScrollTrigger);
try { gsap.registerPlugin(SplitText); } catch (_) {}

/* ─────────────────────────────────────────────
   Design language matches the SplashScreen:
   Obsidian bg · Gold accent · Serif wordmarks
   Every animation has a deliberate reason.
───────────────────────────────────────────── */

const FEATURES = [
  { icon: "⬡", text: "Role-based dashboards — Student, Supervisor, Academic, Admin" },
  { icon: "⬡", text: "Secure authentication with full RBAC" },
  { icon: "⬡", text: "Internship placement management & validation" },
  { icon: "⬡", text: "Weekly logbook workflow with submission deadlines" },
  { icon: "⬡", text: "Supervisor & academic review interfaces" },
  { icon: "⬡", text: "Automated weighted score computation" },
  { icon: "⬡", text: "Aggregated dashboards and reporting" },
  { icon: "⬡", text: "Responsive, award-worthy UI / UX" },
];

export default function LandingPage() {
  const heroRef       = useRef(null);
  const infoRef       = useRef(null);
  const infoHeadRef   = useRef(null);
  const infoBodyRef   = useRef(null);
  const featuresRef   = useRef([]);
  const dividerRef    = useRef(null);
  const modulesHdRef  = useRef(null);
  const modulesBdRef  = useRef(null);
  const modulesRef    = useRef(null);
  const rolesHdRef    = useRef(null);
  const rolesBdRef    = useRef(null);
  const rolesRef      = useRef(null);
  const ctaRef        = useRef(null);
  const lineRef       = useRef(null);

  useEffect(() => {
    /* ── Helper: scrub-reveal (pin + progress) ── */
    const scrubReveal = (el, vars = {}) =>
      gsap.fromTo(
        el,
        { opacity: 0, y: 60, ...vars.from },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 82%",
            end: "top 50%",
            scrub: 1.4,
            toggleActions: "play none none reverse",
          },
          ...vars.to,
        }
      );

    /* ── Hero: fade up on load, no scroll needed ── */
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.3, ease: "power3.out", delay: 0.1 }
      );
    }

    /* ── Info card: clip-path wipe reveal ── */
    if (infoRef.current) {
      gsap.fromTo(
        infoRef.current,
        { clipPath: "inset(0 100% 0 0)", opacity: 0 },
        {
          clipPath: "inset(0 0% 0 0)",
          opacity: 1,
          duration: 1.2,
          ease: "power4.inOut",
          scrollTrigger: {
            trigger: infoRef.current,
            start: "top 78%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    /* ── Info heading: blur + slide ── */
    if (infoHeadRef.current) {
      gsap.fromTo(
        infoHeadRef.current,
        { opacity: 0, y: 30, filter: "blur(12px)" },
        {
          opacity: 1, y: 0, filter: "blur(0px)",
          duration: 1.0, ease: "expo.out",
          scrollTrigger: {
            trigger: infoHeadRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    /* ── Info body text: simple fade after heading ── */
    if (infoBodyRef.current) {
      gsap.fromTo(
        infoBodyRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          duration: 0.9, ease: "power2.out",
          scrollTrigger: {
            trigger: infoBodyRef.current,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    /* ── Feature items: staggered cascade ── */
    if (featuresRef.current.length) {
      gsap.fromTo(
        featuresRef.current.filter(Boolean),
        { opacity: 0, x: -32, scale: 0.95 },
        {
          opacity: 1, x: 0, scale: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: {
            trigger: featuresRef.current[0],
            start: "top 84%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    /* ── Gold divider line: draw across ── */
    if (dividerRef.current) {
      gsap.fromTo(
        dividerRef.current,
        { scaleX: 0 },
        {
          scaleX: 1, duration: 1.2, ease: "expo.inOut",
          scrollTrigger: {
            trigger: dividerRef.current,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    /* ── CTA buttons: pop up with spring ── */
    if (ctaRef.current) {
      const btns = ctaRef.current.querySelectorAll("a");
      gsap.fromTo(
        btns,
        { opacity: 0, y: 30, scale: 0.88 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.65, ease: "back.out(1.5)",
          stagger: 0.12,
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    /* ── Section heading pairs: split slide ── */
    [[modulesHdRef, modulesBdRef], [rolesHdRef, rolesBdRef]].forEach(([hd, bd]) => {
      if (hd.current) {
        gsap.fromTo(hd.current,
          { opacity: 0, y: 40, letterSpacing: "0.4em" },
          {
            opacity: 1, y: 0, letterSpacing: "0.05em",
            duration: 1.1, ease: "expo.out",
            scrollTrigger: {
              trigger: hd.current,
              start: "top 84%",
              toggleActions: "play none none none",
            },
          }
        );
      }
      if (bd.current) {
        gsap.fromTo(bd.current,
          { opacity: 0, y: 18 },
          {
            opacity: 1, y: 0,
            duration: 0.8, ease: "power2.out",
            scrollTrigger: {
              trigger: bd.current,
              start: "top 84%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    });

    /* ── Modules & Roles sections: parallax lift ── */
    [modulesRef, rolesRef].forEach((ref) => {
      if (!ref.current) return;
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 70 },
        {
          opacity: 1, y: 0,
          duration: 1.0, ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            end: "top 40%",
            scrub: false,
            toggleActions: "play none none none",
          },
        }
      );
    });

    /* ── Parallax: subtle vertical drift on info card ── */
    if (infoRef.current) {
      gsap.to(infoRef.current, {
        y: -30,
        ease: "none",
        scrollTrigger: {
          trigger: infoRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 2,
        },
      });
    }

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#080c14",
        color: "#e8dfc8",
        fontFamily: "'Georgia', 'Times New Roman', serif",
        scrollBehavior: "smooth",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* Global ambient texture */}
      <div style={{
        position: "fixed",
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(180,150,40,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(180,150,40,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* Ambient glow top-left */}
      <div style={{
        position: "fixed",
        top: "-15%", left: "-10%",
        width: "50%", height: "50%",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(180,140,30,0.08) 0%, transparent 70%)",
        filter: "blur(60px)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      <Navbar />

      <main style={{ position: "relative", zIndex: 1 }}>

        {/* ── HERO ── */}
        <section ref={heroRef}>
          <HeroSection />
        </section>

        {/* ── PROJECT INFO CARD ── */}
        <section
          ref={infoRef}
          style={{
            position: "relative",
            maxWidth: 860,
            margin: "80px auto 0",
            padding: "56px 52px",
            borderRadius: "4px",
            background: "rgba(14, 20, 32, 0.92)",
            border: "1px solid rgba(180,140,30,0.25)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 8px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(180,140,30,0.12)",
            overflow: "hidden",
          }}
        >
          {/* Corner accents */}
          {[
            { top: 12, left: 12 },
            { top: 12, right: 12 },
            { bottom: 12, left: 12 },
            { bottom: 12, right: 12 },
          ].map((pos, i) => (
            <div key={i} style={{
              position: "absolute",
              width: 16, height: 16,
              ...pos,
              borderTop: i < 2 ? "1.5px solid rgba(180,140,30,0.5)" : "none",
              borderBottom: i >= 2 ? "1.5px solid rgba(180,140,30,0.5)" : "none",
              borderLeft: i % 2 === 0 ? "1.5px solid rgba(180,140,30,0.5)" : "none",
              borderRight: i % 2 !== 0 ? "1.5px solid rgba(180,140,30,0.5)" : "none",
            }} />
          ))}

          {/* Gold vertical bar */}
          <div style={{
            position: "absolute",
            left: 0, top: 0, bottom: 0,
            width: 3,
            background: "linear-gradient(to bottom, transparent, #c9a227 30%, #c9a227 70%, transparent)",
          }} />

          <h2
            ref={infoHeadRef}
            style={{
              fontSize: "clamp(22px, 3.5vw, 36px)",
              fontWeight: 700,
              letterSpacing: "0.02em",
              color: "#e8c84a",
              marginBottom: 20,
              lineHeight: 1.2,
              textShadow: "0 0 30px rgba(180,140,30,0.3)",
            }}
          >
            Internship Logging &amp; Evaluation System
            <span style={{
              display: "block",
              fontSize: "clamp(10px, 1.2vw, 13px)",
              letterSpacing: "0.3em",
              color: "rgba(180,140,30,0.55)",
              fontWeight: 400,
              marginTop: 8,
              textTransform: "uppercase",
            }}>
              ILES · CSC 1202 Software Development Project · 2026
            </span>
          </h2>

          <p
            ref={infoBodyRef}
            style={{
              fontSize: "clamp(14px, 1.6vw, 17px)",
              color: "rgba(232,223,200,0.75)",
              lineHeight: 1.8,
              marginBottom: 36,
              maxWidth: 680,
            }}
          >
            A full-stack, workflow-driven platform managing every aspect of the
            internship lifecycle. Students, supervisors, academics, and
            administrators collaborate seamlessly — tracking progress, logging
            work, and ensuring quality outcomes through structured evaluation.
          </p>

          {/* Features grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "10px 24px",
            marginBottom: 40,
          }}>
            {FEATURES.map((f, i) => (
              <div
                key={i}
                ref={el => featuresRef.current[i] = el}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: "10px 0",
                  borderBottom: "1px solid rgba(180,140,30,0.08)",
                }}
              >
                <span style={{ color: "#c9a227", fontSize: 12, marginTop: 4, flexShrink: 0 }}>◆</span>
                <span style={{ fontSize: "clamp(12px, 1.3vw, 14px)", color: "rgba(232,223,200,0.72)", lineHeight: 1.5 }}>
                  {f.text}
                </span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div
            ref={dividerRef}
            style={{
              height: 1,
              background: "linear-gradient(to right, #c9a227, rgba(180,140,30,0.1))",
              marginBottom: 32,
              transformOrigin: "left center",
            }}
          />

          {/* CTA buttons */}
          <div ref={ctaRef} style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <a
              href="/signup"
              style={{
                padding: "13px 32px",
                background: "#c9a227",
                color: "#080c14",
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                textDecoration: "none",
                borderRadius: 2,
                transition: "all 0.25s ease",
                boxShadow: "0 4px 20px rgba(180,140,30,0.3)",
              }}
              onMouseEnter={e => { e.target.style.background = "#e8c84a"; e.target.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.target.style.background = "#c9a227"; e.target.style.transform = "translateY(0)"; }}
            >
              Sign Up
            </a>
            <a
              href="#modules"
              style={{
                padding: "13px 32px",
                background: "transparent",
                color: "#c9a227",
                fontWeight: 600,
                fontSize: 14,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                textDecoration: "none",
                borderRadius: 2,
                border: "1px solid rgba(180,140,30,0.45)",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={e => { e.target.style.background = "rgba(180,140,30,0.1)"; e.target.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.transform = "translateY(0)"; }}
            >
              Explore Modules
            </a>
            <a
              href="/overview"
              style={{
                padding: "13px 32px",
                background: "transparent",
                color: "rgba(232,223,200,0.6)",
                fontWeight: 500,
                fontSize: 14,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textDecoration: "none",
                borderRadius: 2,
                border: "1px solid rgba(232,223,200,0.12)",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={e => { e.target.style.color = "#e8dfc8"; e.target.style.borderColor = "rgba(232,223,200,0.3)"; }}
              onMouseLeave={e => { e.target.style.color = "rgba(232,223,200,0.6)"; e.target.style.borderColor = "rgba(232,223,200,0.12)"; }}
            >
              Full Overview
            </a>
          </div>

          <div style={{
            marginTop: 28,
            fontSize: 12,
            color: "rgba(180,140,30,0.4)",
            letterSpacing: "0.15em",
            fontFamily: "monospace",
          }}>
            Lecturer: Dr. Peter Khisa Wakholi ·{" "}
            <a href="mailto:pwakholi@cit.ac.ug" style={{ color: "rgba(180,140,30,0.6)", textDecoration: "none" }}>
              pwakholi@cit.ac.ug
            </a>
          </div>
        </section>

        {/* ── MODULES SECTION ── */}
        <SectionBlock
          id="modules"
          headRef={modulesHdRef}
          bodyRef={modulesBdRef}
          sectionRef={modulesRef}
          label="02 — Core Modules"
          title="Seven Pillars of the Platform"
          body="From user management and placement to logbooks, reviews, scoring, and reporting — each module covers a critical node in the internship journey."
        >
          <ModulesSection />
        </SectionBlock>

        {/* ── ROLES SECTION ── */}
        <SectionBlock
          id="roles"
          headRef={rolesHdRef}
          bodyRef={rolesBdRef}
          sectionRef={rolesRef}
          label="03 — User Roles"
          title="Four Roles, One System"
          body="Student Intern, Workplace Supervisor, Academic Supervisor, and Internship Administrator — each with a tailored dashboard and workflow for maximum clarity."
        >
          <RolesSection />
        </SectionBlock>

      </main>

      <Footer />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Reusable section wrapper with editorial header
───────────────────────────────────────────── */
function SectionBlock({ id, headRef, bodyRef, sectionRef, label, title, body, children }) {
  return (
    <section
      id={id}
      style={{
        marginTop: 100,
        padding: "0 24px",
        position: "relative",
      }}
    >
      {/* Label tag */}
      <div style={{
        maxWidth: 860,
        margin: "0 auto",
        paddingBottom: 12,
        borderBottom: "1px solid rgba(180,140,30,0.15)",
        marginBottom: 32,
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}>
        <span style={{
          fontSize: 10,
          letterSpacing: "0.35em",
          color: "rgba(180,140,30,0.5)",
          textTransform: "uppercase",
          fontFamily: "monospace",
        }}>
          {label}
        </span>
        <div style={{ flex: 1, height: 1, background: "rgba(180,140,30,0.08)" }} />
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto 40px" }}>
        <h3
          ref={headRef}
          style={{
            fontSize: "clamp(26px, 4vw, 44px)",
            fontWeight: 700,
            color: "#e8c84a",
            marginBottom: 14,
            letterSpacing: "0.05em",
            lineHeight: 1.15,
            textShadow: "0 0 30px rgba(180,140,30,0.25)",
          }}
        >
          {title}
        </h3>
        <p
          ref={bodyRef}
          style={{
            fontSize: "clamp(14px, 1.6vw, 17px)",
            color: "rgba(232,223,200,0.65)",
            lineHeight: 1.8,
            maxWidth: 580,
          }}
        >
          {body}
        </p>
      </div>

      <div ref={sectionRef}>
        {children}
      </div>
    </section>
  );
}



