import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Brain, Shield, Activity, BarChart3, Stethoscope, Users, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Brain, title: "AI-Powered Analysis", desc: "Hybrid ML & NLP engine analyzes developmental markers with clinical accuracy" },
  { icon: Shield, title: "Early Risk Detection", desc: "Identify speech, motor, social, and cognitive delays before they escalate" },
  { icon: Activity, title: "Explainable Results", desc: "Transparent AI explains every factor behind the risk assessment" },
  { icon: BarChart3, title: "Visual Dashboard", desc: "Interactive charts and confidence scores for data-driven decisions" },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative gradient-hero min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-primary/10 animate-pulse-glow"
              style={{
                width: 200 + i * 80,
                height: 200 + i * 80,
                top: `${10 + i * 15}%`,
                left: `${60 + i * 5}%`,
                animationDelay: `${i * 0.6}s`,
              }}
            />
          ))}
        </div>

        <div className="container relative z-10 py-20">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 mb-6">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">AI-Powered Developmental Screening</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold font-display tracking-tight mb-6" style={{ color: 'hsl(0, 0%, 96%)' }}>
                Neuro
                <span className="text-gradient">Guardian</span>
              </h1>
              <p className="text-lg md:text-xl mb-8 max-w-2xl" style={{ color: 'hsl(210, 15%, 70%)' }}>
                Detect developmental risks early with our hybrid AI system. Combining machine learning, 
                NLP analysis, and explainable AI to protect every child's future.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="gradient-primary text-primary-foreground font-semibold px-8 py-6 text-lg rounded-xl shadow-elevated hover:opacity-90 transition-opacity"
                  onClick={() => navigate("/login")}
                >
                  Get Started <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary/30 font-semibold px-8 py-6 text-lg rounded-xl hover:bg-primary/10 transition-colors"
                  style={{ color: 'hsl(210, 15%, 80%)' }}
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Learn More
                </Button>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-16 grid grid-cols-3 gap-8 max-w-lg"
            >
              {[
                { value: "95%", label: "Accuracy" },
                { value: "0-6yr", label: "Age Range" },
                { value: "< 2min", label: "Analysis Time" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold font-display text-primary">{stat.value}</div>
                  <div className="text-sm mt-1" style={{ color: 'hsl(210, 15%, 55%)' }}>{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4 text-foreground">
              How NeuroGuardian Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A comprehensive AI pipeline that analyzes multiple data points to deliver accurate, explainable risk assessments.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="gradient-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow border border-border"
              >
                <div className="gradient-primary w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <f.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2 text-foreground">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles CTA */}
      <section className="py-24 bg-muted/50">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Users, role: "Parent", desc: "Screen your child's development at home. Get AI-powered insights and personalized recommendations.", color: "primary" },
              { icon: Stethoscope, role: "Doctor", desc: "Access patient analytics, risk distributions, and comprehensive developmental reports.", color: "accent" },
            ].map((item, i) => (
              <motion.div
                key={item.role}
                initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all cursor-pointer border border-border group"
                onClick={() => navigate("/login")}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${item.color === 'primary' ? 'gradient-primary' : 'bg-accent'}`}>
                  <item.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-3 text-foreground">I'm a {item.role}</h3>
                <p className="text-muted-foreground mb-4">{item.desc}</p>
                <span className="text-primary font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Continue as {item.role} <ChevronRight className="h-4 w-4" />
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="gradient-hero py-12">
        <div className="container text-center">
          <h3 className="font-display font-bold text-xl mb-2" style={{ color: 'hsl(0, 0%, 90%)' }}>NeuroGuardian</h3>
          <p className="text-sm" style={{ color: 'hsl(210, 15%, 55%)' }}>AI-powered child development screening system</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
