"use client";

import React from "react";
import { IndicatorMetadata } from "@/app/lib/indicator-config";
import { DataInsight, generateInsights, formatValue } from "@/app/lib/data-utils";
import { StateData } from "@/app/lib/mock-data";

interface InsightsPanelProps {
  indicator: IndicatorMetadata;
  data: StateData[];
}

export const InsightsPanel: React.FC<InsightsPanelProps> = ({ indicator, data }) => {
  const insights = generateInsights(data, indicator);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Key Insights</h3>

      <div className="space-y-4">
        {insights.map((insight, idx) => (
          <InsightCard key={idx} insight={insight} unit={indicator.unit} />
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
          <p className="text-sm text-amber-800">
            <span className="font-semibold">ℹ️ About this indicator:</span>
            <br />
            {indicator.description}
            {indicator.helpText && (
              <>
                <br />
                <br />
                💡 {indicator.helpText}
              </>
            )}
          </p>
        </div>
      </div>

      {indicator.source && (
        <div className="mt-4 text-xs text-gray-500">
          <strong>Source:</strong> {indicator.source}
        </div>
      )}
    </div>
  );
};

/**
 * Individual Insight Card
 */
interface InsightCardProps {
  insight: DataInsight;
  unit?: string;
}

const InsightCard: React.FC<InsightCardProps> = ({ insight, unit }) => {
  const bgColorMap = {
    stat: "bg-blue-50 border-blue-200",
    ranking: "bg-green-50 border-green-200",
    gap: "bg-red-50 border-red-200",
  };

  const textColorMap = {
    stat: "text-blue-900",
    ranking: "text-green-900",
    gap: "text-red-900",
  };

  const iconMap = {
    stat: "📈",
    ranking: "🏆",
    gap: "⚠️",
  };

  return (
    <div className={`p-3 rounded-lg border ${bgColorMap[insight.type]}`}>
      <div className="flex items-start gap-3">
        <span className="text-xl">{iconMap[insight.type]}</span>
        <div className="flex-1">
          <p className={`font-semibold text-sm ${textColorMap[insight.type]}`}>
            {insight.title}
          </p>
          <p className={`text-lg font-bold ${textColorMap[insight.type]}`}>
            {insight.value}
          </p>
          <p className={`text-xs ${textColorMap[insight.type]} opacity-75`}>
            {insight.description}
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Comparison Card - for showing male vs female comparison
 */
interface ComparisonCardProps {
  label: string;
  femaleValue: number;
  maleValue: number;
  unit?: string;
}

export const ComparisonCard: React.FC<ComparisonCardProps> = ({
  label,
  femaleValue,
  maleValue,
  unit = "%",
}) => {
  const gap = Math.abs(maleValue - femaleValue);
  const gapPercentage = ((gap / maleValue) * 100).toFixed(1);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{label}</h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Female */}
        <div className="text-center p-4 bg-pink-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">👩 Female</p>
          <p className="text-3xl font-bold text-pink-600">
            {femaleValue}
            <span className="text-lg">{unit}</span>
          </p>
        </div>

        {/* Male */}
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">👨 Male</p>
          <p className="text-3xl font-bold text-blue-600">
            {maleValue}
            <span className="text-lg">{unit}</span>
          </p>
        </div>
      </div>

      {/* Gap Analysis */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600 mb-2">⚖️ Gender Gap</p>
        <p className="text-2xl font-bold text-gray-800">
          {gap}
          <span className="text-lg">{unit}</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Males have {gapPercentage}% higher participation
        </p>
      </div>
    </div>
  );
};
