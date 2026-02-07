interface StateProps {
  title: string;
  description: string;
}

export function LoadingState({ title, description }: StateProps) {
  return (
    <div className="glass-card text-center">
      <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--accent-color)]" />
      <h3 className="text-lg font-semibold mt-3">{title}</h3>
      <p className="text-muted mt-1">{description}</p>
    </div>
  );
}

export function EmptyState({ title, description }: StateProps) {
  return (
    <div className="glass-card text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-muted mt-1">{description}</p>
    </div>
  );
}

export function ErrorState({ title, description }: StateProps) {
  return (
    <div className="glass-card text-center border-red-400/50">
      <h3 className="text-lg font-semibold text-red-500">{title}</h3>
      <p className="text-muted mt-1">{description}</p>
    </div>
  );
}
