import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] flex-col border-r border-slate-800 bg-slate-950 text-white lg:flex">

            {/* BRAND */}
            <div className="border-b border-white/10 px-6 py-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 p-2 ring-1 ring-white/10">
                        <img
                            src="/paradox-logo.png"
                            alt="PARADOX"
                            className="h-full w-full object-contain"
                        />
                    </div>

                    <div>
                        <div className="text-sm font-bold tracking-[0.18em]">
                            PARADOX
                        </div>

                        <div className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.18em] text-slate-500">
                            Workforce Intelligence
                        </div>
                    </div>
                </div>
            </div>

            {/* WORKSPACE */}
            <div className="px-4 pt-6">
                <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Workspace
                </p>

                <nav className="mt-3 space-y-1">
                    <NavLink
                        to="/employees"
                        className={({ isActive }) =>
                            `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                                isActive
                                    ? "bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-400/10"
                                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <span
                                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                                        isActive
                                            ? "bg-indigo-500/20 text-indigo-300"
                                            : "bg-white/5 text-slate-500 group-hover:text-slate-300"
                                    }`}
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        className="h-4 w-4"
                                    >
                                        <rect
                                            x="3"
                                            y="3"
                                            width="7"
                                            height="7"
                                            rx="1"
                                        />
                                        <rect
                                            x="14"
                                            y="3"
                                            width="7"
                                            height="7"
                                            rx="1"
                                        />
                                        <rect
                                            x="3"
                                            y="14"
                                            width="7"
                                            height="7"
                                            rx="1"
                                        />
                                        <rect
                                            x="14"
                                            y="14"
                                            width="7"
                                            height="7"
                                            rx="1"
                                        />
                                    </svg>
                                </span>

                                <span>Employees</span>
                            </>
                        )}
                    </NavLink>
                </nav>
            </div>

            {/* SPACER */}
            <div className="flex-1" />

            {/* SYSTEM STATUS */}
            <div className="mx-4 mb-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />

                    <span className="text-xs font-medium text-slate-300">
                        System operational
                    </span>
                </div>

                <p className="mt-2 text-[10px] leading-4 text-slate-500">
                    Workforce services are connected and ready.
                </p>
            </div>

            {/* USER / LOGOUT */}
            <div className="border-t border-white/10 p-4">
                <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/[0.03] px-3 py-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-xs font-bold text-white">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-200">
                            {user?.name || "User"}
                        </p>

                        <p className="truncate text-[11px] text-slate-500">
                            {user?.email || "Account"}
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleLogout}
                    className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-300"
                >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-slate-500 transition group-hover:bg-red-500/10 group-hover:text-red-300">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-4 w-4"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10 17l5-5-5-5"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12H3"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 3v18"
                            />
                        </svg>
                    </span>

                    <span>Sign out</span>
                </button>
            </div>
        </aside>
    );
}