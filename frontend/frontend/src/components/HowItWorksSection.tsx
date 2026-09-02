import { useState } from "react";
import { Upload, Cpu, ShieldCheck, ClipboardList } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const steps = [
  {
    num: "01",
    icon: Upload,
    title: "Input Data",
    desc: "Parents or clinicians enter developmental observations, milestones, and behavioral notes through our guided questionnaire.",
    detail: "Supports structured checklists and free-text clinical notes. Data is encrypted end-to-end.",
  },
  {
    num: "02",
    icon: Cpu,
    title: "AI Analysis",
    desc: "Our ML and NLP pipeline processes inputs against validated developmental models and population baselines.",
    detail: "Ensemble models cross-reference WHO growth standards, ASQ-3, and M-CHAT-R frameworks.",
  },
  {
    num: "03",
    icon: ShieldCheck,
    title: "Risk Assessment",
    desc: "Receive a detailed risk profile with confidence scores and explainable contributing factors.",
    detail: "Every flag links to the specific data point that triggered it — fully transparent.",
  },
  {
    num: "04",
    icon: ClipboardList,
    title: "Recommendations",
    desc: "Get personalized, evidence-based action plans and specialist referral guidance.",
    detail: "Recommendations adapt based on age, region, and available local resources.",
  },
];

const HowItWorksSection = () => {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section id="how-it-works" className="py-28">
      <div className="container max-w-3xl">
        <ScrollReveal className="text-center mb-16">
          <p className="text-sm font-medium tracking-widest uppercase text-primary mb-3">
            Process
          </p>
          <h2 className="text-display text-3xl md:text-4xl text-foreground">
            From observation to action
          </h2>
        </ScrollReveal>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[23px] top-2 bottom-2 w-px bg-border/80 hidden sm:block" />

          <div className="space-y-4">
            {steps.map((s, i) => (
              <ScrollReveal key={s.num} delay={i * 100}>
                <button
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  className={`relative w-full text-left flex gap-5 items-start p-5 rounded-xl transition-all duration-300 ${
                    expanded === i
                      ? "bg-sage-light/60 shadow-sm"
                      : "hover:bg-muted/40"
                  }`}
                >
                  {/* Timeline dot */}
                  <div
                    className={`relative z-10 w-[46px] h-[46px] rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                      expanded === i
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "bg-sage-light text-primary"
                    }`}
                  >
                    <s.icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-mono text-primary/50">{s.num}</span>
                      <h3 className="font-semibold text-foreground">{s.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        expanded === i ? "max-h-24 opacity-100 mt-3" : "max-h-0 opacity-0"
                      }`}
                    >
                      <p className="text-sm text-foreground/70 bg-background/60 rounded-lg p-3 border border-border/40">
                        {s.detail}
                      </p>
                    </div>
                  </div>

                  {/* Expand indicator */}
                  <span
                    className={`text-muted-foreground/40 text-lg shrink-0 transition-transform duration-300 ${
                      expanded === i ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
