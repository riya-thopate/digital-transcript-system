import { useState, useEffect, useRef } from "react";
import { TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const tabs = ["Overview", "Milestones", "Timeline"] as const;

const metrics = [
  { label: "Overall Risk", value: "Low", color: "text-primary", icon: CheckCircle2 },
  { label: "Confidence", value: "87.3%", color: "text-foreground", icon: TrendingUp },
  { label: "Flags", value: "2", color: "text-amber-600", icon: AlertTriangle },
];

const milestones = [
  { name: "Motor Skills", progress: 92, status: "On Track" },
  { name: "Language Development", progress: 68, status: "Monitor" },
  { name: "Social-Emotional", progress: 85, status: "On Track" },
  { name: "Cognitive", progress: 78, status: "On Track" },
];

const timeline = [
  { date: "Mar 2026", event: "Routine screening completed", type: "success" },
  { date: "Feb 2026", event: "Language flag raised — monitoring initiated", type: "warning" },
  { date: "Jan 2026", event: "Motor skills milestone achieved", type: "success" },
  { date: "Dec 2025", event: "Initial assessment baseline established", type: "neutral" },
];

function AnimatedBar({ progress }: { progress: number }) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setWidth(progress), 100);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [progress]);

  return (
    <div ref={ref} className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
      <div
        className="h-full rounded-full bg-primary transition-all duration-1000 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

const DashboardPreview = () => {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Overview");

  return (
    <section id="dashboard" className="py-28 bg-cream/50">
      <div className="container">
        <ScrollReveal className="text-center mb-12">
          <p className="text-sm font-medium tracking-widest uppercase text-primary mb-3">
            Interactive Dashboard
          </p>
          <h2 className="text-display text-3xl md:text-4xl text-foreground">
            Clear insights at a glance
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <div className="max-w-4xl mx-auto rounded-2xl bg-background border border-border/60 shadow-xl overflow-hidden">
            {/* Header with tabs */}
            <div className="px-6 py-4 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-foreground">Developmental Summary</p>
                <p className="text-xs text-muted-foreground">Last updated: March 2026</p>
              </div>
              <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                      activeTab === tab
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Metrics row — always visible */}
            <div className="grid grid-cols-3 divide-x divide-border/60 border-b border-border/60">
              {metrics.map((m) => (
                <div key={m.label} className="p-5 text-center group cursor-default">
                  <m.icon
                    className={`w-5 h-5 mx-auto mb-2 ${m.color} group-hover:scale-110 transition-transform duration-200`}
                  />
                  <p className={`text-xl font-semibold tabular-nums ${m.color}`}>{m.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
                </div>
              ))}
            </div>

            {/* Tab content */}
            <div className="p-6 min-h-[220px]">
              {activeTab === "Overview" && (
                <div className="space-y-4 animate-fade-in">
                  {milestones.map((m) => (
                    <div key={m.name} className="flex items-center gap-4">
                      <span className="text-sm text-foreground w-40 shrink-0">{m.name}</span>
                      <AnimatedBar progress={m.progress} />
                      <span className="text-xs font-medium tabular-nums w-10 text-right text-muted-foreground">
                        {m.progress}%
                      </span>
                      <span
                        className={`text-xs font-medium w-20 text-right ${
                          m.status === "Monitor" ? "text-amber-600" : "text-primary"
                        }`}
                      >
                        {m.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "Milestones" && (
                <div className="grid grid-cols-2 gap-4 animate-fade-in">
                  {milestones.map((m) => (
                    <div
                      key={m.name}
                      className={`p-4 rounded-xl border transition-colors ${
                        m.status === "Monitor"
                          ? "border-amber-200 bg-amber-50/50"
                          : "border-border/60 bg-sage-light/30"
                      }`}
                    >
                      <p className="text-sm font-medium text-foreground mb-1">{m.name}</p>
                      <p className="text-2xl font-semibold tabular-nums text-foreground">
                        {m.progress}%
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          m.status === "Monitor" ? "text-amber-600" : "text-primary"
                        }`}
                      >
                        {m.status}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "Timeline" && (
                <div className="space-y-3 animate-fade-in">
                  {timeline.map((t, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                          t.type === "success"
                            ? "bg-primary"
                            : t.type === "warning"
                            ? "bg-amber-500"
                            : "bg-muted-foreground/40"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-sm text-foreground">{t.event}</p>
                        <p className="text-xs text-muted-foreground">{t.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default DashboardPreview;
