"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import useScoreCardHook, { ProcessedState } from "./hooks/scoreCardHooks";

const COLUMNS: { label: string; key: keyof Omit<ProcessedState, "state"> }[] = [
    { label: "Domesticated WEE Policy", key: "q8" },
    { label: "Established Multi-sectoral Coordinating Unit", key: "q9" },
    { label: "Approved Implementation Plan for WEE Policy", key: "q15" },
    { label: "Formalized Women Savings Groups", key: "q16" },
    { label: "% Women in Parliament (35% Afirmative Action)", key: "q17" },
    { label: "% Women in Cabinet (35% Afirmative Action)", key: "q18" },
    { label: "NFWP-SU Budget Allocation", key: "q10_pre" },
    { label: "NFWP-SU Implementation LGAs", key: "q23_e" },
    { label: "Women Affinity Groups (Min. 3,600)", key: "q13" },
];

type FilterMode = "all" | "missing" | "full";
type SortDirection = "asc" | "desc" | null;

interface SortState {
    key: string;
    direction: SortDirection;
}

// ── Sort icon ────────────────────────────────────────────────────────────────
function SortIcon({ direction }: { direction: SortDirection }) {
    return (
        <span className="inline-flex flex-col items-center ml-1 gap-px translate-y-px shrink-0">
            <svg width="7" height="5" viewBox="0 0 7 5"
                className={`transition-opacity duration-150 ${direction === "asc" ? "opacity-100" : "opacity-35"}`}>
                <path d="M3.5 0L7 5H0L3.5 0Z" fill="white" />
            </svg>
            <svg width="7" height="5" viewBox="0 0 7 5"
                className={`transition-opacity duration-150 ${direction === "desc" ? "opacity-100" : "opacity-35"}`}>
                <path d="M3.5 5L0 0H7L3.5 5Z" fill="white" />
            </svg>
        </span>
    );
}

