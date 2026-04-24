"use client";

import React, { memo, useMemo } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from "recharts";

export interface GovernancePolicyIndicator {
  id: string;
  label: string;
  value: boolean | 0 | 1;
  description?: string;
}

export interface GovernanceNumericIndicator {
  id: string;
  label: string;
  value: number;
  unit?: string;
  trendPercentage?: number;
  description?: string;
  series?: Array<{ name: string; value: number }>;
}

export interface GovernanceStructuredData {
  policyIndicators: GovernancePolicyIndicator[];
  numericIndicators: GovernanceNumericIndicator[];
}

export interface GovernanceRawData {
  statutory_rights_occupancy_women?: boolean | 0 | 1;
  wee_policy_domestication?: boolean | 0 | 1;
  child_right_act_adoption?: boolean | 0 | 1;
  gbv_referral_centres?: number;
  gbv_referral_centres_trend?: number;
  gbv_referral_centres_by_state?: Array<{ name: string; value: number }>;
}

export interface GovernanceChartsProps {
  data: GovernanceStructuredData | GovernanceRawData;
  title?: string;
  className?: string;
  policyChartType?: "pie" | "horizontal-bar" | "auto";
}

const PIE_COLORS = ["#0f766e", "#d1d5db"];
const POLICY_BAR_COLORS = ["#14b8a6", "#cbd5e1"];

const normalizeTooltipValue = (
  value: number | string | readonly (number | string)[] | undefined
): string | number => {
  if (typeof value === "number" || typeof value === "string") {
    return value;
  }
  if (value === undefined) {
    return "N/A";
  }
  return value.join(", ");
};

const defaultPolicyLabels = {
  statutory_rights_occupancy_women: "Statutory Rights of Occupancy for Women",
  wee_policy_domestication: "Domestication of the WEE Policy",
  child_right_act_adoption: "Adoption of the Child Right Act",
};

function isStructuredData(input: GovernanceChartsProps["data"]): input is GovernanceStructuredData {
  return "policyIndicators" in input || "numericIndicators" in input;
}

function normalizeData(input: GovernanceChartsProps["data"]): GovernanceStructuredData {
  if (isStructuredData(input)) {
    return {
      policyIndicators: input.policyIndicators ?? [],
      numericIndicators: input.numericIndicators ?? [],
    };
  }

  return {
    policyIndicators: [
      {
        id: "statutory_rights_occupancy_women",
        label: defaultPolicyLabels.statutory_rights_occupancy_women,
        value: input.statutory_rights_occupancy_women ?? false,
      },
      {
        id: "wee_policy_domestication",
        label: defaultPolicyLabels.wee_policy_domestication,
        value: input.wee_policy_domestication ?? false,
      },
      {
        id: "child_right_act_adoption",
        label: defaultPolicyLabels.child_right_act_adoption,
        value: input.child_right_act_adoption ?? false,
      },
    ],
    numericIndicators: [
      {
        id: "gbv_referral_centres",
        label: "Number of Gender-Based Violence Referral Centres",
        value: input.gbv_referral_centres ?? 0,
        trendPercentage: input.gbv_referral_centres_trend,
        unit: "centres",
        series: input.gbv_referral_centres_by_state,
      },
    ],
  };
}

