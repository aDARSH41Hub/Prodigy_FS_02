import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const profile = await login(form.email, form.password);
      if (profile.role === "admin") {
        navigate("/employees");
      } else {
        navigate("/not-authorized");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
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
            <h1 className="text-3xl font-semibold text-ink">Employee Console</h1>
            <p className="mt-2 text-sm leading-6 text-muted">Sign in with your admin account to manage teams.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-2xl border border-danger/30 bg-danger-light px-4 py-3 text-sm text-danger">
                {error}
              </div>
            )}

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
                className="input"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-accent py-3 text-sm font-semibold text-white transition hover:bg-accent-dark disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium text-accent hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
