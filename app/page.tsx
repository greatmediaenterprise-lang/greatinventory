'use client';

import { useMemo, useState } from 'react';

const users = [
  {
    id: 'okoh',
    name: 'Okoh Great',
    email: 'okoh.great@greatpay.tech',
    password: 'admin',
    role: 'Chief Executive Officer',
    department: 'Executive Office',
    image: '/ceo.jpg',
    linkedin: 'https://www.linkedin.com'
  },
  {
    id: 'temidayo',
    name: 'Alao Temidayo',
    email: 'temidayo.alao@greatpay.tech',
    password: 'admin',
    role: 'Account Officer',
    department: 'Client Relations',
    image: '/account-officer-dayo.jpg',
    linkedin: 'https://www.linkedin.com'
  },
  {
    id: 'tope',
    name: 'Tope Bankole',
    email: 'tope.bankole@greatpay.tech',
    password: 'admin',
    role: 'Head of Operations',
    department: 'Operations',
    image: '/tope-bankole.jpg',
    linkedin: 'https://www.linkedin.com'
  },
  {
    id: 'bakare',
    name: 'Prof. Emmanuel Afolabi Bakare',
    email: 'bakare@greatpay.tech',
    password: 'admin',
    role: 'Council Member',
    department: 'Board & Governance',
    image: '/council.jpg',
    linkedin: 'https://www.linkedin.com/in/prof-emmanuel-afolabi-bakare'
  }
];

const stats = [
  { label: 'Total Cardholders', value: '71,887', trend: '+2.3%' },
  { label: 'Avg. TXN Approval Rate', value: '56.87%', trend: '+5.1%' },
  { label: 'Total ATM in Service', value: '09', trend: '+3 live' },
  { label: 'Avg. Volume of TXN/CARD', value: '2.3%', trend: '+0.8%' }
];

