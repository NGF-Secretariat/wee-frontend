"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  EDUCATION_CATEGORY_LABELS,
  EDUCATION_INDICATORS,
  EducationIndicatorCategory,
  EducationIndicatorMetadata,
} from "@/app/lib/education-indicator-config";
import {
  EDUCATION_MOCK_DATA,
  getIndicatorTakeaway,
  getLegendForIndicator,
} from "@/app/lib/education-mock-data";

const SmartEducationChart = dynamic(
  () => import("@/app/components/education/SmartEducationChart").then((mod) => mod.SmartEducationChart),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-[640px] place-items-center rounded-2xl border border-gray-200 bg-white text-sm text-gray-500">
        Loading visualization...
      </div>
    ),
  }
);

export function EducationDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<EducationIndicatorCategory | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndicatorId, setSelectedIndicatorId] = useState<string>(
    "literacy_english_female"
  );

  const selectedIndicator = useMemo(
    () => EDUCATION_INDICATORS.find((indicator) => indicator.id === selectedIndicatorId),
    [selectedIndicatorId]
  );

  const filteredIndicators = useMemo(() => {
    return EDUCATION_INDICATORS.filter((indicator) => {
      if (selectedCategory !== "all" && indicator.category !== selectedCategory) {
        return false;
      }

      if (!searchTerm.trim()) {
        return true;
      }

      const q = searchTerm.toLowerCase();
      return (
        indicator.label.toLowerCase().includes(q) ||
        indicator.description.toLowerCase().includes(q) ||
        indicator.id.toLowerCase().includes(q)
      );
    });
  }, [searchTerm, selectedCategory]);

  if (!selectedIndicator) {
    return null;
  }

  const legend = getLegendForIndicator(selectedIndicator.id);
  const takeaway = getIndicatorTakeaway(selectedIndicator.id);

  return (
    <div className="space-y-6 pb-8">
      <header className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-green-50 p-6">
        <h1 className="text-3xl font-bold text-[#06923E]">Education & Literacy Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Interactive indicator analytics with maps, comparison charts, distributions, and KPI views.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <aside className="space-y-4 xl:col-span-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900">Indicator Selector</h3>
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search indicators"
              className="mt-3 w-full rounded-lg border text-black bg-white border-gray-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
            />

            <select
              value={selectedIndicatorId}
              onChange={(event) => setSelectedIndicatorId(event.target.value)}
              className="mt-3 w-full rounded-lg border bg-white text-black border-gray-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
            >
              {filteredIndicators.map((indicator) => (
                <option key={indicator.id} value={indicator.id}>
                  {indicator.label}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900">Category Filter</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  selectedCategory === "all"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setSelectedCategory("all")}
              >
                All
              </button>
              {Object.entries(EDUCATION_CATEGORY_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    selectedCategory === key
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setSelectedCategory(key as EducationIndicatorCategory)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="xl:col-span-6">
          <SmartEducationChart indicator={selectedIndicator as EducationIndicatorMetadata} data={EDUCATION_MOCK_DATA} />
        </main>

        <aside className="space-y-4 xl:col-span-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900">Legend</h3>
            <div className="mt-3 space-y-2">
              {legend.map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: item.color }} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900">Insight Panel</h3>
            <p className="mt-3 text-sm text-gray-600">{selectedIndicator.description}</p>

            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
              <p className="font-semibold">Key takeaway</p>
              <p className="mt-1">{takeaway}</p>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
