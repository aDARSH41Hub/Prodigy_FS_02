import { useEffect, useState } from "react";

const emptyForm = {
  name: "",
  email: "",
  position: "",
  department: "",
  salary: "",
};

export default function EmployeeDrawer({ open, onClose, onSubmit, editingEmployee, error }) {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingEmployee) {
      setForm({
        name: editingEmployee.name || "",
        email: editingEmployee.email || "",
        position: editingEmployee.position || "",
        department: editingEmployee.department || "",
        salary: editingEmployee.salary ?? "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingEmployee, open]);

  if (!open) return null;

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await onSubmit({ ...form, salary: Number(form.salary) });
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <button
        aria-label="Close panel"
        onClick={onClose}
        className="absolute inset-0 bg-ink/30 backdrop-blur-[1px]"
      />

      <div className="relative z-50 flex h-full w-full max-w-md flex-col border-l border-line bg-surface shadow-2xl animate-[slidein_0.2s_ease-out]">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted">Employee details</p>
            <h2 className="mt-2 text-lg font-semibold text-ink">
              {editingEmployee ? "Edit employee" : "Add employee"}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-2xl px-3 py-2 text-muted transition hover:bg-canvas"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col justify-between overflow-y-auto">
          <div className="space-y-5 px-6 py-6">
            {error && (
              <div className="rounded-2xl border border-danger/30 bg-danger-light px-4 py-3 text-sm text-danger">
                {error}
              </div>
            )}

            <Field label="Full name">
              <input
                required
                value={form.name}
                onChange={handleChange("name")}
                className="input"
                placeholder="Priya Sharma"
              />
            </Field>

            <Field label="Email">
              <input
                required
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                className="input"
                placeholder="priya.sharma@company.com"
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Position">
                <input
                  required
                  value={form.position}
                  onChange={handleChange("position")}
                  className="input"
                  placeholder="Software Engineer"
                />
              </Field>

              <Field label="Department">
                <input
                  required
                  value={form.department}
                  onChange={handleChange("department")}
                  className="input"
                  placeholder="Engineering"
                />
              </Field>
            </div>

            <Field label="Salary (annual)">
              <input
                required
                type="number"
                min="0"
                value={form.salary}
                onChange={handleChange("salary")}
                className="input font-mono"
                placeholder="65000"
              />
            </Field>
          </div>

          <div className="flex gap-3 border-t border-line px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-line py-3 text-sm font-medium text-ink transition hover:bg-canvas"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-2xl bg-accent py-3 text-sm font-semibold text-white transition hover:bg-accent-dark disabled:opacity-60"
            >
              {submitting ? "Saving…" : editingEmployee ? "Save changes" : "Add employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}
