type StatItem = { value: string; label: string };

type Props = {
  stats: StatItem[];
};

export function StatsStrip({ stats }: Props) {
  return (
    <section className="stats-strip">
      <div className="site-shell">
        <div className="stats-grid">
          {stats.map((item) => (
            <article key={item.label} className="stat-card surface-card">
              <span className="stat-value">{item.value}</span>
              <span className="stat-label">{item.label}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
