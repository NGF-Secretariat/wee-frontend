"use client";

import { useMemo, useState } from "react";
import useScoreCardHook, { ProcessedState } from "./hooks/scoreCardHooks";


const COLUMNS: { label: string; key: keyof Omit<ProcessedState, "state"> }[] = [
    { label: "Domesticated WEE Policy", key: "q8" },
    { label: "Established Multi-sectoral Coordinating Unit", key: "q9" },
    { label: "Approved Implementation Plan for WEE Policy", key: "q15" },
    { label: "Formalized Women Savings Groups", key: "q16" },
    { label: "% Women in Parliament (35% AA)", key: "q17" },
    { label: "% Women in Cabinet (35% AA)", key: "q18" },
    { label: "NFWP-SU Budget Allocation", key: "q10_pre" },
    { label: "NFWP-SU Implementation LGAs", key: "q23_e" },
    { label: "Women Affinity Groups (Min. 3,600)", key: "q13" },
];

type FilterMode = "all" | "missing" | "full";



export default function ScoreCardPage() {

    const { data, loading, error } = useScoreCardHook();
    const [search, setSearch] = useState("");
    const [filterMode, setFilterMode] = useState<FilterMode>("all");

    const filtered = useMemo(() => {
        let rows = data;
        if (search.trim()) {
            rows = rows.filter((r) =>
                r.state.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (filterMode === "missing") {
            rows = rows.filter((r) =>
                COLUMNS.some((col) => !r[col.key])
            );
        }
        if (filterMode === "full") {
            rows = rows.filter((r) =>
                COLUMNS.every((col) => r[col.key])
            );
        }
        return rows;
    }, [data, search, filterMode]);

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

    return (
        <div className="flex flex-col space-y-6">
            <h1 className="text-2xl font-bold text-ngf-green">Women's Economic Empowerment (WEE) Scorecard</h1>
            <div className="p-4 font-sans text-sm">
                {/* Filters */}
                <div className="flex flex-wrap gap-3 items-center mb-4">
                    <input
                        type="text"
                        placeholder="Search state…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-1.5 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-[#4a6741]"
                    />
                    <select
                        value={filterMode}
                        onChange={(e) => setFilterMode(e.target.value as FilterMode)}
                        className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a6741]"
                    >
                        <option value="all">All states</option>
                        <option value="missing">States with gaps</option>
                        <option value="full">Fully compliant</option>
                    </select>
                    <span className="text-gray-400 text-xs ml-auto">
                        {filtered.length} state{filtered.length !== 1 ? "s" : ""}
                    </span>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full border-collapse text-xs min-w-[900px]">
                        <thead>
                            <tr>
                                <th className="bg-[#4a6741] text-white font-medium px-3 py-2 border border-[#3a5231] w-8 text-center">
                                    S/N
                                </th>
                                <th className="bg-[#4a6741] text-white font-medium px-3 py-2 border border-[#3a5231] text-left w-28">
                                    Subnational
                                </th>
                                {COLUMNS.map((col) => (
                                    <th
                                        key={col.key}
                                        className="bg-[#4a6741] text-white font-medium px-2 py-2 border border-[#3a5231] text-center leading-snug"
                                    >
                                        {col.label}
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
function CrossIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#c0392b"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 mx-auto"
            aria-label="Not met"
        >
            <circle cx="12" cy="12" r="9" />
            <path d="M15 9l-6 6M9 9l6 6" />
        </svg>
    );
}
function CheckIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#3a7d44"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 mx-auto"
            aria-label="Met"
        >
            <circle cx="12" cy="12" r="9" />
            <path d="M8.5 12.5l2.5 2.5 4.5-4.5" />
        </svg>
    );
}