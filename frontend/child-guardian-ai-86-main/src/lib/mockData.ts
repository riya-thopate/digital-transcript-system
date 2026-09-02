// Simulated AI analysis engine

export interface ChildData {
  name: string;
  age: number; // months
  gender: 'male' | 'female';
  speechDelay: boolean;
  motorDelay: boolean;
  socialScore: number; // 1-10
  screenTime: number; // hours
  sleepHours: number;
  parentalConcernLevel: number; // 1-5
  parentConcernText: string;
  // Girls-specific
  earlyPuberty?: boolean;
  irregularPeriods?: boolean;
  stressLevel?: number; // 1-5
  weightGain?: boolean;
}

export interface RiskResult {
  riskScore: number;
  category: 'Low' | 'Medium' | 'High';
  mlScore: number;
  nlpScore: number;
  girlsScore: number;
  confidenceScore: number;
  explanations: string[];
  recommendations: string[];
  keywordFlags: string[];
}

const NLP_KEYWORDS: Record<string, number> = {
  "not speaking": 0.3,
  "no eye contact": 0.25,
  "slow development": 0.2,
  "doesn't respond": 0.25,
  "avoids": 0.15,
  "delayed": 0.2,
  "not walking": 0.25,
  "no words": 0.3,
  "aggressive": 0.15,
  "tantrum": 0.1,
  "not playing": 0.15,
  "doesn't point": 0.2,
  "repetitive": 0.15,
  "not babbling": 0.2,
  "stiff": 0.15,
  "floppy": 0.15,
};

export function analyzeChildData(data: ChildData): RiskResult {
  // ML Score (simulated Random Forest)
  let mlScore = 0;
  if (data.speechDelay) mlScore += 25;
  if (data.motorDelay) mlScore += 20;
  mlScore += Math.max(0, (5 - data.socialScore) * 5);
  mlScore += Math.max(0, (data.screenTime - 2) * 5);
  mlScore += Math.max(0, (10 - data.sleepHours) * 3);
  mlScore += data.parentalConcernLevel * 4;
  if (data.age < 24) mlScore += 5;
  mlScore = Math.min(100, Math.max(0, mlScore));

  // NLP Score
  let nlpScore = 0;
  const keywordFlags: string[] = [];
  const text = data.parentConcernText.toLowerCase();
  for (const [keyword, weight] of Object.entries(NLP_KEYWORDS)) {
    if (text.includes(keyword)) {
      nlpScore += weight * 100;
      keywordFlags.push(keyword);
    }
  }
  nlpScore = Math.min(100, nlpScore);

  // Girls Health Score
  let girlsScore = 0;
  if (data.gender === 'female') {
    if (data.earlyPuberty) girlsScore += 30;
    if (data.irregularPeriods) girlsScore += 20;
    if (data.stressLevel) girlsScore += data.stressLevel * 5;
    if (data.weightGain) girlsScore += 15;
  }
  girlsScore = Math.min(100, girlsScore);

  // Confidence
  const confidenceScore = Math.min(95, 60 + keywordFlags.length * 5 + (data.parentalConcernLevel * 3));

  // Hybrid final score
  const girlsWeight = data.gender === 'female' ? 0.2 : 0;
  const mlWeight = data.gender === 'female' ? 0.5 : 0.6;
  const nlpWeight = data.gender === 'female' ? 0.2 : 0.3;
  const confWeight = 0.1;

  const riskScore = Math.round(
    mlWeight * mlScore +
    nlpWeight * nlpScore +
    girlsWeight * girlsScore +
    confWeight * confidenceScore
  );

  const category = riskScore >= 65 ? 'High' : riskScore >= 35 ? 'Medium' : 'Low';

  // Explanations
  const explanations: string[] = [];
  if (data.speechDelay) explanations.push("Speech delay detected");
  if (data.motorDelay) explanations.push("Motor delay detected");
  if (data.socialScore < 4) explanations.push("Low social interaction score");
  if (data.screenTime > 3) explanations.push("Excessive screen time");
  if (data.sleepHours < 9) explanations.push("Insufficient sleep hours");
  if (keywordFlags.length > 0) explanations.push(`Concern keywords detected: ${keywordFlags.join(", ")}`);
  if (data.gender === 'female' && girlsScore > 30) explanations.push("Elevated girls health risk factors");

  // Recommendations
  const recommendations: string[] = [];
  if (riskScore >= 65) {
    recommendations.push("Consult a pediatric neurologist immediately");
    recommendations.push("Schedule comprehensive developmental assessment");
  }
  if (data.speechDelay) recommendations.push("Speech therapy assessment recommended");
  if (data.motorDelay) recommendations.push("Occupational therapy evaluation");
  if (data.socialScore < 4) recommendations.push("Social skills group therapy");
  if (data.screenTime > 3) recommendations.push("Reduce screen time to under 1 hour/day");
  if (data.sleepHours < 9) recommendations.push("Establish consistent sleep routine");
  if (riskScore < 35) recommendations.push("Continue monitoring development milestones");

  return {
    riskScore: Math.min(100, Math.max(0, riskScore)),
    category,
    mlScore: Math.round(mlScore),
    nlpScore: Math.round(nlpScore),
    girlsScore: Math.round(girlsScore),
    confidenceScore: Math.round(confidenceScore),
    explanations,
    recommendations,
    keywordFlags,
  };
}

// Mock patients for doctor dashboard
export const mockPatients = [
  { id: '1', name: 'Aarav Sharma', age: 18, gender: 'male' as const, riskScore: 72, category: 'High' as const, lastAssessed: '2026-03-20' },
  { id: '2', name: 'Priya Patel', age: 30, gender: 'female' as const, riskScore: 45, category: 'Medium' as const, lastAssessed: '2026-03-19' },
  { id: '3', name: 'Rohan Kumar', age: 12, gender: 'male' as const, riskScore: 22, category: 'Low' as const, lastAssessed: '2026-03-21' },
  { id: '4', name: 'Ananya Gupta', age: 24, gender: 'female' as const, riskScore: 68, category: 'High' as const, lastAssessed: '2026-03-18' },
  { id: '5', name: 'Vivaan Singh', age: 36, gender: 'male' as const, riskScore: 38, category: 'Medium' as const, lastAssessed: '2026-03-22' },
  { id: '6', name: 'Diya Reddy', age: 15, gender: 'female' as const, riskScore: 15, category: 'Low' as const, lastAssessed: '2026-03-17' },
  { id: '7', name: 'Kabir Joshi', age: 20, gender: 'male' as const, riskScore: 82, category: 'High' as const, lastAssessed: '2026-03-23' },
  { id: '8', name: 'Ishita Mehta', age: 28, gender: 'female' as const, riskScore: 55, category: 'Medium' as const, lastAssessed: '2026-03-16' },
];
