import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = (user?.name || user?.email || "?")
    .trim()
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <aside className="flex h-screen w-72 flex-col justify-between border-r border-line bg-surface px-6 py-7">
      <div>
        <div className="mb-12 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[1.25rem] bg-accent text-lg font-semibold text-white shadow-sm">
            E
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Employee Console</p>
            <p className="mt-1 text-xs uppercase tracking-[0.24em] text-muted">Admin workspace</p>
          </div>
        </div>

        <div className="mb-9 rounded-[1.75rem] border border-line bg-[#F7F8FB] p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.24em] text-muted">Workspace</p>
          <p className="mt-2 text-sm font-semibold text-ink">Staff directory</p>
        </div>

        <nav className="space-y-2">
          <button className="flex w-full items-center gap-3 rounded-[1.5rem] bg-accent-light px-4 py-3 text-sm font-semibold text-accent-dark transition hover:bg-accent/80 hover:text-white">
            <span className="h-2.5 w-2.5 rounded-full bg-accent" />
            Employees
          </button>
        </nav>
      </div>

      <div className="rounded-[1.75rem] border border-line bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{user?.name || "Admin"}</p>
            <p className="truncate text-xs text-muted">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="w-full rounded-2xl border border-line px-3 py-2 text-sm font-medium text-ink transition hover:border-danger hover:text-danger"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
