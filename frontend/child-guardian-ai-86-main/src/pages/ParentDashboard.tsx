import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, ArrowLeft, Send, AlertTriangle, CheckCircle2, Info, Lightbulb, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { analyzeChildData, type ChildData, type RiskResult } from "@/lib/mockData";
import RiskResultView from "@/components/RiskResultView";

const ParentDashboard = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState<RiskResult | null>(null);
  const [form, setForm] = useState<ChildData>({
    name: "",
    age: 24,
    gender: "male",
    speechDelay: false,
    motorDelay: false,
    socialScore: 7,
    screenTime: 1,
    sleepHours: 10,
    parentalConcernLevel: 1,
    parentConcernText: "",
    earlyPuberty: false,
    irregularPeriods: false,
    stressLevel: 1,
    weightGain: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = analyzeChildData(form);
    setResult(res);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-card sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Brain className="h-6 w-6 text-primary" />
            <span className="font-display font-bold text-lg text-foreground">NeuroGuardian</span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Parent</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/login")} className="text-muted-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" /> Logout
          </Button>
        </div>
      </header>

      <div className="container py-8 max-w-5xl">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-foreground mb-2">Child Development Assessment</h1>
                <p className="text-muted-foreground">Enter your child's information for AI-powered developmental risk screening.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <div className="bg-card rounded-xl border border-border shadow-card p-6">
                  <h2 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                    <Info className="h-5 w-5 text-info" /> Basic Information
                  </h2>
                  <div className="grid md:grid-cols-3 gap-5">
                    <div className="space-y-2">
                      <Label className="text-foreground">Child's Name</Label>
                      <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter name" required />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">Age (months)</Label>
                      <Input type="number" min={0} max={72} value={form.age} onChange={(e) => setForm({ ...form, age: Number(e.target.value) })} required />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">Gender</Label>
                      <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v as 'male' | 'female' })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Developmental Markers */}
                <div className="bg-card rounded-xl border border-border shadow-card p-6">
                  <h2 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" /> Developmental Markers
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-between">
                      <Label className="text-foreground">Speech Delay</Label>
                      <Switch checked={form.speechDelay} onCheckedChange={(v) => setForm({ ...form, speechDelay: v })} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-foreground">Motor Delay</Label>
                      <Switch checked={form.motorDelay} onCheckedChange={(v) => setForm({ ...form, motorDelay: v })} />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-foreground">Social Score: {form.socialScore}/10</Label>
                      <Slider min={1} max={10} step={1} value={[form.socialScore]} onValueChange={([v]) => setForm({ ...form, socialScore: v })} />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-foreground">Screen Time: {form.screenTime}h/day</Label>
                      <Slider min={0} max={8} step={0.5} value={[form.screenTime]} onValueChange={([v]) => setForm({ ...form, screenTime: v })} />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-foreground">Sleep Hours: {form.sleepHours}h</Label>
                      <Slider min={4} max={14} step={0.5} value={[form.sleepHours]} onValueChange={([v]) => setForm({ ...form, sleepHours: v })} />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-foreground">Concern Level: {form.parentalConcernLevel}/5</Label>
                      <Slider min={1} max={5} step={1} value={[form.parentalConcernLevel]} onValueChange={([v]) => setForm({ ...form, parentalConcernLevel: v })} />
                    </div>
                  </div>
                </div>

                {/* Girls Health */}
                {form.gender === "female" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-card rounded-xl border border-border shadow-card p-6"
                  >
                    <h2 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-warning" /> Girls Health Module
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="flex items-center justify-between">
                        <Label className="text-foreground">Early Puberty Signs</Label>
                        <Switch checked={form.earlyPuberty} onCheckedChange={(v) => setForm({ ...form, earlyPuberty: v })} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-foreground">Irregular Periods</Label>
                        <Switch checked={form.irregularPeriods} onCheckedChange={(v) => setForm({ ...form, irregularPeriods: v })} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-foreground">Unexplained Weight Gain</Label>
                        <Switch checked={form.weightGain} onCheckedChange={(v) => setForm({ ...form, weightGain: v })} />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-foreground">Stress Level: {form.stressLevel}/5</Label>
                        <Slider min={1} max={5} step={1} value={[form.stressLevel || 1]} onValueChange={([v]) => setForm({ ...form, stressLevel: v })} />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* NLP Input */}
                <div className="bg-card rounded-xl border border-border shadow-card p-6">
                  <h2 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-accent" /> Describe Your Concerns
                  </h2>
                  <Textarea
                    value={form.parentConcernText}
                    onChange={(e) => setForm({ ...form, parentConcernText: e.target.value })}
                    placeholder="e.g., My child is not speaking properly and avoids eye contact with others..."
                    className="min-h-[120px]"
                  />
                  <p className="text-xs text-muted-foreground mt-2">Our NLP engine will analyze your text for developmental concern patterns.</p>
                </div>

                <Button type="submit" size="lg" className="gradient-primary text-primary-foreground font-semibold px-10 py-6 text-lg rounded-xl shadow-elevated">
                  <Send className="mr-2 h-5 w-5" /> Analyze Development
                </Button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Button variant="ghost" onClick={() => setResult(null)} className="mb-4 text-muted-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" /> New Assessment
              </Button>
              <RiskResultView result={result} childName={form.name || "Your Child"} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ParentDashboard;
