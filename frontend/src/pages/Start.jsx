import { Link } from "react-router-dom";

function Start() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,#111827_0,#020617_45%,#000_100%)] p-6 text-slate-50">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
      <div className="pointer-events-none absolute -left-20 top-[18%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_at_center,#22c55e_0,transparent_70%)] opacity-10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-[100px] bottom-[15%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle_at_center,#3b82f6_0,transparent_70%)] opacity-10 blur-[120px]" />

      <div className="relative z-10 w-full max-w-[420px]">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-50">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 bg-clip-text text-transparent">
              ILES
            </span>
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Internship Logging &amp; Evaluation System
          </p>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-slate-500/45 bg-slate-900/95 p-7 shadow-[0_22px_45px_rgba(15,23,42,0.9)] backdrop-blur-xl">
          <p className="text-center text-sm text-slate-400">
            Ready to get started?
          </p>
          <Link
            to="/login"
            className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 px-4 py-3 font-semibold text-slate-900 shadow-[0_18px_40px_rgba(234,179,8,0.45)] transition hover:-translate-y-px"
            style={{ textDecoration: "none" }}
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Start;
