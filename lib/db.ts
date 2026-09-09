import fs from 'node:fs';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import initSqlJs from 'sql.js';

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

type SqlDb = {
  exec: (sql: string, params?: unknown[]) => Array<{ columns: string[]; values: unknown[][] }>;
  prepare: (sql: string) => { step: () => boolean; getAsObject: () => Record<string, unknown> | null; reset: () => void; finalize: () => void };
  export: () => Uint8Array;
  run: (sql: string, params?: unknown[]) => void;
};

const DB_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DB_DIR, 'greatpay.sqlite');
const SQL_WASM_PATH = path.join(process.cwd(), 'node_modules', 'sql.js', 'dist');

const globalForDb = globalThis as typeof globalThis & {
  greatPayDb?: Promise<SqlDb>;
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

function normalizeRows(result: Array<{ columns: string[]; values: unknown[][] }>) {
  if (!result[0]) {
    return [] as Record<string, unknown>[];
  }

  const columns = result[0].columns;
  return result[0].values.map((row) => {
    const item: Record<string, unknown> = {};
    columns.forEach((column, index) => {
      item[column] = row[index];
    });
    return item;
  });
}

async function createDatabase() {
  fs.mkdirSync(DB_DIR, { recursive: true });

  const SQL = await initSqlJs({
    locateFile: (file: string) => path.join(SQL_WASM_PATH, file)
  });

  const db = new SQL.Database() as SqlDb;

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL,
      department TEXT NOT NULL,
      image TEXT NOT NULL,
      linkedin TEXT NOT NULL,
      passwordHash TEXT NOT NULL
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS cards (
      id TEXT PRIMARY KEY,
      holder TEXT NOT NULL,
      type TEXT NOT NULL,
      status TEXT NOT NULL,
      balance REAL NOT NULL,
      last4 TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      cardId TEXT NOT NULL,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      status TEXT NOT NULL,
      merchant TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
  `);

  const userCountResult = db.exec('SELECT COUNT(*) AS count FROM users;');
  const userCount = Number(normalizeRows(userCountResult)[0]?.count ?? 0);

  if (userCount === 0) {
    seedUsers.forEach((user) => {
      const passwordHash = bcrypt.hashSync(user.password, 10);
      db.run(
        'INSERT INTO users (id, name, email, role, department, image, linkedin, passwordHash) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
        [
          user.email.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          user.name,
          user.email.toLowerCase(),
          user.role,
          user.department,
          user.image,
          user.linkedin,
          passwordHash
        ]
      );
    });
  }

  const cardCount = Number(db.exec('SELECT COUNT(*) AS count FROM cards;')[0]?.values?.[0]?.[0] ?? 0);
  if (cardCount === 0) {
    const cards = [
      ['GP-1001', 'Okoh Great', 'Virtual Platinum', 'ACTIVE', 2500000, '1001', '2025-12-01'],
      ['GP-1002', 'Alao Temidayo', 'Corporate Debit', 'ACTIVE', 1532000, '1002', '2025-11-15'],
      ['GP-1003', 'Tope Bankole', 'Travel Rewards', 'PENDING', 722400, '1003', '2026-01-08'],
      ['GP-1004', 'Prof. Emmanuel Afolabi Bakare', 'Premium Plus', 'ACTIVE', 3400000, '1004', '2025-10-09']
    ];

    cards.forEach(([id, holder, type, status, balance, last4, createdAt]) => {
      db.run('INSERT INTO cards (id, holder, type, status, balance, last4, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?);', [id, holder, type, status, Number(balance), last4, createdAt]);
    });
  }

  const transactionCount = Number(db.exec('SELECT COUNT(*) AS count FROM transactions;')[0]?.values?.[0]?.[0] ?? 0);
  if (transactionCount === 0) {
    const transactions = [
      ['txn-001', 'GP-1001', 'Card Transfer', 250000, 'APPROVED', 'Skyline Markets', '2026-09-02T09:15:00.000Z'],
      ['txn-002', 'GP-1002', 'ATM Withdrawal', 45000, 'PENDING', 'Main Branch ATM', '2026-09-03T10:00:00.000Z'],
      ['txn-003', 'GP-1004', 'Purchase', 89000, 'APPROVED', 'Aero Retail', '2026-09-04T13:25:00.000Z'],
      ['txn-004', 'GP-1003', 'Refund', 32000, 'FAILED', 'TravelHub', '2026-09-05T15:30:00.000Z']
    ];

    transactions.forEach(([id, cardId, type, amount, status, merchant, createdAt]) => {
      db.run('INSERT INTO transactions (id, cardId, type, amount, status, merchant, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?);', [id, cardId, type, Number(amount), status, merchant, createdAt]);
    });
  }

  saveDatabase(db);
  return db;
}

export async function getDb() {
  if (!globalForDb.greatPayDb) {
    globalForDb.greatPayDb = createDatabase();
  }

  return globalForDb.greatPayDb;
}

export function saveDatabase(db: SqlDb) {
  fs.writeFileSync(DB_FILE, Buffer.from(db.export()));
}

export async function authenticateUser(email: string, password: string) {
  const db = await getDb();
  const rows = db.exec('SELECT * FROM users WHERE email = ? LIMIT 1;', [email.toLowerCase()]);
  const user = normalizeRows(rows)[0] as UserRecord | undefined;

  if (!user) {
    return null;
  }

  const isValid = bcrypt.compareSync(password, user.passwordHash);

  if (!isValid) {
    return null;
  }

  return user;
}

export async function getUserById(id: string) {
  const db = await getDb();
  const rows = db.exec('SELECT * FROM users WHERE id = ? LIMIT 1;', [id]);
  const user = normalizeRows(rows)[0] as UserRecord | undefined;

  if (!user) {
    return null;
  }

  return user;
}

export async function getDashboardData() {
  const db = await getDb();

  const dashboardRows = db.exec(`
    SELECT
      (SELECT COUNT(*) FROM users) AS totalCardholders,
      (SELECT COUNT(*) FROM cards) AS totalCards,
      (SELECT COUNT(*) FROM cards WHERE status = 'ACTIVE') AS activeCards,
      (SELECT ROUND(AVG(CASE WHEN status = 'APPROVED' THEN 1 ELSE 0 END) * 100, 2) FROM transactions) AS averageApproval,
      (SELECT ROUND(SUM(balance), 2) FROM cards) AS totalSpend,
      (SELECT ROUND((SUM(amount) / COUNT(*)) * 100, 2) FROM transactions WHERE status = 'APPROVED') AS cardVolume;
  `);

  const details = normalizeRows(dashboardRows)[0] ?? {};

  const stats: DashboardStats = {
    totalCardholders: Number(details.totalCardholders ?? 0),
    totalCards: Number(details.totalCards ?? 0),
    activeCards: Number(details.activeCards ?? 0),
    averageApproval: `${Number(details.averageApproval ?? 0).toFixed(2)}%`,
    cardVolume: `${Number(details.cardVolume ?? 0).toFixed(2)}%`,
    totalSpend: `NGN ${Number(details.totalSpend ?? 0).toLocaleString()}`
  };

  const cards = normalizeRows(db.exec('SELECT * FROM cards ORDER BY createdAt DESC;'));
  const transactions = normalizeRows(db.exec('SELECT * FROM transactions ORDER BY createdAt DESC LIMIT 4;'));
  const members = normalizeRows(db.exec('SELECT id, name, email, role, department, image, linkedin FROM users ORDER BY name;'));

  return {
    stats,
    cards,
    transactions,
    members,
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
