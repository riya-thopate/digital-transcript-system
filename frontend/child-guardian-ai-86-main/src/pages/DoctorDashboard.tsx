import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, ArrowLeft, Users, AlertTriangle, ShieldAlert, CheckCircle2, TrendingUp, Activity, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid, Legend } from "recharts";
import { mockPatients } from "@/lib/mockData";

const RISK_COLORS = { High: "hsl(0, 72%, 51%)", Medium: "hsl(38, 92%, 50%)", Low: "hsl(152, 60%, 42%)" };

const distributionData = [
  { name: "High", value: mockPatients.filter(p => p.category === "High").length, fill: RISK_COLORS.High },
  { name: "Medium", value: mockPatients.filter(p => p.category === "Medium").length, fill: RISK_COLORS.Medium },
  { name: "Low", value: mockPatients.filter(p => p.category === "Low").length, fill: RISK_COLORS.Low },
];

const trendData = [
  { month: "Oct", high: 5, medium: 8, low: 12 },
  { month: "Nov", high: 4, medium: 10, low: 14 },
  { month: "Dec", high: 6, medium: 7, low: 11 },
  { month: "Jan", high: 3, medium: 9, low: 15 },
  { month: "Feb", high: 4, medium: 11, low: 13 },
  { month: "Mar", high: 3, medium: 8, low: 16 },
];

const ageDistribution = [
  { age: "0-12m", count: 3 },
  { age: "12-24m", count: 5 },
  { age: "24-36m", count: 4 },
  { age: "36-48m", count: 2 },
  { age: "48-72m", count: 1 },
];

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = mockPatients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const stats = [
    { label: "Total Patients", value: mockPatients.length, icon: Users, color: "text-primary" },
    { label: "High Risk", value: mockPatients.filter(p => p.category === "High").length, icon: ShieldAlert, color: "text-destructive" },
    { label: "Medium Risk", value: mockPatients.filter(p => p.category === "Medium").length, icon: AlertTriangle, color: "text-warning" },
    { label: "Low Risk", value: mockPatients.filter(p => p.category === "Low").length, icon: CheckCircle2, color: "text-success" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card shadow-card sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Brain className="h-6 w-6 text-primary" />
            <span className="font-display font-bold text-lg text-foreground">NeuroGuardian</span>
            <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium">Doctor</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/login")} className="text-muted-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" /> Logout
          </Button>
        </div>
      </header>

      <div className="container py-8">
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">Doctor Dashboard</h1>
        <p className="text-muted-foreground mb-8">Overview of patient developmental risk analytics.</p>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-card rounded-xl border border-border shadow-card p-5"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{s.label}</span>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div className="text-3xl font-display font-bold text-foreground">{s.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-xl border border-border shadow-card p-6">
            <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" /> Risk Distribution
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={distributionData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" stroke="none">
                  {distributionData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card rounded-xl border border-border shadow-card p-6">
            <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-info" /> Monthly Trends
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 20%, 90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(210, 10%, 50%)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(210, 10%, 50%)' }} />
                <Tooltip />
                <Line type="monotone" dataKey="high" stroke={RISK_COLORS.High} strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="medium" stroke={RISK_COLORS.Medium} strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="low" stroke={RISK_COLORS.Low} strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card rounded-xl border border-border shadow-card p-6">
            <h3 className="font-display font-semibold text-foreground mb-4">Age Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ageDistribution}>
                <XAxis dataKey="age" tick={{ fontSize: 11, fill: 'hsl(210, 10%, 50%)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(210, 10%, 50%)' }} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(174, 62%, 34%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Patient Table */}
        <div className="bg-card rounded-xl border border-border shadow-card p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
            <h3 className="font-display font-semibold text-lg text-foreground">Patient Records</h3>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search patients..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Patient</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Age</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Gender</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Risk Score</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Category</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Last Assessed</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-foreground">{p.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{p.age}m</td>
                    <td className="py-3 px-4 text-muted-foreground capitalize">{p.gender}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${p.riskScore}%`, backgroundColor: RISK_COLORS[p.category] }} />
                        </div>
                        <span className="text-foreground font-medium">{p.riskScore}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                        p.category === "High" ? "bg-destructive/10 text-destructive" :
                        p.category === "Medium" ? "bg-warning/10 text-warning" :
                        "bg-success/10 text-success"
                      }`}>
                        {p.category === "High" ? <ShieldAlert className="h-3 w-3" /> :
                         p.category === "Medium" ? <AlertTriangle className="h-3 w-3" /> :
                         <CheckCircle2 className="h-3 w-3" />}
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{p.lastAssessed}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
