import { Link, useLocation } from "react-router";
import logoImg from "../../logo.png";
import { 
  LayoutDashboard, 
  Target, 
  ListChecks, 
  Package, 
  FolderTree, 
  Download, 
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { path: "/", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/targets", icon: Target, label: "Targets" },
  { path: "/tasks", icon: ListChecks, label: "Tasks" },
  { path: "/payloads", icon: Package, label: "Payloads" },
  { path: "/file-system", icon: FolderTree, label: "File System" },
  { path: "/exfiltration", icon: Download, label: "Exfiltration" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

export function C2Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div 
      className="h-screen transition-all duration-300 relative"
      style={{
        width: collapsed ? '64px' : '240px',
        backgroundColor: 'var(--c2-darker-surface)',
        borderRight: '1px solid rgba(0, 240, 255, 0.1)',
        fontFamily: 'var(--font-ui)',
      }}
    >
     {/* Logo/Header - Professional Yangilanish */}
      <div className="pt-10 pb-6 flex flex-col items-center justify-center border-b px-4 gap-4" style={{ borderColor: 'rgba(0, 240, 255, 0.1)' }}>
        {!collapsed ? (
          <div className="flex flex-col items-center">
            {/* Yanada kattaroq va kuchli nurli Logo */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-cyan-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-black p-1 rounded-full border border-cyan-500/50 shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                <img 
                  src={logoImg} 
                  alt="TUIT Logo" 
                  className="w-24 h-24 object-contain rounded-full"
                />
              </div>
            </div>
            
            {/* Matnlar qismini markazlashtirish va kattalashtirish */}
            <div className="flex flex-col items-center mt-4 text-center">
              <span className="text-[12px] text-cyan-400 font-mono tracking-[0.4em] uppercase opacity-80">
                TUIT NEXUS C2
              </span>
              <div className="h-px w-12 bg-cyan-500/30 my-2"></div>
              <h1 className="text-xl font-black text-white tracking-tighter leading-[1.1]">
                QULDOSHEV <br/> 
                <span className="text-cyan-500">OTABEK</span>
              </h1>
            </div>
          </div>
        ) : (
          /* Sidebar yopiq bo'lgandagi holat */
          <div className="py-4">
            <img 
              src={logoImg} 
              alt="Logo" 
              className="w-12 h-12 object-contain rounded-full animate-pulse shadow-[0_0_15px_rgba(0,240,255,0.5)]"
            />
          </div>
        )}
      </div>
      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute bottom-6 -right-3 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
        style={{
          backgroundColor: 'var(--c2-dark-surface)',
          border: '1px solid var(--c2-cyan)',
          color: 'var(--c2-cyan)',
        }}
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Scanline Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div 
          className="h-px w-full absolute animate-scan-line"
          style={{ 
            background: 'linear-gradient(90deg, transparent, var(--c2-cyan), transparent)',
          }}
        />
      </div>

      <style>{`
        @keyframes scan-line {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .animate-scan-line {
          animation: scan-line 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
