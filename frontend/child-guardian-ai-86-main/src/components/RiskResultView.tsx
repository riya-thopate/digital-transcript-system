import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, ShieldAlert, Brain, MessageSquare, Heart, Gauge, Lightbulb } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import type { RiskResult } from "@/lib/mockData";

interface Props {
  result: RiskResult;
  childName: string;
}

const RiskResultView = ({ result, childName }: Props) => {
  const riskColor = result.category === "High" ? "hsl(0, 72%, 51%)" : result.category === "Medium" ? "hsl(38, 92%, 50%)" : "hsl(152, 60%, 42%)";
  const riskBg = result.category === "High" ? "bg-destructive/10" : result.category === "Medium" ? "bg-warning/10" : "bg-success/10";
  const RiskIcon = result.category === "High" ? ShieldAlert : result.category === "Medium" ? AlertTriangle : CheckCircle2;

  const pieData = [
    { name: "Risk", value: result.riskScore },
    { name: "Safe", value: 100 - result.riskScore },
  ];

  const barData = [
    { name: "ML Model", score: result.mlScore, fill: "hsl(174, 62%, 34%)" },
    { name: "NLP", score: result.nlpScore, fill: "hsl(205, 80%, 50%)" },
    { name: "Girls Health", score: result.girlsScore, fill: "hsl(31, 90%, 55%)" },
    { name: "Confidence", score: result.confidenceScore, fill: "hsl(270, 60%, 55%)" },
  ];

  const radarData = [
    { subject: "Speech", A: result.mlScore > 50 ? 80 : 30 },
    { subject: "Motor", A: result.mlScore > 40 ? 60 : 25 },
    { subject: "Social", A: result.nlpScore > 30 ? 70 : 20 },
    { subject: "Cognitive", A: result.riskScore > 50 ? 65 : 20 },
    { subject: "Emotional", A: result.confidenceScore > 70 ? 55 : 30 },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Risk Score */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`rounded-2xl p-8 border border-border shadow-elevated ${riskBg}`}
      >
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} startAngle={90} endAngle={-270} dataKey="value" stroke="none">
                  <Cell fill={riskColor} />
                  <Cell fill="hsl(210, 20%, 92%)" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="relative -mt-[125px] text-center">
              <div className="text-4xl font-display font-bold" style={{ color: riskColor }}>{result.riskScore}%</div>
              <div className="text-xs text-muted-foreground">Risk Score</div>
            </div>
            <div className="h-[45px]" />
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
              <RiskIcon className="h-6 w-6" style={{ color: riskColor }} />
              <span className="text-2xl font-display font-bold" style={{ color: riskColor }}>{result.category} Risk</span>
            </div>
            <h2 className="text-xl font-display font-semibold text-foreground mb-1">Assessment for {childName}</h2>
            <p className="text-muted-foreground">Confidence: {result.confidenceScore}%</p>
          </div>
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Module Scores */}
        <div className="bg-card rounded-xl border border-border shadow-card p-6">
          <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" /> Module Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} layout="vertical">
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: 'hsl(210, 10%, 50%)' }} />
              <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 12, fill: 'hsl(210, 10%, 50%)' }} />
              <Tooltip />
              <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                {barData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar */}
        <div className="bg-card rounded-xl border border-border shadow-card p-6">
          <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <Gauge className="h-5 w-5 text-info" /> Developmental Profile
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(210, 20%, 88%)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'hsl(210, 10%, 50%)' }} />
              <Radar dataKey="A" stroke="hsl(174, 62%, 34%)" fill="hsl(174, 62%, 34%)" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Explanations & NLP */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border shadow-card p-6">
          <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" /> AI Explanations
          </h3>
          <ul className="space-y-3">
            {result.explanations.map((e, i) => (
              <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3 text-sm text-foreground">
                <span className="mt-1 w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: riskColor }} />
                {e}
              </motion.li>
            ))}
          </ul>
        </div>

        {result.keywordFlags.length > 0 && (
          <div className="bg-card rounded-xl border border-border shadow-card p-6">
            <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" /> NLP Keyword Detection
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.keywordFlags.map((kw) => (
                <span key={kw} className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
                  "{kw}"
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="bg-card rounded-xl border border-border shadow-card p-6">
        <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-accent" /> Recommendations
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
          {result.recommendations.map((r, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="flex items-start gap-3 bg-muted/50 rounded-lg p-3">
              <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
              <span className="text-sm text-foreground">{r}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RiskResultView;
