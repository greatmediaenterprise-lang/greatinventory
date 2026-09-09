import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getDashboardData, getUserById } from '@/lib/db';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('greatpay_session')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = verifyToken(token);

  if (!payload || typeof payload.sub !== 'string') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await getUserById(payload.sub);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { stats, cards, transactions, members, alerts } = await getDashboardData();

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      image: user.image,
      linkedin: user.linkedin
    },
    stats,
    cards,
    transactions,
    members,
    alerts
  });
}
