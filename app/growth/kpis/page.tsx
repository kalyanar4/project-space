import PageAnalytics from "@/components/PageAnalytics";
import GrowthKpiDashboard from "@/components/GrowthKpiDashboard";
import TrackedLink from "@/components/TrackedLink";

export default function GrowthKpisPage() {
  return (
    <div className="page-shell">
      <PageAnalytics event="landing_view" payload={{ page: "/growth/kpis" }} />

      <section className="page-intro reveal-fade-up">
        <h1 className="page-title">Week 5 KPI Operating Dashboard</h1>
        <p className="page-subtitle">
          Track activation, retention, conversion, lead capture, and revenue per 1000 visitors.
        </p>
      </section>

      <GrowthKpiDashboard />

      <section className="cta-section reveal-fade-up">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Scale revenue with higher conversion power</h2>
        <TrackedLink
          href="/checkout/pro"
          className="primary-btn"
          eventName="upgrade_click"
          eventPayload={{ source: "growth_kpi_cta" }}
        >
          Upgrade to Pro
        </TrackedLink>
      </section>
    </div>
  );
}
