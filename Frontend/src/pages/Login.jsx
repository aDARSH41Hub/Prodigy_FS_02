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
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-accent font-display text-base font-semibold text-white">
            E
          </div>
          <h1 className="font-display text-xl font-semibold text-ink">Employee Console</h1>
          <p className="mt-1 text-sm text-muted">Sign in with your admin account</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-lg border border-line bg-surface p-6 shadow-sm">
          {error && (
            <div className="mb-4 rounded-md border border-danger/30 bg-danger-light px-3 py-2 text-sm text-danger">
              {error}
            </div>
          )}

          <label className="mb-4 block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
              Email
            </span>
            <input
              required
              type="email"
              className="input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@company.com"
            />
          </label>

          <label className="mb-6 block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
              Password
            </span>
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
            className="w-full rounded-md bg-accent py-2.5 text-sm font-medium text-white hover:bg-accent-dark disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium text-accent hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
