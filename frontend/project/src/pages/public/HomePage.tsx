import { Link } from 'react-router-dom';
import {
  GraduationCap,
  ShieldCheck,
  FileText,
  Clock,
  Download,
  CheckCircle2,
  Search,
  ArrowRight,
  FileCheck2,
  Award,
  Lock,
} from 'lucide-react';

const heroImage =
  'https://images.pexels.com/photos/29229903/pexels-photo-29229903.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

const benefits = [
  {
    icon: Clock,
    title: 'Request Anytime',
    description: 'Submit transcript and certificate requests online 24/7 — no more queueing at the examinations office.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Verified',
    description: 'Every issued document carries a unique verification ID. Third parties can instantly confirm authenticity.',
  },
  {
    icon: Clock,
    title: 'Real-Time Tracking',
    description: 'Track the status of your request from submission to approval to download, with notifications at every step.',
  },
  {
    icon: Download,
    title: 'Instant Download',
    description: 'Once approved, download your official documents immediately in digital format — no waiting for postal delivery.',
  },
];

const documents = [
  {
    icon: FileText,
    name: 'Official Transcript',
    description: 'Complete academic record showing all courses, grades, and CGPA across semesters.',
  },
  {
    icon: Award,
    name: 'Degree Certificate',
    description: 'Official proof of degree conferral upon successful completion of your programme.',
  },
  {
    icon: FileCheck2,
    name: 'Bonafide Certificate',
    description: 'Certification confirming your current student status at the institution.',
  },
  {
    icon: FileCheck2,
    name: 'Course Completion Certificate',
    description: 'Document confirming completion of specific courses or academic requirements.',
  },
];

const steps = [
  { number: '01', title: 'Login & Submit Request', description: 'Sign in to your student account and fill out the document request form with the required details.' },
  { number: '02', title: 'Administrator Review', description: 'The examinations office reviews your request, verifies your records, and adds any remarks if needed.' },
  { number: '03', title: 'Document Generation', description: 'Once approved, your official document is generated and digitally signed by the institution.' },
  { number: '04', title: 'Download & Verify', description: 'Download your document instantly. Third parties can verify its authenticity using the certificate ID.' },
];

export function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-900">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="University graduates"
            className="h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-900/95 to-navy-900/70" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-3.5 py-1.5 text-xs font-medium text-gold-300">
              <ShieldCheck className="h-3.5 w-3.5" />
            Trusted by National Institute of Technology
            </div>
            <h1 className="font-serif text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Digital Transcript &amp; Certificate Issuance System
            </h1>
            <p className="mt-5 text-lg text-navy-200">
              Request official transcripts and certificates online, track their
              status in real time, and download verified digital documents —
              all from a single, secure portal.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/register" className="btn btn-gold px-6 py-3 text-base">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/login" className="btn btn-secondary px-6 py-3 text-base border-navy-700 bg-transparent text-white hover:bg-navy-800">
                Login to Portal
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-navy-300">
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-gold-400" /> 24/7 Online Access</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-gold-400" /> Instant Verification</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-gold-400" /> Secure & Encrypted</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-serif text-3xl font-bold text-navy-900">Why Use the Digital Portal?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              A modern, paperless approach to academic document issuance — designed for students, administrators, and verifiers.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b) => (
              <div key={b.title} className="card p-6 transition-all hover:shadow-card-hover">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-navy-100">
                  <b.icon className="h-6 w-6 text-navy-700" />
                </div>
                <h3 className="mt-4 font-serif text-lg font-semibold text-navy-900">{b.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documents */}
      <section className="section bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-serif text-3xl font-bold text-navy-900">Available Documents</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              Request any of these official academic documents through the portal.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {documents.map((d) => (
              <div key={d.name} className="card p-6 transition-all hover:shadow-card-hover">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gold-100">
                  <d.icon className="h-6 w-6 text-gold-700" />
                </div>
                <h3 className="mt-4 font-serif text-lg font-semibold text-navy-900">{d.name}</h3>
                <p className="mt-2 text-sm text-slate-600">{d.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section bg-navy-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-serif text-3xl font-bold text-white">How It Works</h2>
            <p className="mx-auto mt-3 max-w-2xl text-navy-300">
              From request to download in four simple steps.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.number} className="relative">
                <div className="rounded-xl border border-navy-800 bg-navy-800/50 p-6">
                  <span className="font-serif text-3xl font-bold text-gold-500">{s.number}</span>
                  <h3 className="mt-3 font-serif text-lg font-semibold text-white">{s.title}</h3>
                  <p className="mt-2 text-sm text-navy-300">{s.description}</p>
                </div>
                {i < steps.length - 1 && (
                  <ArrowRight className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-navy-600 lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verification CTA */}
      <section className="section bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-success-50 px-3.5 py-1.5 text-xs font-medium text-success-700">
                <Search className="h-3.5 w-3.5" />
                Public Verification
              </div>
              <h2 className="font-serif text-3xl font-bold text-navy-900">
                Verify a Certificate Instantly
              </h2>
              <p className="mt-4 text-slate-600">
                Employers, universities, and other third parties can verify the
                authenticity of any certificate issued by our institution. Simply
                enter the certificate ID to confirm its validity — no account required.
              </p>
              <ul className="mt-5 space-y-2.5">
                {['No login required for verification', 'Instant authenticity check', 'View document details securely'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-success-600" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/verify" className="btn btn-primary mt-6">
                <Search className="h-4 w-4" />
                Verify a Certificate
              </Link>
            </div>
            <div className="card p-8">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
                <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-800">
                    <Lock className="h-5 w-5 text-gold-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-navy-900">Certificate Verification</p>
                    <p className="text-xs text-slate-500">Enter a certificate ID to verify</p>
                  </div>
                </div>
                <div className="pt-4">
                  <label className="label">Certificate ID</label>
                  <input className="input" placeholder="e.g., CERT-2024-BNF-00123" disabled />
                  <Link to="/verify" className="btn btn-primary mt-3 w-full">
                    <Search className="h-4 w-4" />
                    Verify Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gold-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-12 sm:px-6 md:flex-row lg:px-8">
          <div>
            <h2 className="font-serif text-2xl font-bold text-navy-900">
              Ready to request your documents?
            </h2>
            <p className="mt-1.5 text-navy-800">
              Create an account or log in to get started in minutes.
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/register" className="btn btn-primary">
              Create Account
            </Link>
            <Link to="/login" className="btn btn-secondary border-navy-700">
              Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
