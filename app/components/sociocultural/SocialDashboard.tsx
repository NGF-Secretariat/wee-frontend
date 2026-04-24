"use client";

import React, { useState, useMemo } from "react";
import {
  SOCIOCULTURAL_INDICATORS,
  SocioculturalIndicator,
  getIndicatorById,
  getAllCategories,
  CATEGORY_LABELS,
  IndicatorCategory,
} from "@/app/lib/sociocultural-indicator-config";
import { SocioculturalSmartChart } from "./SmartChart";
import {
  STATE_GENDER_DATA,
  INFRASTRUCTURE_DATA,
  getSortedStates,
} from "@/app/lib/sociocultural-mock-data";

interface InsightData {
  highestState?: string;
  lowestState?: string;
  highestValue?: number;
  lowestValue?: number;
  nationalAverage?: number;
  topThreeStates?: Array<{ state: string; value: number }>;
}

export const SocialDashboard: React.FC = () => {
  const [selectedIndicatorId, setSelectedIndicatorId] = useState<string>(
    SOCIOCULTURAL_INDICATORS[0]?.id || ""
  );
  const [selectedCategory, setSelectedCategory] = useState<IndicatorCategory | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const selectedIndicator = useMemo(
    () => getIndicatorById(selectedIndicatorId),
    [selectedIndicatorId]
  );

  // Filter indicators based on category and search
  const filteredIndicators = useMemo(() => {
    let filtered = SOCIOCULTURAL_INDICATORS;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((ind) => ind.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter((ind) =>
        ind.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [selectedCategory, searchTerm]);

  // Calculate insights
  const insights = useMemo(() => {
    if (!selectedIndicator) return {};

    const states = getSortedStates();
    const values: Array<{ state: string; value: number }> = [];

    states.forEach((state) => {
      if (selectedIndicator.isMaleFemalePair) {
        const stateData = STATE_GENDER_DATA.find((s) => s.state === state);
        if (stateData) {
          const femaleValue = (stateData as any)[selectedIndicator.dataKey] || 0;
          values.push({ state, value: femaleValue });
        }
      } else if (selectedIndicator.category === "infrastructure") {
        const infraData = INFRASTRUCTURE_DATA.find((s) => s.state === state);
        if (infraData) {
          const value = (infraData as any)[selectedIndicator.dataKey] || 0;
          values.push({ state, value });
        }
      } else {
        const stateData = STATE_GENDER_DATA.find((s) => s.state === state);
        if (stateData) {
          const value = (stateData as any)[selectedIndicator.dataKey] || 0;
          values.push({ state, value });
        }
      }
    });

    if (values.length === 0) return {};

    const sorted = [...values].sort((a, b) => b.value - a.value);
    const avg = values.reduce((sum, v) => sum + v.value, 0) / values.length;

    return {
      highestState: sorted[0]?.state,
      lowestState: sorted[sorted.length - 1]?.state,
      highestValue: sorted[0]?.value,
      lowestValue: sorted[sorted.length - 1]?.value,
      nationalAverage: avg,
      topThreeStates: sorted.slice(0, 3),
    } as InsightData;
  }, [selectedIndicator]);

  const categories = getAllCategories();

  return (
    <div className="flex flex-col space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#06923E] mb-2">
          Social & Welfare Indicators Dashboard
        </h1>
        <p className="text-gray-600">
          Explore sociocultural, welfare, and infrastructure indicators across Nigeria
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-6 rounded-lg shadow-md border border-gray-200">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as IndicatorCategory | "all")}
            className="w-full px-4 py-2 border border-gray-300  text-black rounded-lg focus:outline-none focus:border-[#06923E] bg-white cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Search Indicator
          </label>
          <input
            type="text"
            placeholder="Type to search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border text-black bg-white border-gray-300 rounded-lg focus:outline-none focus:border-[#06923E]"
          />
        </div>

        {/* Indicator Selector */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select Indicator ({filteredIndicators.length})
          </label>
          <select
            value={selectedIndicatorId}
            onChange={(e) => setSelectedIndicatorId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#06923E] bg-white text-black cursor-pointer"
          >
            {filteredIndicators.map((ind) => (
              <option key={ind.id} value={ind.id}>
                {ind.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Chart - Takes up 3 columns */}
        <div className="lg:col-span-3">
          <SocioculturalSmartChart
            indicator={selectedIndicator}
            showStates={true}
          />
        </div>

        {/* Insights Panel - Takes up 1 column */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 h-fit">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Insights</h2>

          {selectedIndicator ? (
            <div className="space-y-4">
              {/* Description */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">{selectedIndicator.description}</p>
              </div>

              {/* Key Statistics */}
              {Object.keys(insights).length > 0 && (
                <div className="space-y-3">
                  {/* National Average */}
                  {insights.nationalAverage !== undefined && (
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-xs text-gray-600">National Average</p>
                      <p className="text-lg font-bold text-[#06923E]">
                        {insights.nationalAverage.toFixed(
                          selectedIndicator.unit === "hours" ? 1 : 1
                        )}{" "}
                        {selectedIndicator.unit}
                      </p>
                    </div>
                  )}

                  {/* Highest */}
                  {insights.highestState && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs text-gray-600">Highest</p>
                      <p className="text-sm font-semibold text-blue-900">
                        {insights.highestState}
                      </p>
                      <p className="text-lg font-bold text-blue-700">
                        {insights.highestValue?.toFixed(
                          selectedIndicator.unit === "hours" ? 1 : 1
                        )}{" "}
                        {selectedIndicator.unit}
                      </p>
                    </div>
                  )}

                  {/* Lowest */}
                  {insights.lowestState && (
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-xs text-gray-600">Lowest</p>
                      <p className="text-sm font-semibold text-red-900">
                        {insights.lowestState}
                      </p>
                      <p className="text-lg font-bold text-red-700">
                        {insights.lowestValue?.toFixed(
                          selectedIndicator.unit === "hours" ? 1 : 1
                        )}{" "}
                        {selectedIndicator.unit}
                      </p>
                    </div>
                  )}

                  {/* Gap */}
                  {insights.highestValue !== undefined &&
                    insights.lowestValue !== undefined && (
                      <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-xs text-gray-600">Gap (High - Low)</p>
                        <p className="text-lg font-bold text-yellow-700">
                          {(insights.highestValue - insights.lowestValue).toFixed(1)}{" "}
                          {selectedIndicator.unit}
                        </p>
                      </div>
                    )}

                  {/* Top 3 States */}
                  {insights.topThreeStates && insights.topThreeStates.length > 0 && (
                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-xs text-gray-600 font-semibold mb-2">
                        Top 3 States
                      </p>
                      <div className="space-y-1">
                        {insights.topThreeStates.map((item, idx) => (
                          <div
                            key={item.state}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-gray-700">
                              {idx + 1}. {item.state}
                            </span>
                            <span className="font-semibold text-purple-700">
                              {item.value.toFixed(1)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              Select an indicator to view insights
            </p>
          )}
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-700 font-semibold">Total Indicators</p>
          <p className="text-2xl font-bold text-blue-900">
            {SOCIOCULTURAL_INDICATORS.length}
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <p className="text-xs text-green-700 font-semibold">Categories</p>
          <p className="text-2xl font-bold text-green-900">{categories.length}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <p className="text-xs text-purple-700 font-semibold">States Covered</p>
          <p className="text-2xl font-bold text-purple-900">10</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
          <p className="text-xs text-orange-700 font-semibold">Chart Types</p>
          <p className="text-2xl font-bold text-orange-900">4</p>
        </div>
      </div>
    </div>
  );
};
