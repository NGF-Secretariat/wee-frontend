"use client";

import React, { useState, useMemo } from "react";
import { IndicatorSelector } from "@/app/components/IndicatorSelector";
import { SmartChart } from "@/app/components/SmartChart";
import { InsightsPanel, ComparisonCard } from "@/app/components/InsightsPanel";
import { KPIGrid } from "@/app/components/KPICard";
import {
  IndicatorMetadata,
  getIndicatorById,
} from "@/app/lib/indicator-config";
import {
  STATE_DATA,
  NATIONAL_DATA,
  EMPLOYMENT_SECTOR_DISTRIBUTION,
  GENDER_COMPARISON_DATA} from "@/app/lib/mock-data";
import {
  transformForBarChart,
  transformForGenderComparison
} from "@/app/lib/data-utils";

export default function EconomicParticipationPage() {
  // State management
  const [selectedIndicatorId, setSelectedIndicatorId] = useState<string>(
    "female_labour_force_participation"
  );
  const [drillDownLevel, setDrillDownLevel] = useState<"national" | "state" | "lga">("national");

  // Get selected indicator
  const selectedIndicator = useMemo(
    () => getIndicatorById(selectedIndicatorId),
    [selectedIndicatorId]
  );

  // Prepare chart data based on selected indicator
  const chartData = useMemo(() => {
    if (!selectedIndicator) return [];

    // For gender comparison indicators, prepare comparison data
    if (selectedIndicator.type === "mixed") {
      return transformForGenderComparison(
        STATE_DATA,
        "female_lfpr",
        "male_lfpr"
      );
    }

    // For distribution (pie chart)
    if (selectedIndicator.preferredChart === "pie") {
      if (selectedIndicator.dataKey === "female_sector_dist") {
        return EMPLOYMENT_SECTOR_DISTRIBUTION.female_sector_dist;
      }
      if (selectedIndicator.dataKey === "male_sector_dist") {
        return EMPLOYMENT_SECTOR_DISTRIBUTION.male_sector_dist;
      }
    }

    // For bar charts and maps
    if (selectedIndicator.preferredChart === "bar" || selectedIndicator.preferredChart === "map") {
      return transformForBarChart(STATE_DATA, selectedIndicator);
    }

    // Default
    return transformForBarChart(STATE_DATA, selectedIndicator);
  }, [selectedIndicator]);

  // Handle indicator selection
  const handleIndicatorSelect = (indicator: IndicatorMetadata) => {
    setSelectedIndicatorId(indicator.id);
    setDrillDownLevel("national");
  };

  // Get KPI cards for overview
  const kpiCards: React.ComponentProps<typeof KPIGrid>["cards"] = [
    {
      label: "Female Labour Participation",
      value: NATIONAL_DATA.female_lfpr,
      unit: "%",
      description: "National average",
      color: "bg-gradient-to-br from-pink-50 to-rose-100",
    },
    {
      label: "Male Labour Participation",
      value: NATIONAL_DATA.male_lfpr,
      unit: "%",
      description: "National average",
      color: "bg-gradient-to-br from-blue-50 to-cyan-100",
    },
    {
      label: "Female Business Ownership",
      value: NATIONAL_DATA.female_business,
      unit: "%",
      description: "National average",
      color: "bg-gradient-to-br from-amber-50 to-orange-100",
    },
    {
      label: "Financial Inclusion (Female)",
      value: NATIONAL_DATA.female_banking,
      unit: "%",
      description: "Bank account access",
      color: "bg-gradient-to-br from-green-50 to-emerald-100",
    },
  ];

  return (
    <div className="flex flex-col space-y-6 pb-8">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-[#06923E] mb-2">
          📊 Economic Participation Dashboard
        </h1>
        <p className="text-gray-600">
          Comprehensive gender-disaggregated analysis of economic participation across Nigeria
        </p>
      </div>

      {/* National Overview KPIs */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">📈 National Overview</h2>
        <KPIGrid cards={kpiCards} columns={4} />
      </section>

      {/* Divider */}
      <div className="h-px bg-gray-200" />

      {/* Main Dashboard Section */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Panel: Selector & Insights */}
        <div className="lg:col-span-1 space-y-6">
          {/* Indicator Selector */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">🎯 Select Indicator</h3>
            <IndicatorSelector
              onSelect={handleIndicatorSelect}
              selectedIndicator={selectedIndicator}
            />
          </div>

          {/* Drill-down Level Selector */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">🗺️ View Level</h3>
            <div className="space-y-2">
              <button
                onClick={() => setDrillDownLevel("national")}
                className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  drillDownLevel === "national"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                🇳🇬 National
              </button>
              <button
                onClick={() => setDrillDownLevel("state")}
                className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  drillDownLevel === "state"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                📍 By State
              </button>
              <button
                onClick={() => setDrillDownLevel("lga")}
                className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  drillDownLevel === "lga"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                🏘️ By LGA
              </button>
            </div>
          </div>
        </div>

        {/* Center Panel: Main Chart */}
        <div className="lg:col-span-2">
          {selectedIndicator ? (
            <SmartChart
              indicator={selectedIndicator}
              data={chartData}
              height={500}
            />
          ) : (
            <div className="bg-white rounded-xl shadow-md p-6 h-full flex items-center justify-center">
              <p className="text-gray-500">Select an indicator to view visualization</p>
            </div>
          )}
        </div>

        {/* Right Panel: Insights */}
        <div className="lg:col-span-1">
          {selectedIndicator ? (
            <InsightsPanel indicator={selectedIndicator} data={STATE_DATA} />
          ) : (
            <div className="bg-white rounded-xl shadow-md p-6">
              <p className="text-gray-500">Insights will appear here</p>
            </div>
          )}
        </div>
      </section>

      {/* Gender Comparison Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">⚖️ Gender Comparison Overview</h2>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="space-y-4">
            {GENDER_COMPARISON_DATA.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">{item.indicator}</span>
                <div className="flex gap-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-600">👩 Female</p>
                    <p className="text-lg font-bold text-pink-600">{item.female}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">👨 Male</p>
                    <p className="text-lg font-bold text-blue-600">{item.male}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Gap</p>
                    <p className="text-lg font-bold text-red-600">
                      {Math.abs(item.male - item.female).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Employment by Sector Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">💼 Employment Distribution by Sector</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Female Sector Distribution */}
          <SmartChart
            indicator={{
              id: "female_sector_dist",
              label: "Female Employment by Sector",
              category: "labour",
              type: "female",
              preferredChart: "pie",
              description: "How females are distributed across employment sectors",
              dataKey: "female_sector_dist",
            }}
            data={EMPLOYMENT_SECTOR_DISTRIBUTION.female_sector_dist}
            height={300}
          />

          {/* Male Sector Distribution */}
          <SmartChart
            indicator={{
              id: "male_sector_dist",
              label: "Male Employment by Sector",
              category: "labour",
              type: "male",
              preferredChart: "pie",
              description: "How males are distributed across employment sectors",
              dataKey: "male_sector_dist",
            }}
            data={EMPLOYMENT_SECTOR_DISTRIBUTION.male_sector_dist}
            height={300}
          />
        </div>
      </section>

      {/* Key Indicators Comparison */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">📊 Key Gender Gaps</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ComparisonCard
            label="Labour Force Participation"
            femaleValue={NATIONAL_DATA.female_lfpr}
            maleValue={NATIONAL_DATA.male_lfpr}
            unit="%"
          />
          <ComparisonCard
            label="Business Ownership"
            femaleValue={NATIONAL_DATA.female_business}
            maleValue={NATIONAL_DATA.male_business}
            unit="%"
          />
          <ComparisonCard
            label="Bank Account Access"
            femaleValue={NATIONAL_DATA.female_banking}
            maleValue={NATIONAL_DATA.male_banking}
            unit="%"
          />
          <ComparisonCard
            label="Average Monthly Income"
            femaleValue={NATIONAL_DATA.female_income / 1000}
            maleValue={NATIONAL_DATA.male_income / 1000}
            unit="k₦"
          />
        </div>
      </section>

      {/* Footer Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-sm text-blue-800">
        <p className="font-semibold mb-2">ℹ️ About This Dashboard</p>
        <p>
          This Smart Visualization Dashboard intelligently selects the best chart type for each
          indicator based on the data characteristics. Click any indicator to explore detailed
          geographic distributions, gender comparisons, and trend analysis.
        </p>
      </div>
    </div>
  );
}
