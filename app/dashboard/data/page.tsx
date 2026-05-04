import { Suspense } from "react";
import { DataDashboard } from "@/app/components/data/DataDashboard";

export default function DataPage() {
  return (
    <Suspense fallback={<div className="p-4 text-sm text-gray-600">Loading dashboard...</div>}>
      <DataDashboard />
    </Suspense>
  );
}
