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
export default function LandingPage() {
  const heroRef       = useRef(null);
  const modulesHdRef  = useRef(null);
  const modulesBdRef  = useRef(null);
  const modulesRef    = useRef(null);
  const rolesHdRef    = useRef(null);
  const rolesBdRef    = useRef(null);
  const rolesRef      = useRef(null);
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



