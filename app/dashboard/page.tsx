"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useTopbarFilters } from "../context/TopbarFiltersContext";
import { NATIONAL_DATA } from "@/app/lib/mock-data";
import { EDUCATION_MOCK_DATA } from "@/app/lib/education-mock-data";
import { HEALTH_MOCK_DATA } from "@/app/lib/health-mock-data";
import { LEGAL_GOVERNANCE_MOCK_DATA } from "@/app/lib/legal-governance-mock-data";
import { DATA_PAGE_MOCK_DATA } from "@/app/lib/data-page-mock-data";
import { GOVERNANCE_MOCK_DATA } from "@/app/lib/governance-mock-data";

type SampleCategory =
  | "economic"
  | "education"
  | "sociocultural"
  | "health"
  | "political"
  | "legal"
  | "data";

interface ThematicSample {
  id: string;
  title: string;
  category: SampleCategory;
  value: string;
  caption: string;
  href: string;
  score?: number;
}

const CATEGORY_LABELS: Record<SampleCategory, string> = {
  economic: "Economic",
  education: "Education",
  sociocultural: "Sociocultural",
  health: "Health",
  political: "Political",
  legal: "Legal",
  data: "Data",
};

const categoryPillClass: Record<SampleCategory, string> = {
  economic: "bg-emerald-100 text-emerald-700",
  education: "bg-blue-100 text-blue-700",
  sociocultural: "bg-cyan-100 text-cyan-700",
  health: "bg-rose-100 text-rose-700",
  political: "bg-violet-100 text-violet-700",
  legal: "bg-amber-100 text-amber-700",
  data: "bg-slate-100 text-slate-700",
};