function GovernanceChartsComponent({
  data,
  title = "Governance, Legal & Policy Indicators",
  className,
  policyChartType = "auto",
}: GovernanceChartsProps) {
  const normalized = useMemo(() => normalizeData(data), [data]);

  const policyRows = normalized.policyIndicators.map((item) => {
    const numeric = item.value === true || item.value === 1 ? 1 : 0;
    return {
      id: item.id,
      name: item.label,
      value: numeric,
      status: numeric === 1 ? "Adopted" : "Not adopted",
    };
  });

  const policySummary = useMemo(() => {
    const adopted = policyRows.filter((row) => row.value === 1).length;
    const total = policyRows.length;
    return [
      { name: "Adopted", value: adopted },
      { name: "Not adopted", value: Math.max(total - adopted, 0) },
    ];
  }, [policyRows]);

  const firstCountMetric = normalized.numericIndicators[0];
  const numericSeries = firstCountMetric?.series ?? [
    { name: "Current", value: firstCountMetric?.value ?? 0 },
  ];

  const unit = firstCountMetric?.unit ? ` ${firstCountMetric.unit}` : "";

  const usePie = policyChartType === "pie" || (policyChartType === "auto" && policyRows.length >= 2);

  return (
    <div className={`space-y-6 ${className ?? ""}`}>
      <div className="rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-50 via-white to-cyan-50 p-6">
        <h2 className="text-2xl font-bold text-teal-800">{title}</h2>
        <p className="mt-2 text-sm text-gray-600">
          Policy adoption and referral-system capacity summary using chart-first legal/governance analytics.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <section className="space-y-4 xl:col-span-7">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Policy Adoption Status</h3>
            <p className="mt-1 text-sm text-gray-600">
              Boolean indicators are presented with high-contrast, low-noise visuals for fast interpretation.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
              {usePie ? (
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-2">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={policySummary} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={96} label>
                        {policySummary.map((entry) => (
                          <Cell key={entry.name} fill={entry.name === "Adopted" ? PIE_COLORS[0] : PIE_COLORS[1]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${normalizeTooltipValue(value)}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-2">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart
                      data={policyRows}
                      layout="vertical"
                      margin={{ top: 10, right: 10, left: 40, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis type="number" domain={[0, 1]} tickFormatter={(v) => (v === 1 ? "Yes" : "No")} />
                      <YAxis dataKey="name" type="category" width={180} tick={{ fontSize: 11 }} />
                      <Tooltip
                        formatter={(value) => {
                          const normalized = normalizeTooltipValue(value);
                          const asNumber = Number(normalized);
                          return !Number.isNaN(asNumber) && asNumber === 1 ? "Yes" : "No";
                        }}
                      />
                      <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                        {policyRows.map((row, idx) => (
                          <Cell key={`${row.id}-${idx}`} fill={row.value === 1 ? POLICY_BAR_COLORS[0] : POLICY_BAR_COLORS[1]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="space-y-3">
                {policyRows.map((row) => (
                  <div
                    key={row.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3"
                  >
                    <p className="text-sm text-gray-700">{row.name}</p>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        row.value === 1 ? "bg-emerald-100 text-emerald-800" : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {row.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">
              {firstCountMetric?.label ?? "Number of Gender-Based Violence Referral Centres"}
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Numeric legal-service infrastructure indicators are rendered as bar charts for quick distribution checks.
            </p>

            <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-2">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={numericSeries} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => `${normalizeTooltipValue(value)}${unit}`} />
                  <Bar dataKey="value" fill="#0f766e" radius={[6, 6, 0, 0]}>
                    <LabelList dataKey="value" position="top" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <aside className="space-y-4 xl:col-span-5">
          {normalized.numericIndicators.map((metric) => {
            const trend = metric.trendPercentage;
            const trendUp = (trend ?? 0) >= 0;

            return (
              <div key={metric.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">KPI</p>
                <p className="mt-2 text-sm text-gray-700">{metric.label}</p>
                <p className="mt-3 text-5xl font-bold text-gray-900">
                  {metric.value.toLocaleString()}
                  {metric.unit ? <span className="ml-2 text-lg font-medium text-gray-600">{metric.unit}</span> : null}
                </p>
                {typeof trend === "number" ? (
                  <p className={`mt-3 text-sm font-medium ${trendUp ? "text-emerald-700" : "text-red-700"}`}>
                    {trendUp ? "↑" : "↓"} {Math.abs(trend).toFixed(1)}% vs previous period
                  </p>
                ) : (
                  <p className="mt-3 text-sm text-gray-500">No trend data provided</p>
                )}
              </div>
            );
          })}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h4 className="text-base font-semibold text-gray-900">Interpretation Note</h4>
            <p className="mt-2 text-sm text-gray-600">
              Policy indicators report formal adoption status. Service-centre counts should be paired with quality,
              staffing, and accessibility metrics before drawing implementation conclusions.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export const GovernanceCharts = memo(GovernanceChartsComponent);
