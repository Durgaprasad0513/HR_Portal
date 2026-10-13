import { useEffect, useRef, useState, type ComponentType } from 'react';
import type { DashboardChartsProps } from './DashboardCharts';

export function DeferredDashboardCharts(props: DashboardChartsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [Charts, setCharts] = useState<ComponentType<DashboardChartsProps> | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let requested = false;
    const loadCharts = () => {
      if (requested) return;
      requested = true;
      void import('./DashboardCharts').then(({ DashboardCharts }) => {
        setCharts(() => DashboardCharts);
      });
    };

    if (!('IntersectionObserver' in window)) {
      loadCharts();
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        loadCharts();
      }
    }, { rootMargin: '350px 0px' });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="min-w-0 w-full lg:col-span-2 grid auto-rows-fr grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8" aria-busy={!Charts}>
      {Charts ? (
        <Charts {...props} />
      ) : (
        <>
          {props.isAdminOrHR && props.attendanceTrend && (
            <div className="min-h-[360px] rounded-xl border border-slate-border bg-surface" aria-hidden="true" />
          )}
          <div className="min-h-[360px] rounded-xl border border-slate-border bg-surface" aria-hidden="true" />
        </>
      )}
    </div>
  );
}
