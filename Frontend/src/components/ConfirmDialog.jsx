export default function ConfirmDialog({ open, title, description, onConfirm, onCancel, busy }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        aria-label="Dismiss"
        onClick={onCancel}
        className="absolute inset-0 bg-ink/30 backdrop-blur-[1px]"
      />
      <div className="relative z-10 w-full max-w-sm rounded-lg border border-line bg-surface p-6 shadow-xl">
        <h3 className="font-display text-base font-semibold text-ink">{title}</h3>
        <p className="mt-2 text-sm text-muted">{description}</p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-md border border-line py-2 text-sm font-medium text-ink hover:bg-canvas"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className="flex-1 rounded-md bg-danger py-2 text-sm font-medium text-white hover:bg-danger/90 disabled:opacity-60"
          >
            {busy ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
