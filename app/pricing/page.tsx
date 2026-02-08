import PageAnalytics from "@/components/PageAnalytics";
import TrackedLink from "@/components/TrackedLink";

const tiers = [
  {
    name: "Free",
    price: "$0",
    detail: "Basic usage limits",
    features: [
      "Core tools with daily caps",
      "Standard processing speed",
      "Community support",
    ],
    cta: "Start Free",
    href: "/tools",
  },
  {
    name: "Pro",
    price: "$19/mo",
    detail: "Higher limits, faster processing, advanced tools",
    features: [
      "Higher usage limits",
      "Priority processing speed",
      "Advanced AI + PDF workflows",
    ],
    cta: "Upgrade to Pro",
    href: "/contact",
  },
];

export default function PricingPage() {
  return (
    <div className="page-shell">
      <PageAnalytics event="landing_view" payload={{ page: "/pricing" }} />

      <section className="page-intro reveal-fade-up">
        <h1 className="page-title">Pricing</h1>
        <p className="page-subtitle">
          Simple plans for freelancers and small agencies.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 max-w-4xl mx-auto w-full">
        {tiers.map((tier) => (
          <article key={tier.name} className="service-card reveal-fade-up">
            <h2 className="text-2xl font-semibold">{tier.name}</h2>
            <p className="text-3xl font-bold my-3">{tier.price}</p>
            <p className="text-muted mb-4">{tier.detail}</p>
            <ul className="space-y-2 mb-5">
              {tier.features.map((feature) => (
                <li key={feature} className="text-muted">• {feature}</li>
              ))}
            </ul>
            <TrackedLink
              href={tier.href}
              className="primary-btn"
              eventName={tier.name === "Pro" ? "upgrade_click" : "tool_start"}
              eventPayload={{ tier: tier.name.toLowerCase(), source: "pricing", tool: "/tools" }}
            >
              {tier.cta}
            </TrackedLink>
          </article>
        ))}
      </section>
    </div>
  );
}