// ── Export dropdown ──────────────────────────────────────────────────────────
function ExportDropdown({ data, columns }: {
    data: ProcessedState[];
    columns: typeof COLUMNS;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const exportCSV = () => {
        const header = ["S/N", "Subnational", ...columns.map((c) => c.label)];
        const rows = data.map((row, i) => [
            i + 1,
            row.state,
            ...columns.map((c) => (row[c.key] ? "Yes" : "No")),
        ]);
        const csv = [header, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "wee-scorecard.csv";
        a.click();
        URL.revokeObjectURL(url);
        setOpen(false);
    };

    const exportExcel = () => {
        // Simple HTML table export that Excel can open
        const header = `<tr><th>S/N</th><th>Subnational</th>${columns.map((c) => `<th>${c.label}</th>`).join("")}</tr>`;
        const rows = data.map((row, i) =>
            `<tr><td>${i + 1}</td><td>${row.state}</td>${columns.map((c) => `<td>${row[c.key] ? "Yes" : "No"}</td>`).join("")}</tr>`
        ).join("");
        const html = `<html><head><meta charset="UTF-8"></head><body><table>${header}${rows}</table></body></html>`;
        const blob = new Blob([html], { type: "application/vnd.ms-excel" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "wee-scorecard.xls";
        a.click();
        URL.revokeObjectURL(url);
        setOpen(false);
    };

    const exportWord = () => {
        const header = `<tr><th>S/N</th><th>Subnational</th>${columns.map((c) => `<th>${c.label}</th>`).join("")}</tr>`;
        const rows = data.map((row, i) =>
            `<tr><td>${i + 1}</td><td>${row.state}</td>${columns.map((c) => `<td>${row[c.key] ? "Yes" : "No"}</td>`).join("")}</tr>`
        ).join("");
        const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="UTF-8"></head><body><table border="1">${header}${rows}</table></body></html>`;
        const blob = new Blob([html], { type: "application/msword" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "wee-scorecard.doc";
        a.click();
        URL.revokeObjectURL(url);
        setOpen(false);
    };

    const options = [
        {
            label: "Print",
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                        d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z" />
                </svg>
            ),
            action: () => { window.print(); setOpen(false); },
        },
        {
            label: "Export as PDF",
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
            ),
            action: () => { window.print(); setOpen(false); }, // PDF via browser print dialog
        },
        {
            label: "Export as Excel",
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                        d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
            ),
            action: exportExcel,
        },
        {
            label: "Export as CSV",
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                        d="M9 12h6m-3-3v6M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
                </svg>
            ),
            action: exportCSV,
        },
        {
            label: "Export as Word",
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            action: exportWord,
        },
    ];

    return (
        <div className="relative inline-block" ref={ref}>
            <div className="flex items-center bg-ngf-green rounded-md text-white text-sm">
                <button
                    className="px-3 py-1.5 cursor-pointer hover:bg-black/10 rounded-l-md transition-colors"
                    onClick={() => setOpen((v) => !v)}
                >
                    Export
                </button>
                <div className="w-px h-5 bg-white/30" />
                <button
                    className="px-2 py-1.5 cursor-pointer hover:bg-black/10 rounded-r-md transition-colors flex items-center"
                    onClick={() => setOpen((v) => !v)}
                    aria-haspopup="true"
                    aria-expanded={open}
                >
                    <svg
                        className={`w-3.5 h-3.5 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>
            {open && (
                <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1">
                    {options.map((opt) => (
                        <button
                            key={opt.label}
                            onClick={opt.action}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors text-left"
                        >
                            <span className="text-gray-500">{opt.icon}</span>
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function ScoreCardPage() {
    const { data, loading, error } = useScoreCardHook();
    const [search, setSearch] = useState("");
    const [filterMode, setFilterMode] = useState<FilterMode>("all");
    const [sort, setSort] = useState<SortState>({ key: "", direction: null });

    const handleSort = (key: string, direction: SortDirection) => {
        setSort({ key, direction });
    };

    const filtered = useMemo(() => {
        let rows = data;

        // Text search
        if (search.trim()) {
            rows = rows.filter((r) =>
                r.state.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Filter mode
        if (filterMode === "missing") {
            rows = rows.filter((r) => COLUMNS.some((col) => !r[col.key]));
        }
        if (filterMode === "full") {
            rows = rows.filter((r) => COLUMNS.every((col) => r[col.key]));
        }

        // Sorting
        if (sort.key && sort.direction) {
            rows = [...rows].sort((a, b) => {
                if (sort.key === "subnational") {
                    const cmp = a.state.localeCompare(b.state);
                    return sort.direction === "asc" ? cmp : -cmp;
                }
                const aVal = a[sort.key as keyof ProcessedState] ? 1 : 0;
                const bVal = b[sort.key as keyof ProcessedState] ? 1 : 0;
                // asc = compliant first (1 before 0), desc = non-compliant first
                return sort.direction === "asc" ? bVal - aVal : aVal - bVal;
            });
        }

        return rows;
    }, [data, search, filterMode, sort]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4a6741]" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-red-600 bg-red-50 rounded-lg">
                ❌ Error: {error}
            </div>
        );
    }

    const thBase = "text-white font-medium px-2 py-2 border border-[#3a5231] text-center leading-snug cursor-pointer select-none transition-colors duration-150";

    const getSortDir = (key: string): SortDirection =>
        sort.key === key ? sort.direction : null;

    const cycleSort = (key: string) => {
        const cur = getSortDir(key);
        if (cur === null) handleSort(key, "asc");
        else if (cur === "asc") handleSort(key, "desc");
        else handleSort(key, null);
    };

    return (
        <div className="flex flex-col space-y-6">
            <h1 className="text-2xl font-bold text-ngf-green">
                Women's Economic Empowerment (WEE) Score card
            </h1>
            <div className="p-4 font-sans text-sm">
                {/* Filters */}
                <div className="flex flex-wrap gap-3 items-center mb-4">
                    <input
                        type="text"
                        placeholder="Search state…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="text-black border border-gray-300 rounded px-3 py-1.5 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-[#4a6741]"
                    />
                    <select
                        value={filterMode}
                        onChange={(e) => setFilterMode(e.target.value as FilterMode)}
                        className="text-black border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a6741]"
                    >
                        <option value="all">All states</option>
                        <option value="missing">States with gaps</option>
                        <option value="full">Fully compliant</option>
                    </select>
                    <span className="text-gray-400 text-xs ml-auto">
                        {filtered.length} state{filtered.length !== 1 ? "s" : ""}
                    </span>
                    <ExportDropdown data={filtered} columns={COLUMNS} />
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full border-collapse text-xs min-w-[900px]">
                        <thead>
                            <tr>
                                {/* S/N – not sortable */}
                                <th className="bg-[#4a6741] text-white font-medium px-3 py-2 border border-[#3a5231] w-8 text-center">
                                    S/N
                                </th>

                                {/* Subnational – sortable */}
                                <th
                                    onClick={() => cycleSort("subnational")}
                                    className={`${thBase} text-left w-28 px-3 ${sort.key === "subnational" ? "bg-[#3a5231]" : "bg-[#4a6741] hover:bg-[#3d5637]"}`}
                                >
                                    <span className="inline-flex items-center">
                                        Subnational
                                        <SortIcon direction={getSortDir("subnational")} />
                                    </span>
                                </th>

                                {/* Dynamic columns – all sortable */}
                                {COLUMNS.map((col) => (
                                    <th
                                        key={col.key}
                                        onClick={() => cycleSort(col.key)}
                                        className={`${thBase} ${sort.key === col.key ? "bg-[#3a5231]" : "bg-[#4a6741] hover:bg-[#3d5637]"}`}
                                    >
                                        <span className="inline-flex items-center justify-center w-full">
                                            <span className="leading-snug">{col.label}</span>
                                            <SortIcon direction={getSortDir(col.key)} />
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={COLUMNS.length + 2}
                                        className="text-center py-10 text-gray-400"
                                    >
                                        No states match your filter.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((row, i) => (
                                    <tr
                                        key={row.state}
                                        className={
                                            i % 2 === 0
                                                ? "bg-[#f9fbf8] hover:bg-[#e4eddf] transition-colors"
                                                : "bg-[#f0f4ee] hover:bg-[#e4eddf] transition-colors"
                                        }
                                    >
                                        <td className="px-3 py-2 border border-[#c8d8c4] text-center text-gray-400">
                                            {i + 1}
                                        </td>
                                        <td className="px-3 py-2 border border-[#c8d8c4] font-medium text-gray-800">
                                            {row.state}
                                        </td>
                                        {COLUMNS.map((col) => (
                                            <td
                                                key={col.key}
                                                className="px-2 py-2 border border-[#c8d8c4] text-center"
                                            >
                                                {row[col.key] ? <CheckIcon /> : <CrossIcon />}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// ── Icons ────────────────────────────────────────────────────────────────────
function CrossIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="#c0392b" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
            className="w-5 h-5 mx-auto" aria-label="Not met">
            <circle cx="12" cy="12" r="9" />
            <path d="M15 9l-6 6M9 9l6 6" />
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="#3a7d44" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
            className="w-5 h-5 mx-auto" aria-label="Met">
            <circle cx="12" cy="12" r="9" />
            <path d="M8.5 12.5l2.5 2.5 4.5-4.5" />
        </svg>
    );
}