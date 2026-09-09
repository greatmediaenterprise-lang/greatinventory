'use client';

import { useEffect, useState } from 'react';

export type DashboardUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  image: string;
  linkedin: string;
};

type DashboardStats = {
  totalCardholders: number;
  totalCards: number;
  activeCards: number;
  averageApproval: string;
  cardVolume: string;
  totalSpend: string;
};

export default function DashboardPage() {
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/api/dashboard', { credentials: 'include' });
        const payload = await response.json();

        if (!response.ok) {
          window.location.href = '/';
          return;
        }

        setUser(payload.user);
        setStats(payload.stats);
        setCards(payload.cards ?? []);
        setTransactions(payload.transactions ?? []);
        setMembers(payload.members ?? []);
      } catch {
        window.location.href = '/';
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    window.location.href = '/';
  };

  if (loading || !user || !stats) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading your secure dashboard...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="border-r border-slate-800 bg-slate-900/80 p-5">
          <div className="flex items-center gap-3 px-2 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-500/10">
              <img src="/greatpay.png" alt="GreatPay" className="h-7 w-7 object-contain" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-[0.18em] text-white">GREAT PAY</div>
            </div>
          </div>

          <nav className="mt-8 space-y-2">
            {['Dashboard', 'Card Management', 'Transactions', 'Batch Processing', 'Reporting', 'Fraud', 'Members', 'Settings'].map((item, idx) => (
              <div key={item} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm ${idx === 0 ? 'bg-cyan-500/10 text-white ring-1 ring-cyan-400/20' : 'text-slate-300'}`}>
                <span>{['🏠', '💳', '🔁', '📦', '📊', '🛡️', '👥', '⚙️'][idx]}</span>
                {item}
              </div>
            ))}
          </nav>

          <button onClick={handleLogout} className="mt-8 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-100">
            Logout
          </button>
        </aside>

        <section className="p-6 lg:p-8">
          <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-cyan-300">Secure access</p>
              <h1 className="text-3xl font-bold tracking-[-0.04em] text-white">Dashboard</h1>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2">
              <img src={user.image} alt={user.name} className="h-9 w-9 rounded-full object-cover" />
              <div className="leading-tight">
                <div className="font-semibold text-white">{user.name}</div>
                <div className="text-xs text-slate-400">{user.role}</div>
              </div>
            </div>
          </header>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Total Cardholders', value: stats.totalCardholders.toLocaleString(), trend: '+2.3%' },
              { label: 'Avg. TXN Approval Rate', value: stats.averageApproval, trend: '+5.1%' },
              { label: 'Total ATM in Service', value: String(stats.activeCards).padStart(2, '0'), trend: '+3 live' },
              { label: 'Total Spend', value: stats.totalSpend, trend: '+0.8%' }
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg shadow-slate-950/40">
                <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.12em] text-slate-400">
                  <span>{item.label}</span>
                  <span>↗</span>
                </div>
                <div className="text-3xl font-black tracking-[-0.06em] text-white">{item.value}</div>
                <div className="mt-2 text-sm text-emerald-400">{item.trend}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.7fr_1fr]">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Card portfolio</h3>
                <button className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">This month</button>
              </div>
              <div className="space-y-3">
                {cards.map((card) => (
                  <div key={card.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-3 text-sm">
                    <div>
                      <div className="font-semibold text-white">{card.holder}</div>
                      <div className="text-slate-400">{card.type}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-cyan-300">NGN {Number(card.balance).toLocaleString()}</div>
                      <div className="text-xs text-slate-400">{card.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Recent transactions</h3>
              </div>
              <div className="space-y-3">
                {transactions.map((txn) => (
                  <div key={txn.id} className="rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-white">{txn.type}</span>
                      <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${txn.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-300' : txn.status === 'PENDING' ? 'bg-amber-500/10 text-amber-300' : 'bg-rose-500/10 text-rose-300'}`}>
                        {txn.status}
                      </span>
                    </div>
                    <div className="mt-2 text-slate-400">{txn.merchant}</div>
                    <div className="mt-1 text-cyan-300">NGN {Number(txn.amount).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Leadership and access list</h3>
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
                  </tr>
                </thead>
                <tbody className="text-slate-200">
                  {members.map((member) => (
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
