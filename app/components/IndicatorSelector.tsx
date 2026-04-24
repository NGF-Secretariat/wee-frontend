"use client";

import React, { useState } from "react";
import {
  getAllIndicators,
  getIndicatorsByCategory,
  IndicatorMetadata,
  INDICATOR_CATEGORIES,
  IndicatorCategory,
} from "@/app/lib/indicator-config";

interface IndicatorSelectorProps {
  onSelect: (indicator: IndicatorMetadata) => void;
  selectedIndicator?: IndicatorMetadata | null;
}

export const IndicatorSelector: React.FC<IndicatorSelectorProps> = ({
  onSelect,
  selectedIndicator,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<IndicatorCategory | "all">("all");

  // Filter indicators based on search and category
  const filteredIndicators = (() => {
    let indicators =
      selectedCategory === "all"
        ? getAllIndicators()
        : getIndicatorsByCategory(selectedCategory as IndicatorCategory);

    if (searchTerm.trim() !== "") {
      const lowercaseSearch = searchTerm.toLowerCase();
      indicators = indicators.filter(
        (ind) =>
          ind.label.toLowerCase().includes(lowercaseSearch) ||
          ind.description.toLowerCase().includes(lowercaseSearch) ||
          ind.id.toLowerCase().includes(lowercaseSearch)
      );
    }

    return indicators.sort((a, b) => a.label.localeCompare(b.label));
  })();

  return (
    <div className="w-full max-w-md">
      <div className="relative">
        {/* Dropdown Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-left"
        >
          <div className="flex items-center justify-between">
            <span className="text-gray-900 font-medium">
              {selectedIndicator ? selectedIndicator.label : "Select an indicator..."}
            </span>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
            {/* Search Box */}
            <div className="p-3 border-b border-gray-200 sticky top-0 bg-white">
              <input
                type="text"
                placeholder="Search indicators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>

            {/* Category Filter */}
            <div className="p-3 border-b border-gray-200 sticky top-12 bg-gray-50">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedCategory === "all"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  All
                </button>
                {Object.entries(INDICATOR_CATEGORIES).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key as IndicatorCategory)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      selectedCategory === key
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Indicator List */}
            <div className="max-h-96 overflow-y-auto">
              {filteredIndicators.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  No indicators found matching your search.
                </div>
              ) : (
                filteredIndicators.map((indicator) => (
                  <button
                    key={indicator.id}
                    onClick={() => {
                      onSelect(indicator);
                      setIsOpen(false);
                      setSearchTerm("");
                      setSelectedCategory("all");
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-100 border-b border-gray-100 transition-colors ${
                      selectedIndicator?.id === indicator.id
                        ? "bg-green-50 border-l-4 border-green-600"
                        : ""
                    }`}
                  >
                    <div>
                      <p className="font-medium text-sm text-gray-900">{indicator.label}</p>
                      <p className="text-xs text-gray-600 mt-1">{indicator.description}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {INDICATOR_CATEGORIES[indicator.category]}
                        </span>
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          {indicator.preferredChart.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Selected Indicator Info */}
      {selectedIndicator && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">Selected Indicator</h4>
          <div className="text-sm text-blue-800">
            <p>
              <span className="font-medium">Type:</span> {selectedIndicator.type}
            </p>
            <p>
              <span className="font-medium">Chart:</span> {selectedIndicator.preferredChart}
            </p>
            {selectedIndicator.unit && (
              <p>
                <span className="font-medium">Unit:</span> {selectedIndicator.unit}
              </p>
            )}
            {selectedIndicator.source && (
              <p>
                <span className="font-medium">Source:</span> {selectedIndicator.source}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
