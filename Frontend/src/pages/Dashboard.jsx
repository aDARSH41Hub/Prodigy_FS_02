import { useEffect, useState, useCallback } from "react";
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

      <main className="flex-1 px-8 py-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">Employees</h1>
            <p className="mt-1 text-sm text-muted">
              {meta.total} record{meta.total === 1 ? "" : "s"} · admin access
            </p>
          </div>
          <button
            onClick={openCreate}
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dark"
          >
            + Add employee
          </button>
        </div>

        <div className="mb-4">
          <input
            className="input max-w-xs"
            placeholder="Search by name or department…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loadError && (
          <div className="mb-4 rounded-md border border-danger/30 bg-danger-light px-3 py-2 text-sm text-danger">
            {loadError}
          </div>
        )}

        <div className="overflow-hidden rounded-lg border border-line bg-surface">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-canvas text-xs uppercase tracking-wide text-muted">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Position</th>
                <th className="px-5 py-3 font-medium">Department</th>
                <th className="px-5 py-3 font-medium">Salary</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-muted">
                    Loading employees…
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-muted">
                    {search ? "No employees match your search." : "No employees yet — add your first one."}
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp._id} className="border-b border-line last:border-0 hover:bg-canvas/60">
                    <td className="px-5 py-3">
                      <p className="font-medium text-ink">{emp.name}</p>
                      <p className="font-mono text-xs text-muted">{emp.email}</p>
                    </td>
                    <td className="px-5 py-3 text-ink">{emp.position}</td>
                    <td className="px-5 py-3">
                      <span className="rounded-full bg-accent-light px-2.5 py-1 text-xs font-medium text-accent-dark">
                        {emp.department}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-ink">{currency.format(emp.salary)}</td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(emp)}
                          className="rounded-md border border-line px-3 py-1.5 text-xs font-medium text-ink hover:bg-canvas"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(emp)}
                          className="rounded-md border border-line px-3 py-1.5 text-xs font-medium text-danger hover:border-danger hover:bg-danger-light"
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
          <div className="mt-4 flex items-center justify-between text-sm text-muted">
            <span>
              Page {meta.page} of {meta.pages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={meta.page <= 1}
                onClick={() => fetchEmployees(meta.page - 1, search)}
                className="rounded-md border border-line px-3 py-1.5 font-medium text-ink hover:bg-surface disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={meta.page >= meta.pages}
                onClick={() => fetchEmployees(meta.page + 1, search)}
                className="rounded-md border border-line px-3 py-1.5 font-medium text-ink hover:bg-surface disabled:opacity-40"
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
