import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const sections = [
  {
    title: "What is ILES?",
    content:
      "ILES (Internship Logging & Evaluation System) is a full-stack, workflow-driven platform for managing every aspect of the internship lifecycle. It empowers students, supervisors, academics, and administrators to collaborate efficiently, track progress, and ensure quality outcomes.",
  },
  {
    title: "Key Features",
    content: (
      <ul className="list-disc list-inside ml-4">
        <li>
          Role-based dashboards for Students, Supervisors, Academics, Admins
        </li>
        <li>Secure authentication and RBAC</li>
        <li>Internship placement management with validation</li>
        <li>Weekly logbook workflow with deadlines</li>
        <li>Supervisor and academic review interfaces</li>
        <li>Automated weighted score computation</li>
        <li>Aggregated dashboards and reporting</li>
        <li>Modern, responsive, award-winning UI/UX</li>
      </ul>
    ),
  },
  {
    title: "Core Modules",
    content: (
      <ol className="list-decimal list-inside ml-4">
        <li>User & Role Management</li>
        <li>Internship Placement</li>
        <li>Weekly Logbook</li>
        <li>Supervisor Review</li>
        <li>Academic Evaluation</li>
        <li>Score Computation</li>
        <li>Dashboards & Reporting</li>
      </ol>
    ),
  },
  {
    title: "User Roles",
    content: (
      <ul className="list-disc list-inside ml-4">
        <li>
          <b>Student Intern:</b> Submit weekly logbooks, track placement
          progress, and view evaluation scores in real-time.
        </li>
        <li>
          <b>Workplace Supervisor:</b> Review student logs, provide feedback,
          approve submissions, and submit workplace evaluations.
        </li>
        <li>
          <b>Academic Supervisor:</b> Monitor student progress, review logbooks,
          and submit academic evaluation scores.
        </li>
        <li>
          <b>Internship Administrator:</b> Manage placements, assign
          supervisors, oversee evaluations, and generate reports.
        </li>
      </ul>
    ),
  },
  {
    title: "Technology Stack",
    content:
      "Frontend: React + Tailwind CSS + GSAP | Backend: Django + DRF | Database: PostgreSQL | Auth: JWT | Charts: Recharts",
  },
  {
    title: "Lecturer & Course",
    content:
      "CSC 1202: Software Development Project (2026) | Lecturer: Dr. Peter Khisa Wakholi (pwakholi@cit.ac.ug)",
  },
];

const Overview = () => {
  const sectionRefs = useRef([]);

  useEffect(() => {
    sectionRefs.current.forEach((ref, idx) => {
      if (ref) {
        gsap.fromTo(
          ref,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: idx * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ref,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gold/10 via-blue-100/10 to-pink-100/10 text-foreground py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-10 text-center text-gold drop-shadow-lg">
          Website Overview
        </h1>
        {sections.map((section, idx) => (
          <section
            key={section.title}
            ref={(el) => (sectionRefs.current[idx] = el)}
            className="mb-12 p-8 rounded-3xl bg-white/80 dark:bg-black/60 shadow-xl backdrop-blur-lg border border-gold/20"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gold drop-shadow">
              {section.title}
            </h2>
            <div className="text-lg text-gray-700 dark:text-gray-200">
              {section.content}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default Overview;
