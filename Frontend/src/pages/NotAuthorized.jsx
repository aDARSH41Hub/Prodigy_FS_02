import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NotAuthorized() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4 py-10">
      <div className="w-full max-w-md rounded-[2rem] border border-line bg-white/95 p-10 shadow-2xl shadow-slate-200/40 text-center">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-danger-light text-lg font-semibold text-danger">
          !
        </div>
        <h1 className="text-2xl font-semibold text-ink">Admin access required</h1>
        <p className="mt-4 text-sm leading-6 text-muted">
          Your account doesn't have permission to manage employee records. Ask an existing admin to promote your account, then sign in again.
        </p>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="mt-7 rounded-2xl border border-line bg-surface px-5 py-3 text-sm font-medium text-ink transition hover:bg-canvas"
        >
          Back to sign in
        </button>
      </div>
    </div>
  );
}
