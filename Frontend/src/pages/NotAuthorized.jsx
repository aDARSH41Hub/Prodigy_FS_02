import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NotAuthorized() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-canvas px-4 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-danger-light font-display text-base font-semibold text-danger">
        !
      </div>
      <h1 className="font-display text-lg font-semibold text-ink">Admin access required</h1>
      <p className="max-w-sm text-sm text-muted">
        Your account doesn't have permission to manage employee records. Ask an existing admin to
        promote your account, then sign in again.
      </p>
      <button
        onClick={() => {
          logout();
          navigate("/login");
        }}
        className="mt-2 rounded-md border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-surface"
      >
        Back to sign in
      </button>
    </div>
  );
}
