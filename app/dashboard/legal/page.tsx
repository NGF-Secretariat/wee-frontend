import { GovernanceCharts } from "@/app/components/legal/GovernanceCharts";
import { LEGAL_GOVERNANCE_MOCK_DATA } from "@/app/lib/legal-governance-mock-data";

export default function LegalPage() {
  return <GovernanceCharts data={LEGAL_GOVERNANCE_MOCK_DATA} />;
}
