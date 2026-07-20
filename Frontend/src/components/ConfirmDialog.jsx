export default function ConfirmDialog({ open, title, description, onConfirm, onCancel, busy }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <button
        aria-label="Dismiss"
        onClick={onCancel}
        className="absolute inset-0 bg-ink/30 backdrop-blur-[1px]"
      />
      <div className="relative z-10 w-full max-w-sm rounded-[1.75rem] border border-line bg-surface p-6 shadow-2xl">
        <div className="mb-4 inline-flex items-center rounded-2xl bg-danger-light px-3 py-2 text-sm font-semibold text-danger">
          Delete confirmation
        </div>
        <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-2xl border border-line py-3 text-sm font-medium text-ink transition hover:bg-canvas"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className="flex-1 rounded-2xl bg-danger py-3 text-sm font-semibold text-white transition hover:bg-danger/90 disabled:opacity-60"
          >
            {busy ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
