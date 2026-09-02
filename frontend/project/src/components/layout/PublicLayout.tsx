import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { ToastContainer } from '@/components/ui/Toast';

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-navy-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-800">
                <svg className="h-5 w-5 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <div>
                <p className="font-serif text-sm font-semibold text-white">
                  Digital Transcript System
                </p>
                <p className="text-xs text-navy-300">National Institute of Technology</p>
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm text-navy-300">
              A secure, digital platform for issuing and verifying academic
              transcripts and certificates. Request documents online and track
              their status in real time.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Quick Links</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="/" className="text-navy-300 hover:text-white">Home</a></li>
              <li><a href="/about" className="text-navy-300 hover:text-white">About</a></li>
              <li><a href="/verify" className="text-navy-300 hover:text-white">Verify Certificate</a></li>
              <li><a href="/login" className="text-navy-300 hover:text-white">Login</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Support</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="text-navy-300">Examinations Office</li>
              <li className="text-navy-300">admin@college.edu</li>
              <li className="text-navy-300">+91 80 1234 5678</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-navy-800 pt-6 text-center text-xs text-navy-400">
          &copy; {new Date().getFullYear()} National Institute of Technology. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
