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
    <aside className="flex h-screen w-64 flex-col justify-between border-r border-line bg-surface px-5 py-6">
      <div>
        <div className="mb-10 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent font-display text-sm font-semibold text-white">
            E
          </div>
          <div>
            <p className="font-display text-sm font-semibold leading-none text-ink">
              Employee Console
            </p>
            <p className="mt-1 font-mono text-[11px] text-muted">Task 2 · Admin</p>
          </div>
        </div>

        <nav className="space-y-1">
          <div className="flex items-center gap-2 rounded-md bg-accent-light px-3 py-2 text-sm font-medium text-accent-dark">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Employees
          </div>
        </nav>
      </div>

      <div className="border-t border-line pt-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink font-display text-xs font-semibold text-white">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">
              {user?.name || "Admin"}
            </p>
            <p className="truncate text-xs text-muted">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="w-full rounded-md border border-line px-3 py-2 text-sm font-medium text-muted transition-colors hover:border-danger hover:text-danger"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
