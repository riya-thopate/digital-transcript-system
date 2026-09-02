import { Shield } from "lucide-react";

const links = {
  Product: ["Features", "Dashboard", "Pricing", "Security"],
  Resources: ["Documentation", "API Reference", "Research"],
  Company: ["About", "Careers", "Contact", "Privacy"],
};

const Footer = () => (
  <footer className="border-t border-border/60 bg-cream/30">
    <div className="container py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">NeuroGuardian</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            AI-powered developmental screening for earlier detection and better outcomes.
          </p>
        </div>

        {/* Link columns */}
        {Object.entries(links).map(([title, items]) => (
          <div key={title}>
            <p className="text-sm font-semibold text-foreground mb-3">{title}</p>
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-10 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <p>© 2026 NeuroGuardian. Built for better beginnings.</p>
        <p>HIPAA Compliant · SOC 2 Type II · GDPR Ready</p>
      </div>
    </div>
  </footer>
);

export default Footer;
