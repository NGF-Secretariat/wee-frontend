"use client";

import React from "react";
import { formatValue, type IndicatorValue } from "@/app/lib/gender-dashboard";

interface IndicatorCardsProps {
  entries: Array<[string, IndicatorValue]>;
  color: string;
  overviewMeta?: Array<[string, IndicatorValue, string]>;
}

export function IndicatorCards({
  entries,
  color,
  overviewMeta,
}: IndicatorCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {entries.map(([name, item]) => (
        <article key={name} className="rounded-lg border border-emerald-100 bg-white p-4">
          <div className="mb-2 h-1 rounded" style={{ backgroundColor: color }} />
          <p className="text-sm text-slate-800">{name}</p>
          <p className="mt-1 text-3xl font-semibold text-black">{formatValue(item.value)}</p>
          <p className="text-xs text-slate-800">{item.unit}</p>
          <div className="mt-3 flex items-center justify-between border-t border-emerald-100 pt-2 text-[11px] text-slate-800">
            <span>{item.source}</span>
            <span className="text-[#06923E]">{item.year}</span>
          </div>
          {item.note && <p className="mt-2 text-[11px] italic text-slate-800">{item.note}</p>}
          {overviewMeta && (
            <p className="mt-2 text-[10px] uppercase tracking-wide text-[#06923E]">
              {overviewMeta.find(([indicatorName]) => indicatorName === name)?.[2] ?? ""}
            </p>
          )}
        </article>
      ))}
    </div>
  );
}
