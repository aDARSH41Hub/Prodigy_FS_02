import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1400);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-10 rounded-[2rem] border border-line bg-white/95 p-8 shadow-2xl shadow-slate-200/50">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-[1.5rem] bg-accent text-lg font-semibold text-white shadow-sm">
              E
            </div>
            <h1 className="text-3xl font-semibold text-ink">Create an account</h1>
            <p className="mt-2 text-sm leading-6 text-muted">
              New users start as standard users. Ask an admin to grant elevated access.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-2xl border border-danger/30 bg-danger-light px-4 py-3 text-sm text-danger">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-2xl border border-success/30 bg-success-light px-4 py-3 text-sm text-success">
                Account created — redirecting to sign in…
              </div>
            )}

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-muted">Full name</span>
              <input
                required
                className="input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Adarsh Pratap Singh"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-muted">Email</span>
              <input
                required
                type="email"
                className="input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@company.com"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-muted">Password</span>
              <input
                required
                type="password"
                minLength={6}
                className="input"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="At least 6 characters"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-accent py-3 text-sm font-semibold text-white transition hover:bg-accent-dark disabled:opacity-60"
            >
              {loading ? "Creating…" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-accent hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
