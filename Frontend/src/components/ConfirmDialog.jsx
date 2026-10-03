export default function ConfirmDialog({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  busy,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">

      {/* BACKDROP */}
      <button
        aria-label="Dismiss"
        onClick={onCancel}
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-[3px]"
      />

      {/* DIALOG */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">

        {/* TOP ACCENT */}
        <div className="h-1 w-full bg-gradient-to-r from-red-500 via-rose-500 to-orange-400" />

        <div className="p-6">

          {/* ICON + LABEL */}
          <div className="flex items-start gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v4"
                />

                <path
                  strokeLinecap="round"
                  d="M12 17h.01"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.3 4.6L2.9 17a2 2 0 001.7 3h14.8a2 2 0 001.7-3L13.7 4.6a2 2 0 00-3.4 0z"
                />
              </svg>

            </div>

            <div className="min-w-0">

              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red-500">
                Delete confirmation
              </p>

              <h3 className="mt-1.5 text-lg font-semibold tracking-[-0.025em] text-slate-950">
                {title}
              </h3>

            </div>

          </div>

          {/* DESCRIPTION */}
          <p className="mt-5 rounded-2xl bg-slate-50 px-4 py-3.5 text-sm leading-6 text-slate-500">
            {description}
          </p>

          {/* WARNING */}
          <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-400">

            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />

            This action cannot be undone.

          </div>

          {/* ACTIONS */}
          <div className="mt-6 flex gap-3">

            <button
              type="button"
              onClick={onCancel}
              disabled={busy}
              className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={busy}
              className="flex-1 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/10 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Deleting...
                </span>
              ) : (
                "Delete employee"
              )}
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}