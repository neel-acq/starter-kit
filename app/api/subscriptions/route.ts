import { getSubscriptions } from '@/lib/db/queries';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const subscriptions = await getSubscriptions();
    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}
