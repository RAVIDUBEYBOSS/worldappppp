"use client";

// Added 'adgrid' to types
type View = "home" | "claim" | "adgrid" | "leaderboard" | "support";

interface Props {
  activeView: View;
  setView: (v: View) => void;
}

export default function BottomNav({ activeView, setView }: Props) {
  const navItems = [
    { 
      id: "home", 
      label: "HOME", 
      icon: (active: boolean) => <svg className="w-5 h-5" fill={active?"currentColor":"none"} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
    },
    { 
      id: "claim", 
      label: "CLAIM", 
      icon: (active: boolean) => <svg className="w-5 h-5" fill={active?"currentColor":"none"} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" /></svg>
    },
    { 
      id: "adgrid", 
      label: "ADS",
      icon: (active: boolean) => <svg className="w-5 h-5" fill={active?"currentColor":"none"} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
    },
    { 
      id: "leaderboard", 
      label: "RANK", 
      icon: (active: boolean) => <svg className="w-5 h-5" fill={active?"currentColor":"none"} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0V5.625a2.25 2.25 0 11-4.5 0v5.75c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125-.504 1.125-1.125" /></svg>
    },
    { 
      id: "support", 
      label: "HELP", 
      icon: (active: boolean) => <svg className="w-5 h-5" fill={active?"currentColor":"none"} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>
    },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-[400px] px-2 z-50">
      <div className="h-16 bg-black/90 backdrop-blur-xl border border-white/10 rounded-3xl flex justify-between items-center px-1 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button key={item.id} onClick={() => setView(item.id as any)} className="relative flex flex-col items-center justify-center flex-1 h-full group">
              
              {/* Glow Effect */}
              {isActive && <div className="absolute top-1 w-8 h-8 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>}
              
              {/* Icon */}
              <span className={`transition-all duration-300 ${isActive ? "-translate-y-1 scale-110 text-blue-400" : "text-gray-500 group-hover:text-gray-300"}`}>
                {item.icon(isActive)}
              </span>

              {/* Label - AB HAMESHA DIKHEGA */}
              <span className={`text-[8px] font-black tracking-widest transition-colors duration-300 ${isActive ? "text-blue-400" : "text-gray-600 group-hover:text-gray-400"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}