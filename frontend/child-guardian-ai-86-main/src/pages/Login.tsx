import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Users, Stethoscope, Mail, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type Role = "parent" | "doctor";

const Login = () => {
  const [role, setRole] = useState<Role | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    // Simulated login
    toast({ title: `Welcome back!`, description: `Logged in as ${role}` });
    navigate(role === "parent" ? "/parent" : "/doctor");
  };

  if (!role) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg"
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-4">
              <Brain className="h-8 w-8 text-primary" />
              <span className="text-2xl font-display font-bold" style={{ color: 'hsl(0, 0%, 92%)' }}>NeuroGuardian</span>
            </div>
            <p className="text-muted-foreground">Select your role to continue</p>
          </div>

          <div className="grid gap-4">
            {([
              { r: "parent" as Role, icon: Users, title: "Parent", desc: "Screen your child's development" },
              { r: "doctor" as Role, icon: Stethoscope, title: "Doctor", desc: "Access patient analytics" },
            ]).map((item) => (
              <motion.button
                key={item.r}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setRole(item.r)}
                className="bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all text-left flex items-center gap-5 border border-border"
              >
                <div className="gradient-primary w-14 h-14 rounded-xl flex items-center justify-center shrink-0">
                  <item.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </motion.button>
            ))}
          </div>

          <button
            onClick={() => navigate("/")}
            className="mt-6 mx-auto flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl shadow-elevated p-8 w-full max-w-md border border-border"
      >
        <button
          onClick={() => setRole(null)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Change role
        </button>

        <div className="text-center mb-8">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 ${role === 'parent' ? 'gradient-primary' : 'bg-accent'}`}>
            {role === "parent" ? <Users className="h-7 w-7 text-primary-foreground" /> : <Stethoscope className="h-7 w-7 text-accent-foreground" />}
          </div>
          <h2 className="text-2xl font-display font-bold text-foreground">
            {role === "parent" ? "Parent" : "Doctor"} Login
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Enter your credentials to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" className="w-full gradient-primary text-primary-foreground font-semibold py-5 rounded-xl">
            Sign In
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Demo: enter any email/password to continue
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
