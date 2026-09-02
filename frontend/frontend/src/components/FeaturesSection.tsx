import { Brain, BarChart3, FileText, MessageSquare, type LucideIcon } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const features: { icon: LucideIcon; title: string; desc: string; accent: string }[] = [
  {
    icon: Brain,
    title: "ML-Driven Risk Prediction",
    desc: "Analyzes developmental milestones against large-scale datasets to identify patterns that indicate potential delays.",
    accent: "group-hover:bg-primary group-hover:text-primary-foreground",
  },
  {
    icon: MessageSquare,
    title: "NLP Analysis",
    desc: "Processes clinical notes, parent observations, and behavioral descriptions to extract meaningful developmental signals.",
    accent: "group-hover:bg-primary group-hover:text-primary-foreground",
  },
  {
    icon: BarChart3,
    title: "Confidence Scoring",
    desc: "Every prediction includes transparent confidence intervals and explainable reasoning — no black-box results.",
    accent: "group-hover:bg-primary group-hover:text-primary-foreground",
  },
  {
    icon: FileText,
    title: "Actionable Reports",
    desc: "Generates personalized recommendations with evidence-based next steps for parents and healthcare providers.",
    accent: "group-hover:bg-primary group-hover:text-primary-foreground",
  },
];

const FeaturesSection = () => (
  <section id="features" className="py-28 bg-cream/50">
    <div className="container">
      <ScrollReveal className="text-center mb-16">
        <p className="text-sm font-medium tracking-widest uppercase text-primary mb-3">
          Core Capabilities
        </p>
        <h2 className="text-display text-3xl md:text-4xl text-foreground mb-4">
          Built for clinical confidence
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Four pillars of intelligent analysis working together to deliver trustworthy developmental insights.
        </p>
      </ScrollReveal>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <ScrollReveal key={f.title} delay={i * 80}>
            <div className="group relative p-6 rounded-xl bg-background border border-border/60 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full cursor-default">
              <div
                className={`w-11 h-11 rounded-xl bg-sage-light flex items-center justify-center mb-5 transition-all duration-300 ${f.accent}`}
              >
                <f.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <h3 className="font-semibold text-foreground mb-2 text-[0.95rem]">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
