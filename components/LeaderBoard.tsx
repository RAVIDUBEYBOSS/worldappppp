"use client";
import { useState, useEffect } from "react";
import { usePublicClient } from "wagmi";
import { formatUnits, parseAbiItem } from "viem";

const TOKEN_ADDRESS = "0x17B236e31dab6B071a0b51787329f77fEF69c3E6";
const AIRDROP_ADDRESS = "0xe9EAdb26850e7E08Da443C679e37a99a85a45022";

// --- 🎨 Name & Avatar Generator ---
const ADJECTIVES = ["Cyber", "Shadow", "Tech", "Iron", "Mystic", "Crypto", "Digital", "Neon", "Elite", "Warrior"];
const NOUNS = ["Ninja", "Hunter", "King", "Slayer", "Master", "Ghost", "Titan", "Viper", "Lord", "Army"];

function generateIdentity(address: string) {
  const seed = parseInt(address.slice(-4), 16); 
  const adj = ADJECTIVES[seed % ADJECTIVES.length];
  const noun = NOUNS[(seed * 13) % NOUNS.length];
  const avatarUrl = `https://api.dicebear.com/9.x/avataaars/svg?seed=${address}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
  return { name: `${adj} ${noun}`, avatar: avatarUrl };
}

export default function Leaderboard() {
  const publicClient = usePublicClient();
  const [activeTab, setActiveTab] = useState<"claimers" | "holders">("claimers");
  
  const [dataList, setDataList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // --- 🔥 REAL DATA FETCHING LOGIC ---
  const fetchData = async () => {
    if (!publicClient) return;
    setLoading(true);
    setDataList([]); // Clear old data

    try {
      // 1. Fetch All Transfer Events (Token Contract se)
      // Standard ERC20 Event: Transfer(from, to, value)
      const logs = await publicClient.getLogs({
        address: TOKEN_ADDRESS,
        event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 value)'),
        fromBlock: 'earliest' // Shuru se ab tak ka data
      });

      const balances: Record<string, bigint> = {};
      const claims: Record<string, bigint> = {};

      logs.forEach((log: any) => {
        const { from, to, value } = log.args;
        
        // --- Logic for Holders (Balance Calculation) ---
        if (from && to && value) {
          if (from !== "0x0000000000000000000000000000000000000000") {
            balances[from] = (balances[from] || 0n) - value;
          }
          balances[to] = (balances[to] || 0n) + value;

          // --- Logic for Claimers (Received from Airdrop Contract) ---
          // Agar sender Airdrop Contract hai, matlab ye Claim tha
          if (from.toLowerCase() === AIRDROP_ADDRESS.toLowerCase()) {
            claims[to] = (claims[to] || 0n) + value;
          }
        }
      });

      // --- Processing Data based on Tab ---
      let processedData = [];

      if (activeTab === "holders") {
        // Convert Balances to Array & Sort
        processedData = Object.entries(balances)
          .filter(([_, bal]) => bal > 0n) // Sirf positive balance wale
          .map(([addr, bal]) => ({
            address: addr,
            amount: parseFloat(formatUnits(bal, 18)).toFixed(2), // 2 decimal tak
            ...generateIdentity(addr)
          }))
          .sort((a, b) => Number(b.amount) - Number(a.amount)) // Highest First
          .slice(0, 20); // Top 20
      } else {
        // Convert Claims to Array & Sort
        processedData = Object.entries(claims)
          .map(([addr, bal]) => ({
            address: addr,
            amount: parseFloat(formatUnits(bal, 18)).toFixed(2),
            ...generateIdentity(addr)
          }))
          .sort((a, b) => Number(b.amount) - Number(a.amount))
          .slice(0, 20);
      }

      setDataList(processedData);

    } catch (e) {
      console.error("Fetch Error:", e);
    } finally {
      setLoading(false);
    }
  };

  // Tab change hone par data wapas layenge
  useEffect(() => {
    fetchData();
  }, [activeTab, publicClient]);

  return (
    <div className="w-full min-h-[60vh] bg-black text-white p-4 pb-32">
      
      {/* HEADER */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 uppercase tracking-tighter">
          HALL OF FAME
        </h2>
        <p className="text-[10px] text-gray-500 font-mono tracking-widest">REAL-TIME BLOCKCHAIN DATA</p>
      </div>

      {/* TABS */}
      <div className="flex justify-center gap-2 mb-6 p-1 bg-gray-900 rounded-xl w-fit mx-auto border border-gray-800">
        <button 
          onClick={() => setActiveTab("claimers")}
          className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === "claimers" ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50" : "text-gray-500 hover:text-white"}`}
        >
          TOP CLAIMERS
        </button>
        <button 
          onClick={() => setActiveTab("holders")}
          className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === "holders" ? "bg-purple-600 text-white shadow-lg shadow-purple-900/50" : "text-gray-500 hover:text-white"}`}
        >
          TOP HOLDERS
        </button>
      </div>

      {/* LIST AREA */}
      <div className="flex flex-col gap-3 max-w-md mx-auto">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[10px] text-gray-500 animate-pulse tracking-widest">ANALYZING BLOCKCHAIN...</span>
          </div>
        ) : dataList.length === 0 ? (
          <div className="text-center py-10 text-gray-600 text-xs font-mono border border-gray-800 rounded-xl bg-gray-900/50">
            NO DATA FOUND<br/>(Be the first!)
          </div>
        ) : (
          dataList.map((user, index) => (
            <div 
              key={index} 
              className="relative group bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-2xl p-2.5 flex items-center gap-3 transition-all hover:scale-[1.02] hover:bg-gray-800/80 hover:border-blue-500/30 shadow-lg"
            >
              
              {/* RANK */}
              <div className={`absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-black shadow-md z-10
                ${index === 0 ? "bg-gradient-to-br from-yellow-300 to-yellow-600 text-black" : 
                  index === 1 ? "bg-gradient-to-br from-gray-300 to-gray-500 text-black" : 
                  index === 2 ? "bg-gradient-to-br from-orange-300 to-orange-600 text-black" : "bg-gray-800 text-gray-500 border-gray-700"}
              `}>
                {index + 1}
              </div>

              {/* AVATAR */}
              <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-gray-700 to-gray-900 overflow-hidden shrink-0">
                <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full bg-black" />
              </div>

              {/* INFO */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-gray-200 group-hover:text-blue-400 transition-colors truncate">
                    {user.name}
                  </h3>
                  {index < 3 && <span className="text-[10px]">🏆</span>}
                </div>
                <p className="text-[9px] text-gray-500 font-mono truncate">
                  {user.address.slice(0, 6)}...{user.address.slice(-4)}
                </p>
              </div>

              {/* AMOUNT */}
              <div className="text-right shrink-0">
                <span className="block text-sm font-black text-white">{Number(user.amount).toLocaleString()}</span>
                <span className="text-[8px] font-bold text-gray-600 tracking-widest">COINS</span>
              </div>

            </div>
          ))
        )}

      </div>
    </div>
  );
}