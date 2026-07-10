"use client";

import React from "react";
import { formatValue, type IndicatorValue } from "@/app/lib/gender-dashboard";

interface IndicatorTableProps {
  rows: Array<[string, IndicatorValue]>;
  page: number;
  totalPages: number;
  onPageChange: (next: number) => void;
}

export function IndicatorTable({
  rows,
  page,
  totalPages,
  onPageChange,
}: IndicatorTableProps) {
  return (
    <div className="rounded-lg border border-emerald-100 bg-white p-3">
      <table className="w-full text-left text-sm text-black">
        <thead>
          <tr className="border-b border-emerald-100 text-xs uppercase tracking-wide text-slate-800">
            <th className="py-2">Indicator</th><th>Value</th><th>Unit</th><th>Year</th><th>Source</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, item]) => (
            <tr key={name} className="border-b border-emerald-100">
              <td className="py-2">{name}</td>
              <td>{formatValue(item.value)}</td>
              <td>{item.unit}</td>
              <td>{item.year}</td>
              <td>{item.source}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3 flex items-center justify-end gap-2">
        <button disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="rounded border border-[#243044] px-2 py-1 text-xs text-slate-800 disabled:opacity-50">Prev</button>
        <span className="text-xs text-slate-800">{page}/{totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className="rounded border border-[#243044] px-2 py-1 text-xs text-slate-800 disabled:opacity-50">Next</button>
      </div>
    </div>
  );
}
