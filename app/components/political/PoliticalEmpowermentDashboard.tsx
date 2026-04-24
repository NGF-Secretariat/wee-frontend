"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  GOVERNANCE_CATEGORY_LABELS,
  GOVERNANCE_INDICATORS,
  getAllGovernanceCategories,
  getGovernanceIndicatorById,
  type GovernanceCategory,
} from "@/app/lib/governance-indicator-config";
import { GOVERNANCE_MOCK_DATA, getGovernanceTakeaway } from "@/app/lib/governance-mock-data";

const PoliticalChart = dynamic(
  () => import("@/app/components/political/PoliticalChart").then((mod) => mod.PoliticalChart),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-[620px] place-items-center rounded-2xl border border-gray-200 bg-white text-sm text-gray-500">
        Loading chart...
      </div>
    ),
  }
);

export function PoliticalEmpowermentDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<GovernanceCategory | "all">("all");
  const [search, setSearch] = useState("");
  const [selectedIndicatorId, setSelectedIndicatorId] = useState<string>("voter_turnout_female");

  const categories = useMemo(() => getAllGovernanceCategories(), []);

  const filteredIndicators = useMemo(() => {
    return GOVERNANCE_INDICATORS.filter((indicator) => {
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
    () => getGovernanceIndicatorById(selectedIndicatorId) ?? GOVERNANCE_INDICATORS[0],
    [selectedIndicatorId]
  );

  return (
    <div className="space-y-6 pb-8">
      <header className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-green-50 p-6">
        <h1 className="text-3xl font-bold text-[#0f766e]">Political Empowerment Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Track participation, representation, policy implementation, and public sentiment on inclusion in governance.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Female Voter Turnout</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">49%</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Women in Parliaments</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">12.7%</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Quota Policy</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">In Place</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Public Support</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">64%</p>
        </div>
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
              className="mt-3 w-full rounded-lg border text-black bg-white border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-600"
            />

            <select
              value={selectedIndicatorId}
              onChange={(event) => setSelectedIndicatorId(event.target.value)}
              className="mt-3 w-full rounded-lg border text-black bg-white border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-600"
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
              {categories.map((key) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    selectedCategory === key
                      ? "bg-teal-700 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {GOVERNANCE_CATEGORY_LABELS[key]}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="xl:col-span-6">
          <PoliticalChart indicator={selectedIndicator} data={GOVERNANCE_MOCK_DATA} />
        </main>

        <aside className="space-y-4 xl:col-span-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900">Insight panel</h3>
            <p className="mt-3 text-sm text-gray-600">{selectedIndicator.description}</p>

            <div className="mt-4 rounded-lg border border-teal-200 bg-teal-50 p-3 text-sm text-teal-900">
              <p className="font-semibold">Key takeaway</p>
              <p className="mt-1">{getGovernanceTakeaway(selectedIndicator.id)}</p>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
