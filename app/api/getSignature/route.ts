import { NextRequest, NextResponse } from "next/server";
import {
  Wallet,
  keccak256,
  solidityPacked,
  getBytes
} from "ethers";

const PRIVATE_KEY = process.env.SIGNER_PRIVATE_KEY!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userAddress, tokenAddress, nonce } = body;

    if (!userAddress || !tokenAddress || nonce === undefined) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    if (!PRIVATE_KEY) {
      return NextResponse.json(
        { error: "Signer misconfigured" },
        { status: 500 }
      );
    }

    const chainId = 480;

    const messageHash = keccak256(
      solidityPacked(
        ["address", "address", "uint256", "uint256"],
        [userAddress, tokenAddress, nonce, chainId]
      )
    );

    const wallet = new Wallet(PRIVATE_KEY);
    const signature = await wallet.signMessage(getBytes(messageHash));
    return NextResponse.json({ signature });

  } catch (error: any) {
    console.error("Sign error:", error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
