"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  HEALTH_CATEGORY_LABELS,
  HEALTH_INDICATORS,
  type HealthIndicatorCategory,
} from "@/app/lib/health-indicator-config";
import {
  HEALTH_MOCK_DATA,
  getSensitiveNote,
  getTakeaway,
} from "@/app/lib/health-mock-data";

const HealthChart = dynamic(
  () => import("@/app/components/health/HealthChart").then((mod) => mod.HealthChart),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-[620px] place-items-center rounded-2xl border border-gray-200 bg-white text-sm text-gray-500">
        Loading chart...
      </div>
    ),
  }
);

export function HealthDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<HealthIndicatorCategory | "all">("all");
  const [search, setSearch] = useState("");
  const [selectedIndicatorId, setSelectedIndicatorId] = useState<string>("health_insurance_female");

  const filteredIndicators = useMemo(() => {
    return HEALTH_INDICATORS.filter((indicator) => {
      const categoryPass = selectedCategory === "all" || indicator.category === selectedCategory;
      if (!categoryPass) return false;

      if (!search.trim()) return true;
      const q = search.toLowerCase();

      return (
        indicator.label.toLowerCase().includes(q) ||
        indicator.description.toLowerCase().includes(q) ||
        indicator.id.toLowerCase().includes(q)
      );
    });
  }, [search, selectedCategory]);

  const selectedIndicator = useMemo(() => {
    return HEALTH_INDICATORS.find((item) => item.id === selectedIndicatorId) ?? HEALTH_INDICATORS[0];
  }, [selectedIndicatorId]);

  const kpis = useMemo(() => {
    return [
      {
        label: "Maternal Mortality",
        value: `${HEALTH_MOCK_DATA.maternal_mortality} per 100,000`,
      },
      {
        label: "Violence Rate",
        value: `${HEALTH_MOCK_DATA.violence_rate}%`,
      },
      {
        label: "Female Insurance",
        value: `${HEALTH_MOCK_DATA.insurance_enrolment.female}%`,
      },
      {
        label: "Female Life Expectancy",
        value: `${HEALTH_MOCK_DATA.life_expectancy.female} years`,
      },
    ];
  }, []);

  return (
    <div className="space-y-6 pb-8">
      <header className="rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-50 via-white to-cyan-50 p-6">
        <h1 className="text-3xl font-bold text-[#0f766e]">Health &amp; Social Indicators</h1>
        <p className="mt-2 text-sm text-gray-600">
          Chart-based monitoring for health, violence, and demographic indicators.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <div key={item.label} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{item.label}</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <aside className="space-y-4 xl:col-span-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900">Indicator selector</h3>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search indicators"
              className="mt-3 w-full rounded-lg border bg-white text-black border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-600"
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
              {Object.entries(HEALTH_CATEGORY_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key as HealthIndicatorCategory)}
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
          <HealthChart
            key={selectedIndicator.id}
            indicator={selectedIndicator}
            data={HEALTH_MOCK_DATA}
          />
        </main>

        <aside className="space-y-4 xl:col-span-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900">Insight panel</h3>
            <p className="mt-3 text-sm text-gray-600">{selectedIndicator.description}</p>

            <div className="mt-4 rounded-lg border border-teal-200 bg-teal-50 p-3 text-sm text-teal-900">
              <p className="font-semibold">Key takeaway</p>
              <p className="mt-1">{getTakeaway(selectedIndicator)}</p>
            </div>

            <div
              className={`mt-3 rounded-lg p-3 text-sm ${
                selectedIndicator.sensitive
                  ? "border border-gray-300 bg-gray-50 text-gray-800"
                  : "border border-gray-200 bg-gray-50 text-gray-700"
              }`}
            >
              <p className="font-semibold">Context note</p>
              <p className="mt-1">{getSensitiveNote(selectedIndicator)}</p>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
