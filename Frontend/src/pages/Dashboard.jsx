import { useCallback, useEffect, useMemo, useState } from "react";
import { employeeApi } from "../api/endpoints";
import EmployeeDrawer from "../components/EmployeeDrawer";
import ConfirmDialog from "../components/ConfirmDialog";
import Sidebar from "../components/Sidebar";

const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(Number(value) || 0);
};

const formatNumber = (value) => {
    return new Intl.NumberFormat("en-IN").format(Number(value) || 0);
};

const formatPercentage = (value) => {
    return `${Number(value) || 0}%`;
};

const getInitials = (name = "") => {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
};

const Dashboard = () => {
    const [employees, setEmployees] = useState([]);
    const [stats, setStats] = useState(null);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({
        total: 0,
        pages: 1,
        count: 0,
    });

    const [loading, setLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(true);
    const [error, setError] = useState("");
    const [statsError, setStatsError] = useState("");

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const limit = 8;

    /*
     * ---------------------------------------------------------
     * SEARCH DEBOUNCE
     * ---------------------------------------------------------
     */
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 350);

        return () => clearTimeout(timer);
    }, [search]);

    /*
     * ---------------------------------------------------------
     * LOAD EMPLOYEES
     * ---------------------------------------------------------
     */
    const loadEmployees = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await employeeApi.list({
                page,
                limit,
                search: debouncedSearch,
            });

            const data = response.data;

            setEmployees(data.data || []);

            setMeta({
                total: data.total || 0,
                pages: data.pages || 1,
                count: data.count || 0,
            });
        } catch (err) {
            setError(
                err.response?.data?.error?.message ||
                    "Unable to load employees."
            );
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearch]);

    /*
     * ---------------------------------------------------------
     * LOAD WORKFORCE STATS
     * ---------------------------------------------------------
     */
    const loadStats = useCallback(async () => {
        try {
            setStatsLoading(true);
            setStatsError("");

            const response = await employeeApi.stats();

            setStats(response.data.data);
        } catch (err) {
            setStatsError(
                err.response?.data?.error?.message ||
                    "Unable to load workforce intelligence."
            );
        } finally {
            setStatsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadEmployees();
    }, [loadEmployees]);

    useEffect(() => {
        loadStats();
    }, [loadStats]);

    /*
     * ---------------------------------------------------------
     * DASHBOARD REFRESH
     * ---------------------------------------------------------
     */
    const refreshDashboard = async () => {
        await Promise.all([
            loadEmployees(),
            loadStats(),
        ]);
    };

    /*
     * ---------------------------------------------------------
     * EMPLOYEE ACTIONS
     * ---------------------------------------------------------
     */
    const handleCreate = () => {
        setEditingEmployee(null);
        setDrawerOpen(true);
    };

    const handleEdit = (employee) => {
        setEditingEmployee(employee);
        setDrawerOpen(true);
    };

    const handleDrawerSuccess = async () => {
        setDrawerOpen(false);
        setEditingEmployee(null);
        await refreshDashboard();
    };

    const handleDeleteRequest = (employee) => {
        setEmployeeToDelete(employee);
        setConfirmOpen(true);
    };

    const handleDelete = async () => {
        if (!employeeToDelete) return;

        try {
            setDeleteLoading(true);

            await employeeApi.remove(employeeToDelete._id);

            setConfirmOpen(false);
            setEmployeeToDelete(null);

            /*
             * If the deleted employee was the last item
             * on the current page, move back one page.
             */
            if (employees.length === 1 && page > 1) {
                setPage((currentPage) => currentPage - 1);
            } else {
                await refreshDashboard();
            }
        } catch (err) {
            setError(
                err.response?.data?.error?.message ||
                    "Unable to delete employee."
            );
        } finally {
            setDeleteLoading(false);
        }
    };

    /*
     * ---------------------------------------------------------
     * DEPARTMENT INTELLIGENCE
     * ---------------------------------------------------------
     *
     * Calculate percentages from database-wide employee totals.
     *
     * Example:
     * 2 employees in Engineering
     * 2 total employees
     *
     * (2 / 2) * 100 = 100%
     */
    const departmentBreakdown = useMemo(() => {
        if (!stats?.departmentBreakdown) {
            return [];
        }

        const total = Number(stats.totalEmployees) || 0;

        if (total === 0) {
            return stats.departmentBreakdown.map((department) => ({
                ...department,
                percentage: 0,
            }));
        }

        return stats.departmentBreakdown.map((department) => {
            const count = Number(department.count) || 0;

            const percentage = (count / total) * 100;

            return {
                ...department,
                percentage,
            };
        });
    }, [stats]);

    const topDepartment = departmentBreakdown[0];

    /*
     * ---------------------------------------------------------
     * SALARY INTELLIGENCE
     * ---------------------------------------------------------
     */
    const salaryRange = useMemo(() => {
        if (!stats) return 0;

        return Math.max(
            0,
            (Number(stats.maximumSalary) || 0) -
                (Number(stats.minimumSalary) || 0)
        );
    }, [stats]);

    /*
     * ---------------------------------------------------------
     * PAGINATION
     * ---------------------------------------------------------
     */
    const pageStart =
        meta.total === 0
            ? 0
            : (page - 1) * limit + 1;

    const pageEnd =
        meta.total === 0
            ? 0
            : Math.min(page * limit, meta.total);

    return (
        <div className="min-h-screen bg-[#f5f7ff] text-slate-900">
            <Sidebar />

            <main className="min-h-screen lg:pl-[248px]">
                <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">

                    {/* =====================================================
                        HEADER
                    ===================================================== */}
                    <div className="mb-7 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                        <div>
                            <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-500">
                                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                                Workforce Intelligence
                            </div>

                            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                                Workforce overview
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                                Monitor your people, payroll and organizational
                                structure from one workspace.
                            </p>
                        </div>

                        <button
                            onClick={handleCreate}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-indigo-600"
                        >
                            <span className="text-lg leading-none">
                                +
                            </span>
                            Add employee
                        </button>
                    </div>

                    {/* =====================================================
                        INTELLIGENCE CARDS
                    ===================================================== */}
                    <section className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                        {/* Workforce */}
                        <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm">
                            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-indigo-100/60 blur-2xl" />

                            <div className="relative">
                                <div className="mb-4 flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                                        Workforce
                                    </span>

                                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                        👥
                                    </span>
                                </div>

                                <div className="text-3xl font-bold tracking-tight text-slate-950">
                                    {statsLoading
                                        ? "—"
                                        : formatNumber(
                                              stats?.totalEmployees
                                          )}
                                </div>

                                <p className="mt-1 text-sm text-slate-500">
                                    Total employees
                                </p>
                            </div>
                        </div>

                        {/* Payroll */}
                        <div className="relative overflow-hidden rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
                            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-violet-100/60 blur-2xl" />

                            <div className="relative">
                                <div className="mb-4 flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                                        Payroll
                                    </span>

                                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                                        ₹
                                    </span>
                                </div>

                                <div className="text-3xl font-bold tracking-tight text-slate-950">
                                    {statsLoading
                                        ? "—"
                                        : formatCurrency(
                                              stats?.totalPayroll
                                          )}
                                </div>

                                <p className="mt-1 text-sm text-slate-500">
                                    Total annual payroll
                                </p>
                            </div>
                        </div>

                        {/* Average salary */}
                        <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
                            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-100/60 blur-2xl" />

                            <div className="relative">
                                <div className="mb-4 flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                                        Compensation
                                    </span>

                                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                        ↗
                                    </span>
                                </div>

                                <div className="text-3xl font-bold tracking-tight text-slate-950">
                                    {statsLoading
                                        ? "—"
                                        : formatCurrency(
                                              stats?.averageSalary
                                          )}
                                </div>

                                <p className="mt-1 text-sm text-slate-500">
                                    Average salary
                                </p>
                            </div>
                        </div>

                        {/* Departments */}
                        <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
                            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-100/60 blur-2xl" />

                            <div className="relative">
                                <div className="mb-4 flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                                        Organization
                                    </span>

                                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                        ◈
                                    </span>
                                </div>

                                <div className="text-3xl font-bold tracking-tight text-slate-950">
                                    {statsLoading
                                        ? "—"
                                        : formatNumber(
                                              stats?.departments
                                          )}
                                </div>

                                <p className="mt-1 text-sm text-slate-500">
                                    Active departments
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* =====================================================
                        INTELLIGENCE PANELS
                    ===================================================== */}
                    <section className="mb-7 grid gap-5 xl:grid-cols-[1.5fr_1fr]">

                        {/* Department distribution */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                            <div className="mb-6 flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-950">
                                        Department distribution
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Workforce composition across the organization.
                                    </p>
                                </div>

                                {topDepartment && (
                                    <div className="hidden rounded-xl bg-slate-50 px-3 py-2 text-right sm:block">
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                            Largest
                                        </div>

                                        <div className="text-sm font-bold text-slate-900">
                                            {topDepartment.department}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {statsLoading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map((item) => (
                                        <div
                                            key={item}
                                            className="animate-pulse"
                                        >
                                            <div className="mb-2 h-3 w-32 rounded bg-slate-100" />
                                            <div className="h-2 rounded-full bg-slate-100" />
                                        </div>
                                    ))}
                                </div>
                            ) : statsError ? (
                                <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                                    {statsError}
                                </div>
                            ) : departmentBreakdown.length === 0 ? (
                                <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                                    No department data available.
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    {departmentBreakdown.map(
                                        (department, index) => (
                                            <div
                                                key={department.department}
                                            >
                                                <div className="mb-2 flex items-center justify-between gap-4">
                                                    <div className="flex min-w-0 items-center gap-3">
                                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-[10px] font-bold text-indigo-600">
                                                            {String(
                                                                index + 1
                                                            ).padStart(
                                                                2,
                                                                "0"
                                                            )}
                                                        </span>

                                                        <span className="truncate text-sm font-semibold text-slate-800">
                                                            {
                                                                department.department
                                                            }
                                                        </span>
                                                    </div>

                                                    <div className="shrink-0 text-right">
                                                        <span className="text-sm font-bold text-slate-900">
                                                            {department.count}
                                                        </span>

                                                        <span className="ml-1 text-xs text-slate-400">
                                                            {formatPercentage(
                                                                department.percentage.toFixed(
                                                                    1
                                                                )
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                                    <div
                                                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-blue-500 transition-all duration-700"
                                                        style={{
                                                            width: `${Math.min(
                                                                100,
                                                                Math.max(
                                                                    department.percentage,
                                                                    2
                                                                )
                                                            )}%`,
                                                        }}
                                                    />
                                                </div>

                                                <div className="mt-2 flex justify-between text-xs text-slate-400">
                                                    <span>
                                                        Avg. salary
                                                    </span>

                                                    <span className="font-medium text-slate-500">
                                                        {formatCurrency(
                                                            department.averageSalary
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Compensation intelligence */}
                        <div className="rounded-2xl border border-slate-200 bg-slate-950 p-5 text-white shadow-sm sm:p-6">
                            <div className="mb-7">
                                <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-300">
                                    Compensation intelligence
                                </div>

                                <h2 className="text-xl font-bold">
                                    Salary landscape
                                </h2>

                                <p className="mt-1 text-sm leading-6 text-slate-400">
                                    Organization-wide salary distribution from
                                    the employee database.
                                </p>
                            </div>

                            {statsLoading ? (
                                <div className="space-y-5">
                                    <div className="h-16 animate-pulse rounded-xl bg-white/5" />
                                    <div className="h-16 animate-pulse rounded-xl bg-white/5" />
                                </div>
                            ) : statsError ? (
                                <div className="rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">
                                    {statsError}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-slate-400">
                                                Average salary
                                            </span>

                                            <span className="text-lg font-bold">
                                                {formatCurrency(
                                                    stats?.averageSalary
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-slate-400">
                                                Salary range
                                            </span>

                                            <span className="text-lg font-bold">
                                                {formatCurrency(
                                                    salaryRange
                                                )}
                                            </span>
                                        </div>

                                        <div className="mt-3 flex justify-between text-[11px] text-slate-500">
                                            <span>
                                                Min{" "}
                                                {formatCurrency(
                                                    stats?.minimumSalary
                                                )}
                                            </span>

                                            <span>
                                                Max{" "}
                                                {formatCurrency(
                                                    stats?.maximumSalary
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-indigo-400/20 bg-indigo-500/10 p-4">
                                        <div className="text-xs text-indigo-200">
                                            Highest concentration
                                        </div>

                                        <div className="mt-1 text-lg font-bold">
                                            {topDepartment?.department ||
                                                "No data"}
                                        </div>

                                        {topDepartment && (
                                            <div className="mt-1 text-xs text-slate-400">
                                                {topDepartment.count} of{" "}
                                                {stats.totalEmployees}{" "}
                                                employees
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* =====================================================
                        EMPLOYEE DIRECTORY
                    ===================================================== */}
                    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-100 p-5 sm:p-6">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-950">
                                        Employee directory
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Manage workforce records and employee
                                        information.
                                    </p>
                                </div>

                                <div className="relative w-full lg:w-80">
                                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                        ⌕
                                    </span>

                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(event) =>
                                            setSearch(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Search name or department..."
                                        className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="mx-5 mt-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600 sm:mx-6">
                                {error}
                            </div>
                        )}

                        {/* Desktop table */}
                        <div className="hidden overflow-x-auto md:block">
                            <table className="w-full min-w-[850px]">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
                                        <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                            Employee
                                        </th>

                                        <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                            Position
                                        </th>

                                        <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                            Department
                                        </th>

                                        <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                            Salary
                                        </th>

                                        <th className="px-6 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        [...Array(5)].map(
                                            (_, index) => (
                                                <tr
                                                    key={index}
                                                    className="animate-pulse"
                                                >
                                                    <td className="px-6 py-5">
                                                        <div className="h-4 w-44 rounded bg-slate-100" />
                                                    </td>

                                                    <td className="px-6 py-5">
                                                        <div className="h-4 w-28 rounded bg-slate-100" />
                                                    </td>

                                                    <td className="px-6 py-5">
                                                        <div className="h-4 w-24 rounded bg-slate-100" />
                                                    </td>

                                                    <td className="px-6 py-5">
                                                        <div className="h-4 w-20 rounded bg-slate-100" />
                                                    </td>

                                                    <td className="px-6 py-5">
                                                        <div className="ml-auto h-8 w-24 rounded bg-slate-100" />
                                                    </td>
                                                </tr>
                                            )
                                        )
                                    ) : employees.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="px-6 py-16 text-center"
                                            >
                                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-xl text-slate-400">
                                                    ◌
                                                </div>

                                                <p className="mt-4 text-sm font-semibold text-slate-700">
                                                    No employees found
                                                </p>

                                                <p className="mt-1 text-sm text-slate-400">
                                                    Try changing your search
                                                    or add a new employee.
                                                </p>
                                            </td>
                                        </tr>
                                    ) : (
                                        employees.map(
                                            (employee) => (
                                                <tr
                                                    key={employee._id}
                                                    className="group transition hover:bg-slate-50/80"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-bold text-white">
                                                                {getInitials(
                                                                    employee.name
                                                                )}
                                                            </div>

                                                            <div className="min-w-0">
                                                                <div className="truncate text-sm font-bold text-slate-900">
                                                                    {
                                                                        employee.name
                                                                    }
                                                                </div>

                                                                <div className="truncate text-xs text-slate-400">
                                                                    {
                                                                        employee.email
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4 text-sm font-medium text-slate-700">
                                                        {
                                                            employee.position
                                                        }
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <span className="inline-flex rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                                                            {
                                                                employee.department
                                                            }
                                                        </span>
                                                    </td>

                                                    <td className="px-6 py-4 text-sm font-bold text-slate-900">
                                                        {formatCurrency(
                                                            employee.salary
                                                        )}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <div className="flex justify-end gap-2 opacity-70 transition group-hover:opacity-100">
                                                            <button
                                                                onClick={() =>
                                                                    handleEdit(
                                                                        employee
                                                                    )
                                                                }
                                                                className="rounded-lg px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600"
                                                            >
                                                                Edit
                                                            </button>

                                                            <button
                                                                onClick={() =>
                                                                    handleDeleteRequest(
                                                                        employee
                                                                    )
                                                                }
                                                                className="rounded-lg px-3 py-1.5 text-xs font-bold text-red-500 transition hover:bg-red-50 hover:text-red-600"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile cards */}
                        <div className="divide-y divide-slate-100 md:hidden">
                            {loading ? (
                                [...Array(4)].map(
                                    (_, index) => (
                                        <div
                                            key={index}
                                            className="animate-pulse p-5"
                                        >
                                            <div className="h-4 w-40 rounded bg-slate-100" />

                                            <div className="mt-3 h-3 w-28 rounded bg-slate-100" />

                                            <div className="mt-3 h-3 w-32 rounded bg-slate-100" />
                                        </div>
                                    )
                                )
                            ) : employees.length === 0 ? (
                                <div className="px-5 py-14 text-center">
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-xl text-slate-400">
                                        ◌
                                    </div>

                                    <p className="mt-4 text-sm font-semibold text-slate-700">
                                        No employees found
                                    </p>

                                    <p className="mt-1 text-sm text-slate-400">
                                        Try changing your search or add a
                                        new employee.
                                    </p>
                                </div>
                            ) : (
                                employees.map(
                                    (employee) => (
                                        <div
                                            key={employee._id}
                                            className="p-5"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-bold text-white">
                                                        {getInitials(
                                                            employee.name
                                                        )}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <div className="truncate text-sm font-bold text-slate-900">
                                                            {
                                                                employee.name
                                                            }
                                                        </div>

                                                        <div className="truncate text-xs text-slate-400">
                                                            {
                                                                employee.email
                                                            }
                                                        </div>
                                                    </div>
                                                </div>

                                                <span className="shrink-0 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                                                    {
                                                        employee.department
                                                    }
                                                </span>
                                            </div>

                                            <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3">
                                                <div>
                                                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                        Position
                                                    </div>

                                                    <div className="mt-1 text-sm font-medium text-slate-700">
                                                        {
                                                            employee.position
                                                        }
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                        Salary
                                                    </div>

                                                    <div className="mt-1 text-sm font-bold text-slate-900">
                                                        {formatCurrency(
                                                            employee.salary
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex justify-end gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleEdit(
                                                            employee
                                                        )
                                                    }
                                                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDeleteRequest(
                                                            employee
                                                        )
                                                    }
                                                    className="rounded-lg border border-red-100 px-3 py-1.5 text-xs font-bold text-red-500 transition hover:bg-red-50"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    )
                                )
                            )}
                        </div>

                        {/* Pagination */}
                        <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <p className="text-xs text-slate-400">
                                Showing{" "}
                                <span className="font-semibold text-slate-600">
                                    {pageStart}
                                </span>{" "}
                                to{" "}
                                <span className="font-semibold text-slate-600">
                                    {pageEnd}
                                </span>{" "}
                                of{" "}
                                <span className="font-semibold text-slate-600">
                                    {meta.total}
                                </span>{" "}
                                employees
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    disabled={page <= 1 || loading}
                                    onClick={() =>
                                        setPage(
                                            (currentPage) =>
                                                currentPage - 1
                                        )
                                    }
                                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Previous
                                </button>

                                <span className="rounded-lg bg-slate-950 px-3 py-1.5 text-xs font-bold text-white">
                                    {page} / {meta.pages}
                                </span>

                                <button
                                    disabled={
                                        page >= meta.pages ||
                                        loading
                                    }
                                    onClick={() =>
                                        setPage(
                                            (currentPage) =>
                                                currentPage + 1
                                        )
                                    }
                                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {/* =========================================================
                EMPLOYEE DRAWER
            ========================================================= */}
            <EmployeeDrawer
                open={drawerOpen}
                employee={editingEmployee}
                onClose={() => {
                    setDrawerOpen(false);
                    setEditingEmployee(null);
                }}
                onSuccess={handleDrawerSuccess}
            />

            {/* =========================================================
                DELETE CONFIRMATION
            ========================================================= */}
            <ConfirmDialog
                open={confirmOpen}
                title="Delete employee?"
                message={
                    employeeToDelete
                        ? `This will permanently remove ${employeeToDelete.name} from the workforce directory.`
                        : "This action cannot be undone."
                }
                confirmText="Delete employee"
                cancelText="Cancel"
                loading={deleteLoading}
                onConfirm={handleDelete}
                onCancel={() => {
                    if (!deleteLoading) {
                        setConfirmOpen(false);
                        setEmployeeToDelete(null);
                    }
                }}
            />
        </div>
    );
};

export default Dashboard;