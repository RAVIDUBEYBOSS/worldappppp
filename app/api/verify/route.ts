import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { users, claims } from '@/lib/schema';
import { eq, sql } from 'drizzle-orm';
export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { nullifier_hash } = await req.json();

    if (!nullifier_hash) {
      return NextResponse.json({ error: "No ID provided" }, { status: 400 });
    }
    const db = getDb(process.env.DB as any);
    const existingUser = await db.select().from(users).where(eq(users.nullifier_hash, nullifier_hash)).limit(1);

    if (existingUser.length > 0) {
      const user = existingUser[0];

      const lastClaimTime = new Date(user.last_claim_at || 0).getTime();
      const now = new Date().getTime();
      const hoursPassed = (now - lastClaimTime) / (1000 * 60 * 60);

      if (hoursPassed < 24) {
        return NextResponse.json({ 
          success: false, 
          message: "Wait 24h for next claim!",
          next_claim_in: 24 - hoursPassed 
        });
      }

      await db.update(users).set({
        total_claimed: user.total_claimed! + 10, // 10 Coin aur de do
        last_claim_at: new Date(),
      }).where(eq(users.nullifier_hash, nullifier_hash));

    } else {
      await db.insert(users).values({
        nullifier_hash: nullifier_hash,
        total_claimed: 10,
        last_claim_at: new Date(),
      });
    }

    await db.insert(claims).values({
      user_nullifier: nullifier_hash,
      amount: 10,
    });

    return NextResponse.json({ success: true, message: "10 TECH Coins Claimed!" });

  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}