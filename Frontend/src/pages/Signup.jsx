import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signup(form.name, form.email, form.password);
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">

        {/* =========================================================
            BRAND PANEL
        ========================================================= */}
        <section className="relative hidden overflow-hidden lg:flex">

          {/* Background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.45),transparent_35%),radial-gradient(circle_at_80%_75%,rgba(59,130,246,0.3),transparent_35%),linear-gradient(135deg,#0f172a,#172554_55%,#312e81)]" />

          {/* Geometric elements */}
          <div className="absolute -left-32 top-24 h-72 w-72 rounded-full border border-white/10" />

          <div className="absolute -left-20 top-36 h-48 w-48 rounded-full border border-white/10" />

          <div className="absolute right-[-80px] top-[-80px] h-80 w-80 rotate-45 rounded-[4rem] border border-indigo-300/20 bg-indigo-400/5 backdrop-blur-3xl" />

          <div className="absolute bottom-[-120px] right-20 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

          {/* Content */}
          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

            {/* Logo + Brand */}
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 p-2 ring-1 ring-white/15 backdrop-blur-md">
                  <img
                    src="/paradox-logo.png"
                    alt="PARADOX"
                    className="h-full w-full object-contain"
                  />
                </div>

                <span className="text-lg font-bold tracking-[0.18em]">
                  PARADOX
                </span>
              </div>

              {/* Hero */}
              <div className="mt-24 max-w-xl">
                <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-200">
                  Workforce Intelligence Platform
                </p>

                <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-0.04em] xl:text-6xl">
                  Build.
                  <br />
                  Connect.
                  <br />
                  <span className="text-indigo-300">
                    Grow together.
                  </span>
                </h1>

                <p className="mt-7 max-w-md text-base leading-7 text-slate-300">
                  Create your workspace account and bring your
                  organization's workforce operations into one focused
                  platform.
                </p>
              </div>
            </div>

            {/* Bottom status */}
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Built for modern workforce operations
            </div>
          </div>
        </section>

        {/* =========================================================
            SIGNUP PANEL
        ========================================================= */}
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-5 py-10 text-slate-900 sm:px-8">

          {/* Background glow */}
          <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />

          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-blue-200/30 blur-3xl" />

          <div className="relative z-10 w-full max-w-md">

            {/* Mobile logo */}
            <div className="mb-12 lg:hidden">
              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 p-2">
                  <img
                    src="/paradox-logo.png"
                    alt="PARADOX"
                    className="h-full w-full object-contain"
                  />
                </div>

                <span className="text-lg font-bold tracking-[0.18em]">
                  PARADOX
                </span>
              </div>
            </div>

            {/* Heading */}
            <div className="mb-9">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600">
                Workforce Console
              </p>

              <h2 className="text-4xl font-semibold tracking-[-0.035em] text-slate-950">
                Create your account.
              </h2>

              <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
                Set up your PARADOX workspace account to get started.
              </p>
            </div>

            {/* Signup form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Error */}
              {error && (
                <div
                  role="alert"
                  className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
                >
                  {error}
                </div>
              )}

              {/* Name */}
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Full name
                </span>

                <input
                  required
                  type="text"
                  autoComplete="name"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  placeholder="Your full name"
                />
              </label>

              {/* Email */}
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Email
                </span>

                <input
                  required
                  type="email"
                  autoComplete="email"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  placeholder="you@company.com"
                />
              </label>

              {/* Password */}
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Password
                </span>

                <input
                  required
                  type="password"
                  autoComplete="new-password"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  placeholder="Create a password"
                />
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account…" : "Create account"}

                {!loading && (
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                )}
              </button>
            </form>

            {/* Login link */}
            <p className="mt-8 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-indigo-600 transition hover:text-indigo-800"
              >
                Sign in
              </Link>
            </p>

            {/* Footer */}
            <p className="mt-10 text-center text-[11px] uppercase tracking-[0.2em] text-slate-400">
              PARADOX · Workforce Intelligence
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}