const chartBars = [42, 58, 76, 69, 88, 95, 80];
const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [email, setEmail] = useState('okoh.great@greatpay.tech');
  const [password, setPassword] = useState('admin');
  const [loginError, setLoginError] = useState('');
  const [activeUser, setActiveUser] = useState<typeof users[number] | null>(null);

  const filteredMembers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;
    return users.filter((member) => {
      return [member.name, member.email, member.role, member.department].some((field) =>
        field.toLowerCase().includes(term)
      );
    });
  }, [search]);

  const signin = () => {
    const user = users.find((person) => {
      const input = email.trim().toLowerCase();
      const emailMatch = person.email.toLowerCase() === input;
      const nameMatch = person.name.toLowerCase() === input;
      const roleMatch = person.role.toLowerCase() === input;
      const deptMatch = person.department.toLowerCase() === input;
      return (emailMatch || nameMatch || roleMatch || deptMatch) && person.password === password;
    });

    if (!user) {
      setLoginError('Invalid login. Use a valid person name, email, or role and admin password.');
      return;
    }

    setActiveUser(user);
    setLoginError('');
  };

  if (!activeUser) {
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
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="flex -space-x-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-900 bg-amber-300 text-xs font-bold text-slate-900">AB</span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-900 bg-cyan-300 text-xs font-bold text-slate-900">AF</span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-900 bg-violet-300 text-xs font-bold text-slate-900">GP</span>
                  </div>
                  <span>Join 10.000+ banks and operations teams</span>
                </div>
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

              <p className="mb-6 text-slate-300">Use your name, email, or role to sign in.</p>

              <div className="space-y-5">
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-200">Username or email</span>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0 transition focus:border-cyan-400"
                    placeholder="Enter your name or email"
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

                <div className="flex items-center justify-between text-sm text-slate-300">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="h-4 w-4 accent-cyan-500" />
                    Remember me
                  </label>
                  <button type="button" className="font-medium text-cyan-300">Forgot password?</button>
                </div>

                <button
                  type="button"
                  onClick={signin}
                  className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 px-4 py-3 font-bold text-slate-900 shadow-lg shadow-cyan-500/20"
                >
                  Sign in
                </button>

                <button type="button" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-semibold text-slate-100">
                  Sign in with Google
                </button>

                <div className="min-h-5 text-sm text-rose-300">{loginError}</div>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="border-r border-slate-800 bg-slate-900/80 p-5">
          <div className="flex items-center gap-3 px-2 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-500/10">
              <img src="/greatpay.png" alt="GreatPay logo" className="h-7 w-7 object-contain" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-[0.18em] text-white">GREAT PAY</div>
            </div>
          </div>

          <nav className="mt-8 space-y-2">
            {['Dashboard', 'Card Management', 'Transactions', 'Batch Processing', 'Reporting', 'Fraud', 'Members', 'Settings'].map((item, idx) => (
              <div
                key={item}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm ${idx === 0 ? 'bg-cyan-500/10 text-white ring-1 ring-cyan-400/20' : 'text-slate-300'}`}
              >
                <span>{['🏠', '💳', '🔁', '📦', '📊', '🛡️', '👥', '⚙️'][idx]}</span>
                {item}
              </div>
            ))}
          </nav>
        </aside>

        <section className="p-6 lg:p-8">
          <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <h1 className="text-3xl font-bold tracking-[-0.04em] text-white">Dashboard</h1>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300">
                <span>🔍</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search members"
                  className="w-52 bg-transparent text-white placeholder:text-slate-400 outline-none"
                />
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2">
                <img src={activeUser.image} alt={activeUser.name} className="h-9 w-9 rounded-full object-cover" />
                <div className="leading-tight">
                  <div className="font-semibold text-white">{activeUser.name}</div>
                  <div className="text-xs text-slate-400">{activeUser.role}</div>
                </div>
              </div>
            </div>
          </header>

          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg shadow-slate-950/40">
                  <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.12em] text-slate-400">
                    <span>{stat.label}</span>
                    <span>↗</span>
                  </div>
                  <div className="text-3xl font-black tracking-[-0.06em] text-white">{stat.value}</div>
                  <div className="mt-2 text-sm text-emerald-400">{stat.trend}</div>
                </div>
              ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Performance overview</h3>
                  <button className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">This month</button>
                </div>
                <div className="flex h-52 items-end gap-3">
                  {chartBars.map((height, index) => (
                    <div key={monthLabels[index]} className="flex flex-1 flex-col items-center gap-2">
                      <div className="w-full rounded-t-xl bg-gradient-to-t from-cyan-500 to-sky-400" style={{ height: `${height}%` }} />
                      <span className="text-[10px] uppercase tracking-[0.15em] text-slate-400">{monthLabels[index]}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Alerts</h3>
                  <button className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-semibold text-slate-300">View all</button>
                </div>
                <div className="space-y-3">
                  {[
                    ['Card batch approved', '3 min ago', 'bg-emerald-500'],
                    ['KYC review pending', '18 min ago', 'bg-amber-400'],
                    ['Fraud threshold reached', '1 hour ago', 'bg-rose-400']
                  ].map(([label, time, color]) => (
                    <div key={label} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-3 text-sm">
                      <div className="flex items-center gap-3">
                        <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
                        <span className="text-slate-200">{label}</span>
                      </div>
                      <span className="text-slate-400">{time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Leadership and access list</h3>
                <button className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">Export</button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="text-slate-400">
                    <tr>
                      <th className="pb-3 pr-4">Member</th>
                      <th className="pb-3 pr-4">Role</th>
                      <th className="pb-3 pr-4">Email</th>
                      <th className="pb-3 pr-4">Department</th>
                      <th className="pb-3 pr-4">Status</th>
                      <th className="pb-3 pr-4">LinkedIn</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-200">
                    {filteredMembers.map((member) => (
                      <tr key={member.id} className="border-t border-slate-800">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-3">
                            <img src={member.image} alt={member.name} className="h-9 w-9 rounded-full object-cover" />
                            <span className="font-medium text-white">{member.name}</span>
                          </div>
                        </td>
                        <td className="py-3 pr-4">{member.role}</td>
                        <td className="py-3 pr-4">{member.email}</td>
                        <td className="py-3 pr-4">{member.department}</td>
                        <td className="py-3 pr-4">
                          <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-300">ACTIVE</span>
                        </td>
                        <td className="py-3 pr-4">
                          <a href={member.linkedin} target="_blank" rel="noreferrer" className="text-cyan-300 underline">LinkedIn</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
