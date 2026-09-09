import bcrypt from 'bcryptjs';

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  image: string;
  linkedin: string;
  passwordHash: string;
};

export type DashboardStats = {
  totalCardholders: number;
  totalCards: number;
  activeCards: number;
  averageApproval: string;
  cardVolume: string;
  totalSpend: string;
};

type DbState = {
  users: UserRecord[];
  cards: Array<{
    id: string;
    holder: string;
    type: string;
    status: string;
    balance: number;
    last4: string;
    createdAt: string;
  }>;
  transactions: Array<{
    id: string;
    cardId: string;
    type: string;
    amount: number;
    status: string;
    merchant: string;
    createdAt: string;
  }>;
};

const seedUsers: Array<{ name: string; email: string; role: string; department: string; image: string; linkedin: string; password: string }> = [
  {
    name: 'Okoh Great',
    email: 'okoh.great@greatpay.tech',
    role: 'Chief Executive Officer',
    department: 'Executive Office',
    image: '/ceo.jpg',
    linkedin: 'https://www.linkedin.com',
    password: 'admin'
  },
  {
    name: 'Alao Temidayo',
    email: 'temidayo.alao@greatpay.tech',
    role: 'Account Officer',
    department: 'Client Relations',
    image: '/account-officer-dayo.jpg',
    linkedin: 'https://www.linkedin.com',
    password: 'admin'
  },
  {
    name: 'Tope Bankole',
    email: 'tope.bankole@greatpay.tech',
    role: 'Head of Operations',
    department: 'Operations',
    image: '/tope-bankole.jpg',
    linkedin: 'https://www.linkedin.com',
    password: 'admin'
  },
  {
    name: 'Prof. Emmanuel Afolabi Bakare',
    email: 'bakare@greatpay.tech',
    role: 'Council Member',
    department: 'Board & Governance',
    image: '/council.jpg',
    linkedin: 'https://www.linkedin.com/in/prof-emmanuel-afolabi-bakare',
    password: 'admin'
  }
];

const globalForDb = globalThis as typeof globalThis & {
  greatPayDb?: DbState;
};

function buildInitialDb(): DbState {
  return {
    users: seedUsers.map((user) => ({
      id: user.email.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: user.name,
      email: user.email.toLowerCase(),
      role: user.role,
      department: user.department,
      image: user.image,
      linkedin: user.linkedin,
      passwordHash: bcrypt.hashSync(user.password, 10)
    })),
    cards: [
      {
        id: 'GP-1001',
        holder: 'Okoh Great',
        type: 'Virtual Platinum',
        status: 'ACTIVE',
        balance: 2500000,
        last4: '1001',
        createdAt: '2025-12-01'
      },
      {
        id: 'GP-1002',
        holder: 'Alao Temidayo',
        type: 'Corporate Debit',
        status: 'ACTIVE',
        balance: 1532000,
        last4: '1002',
        createdAt: '2025-11-15'
      },
      {
        id: 'GP-1003',
        holder: 'Tope Bankole',
        type: 'Travel Rewards',
        status: 'PENDING',
        balance: 722400,
        last4: '1003',
        createdAt: '2026-01-08'
      },
      {
        id: 'GP-1004',
        holder: 'Prof. Emmanuel Afolabi Bakare',
        type: 'Premium Plus',
        status: 'ACTIVE',
        balance: 3400000,
        last4: '1004',
        createdAt: '2025-10-09'
      }
    ],
    transactions: [
      {
        id: 'txn-001',
        cardId: 'GP-1001',
        type: 'Card Transfer',
        amount: 250000,
        status: 'APPROVED',
        merchant: 'Skyline Markets',
        createdAt: '2026-09-02T09:15:00.000Z'
      },
      {
        id: 'txn-002',
        cardId: 'GP-1002',
        type: 'ATM Withdrawal',
        amount: 45000,
        status: 'PENDING',
        merchant: 'Main Branch ATM',
        createdAt: '2026-09-03T10:00:00.000Z'
      },
      {
        id: 'txn-003',
        cardId: 'GP-1004',
        type: 'Purchase',
        amount: 89000,
        status: 'APPROVED',
        merchant: 'Aero Retail',
        createdAt: '2026-09-04T13:25:00.000Z'
      },
      {
        id: 'txn-004',
        cardId: 'GP-1003',
        type: 'Refund',
        amount: 32000,
        status: 'FAILED',
        merchant: 'TravelHub',
        createdAt: '2026-09-05T15:30:00.000Z'
      }
    ]
  };
}

export function getDb(): DbState {
  if (!globalForDb.greatPayDb) {
    globalForDb.greatPayDb = buildInitialDb();
  }

  return globalForDb.greatPayDb;
}

export function saveDb(db: DbState) {
  globalForDb.greatPayDb = db;
}

export function listDemoAccounts() {
  return seedUsers.map((user) => ({
    name: user.name,
    email: user.email,
    role: user.role,
    password: 'admin'
  }));
}

export async function authenticateUser(email: string, password: string) {
  const db = getDb();
  const user = db.users.find((item) => item.email.toLowerCase() === email.trim().toLowerCase());

  if (!user) {
    return null;
  }

  const isValid = bcrypt.compareSync(password, user.passwordHash);
  return isValid ? user : null;
}

export async function getUserById(id: string) {
  const db = getDb();
  return db.users.find((user) => user.id === id) ?? null;
}

export async function getDashboardData() {
  const db = getDb();

  const totalCardholders = db.users.length;
  const totalCards = db.cards.length;
  const activeCards = db.cards.filter((card) => card.status === 'ACTIVE').length;
  const totalSpend = db.cards.reduce((sum, card) => sum + Number(card.balance), 0);

  const approvedTransactions = db.transactions.filter((txn) => txn.status === 'APPROVED').length;
  const averageApproval = db.transactions.length > 0 ? (approvedTransactions / db.transactions.length) * 100 : 0;
  const cardVolume = db.transactions.length > 0 ? (db.transactions.reduce((sum, txn) => sum + Number(txn.amount), 0) / db.transactions.length) * 100 : 0;

  const stats: DashboardStats = {
    totalCardholders,
    totalCards,
    activeCards,
    averageApproval: `${averageApproval.toFixed(2)}%`,
    cardVolume: `${cardVolume.toFixed(2)}%`,
    totalSpend: `NGN ${Number(totalSpend).toLocaleString()}`
  };

  return {
    stats,
    cards: db.cards,
    transactions: db.transactions.slice(0, 4),
    members: db.users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      image: user.image,
      linkedin: user.linkedin
    })),
    alerts: [
      { label: 'Card batch approved', time: '3 min ago', color: 'bg-emerald-500' },
      { label: 'KYC review pending', time: '18 min ago', color: 'bg-amber-400' },
      { label: 'Fraud threshold reached', time: '1 hour ago', color: 'bg-rose-400' }
    ]
  };
}

export async function getUserPayload(user: UserRecord) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
    image: user.image,
    linkedin: user.linkedin
  };
}
