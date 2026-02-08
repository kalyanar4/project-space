interface ToolTrustSignalsProps {
  privacyNote: string;
  processingNote: string;
  reliabilityNote: string;
}

export default function ToolTrustSignals({
  privacyNote,
  processingNote,
  reliabilityNote,
}: ToolTrustSignalsProps) {
  return (
    <section className="glass-card trust-signals">
      <h2 className="text-xl font-semibold mb-3">Trust and Output Quality</h2>
      <div className="grid gap-3 md:grid-cols-3">
        <article className="trust-card">
          <h3 className="text-sm font-semibold uppercase tracking-wide mb-1">Privacy</h3>
          <p className="text-sm text-muted">{privacyNote}</p>
        </article>
        <article className="trust-card">
          <h3 className="text-sm font-semibold uppercase tracking-wide mb-1">Processing</h3>
          <p className="text-sm text-muted">{processingNote}</p>
        </article>
        <article className="trust-card">
          <h3 className="text-sm font-semibold uppercase tracking-wide mb-1">Reliability</h3>
          <p className="text-sm text-muted">{reliabilityNote}</p>
        </article>
      </div>
    </section>
  );
}