export default function DashboardHome() {
  const { selectedState, selectedYear } = useTopbarFilters();
  const [selectedCategory, setSelectedCategory] = useState<SampleCategory | "all">("all");
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string>("economic");

  const thematicSamples: ThematicSample[] = useMemo(
    () => [
      {
        id: "economic",
        title: "Economic Participation",
        category: "economic",
        value: `${NATIONAL_DATA.female_lfpr}% female labour force participation`,
        caption: "Economic inclusion and workforce engagement",
        href: "/dashboard/economic-participation",
        score: NATIONAL_DATA.female_lfpr,
      },
      {
        id: "education",
        title: "Education & Training",
        category: "education",
        value: `${EDUCATION_MOCK_DATA.school_attendance.female.lagos}% female school attendance in Lagos`,
        caption: "Learning access and literacy progression",
        href: "/dashboard/education-training",
        score: EDUCATION_MOCK_DATA.school_attendance.female.lagos,
      },
      {
        id: "sociocultural",
        title: "Sociocultural",
        category: "sociocultural",
        value: "NIN and access indicators available by state",
        caption: "Norms, identity access, and social conditions",
        href: "/dashboard/sociocultural",
        score: 62,
      },
      {
        id: "health",
        title: "Health",
        category: "health",
        value: `${HEALTH_MOCK_DATA.maternal_mortality} maternal mortality rate`,
        caption: "Service coverage and maternal outcomes",
        href: "/dashboard/health",
        score: 48,
      },
      {
        id: "political",
        title: "Political Empowerment",
        category: "political",
        value: `${GOVERNANCE_MOCK_DATA.voter_turnout.femaleNational}% female voter turnout`,
        caption: "Representation and civic participation",
        href: "/dashboard/political-empowerment",
        score: GOVERNANCE_MOCK_DATA.voter_turnout.femaleNational,
      },
      {
        id: "legal",
        title: "Legal",
        category: "legal",
        value: `${LEGAL_GOVERNANCE_MOCK_DATA.policyIndicators.filter((item) => item.value).length}/${LEGAL_GOVERNANCE_MOCK_DATA.policyIndicators.length} policy indicators adopted`,
        caption: "Policy domestication and legal safeguards",
        href: "/dashboard/legal",
        score:
          (LEGAL_GOVERNANCE_MOCK_DATA.policyIndicators.filter((item) => item.value).length /
            LEGAL_GOVERNANCE_MOCK_DATA.policyIndicators.length) *
          100,
      },
      {
        id: "data",
        title: "Data",
        category: "data",
        value: DATA_PAGE_MOCK_DATA.gender_responsive_budgeting_framework
          ? "Gender responsive budgeting framework adopted"
          : "Gender responsive budgeting framework not adopted",
        caption: "Data systems and planning quality",
        href: "/dashboard/data",
        score: DATA_PAGE_MOCK_DATA.gender_responsive_budgeting_framework ? 100 : 35,
      },
    ],
    []
  );

  const filteredSamples = useMemo(() => {
    return thematicSamples.filter((sample) => {
      if (selectedCategory !== "all" && sample.category !== selectedCategory) {
        return false;
      }

      if (!query.trim()) {
        return true;
      }

      const q = query.toLowerCase();
      return (
        sample.title.toLowerCase().includes(q) ||
        sample.value.toLowerCase().includes(q) ||
        sample.caption.toLowerCase().includes(q)
      );
    });
  }, [query, selectedCategory, thematicSamples]);

  const activeSample =
    filteredSamples.find((sample) => sample.id === activeId) ?? filteredSamples[0] ?? thematicSamples[0];

  return (
    <div className="space-y-6 min-h-screen pb-8">
      <header className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-teal-50 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#0a7c3d]">Dashboard Overview</h1>
            <p className="mt-2 text-sm text-gray-600">
              Explore quick, interactive samples from each thematic dashboard before diving deeper.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-white px-3 py-1 font-medium text-gray-700 border border-gray-200">
              State: {selectedState || "Not selected"}
            </span>
            <span className="rounded-full bg-white px-3 py-1 font-medium text-gray-700 border border-gray-200">
              Year: {selectedYear || "Not selected"}
            </span>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <aside className="space-y-4 xl:col-span-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900">Find Dashboard</h2>
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search samples"
              className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 bg-white text-black text-sm outline-none focus:border-[#0a7c3d]"
            />

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  selectedCategory === "all"
                    ? "bg-[#0a7c3d] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              {(Object.keys(CATEGORY_LABELS) as SampleCategory[]).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    selectedCategory === category
                      ? "bg-[#0a7c3d] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {CATEGORY_LABELS[category]}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900">Selection Summary</h3>
            <p className="mt-2 text-sm text-gray-600">
              {filteredSamples.length} dashboard{filteredSamples.length === 1 ? "" : "s"} matched.
            </p>
            {activeSample?.score !== undefined && (
              <div className="mt-3">
                <p className="text-xs text-gray-500">Preview score</p>
                <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                    style={{ width: `${Math.max(0, Math.min(activeSample.score, 100))}%` }}
                  />
                </div>
                <p className="mt-1 text-xs font-medium text-gray-700">
                  {Math.round(Math.max(0, Math.min(activeSample.score, 100)))} / 100
                </p>
              </div>
            )}
          </div>
        </aside>

        <main className="space-y-4 xl:col-span-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0a7c3d]">Samples From All Pages</h2>
            <p className="mt-1 text-sm text-gray-600">Click any card to preview details and jump to the full dashboard.</p>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
              {filteredSamples.map((sample, index) => {
                const isActive = sample.id === activeSample.id;
                return (
                  <button
                    key={sample.id}
                    onClick={() => setActiveId(sample.id)}
                    className={`group rounded-xl border p-4 text-left transition-all duration-200 animate-stagger-in ${
                      isActive
                        ? "border-[#0a7c3d] bg-emerald-50 shadow-sm"
                        : "border-gray-200 bg-white hover:border-emerald-300 hover:shadow-sm"
                    }`}
                    style={{ animationDelay: `${index * 70}ms` }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-gray-900">{sample.title}</p>
                      <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${categoryPillClass[sample.category]}`}>
                        {CATEGORY_LABELS[sample.category]}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{sample.value}</p>
                    <p className="mt-2 text-xs text-gray-500">{sample.caption}</p>
                    <p className="mt-3 text-xs font-medium text-[#0a7c3d] group-hover:underline">Preview details →</p>
                  </button>
                );
              })}
            </div>
          </div>
        </main>

        <aside className="space-y-4 xl:col-span-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm animate-fade-in">
            <h3 className="text-sm font-semibold text-gray-900">Live Preview</h3>
            <p className="mt-3 text-xl font-bold text-gray-900">{activeSample.title}</p>
            <p className="mt-2 text-sm text-gray-600">{activeSample.value}</p>
            <p className="mt-3 text-xs text-gray-500">{activeSample.caption}</p>

            <Link
              href={activeSample.href}
              className="mt-4 inline-flex items-center rounded-lg bg-[#0a7c3d] px-4 py-2 text-sm font-medium text-white hover:bg-[#086633]"
            >
              Open full dashboard
            </Link>
          </div>
        </aside>
      </section>

      <style jsx>{`
        .animate-stagger-in {
          opacity: 0;
          transform: translateY(8px) scale(0.995);
          animation: staggerIn 420ms ease forwards;
        }

        .animate-fade-in {
          animation: fadeIn 300ms ease;
        }

        @keyframes staggerIn {
          from {
            opacity: 0;
            transform: translateY(8px) scale(0.995);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
