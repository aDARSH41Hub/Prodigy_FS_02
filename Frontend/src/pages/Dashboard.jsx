import { useEffect, useState, useMemo, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import EmployeeDrawer from "../components/EmployeeDrawer";
import ConfirmDialog from "../components/ConfirmDialog";
import { employeeApi } from "../api/endpoints";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formError, setFormError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchEmployees = useCallback(async (page = 1, searchTerm = "") => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await employeeApi.list({ page, limit: 8, search: searchTerm });
      const body = res.data;
      setEmployees(body.data);
      setMeta({ page: body.page, pages: body.pages || 1, total: body.total });
    } catch (err) {
      setLoadError(err.response?.data?.message || "Could not load employees");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees(1, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => fetchEmployees(1, search), 350);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const departments = useMemo(
    () => new Set(employees.map((emp) => emp.department).filter(Boolean)).size,
    [employees]
  );

  const averageSalary = useMemo(() => {
    if (!employees.length) return "$0";
    const total = employees.reduce((sum, emp) => sum + Number(emp.salary || 0), 0);
    return currency.format(Math.round(total / employees.length));
  }, [employees]);

  const openCreate = () => {
    setEditingEmployee(null);
    setFormError("");
    setDrawerOpen(true);
  };

  const openEdit = (employee) => {
    setEditingEmployee(employee);
    setFormError("");
    setDrawerOpen(true);
  };

  const handleSubmit = async (form) => {
    try {
      if (editingEmployee) {
        await employeeApi.update(editingEmployee._id, form);
      } else {
        await employeeApi.create(form);
      }
      setDrawerOpen(false);
      fetchEmployees(meta.page, search);
    } catch (err) {
      setFormError(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await employeeApi.remove(deleteTarget._id);
      setDeleteTarget(null);
      const nextPage =
        employees.length === 1 && meta.page > 1 ? meta.page - 1 : meta.page;
      fetchEmployees(nextPage, search);
    } catch (err) {
      setLoadError(err.response?.data?.message || "Could not delete employee");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar />

      <main className="flex-1 px-6 py-8 lg:px-10">
        <section className="mb-6 rounded-[2rem] border border-line bg-white/90 p-6 shadow-sm backdrop-blur-sm sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted">Employee management</p>
              <h1 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">Employees</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                Review all employee records, update profiles, and keep the directory in sync.
              </p>
            </div>

            <button
              onClick={openCreate}
              className="inline-flex items-center justify-center rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-dark"
            >
              + Add employee
            </button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="card p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Total employees</p>
              <p className="mt-3 text-3xl font-semibold text-ink">{meta.total}</p>
            </div>
            <div className="card p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Departments</p>
              <p className="mt-3 text-3xl font-semibold text-ink">{departments}</p>
            </div>
            <div className="card p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Avg. salary</p>
              <p className="mt-3 text-3xl font-semibold text-ink">{averageSalary}</p>
            </div>
          </div>
        </section>

        <div className="mb-4 flex flex-col gap-4 rounded-[1.75rem] border border-line bg-surface p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-ink">Search employees</p>
            <p className="mt-1 text-sm text-muted">Filter by name, email, or department.</p>
          </div>
          <input
            className="input max-w-xs"
            placeholder="Search by name or department…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loadError && (
          <div className="mb-4 rounded-3xl border border-danger/30 bg-danger-light px-4 py-3 text-sm text-danger shadow-sm">
            {loadError}
          </div>
        )}

        <div className="overflow-hidden rounded-[1.75rem] border border-line bg-surface shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-canvas text-xs uppercase tracking-wide text-muted">
                <th className="px-5 py-4 font-medium">Name</th>
                <th className="px-5 py-4 font-medium">Position</th>
                <th className="px-5 py-4 font-medium">Department</th>
                <th className="px-5 py-4 font-medium">Salary</th>
                <th className="px-5 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center text-sm text-muted">
                    Loading employees…
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center text-sm text-muted">
                    {search ? "No employees match your search." : "No employees yet — add your first one."}
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp._id} className="border-b border-line last:border-0 hover:bg-canvas/70">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-ink">{emp.name}</p>
                      <p className="mt-1 text-xs text-muted">{emp.email}</p>
                    </td>
                    <td className="px-5 py-4 text-ink">{emp.position}</td>
                    <td className="px-5 py-4">
                      <span className="badge">{emp.department}</span>
                    </td>
                    <td className="px-5 py-4 font-mono text-ink">{currency.format(emp.salary)}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(emp)}
                          className="rounded-2xl border border-line px-3 py-2 text-xs font-medium text-ink transition hover:bg-canvas"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(emp)}
                          className="rounded-2xl border border-line px-3 py-2 text-xs font-medium text-danger transition hover:border-danger hover:bg-danger-light"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {meta.pages > 1 && (
          <div className="mt-5 flex flex-col gap-3 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
            <span>
              Page {meta.page} of {meta.pages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={meta.page <= 1}
                onClick={() => fetchEmployees(meta.page - 1, search)}
                className="rounded-2xl border border-line px-4 py-2 font-medium text-ink transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={meta.page >= meta.pages}
                onClick={() => fetchEmployees(meta.page + 1, search)}
                className="rounded-2xl border border-line px-4 py-2 font-medium text-ink transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>

      <EmployeeDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleSubmit}
        editingEmployee={editingEmployee}
        error={formError}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete employee?"
        description={
          deleteTarget ? `This permanently removes ${deleteTarget.name}'s record. This can't be undone.` : ""
        }
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        busy={deleting}
      />
    </div>
  );
}
