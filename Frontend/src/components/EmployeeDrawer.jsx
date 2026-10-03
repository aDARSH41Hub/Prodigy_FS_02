import { useEffect, useState } from "react";

const emptyForm = {
  name: "",
  email: "",
  position: "",
  department: "",
  salary: "",
};

export default function EmployeeDrawer({
  open,
  onClose,
  onSubmit,
  editingEmployee,
  error,
}) {
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
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    await onSubmit({
      ...form,
      salary: Number(form.salary),
    });

    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end">

      {/* BACKDROP */}
      <button
        aria-label="Close panel"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]"
      />

      {/* DRAWER */}
      <div className="relative z-50 flex h-full w-full max-w-lg flex-col border-l border-slate-200 bg-white shadow-2xl animate-[slidein_0.2s_ease-out]">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="border-b border-slate-200 bg-white px-6 py-5">

          <div className="flex items-start justify-between gap-4">

            <div>
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-indigo-500">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                Workforce record
              </div>

              <h2 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-slate-950">
                {editingEmployee
                  ? "Edit employee"
                  : "Add employee"}
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                {editingEmployee
                  ? "Update the employee record and save your changes."
                  : "Create a new employee record for the workforce directory."}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  d="M6 6l12 12M18 6L6 18"
                />
              </svg>
            </button>

          </div>
        </div>

        {/* ======================================================
            FORM
        ====================================================== */}

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >

          <div className="flex-1 overflow-y-auto px-6 py-7">

            {/* ERROR */}
            {error && (
              <div
                role="alert"
                className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold">
                  !
                </span>

                <span>{error}</span>
              </div>
            )}

            {/* FORM INTRO */}
            <div className="mb-6 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-4 w-4"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path
                      strokeLinecap="round"
                      d="M4 21a8 8 0 0116 0"
                    />
                  </svg>
                </div>

                <div>
                  <p className="text-xs font-semibold text-indigo-900">
                    Employee profile
                  </p>

                  <p className="mt-0.5 text-[11px] text-indigo-600/70">
                    Keep workforce information accurate and up to date.
                  </p>
                </div>

              </div>
            </div>

            <div className="space-y-5">

              {/* NAME */}
              <Field label="Full name">
                <input
                  required
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={handleChange("name")}
                  className="drawer-input"
                  placeholder="Priya Sharma"
                />
              </Field>

              {/* EMAIL */}
              <Field label="Email">
                <input
                  required
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange("email")}
                  className="drawer-input"
                  placeholder="priya.sharma@company.com"
                />
              </Field>

              {/* POSITION / DEPARTMENT */}
              <div className="grid gap-5 sm:grid-cols-2">

                <Field label="Position">
                  <input
                    required
                    type="text"
                    value={form.position}
                    onChange={handleChange("position")}
                    className="drawer-input"
                    placeholder="Software Engineer"
                  />
                </Field>

                <Field label="Department">
                  <input
                    required
                    type="text"
                    value={form.department}
                    onChange={handleChange("department")}
                    className="drawer-input"
                    placeholder="Engineering"
                  />
                </Field>

              </div>

              {/* SALARY */}
              <Field label="Annual salary">

                <div className="relative">

                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-sm text-slate-400">
                    $
                  </span>

                  <input
                    required
                    type="number"
                    min="0"
                    value={form.salary}
                    onChange={handleChange("salary")}
                    className="drawer-input pl-8 font-mono"
                    placeholder="65000"
                  />

                </div>

                <p className="mt-2 text-[11px] text-slate-400">
                  Enter the employee's annual compensation in USD.
                </p>

              </Field>

            </div>
          </div>

          {/* ====================================================
              FOOTER
          ==================================================== */}

          <div className="border-t border-slate-200 bg-slate-50/80 px-6 py-4">

            <div className="flex gap-3">

              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="flex-1 rounded-xl bg-slate-950 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Saving..."
                  : editingEmployee
                    ? "Save changes"
                    : "Add employee"}
              </button>

            </div>

          </div>
        </form>
      </div>

      {/* DRAWER-SCOPED INPUT STYLE */}
      <style>{`
        .drawer-input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgb(226 232 240);
          background: white;
          padding: 0.75rem 0.875rem;
          font-size: 0.875rem;
          color: rgb(15 23 42);
          outline: none;
          transition: border-color 150ms ease, box-shadow 150ms ease;
        }

        .drawer-input::placeholder {
          color: rgb(148 163 184);
        }

        .drawer-input:focus {
          border-color: rgb(129 140 248);
          box-shadow: 0 0 0 4px rgb(99 102 241 / 0.10);
        }

        .drawer-input:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </span>

      {children}
    </label>
  );
}