import { Link, useLocation } from "react-router";
import logoImg from "../../logo.png"; // Ikki marta orqaga (app va components papkasidan chiqish uchun)
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
    {/* Logo/Header qismi */}
      <div className="h-32 flex flex-col items-center justify-center border-b px-2 gap-3" style={{ borderColor: 'rgba(0, 240, 255, 0.1)' }}>
        {!collapsed ? (
          <div className="flex flex-col items-center text-center">
            {/* Logo doira ichida */}
            <div className="mb-2 p-1 rounded-full border border-cyan-500/30 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <img 
                src={logoImg} 
                alt="TUIT Logo" 
                className="w-16 h-16 object-contain rounded-full"
              />
            </div>
            
            {/* Matnlar */}
            <div className="flex flex-col">
              <span className="text-[11px] text-cyan-500/70 font-mono tracking-[0.3em] uppercase">
                TUIT Nexus
              </span>
              <span className="text-lg font-black text-white tracking-tighter leading-none mt-1">
                ABROROV <br/> BAXTIYOR
              </span>
            </div>
          </div>
        ) : (
          /* Sidebar yopiq bo'lgandagi holat */
          <img 
            src={logoImg} 
            alt="Logo" 
            className="w-10 h-10 object-contain rounded-full animate-pulse shadow-[0_0_10px_rgba(0,240,255,0.4)]"
          />
        )}
      </div>

      {/* Navigation */}
      <nav className="p-3 flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group"
              style={{
                backgroundColor: isActive ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
                color: isActive ? 'var(--c2-cyan)' : '#8b92a8',
              }}
            >
              {isActive && (
                <div 
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r"
                  style={{ backgroundColor: 'var(--c2-cyan)' }}
                />
              )}
              <Icon 
                className={`transition-all ${collapsed ? 'w-5 h-5' : 'w-5 h-5'}`}
                style={{
                  filter: isActive ? 'drop-shadow(0 0 6px var(--c2-cyan-glow))' : 'none',
                }}
              />
              {!collapsed && (
                <span className="text-sm font-medium group-hover:translate-x-0.5 transition-transform">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

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
