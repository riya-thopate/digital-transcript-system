import { useEffect, useState, useRef } from "react";
import heroIllustration from "@/assets/hero-illustration.png";

const stats = [
  { end: 94, suffix: "%", label: "Detection Accuracy" },
  { end: 12, suffix: "mo", label: "Earlier Identification" },
  { end: 3200, suffix: "+", label: "Children Screened" },
];

function useCounter(end: number, duration = 1800) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * end));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return { value, ref };
}

const StatItem = ({ end, suffix, label }: (typeof stats)[0]) => {
  const { value, ref } = useCounter(end);
  return (
    <div ref={ref} className="text-center">
      <p className="text-2xl md:text-3xl font-semibold tabular-nums text-foreground">
        {value.toLocaleString()}
        <span className="text-primary">{suffix}</span>
      </p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
};

const HeroSection = () => (
  <section className="pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
    <div className="container">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-up">
          <span className="inline-block text-xs font-medium tracking-widest uppercase text-primary bg-sage-light px-3 py-1.5 rounded-full mb-5">
            AI-Powered Child Development
          </span>
          <h1 className="text-display text-4xl md:text-5xl lg:text-6xl leading-[1.08] text-foreground mb-6">
            Early detection that changes lives
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed">
            NeuroGuardian combines machine learning and natural language processing
            to predict developmental risks — giving parents and clinicians the
            clarity to act early.
          </p>
          <div className="flex flex-wrap gap-3 mb-12">
            <button className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 active:scale-[0.97] transition-all duration-200 shadow-lg shadow-primary/20">
              Start Screening
            </button>
            <button className="group px-6 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-muted active:scale-[0.97] transition-all duration-200">
              View Demo
              <span className="inline-block ml-1 group-hover:translate-x-0.5 transition-transform">→</span>
            </button>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/60">
            {stats.map((s) => (
              <StatItem key={s.label} {...s} />
            ))}
          </div>
        </div>
        <div className="animate-fade-up flex justify-center" style={{ animationDelay: "150ms" }}>
          <div className="relative">
            <div className="absolute -inset-8 bg-sage-light/40 rounded-full blur-3xl" />
            <img
              src={heroIllustration}
              alt="Neural network shield representing developmental protection"
              className="relative w-80 md:w-96 drop-shadow-xl"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
