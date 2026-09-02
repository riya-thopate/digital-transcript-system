import { GraduationCap, ShieldCheck, FileText, Users, Award, Building2, Mail, Phone } from 'lucide-react';

export function AboutPage() {
  return (
    <div>
      <div className="bg-navy-900 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-serif text-4xl font-bold text-white">About the System</h1>
            <p className="mt-4 text-lg text-navy-300">
              The Digital Transcript & Certificate Issuance System is a secure,
              modern platform that replaces the traditional paper-based document
              request process with a fully digital workflow.
            </p>
          </div>
        </div>
      </div>

      <section className="section bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-serif text-2xl font-bold text-navy-900">Our Mission</h2>
              <p className="mt-4 text-slate-600">
                To provide students, alumni, and third-party verifiers with a
                fast, secure, and transparent way to request, issue, and verify
                academic documents. By digitising the entire process, we reduce
                processing times from weeks to days, eliminate paper waste, and
                make verification accessible to anyone, anywhere.
              </p>
              <p className="mt-4 text-slate-600">
                The system is designed for three key audiences: students who
                need official documents, administrators who manage and issue
                them, and external verifiers (employers, universities) who need
                to confirm authenticity.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { icon: GraduationCap, title: 'For Students', text: 'Request transcripts and certificates online, track status in real time, and download verified digital copies instantly.' },
                { icon: ShieldCheck, title: 'For Administrators', text: 'Review, approve, and issue documents through a centralized dashboard with full audit trail logging.' },
                { icon: FileText, title: 'For Verifiers', text: 'Instantly verify the authenticity of any certificate using its unique certificate ID — no account needed.' },
              ].map((item) => (
                <div key={item.title} className="card p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-navy-100">
                      <item.icon className="h-5.5 w-5.5 text-navy-700" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-navy-900">{item.title}</h3>
                      <p className="mt-1 text-sm text-slate-600">{item.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-serif text-3xl font-bold text-navy-900">Key Features</h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: FileText, title: 'Online Document Requests', text: 'Submit requests for transcripts, degree certificates, bonafide letters, and more — entirely online.' },
              { icon: Users, title: 'Role-Based Access', text: 'Separate portals for students and administrators, each with tailored tools and views.' },
              { icon: ShieldCheck, title: 'Public Verification', text: 'Any third party can verify a certificate ID without logging in — instant authenticity confirmation.' },
              { icon: Award, title: 'Digital Document Issuance', text: 'Approved documents are generated digitally and made available for immediate download.' },
              { icon: FileText, title: 'Full Audit Trail', text: 'Every action — submissions, approvals, rejections, downloads — is logged for accountability.' },
              { icon: ShieldCheck, title: 'Secure Architecture', text: 'Built on Spring Security with JWT authentication and role-based authorization.' },
            ].map((f) => (
              <div key={f.title} className="card p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gold-100">
                  <f.icon className="h-5.5 w-5.5 text-gold-700" />
                </div>
                <h3 className="mt-4 font-serif text-lg font-semibold text-navy-900">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-navy-900">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-800">
            <Building2 className="h-8 w-8 text-gold-400" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-white">Examinations Office</h2>
          <p className="mt-3 text-navy-300">
            For any queries regarding document requests, verification, or technical support, please contact the Examinations Office.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="mailto:admin@college.edu" className="flex items-center gap-2 text-navy-200 hover:text-white">
              <Mail className="h-5 w-5 text-gold-400" /> admin@college.edu
            </a>
            <span className="hidden text-navy-600 sm:block">|</span>
            <span className="flex items-center gap-2 text-navy-200">
              <Phone className="h-5 w-5 text-gold-400" /> +91 80 1234 5678
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
