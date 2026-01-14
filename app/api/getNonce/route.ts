export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { JsonRpcProvider, Contract } from "ethers";

const CONTRACT_ADDRESS = "0xe9EAdb26850e7E08Da443C679e37a99a85a45022";

const ABI = [
  "function userNonce(address user, address token) view returns (uint256)"
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userAddress, tokenAddress, rpcUrl } = body;

    if (!userAddress || !tokenAddress || !rpcUrl) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    const provider = new JsonRpcProvider(rpcUrl);
    const contract = new Contract(CONTRACT_ADDRESS, ABI, provider);

    const nonceBigInt = await contract.userNonce(userAddress, tokenAddress);

    return NextResponse.json({
      nonce: nonceBigInt.toString()
    });

  } catch (error: any) {
    console.error("Nonce fetch error:", error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
