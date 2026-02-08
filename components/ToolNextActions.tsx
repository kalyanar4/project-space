import TrackedLink from "@/components/TrackedLink";

interface NextAction {
  title: string;
  description: string;
  href: string;
}

interface ToolNextActionsProps {
  sourceToolId: string;
  actions: NextAction[];
}

export default function ToolNextActions({ sourceToolId, actions }: ToolNextActionsProps) {
  return (
    <section className="glass-card mt-5">
      <h3 className="text-lg font-semibold mb-3">Next Best Action</h3>
      <div className="grid gap-3 md:grid-cols-2">
        {actions.map((action) => (
          <article key={action.title} className="trust-card">
            <h4 className="text-base font-semibold mb-1">{action.title}</h4>
            <p className="text-sm text-muted mb-3">{action.description}</p>
            <TrackedLink
              href={action.href}
              className="secondary-btn"
              eventName="tool_start"
              eventPayload={{ tool: action.href, source: `next_action_${sourceToolId}` }}
            >
              {action.title}
            </TrackedLink>
          </article>
        ))}
      </div>
    </section>
  );
}
