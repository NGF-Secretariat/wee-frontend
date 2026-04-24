"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  DATA_PAGE_CATEGORY_LABELS,
  DATA_PAGE_INDICATORS,
  type DataPageIndicatorCategory,
} from "@/app/lib/data-page-indicator-config";
import {
  DATA_PAGE_MOCK_DATA,
  getDataPageTakeaway,
} from "@/app/lib/data-page-mock-data";

const DataChart = dynamic(
  () => import("@/app/components/data/DataChart").then((mod) => mod.DataChart),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-[620px] place-items-center rounded-2xl border border-gray-200 bg-white text-sm text-gray-500">
        Loading chart...
      </div>
    ),
  }
);

export function DataDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<DataPageIndicatorCategory | "all">("all");
  const [search, setSearch] = useState("");
  const [selectedIndicatorId, setSelectedIndicatorId] = useState<string>("gender_disaggregation_sector");

  const filteredIndicators = useMemo(() => {
    return DATA_PAGE_INDICATORS.filter((indicator) => {
      if (selectedCategory !== "all" && indicator.category !== selectedCategory) {
        return false;
      }

      if (!search.trim()) {
        return true;
      }

      const q = search.toLowerCase();
      return (
        indicator.label.toLowerCase().includes(q) ||
        indicator.description.toLowerCase().includes(q)
      );
    });
  }, [search, selectedCategory]);

  const selectedIndicator = useMemo(
    () => DATA_PAGE_INDICATORS.find((item) => item.id === selectedIndicatorId) ?? DATA_PAGE_INDICATORS[0],
    [selectedIndicatorId]
  );

  return (
    <div className="space-y-6 pb-8">
      <header className="rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-50 via-white to-cyan-50 p-6">
        <h1 className="text-3xl font-bold text-[#0f766e]">Data Systems & Evidence Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Indicator tracking for disaggregated data quality, social norms evidence, and gender-responsive planning.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <aside className="space-y-4 xl:col-span-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900">Indicator selector</h3>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search indicators"
              className="mt-3 w-full rounded-lg border text-black border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-600"
            />

            <select
              value={selectedIndicatorId}
              onChange={(event) => setSelectedIndicatorId(event.target.value)}
              className="mt-3 w-full rounded-lg border bg-white text-black border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-600"
            >
              {filteredIndicators.map((indicator) => (
                <option key={indicator.id} value={indicator.id}>
                  {indicator.label}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900">Category filter</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  selectedCategory === "all"
                    ? "bg-teal-700 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              {Object.entries(DATA_PAGE_CATEGORY_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key as DataPageIndicatorCategory)}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    selectedCategory === key
                      ? "bg-teal-700 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="xl:col-span-6">
          <DataChart indicator={selectedIndicator} data={DATA_PAGE_MOCK_DATA} />
        </main>

        <aside className="space-y-4 xl:col-span-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900">Insight panel</h3>
            <p className="mt-3 text-sm text-gray-600">{selectedIndicator.description}</p>

            <div className="mt-4 rounded-lg border border-teal-200 bg-teal-50 p-3 text-sm text-teal-900">
              <p className="font-semibold">Key takeaway</p>
              <p className="mt-1">{getDataPageTakeaway(selectedIndicator.id)}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-900">Quick KPI</h4>
            <div className="mt-3 space-y-2 text-sm text-gray-700">
              <p>Social norms average score: <span className="font-semibold">55 / 100</span></p>
              <p>Planning framework status: <span className="font-semibold">Adopted</span></p>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
