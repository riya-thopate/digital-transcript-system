import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const CtaSection = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <section className="py-28">
      <div className="container">
        <ScrollReveal>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-display text-3xl md:text-4xl text-foreground mb-4">
              Every milestone matters
            </h2>
            <p className="text-muted-foreground mb-10 leading-relaxed">
              Join clinicians and families using NeuroGuardian to identify developmental
              concerns earlier, when intervention is most effective.
            </p>

            {submitted ? (
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sage-light text-primary font-medium animate-fade-up">
                <CheckCircle2 className="w-5 h-5" />
                You're on the list — we'll be in touch soon.
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
                />
                <button
                  type="submit"
                  className="h-12 px-6 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 active:scale-[0.97] transition-all duration-200 shadow-lg shadow-primary/20 flex items-center gap-2 whitespace-nowrap"
                >
                  Request Access
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            <p className="text-xs text-muted-foreground mt-4">
              No credit card required · HIPAA-compliant · Cancel anytime
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CtaSection;
