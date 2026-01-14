export const runtime = 'edge'; 

import { NextResponse } from "next/server";
import { encodePacked, keccak256 } from "viem"; 
import { privateKeyToAccount } from "viem/accounts";

const WORLD_CHAIN_ID = 480; 

export async function POST(req: Request) {
  try {
    const { userAddress, tokenAddress, nonce } = await req.json();

    // Setup Signer
    let privateKey = process.env.SIGNER_PRIVATE_KEY;
    if (!privateKey) return NextResponse.json({ error: "Key Missing" }, { status: 500 });
    
    if (!privateKey.startsWith("0x")) privateKey = `0x${privateKey.trim()}`;
    const account = privateKeyToAccount(privateKey as `0x${string}`);

    const messageHash = keccak256(
      encodePacked(
        ["address", "address", "uint256", "uint256"], 
        [
          userAddress as `0x${string}`, 
          tokenAddress as `0x${string}`, 
          BigInt(nonce),      
          BigInt(WORLD_CHAIN_ID)
        ]
      )
    );

    const signature = await account.signMessage({
      message: { raw: messageHash }
    });

    return NextResponse.json({ signature });

  } catch (error: any) {
    console.error("Backend Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}