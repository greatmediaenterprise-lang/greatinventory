'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/me', { credentials: 'include' });
        if (response.ok) {
          router.push('/dashboard');
        }
      } catch {
        // ignore and stay on login page
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  const handleLogin = async () => {
    try {
      setLoginError('');
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      const payload = await response.json();

      if (!response.ok) {
        setLoginError(payload.error || 'Login failed.');
        return;
      }

      router.push('/dashboard');
    } catch {
      setLoginError('Unable to sign in right now. Please try again.');
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Checking session...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="relative overflow-hidden bg-slate-900/80 p-10 lg:p-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),transparent_40%)]" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10">
                <img src="/greatpay.png" alt="GreatPay logo" className="h-8 w-8 object-contain" />
              </div>
              <span className="text-xl font-bold tracking-[0.18em]">GREAT PAY</span>
            </div>

            <div className="max-w-xl space-y-6">
              <div className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                Secure card operations
              </div>
              <h1 className="text-5xl font-black tracking-[-0.05em] text-white lg:text-6xl">
                Start making your dreams come true
              </h1>
              <p className="max-w-lg text-lg text-slate-300">
                Log in to your account and discover the world&apos;s best card management system for banks, operators, and leadership teams.
              </p>
            </div>

            <div className="text-sm text-slate-400">© 2026 Great Pay. All rights reserved.</div>
          </div>
        </section>

        <section className="flex items-center justify-center bg-slate-950 p-5 lg:p-10">
          <div className="w-full max-w-xl rounded-[28px] border border-slate-700/80 bg-slate-900/90 p-8 shadow-glow">
            <div className="mb-6 flex items-center justify-between gap-3">
              <h2 className="text-3xl font-bold text-white">Log in</h2>
              <span className="rounded-full border border-slate-600 bg-slate-800 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-300">
                Secure access
              </span>
            </div>

            <p className="mb-6 text-slate-300">Use your company email and password to sign in.</p>

            <div className="space-y-5">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-200">Email</span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0 transition focus:border-cyan-400"
                  placeholder="Enter your email"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-200">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                  placeholder="Enter password"
                />
              </label>

              <button
                type="button"
                onClick={handleLogin}
                className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 px-4 py-3 font-bold text-slate-900 shadow-lg shadow-cyan-500/20"
              >
                Sign in
              </button>

              <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-3 text-sm text-slate-300">
                Contact your administrator if you need account access.
              </div>

              <div className="min-h-5 text-sm text-rose-300">{loginError}</div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
