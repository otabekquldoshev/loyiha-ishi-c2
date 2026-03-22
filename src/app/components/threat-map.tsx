import { useEffect, useState, useMemo } from "react";
import { 
  ShieldAlert, Terminal, Activity, Radar, 
  Zap, Shield, Server, Globe, Cpu, 
  Lock, HardDrive, Search, Settings, 
  Maximize2, BarChart3, ChevronRight, Eye
} from "lucide-react";

// --- 1. MA'LUMOTLAR STRUKTURASI ---
interface Node {
  id: string;
  lat: number;
  lng: number;
  type: 'attack' | 'defense' | 'compromised';
  label: string;
  ip: string;
  country: string;
  os: 'Windows' | 'Linux' | 'MacOS';
  status: 'ONLINE' | 'OFFLINE' | 'CRITICAL';
  cpu: number;
  mem: number;
  latency: string;
}

const initialNodes: Node[] = [
  { id: 'TGT-4F2A', lat: 41.2995, lng: 69.2401, type: 'defense', label: 'CORP-WS-01', ip: '192.168.1.105', country: 'Uzbekistan', os: 'Windows', status: 'ONLINE', cpu: 45, mem: 62, latency: '12ms' },
  { id: 'TGT-8B91', lat: 37.0902, lng: -95.7129, type: 'defense', label: 'MacBook-Pro', ip: '10.0.0.42', country: 'USA', os: 'MacOS', status: 'ONLINE', cpu: 23, mem: 48, latency: '45ms' },
  { id: 'TGT-C3E7', lat: 51.1657, lng: 10.4515, type: 'defense', label: 'ubuntu-server', ip: '172.16.0.88', country: 'Germany', os: 'Linux', status: 'ONLINE', cpu: 67, mem: 81, latency: '28ms' },
  { id: 'TGT-D947', lat: 55.7558, lng: 37.6173, type: 'attack', label: 'DEV-MACHINE', ip: '192.168.2.201', country: 'Russia', os: 'Windows', status: 'CRITICAL', cpu: 89, mem: 95, latency: '120ms' },
  { id: 'TGT-1A5C', lat: 55.3781, lng: -3.4360, type: 'compromised', label: 'web-server-01', ip: '10.10.10.15', country: 'UK', os: 'Linux', status: 'OFFLINE', cpu: 0, mem: 0, latency: '---' },
];

// --- 2. ASOSIY KOMPONENT ---
export function FullCyberDashboard() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [logs, setLogs] = useState<any[]>([]);
  const [time, setTime] = useState(new Date());
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Reallik qo'shish uchun dinamik yangilanishlar
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
      
      // CPU va Mem dinamikasini o'zgartirish
      setNodes(prev => prev.map(n => n.status !== 'OFFLINE' ? {
        ...n,
        cpu: Math.max(10, Math.min(100, n.cpu + (Math.random() * 10 - 5))),
        mem: Math.max(10, Math.min(100, n.mem + (Math.random() * 4 - 2)))
      } : n));

      // Yangi log qo'shish
      if (Math.random() > 0.7) {
        const methods = ['SQLi', 'XSS', 'Brute Force', 'DDoS'];
        const newLog = {
          id: Math.random().toString(36).substr(2, 9),
          time: new Date().toLocaleTimeString('en-GB').split(' ')[0],
          source: nodes[Math.floor(Math.random() * nodes.length)].label,
          target: nodes[Math.floor(Math.random() * nodes.length)].label,
          method: methods[Math.floor(Math.random() * methods.length)],
          blocked: Math.random() > 0.4
        };
        setLogs(prev => [newLog, ...prev].slice(0, 10));
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [nodes]);

  const getPos = (lat: number, lng: number) => ({
    y: ((90 - lat) / 180) * 100,
    x: ((lng + 180) / 360) * 100
  });

  return (
    <div className="flex flex-col w-full h-screen bg-[#02050a] text-cyan-500 font-mono overflow-hidden select-none">
      
      {/* --- HEADER (TOP BAR) --- */}
      <header className="h-16 border-b border-cyan-900/50 bg-black/60 flex items-center justify-between px-8 z-50 backdrop-blur-xl">
        <div className="flex items-center gap-5">
          <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-lg shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <ShieldAlert className="w-6 h-6 text-red-500 animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-[0.2em] text-white">NEXUS_TERMINAL_V2</h1>
            <p className="text-[9px] text-cyan-800 tracking-[0.5em] uppercase">Global Threat Intelligence Hive</p>
          </div>
        </div>

        <div className="flex items-center gap-12">
          <div className="hidden lg:flex gap-10">
            <StatHeader label="Active Threats" value="1,244" color="text-red-500" />
            <StatHeader label="Nodes Online" value="89%" color="text-green-500" />
            <StatHeader label="System Load" value="24%" color="text-cyan-500" />
          </div>
          <div className="text-2xl font-bold text-white tabular-nums tracking-wider bg-cyan-900/20 px-4 py-1 rounded border border-cyan-900/50">
            {time.toLocaleTimeString('en-GB')}
          </div>
        </div>
      </header>

      {/* --- ASOSIY ISH MAYDONI --- */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* CHAP PANEL: TERMINAL LOGS */}
        <aside className="w-80 border-r border-cyan-900/30 bg-black/40 p-4 flex flex-col gap-4 overflow-hidden">
          <div className="flex items-center gap-2 text-[10px] font-bold text-cyan-700 tracking-widest border-b border-cyan-900/30 pb-2 italic">
            <Terminal size={14} /> {`>_ LIVE_ATTACK_FEED`}
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {logs.map((log) => (
              <div key={log.id} className="p-3 bg-cyan-950/10 border border-cyan-900/20 rounded-md hover:bg-cyan-500/5 transition-all group animate-in slide-in-from-left">
                <div className="flex justify-between text-[9px] mb-1.5">
                  <span className="text-gray-600">{log.time}</span>
                  <span className={log.blocked ? 'text-green-500' : 'text-red-500 font-bold'}>
                    [{log.blocked ? 'blocked' : 'active'}]
                  </span>
                </div>
                <div className="text-[10px] truncate">
                  <span className="text-cyan-400 group-hover:text-cyan-300">{log.source}</span>
                  <span className="text-gray-600 mx-1">→</span>
                  <span className="text-gray-300">{log.target}</span>
                </div>
                <div className="mt-1 text-[9px] text-gray-500 italic">Method: {log.method}</div>
              </div>
            ))}
          </div>
        </aside>

        {/* MARKAZ: WORLD THREAT MAP */}
        <section className="flex-1 relative bg-[radial-gradient(circle_at_center,_#0a1220_0%,_#02050a_100%)]">
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%">
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="absolute top-6 left-6 z-20">
            <div className="px-4 py-1.5 bg-black/60 border border-cyan-500/30 rounded backdrop-blur-md">
              <span className="text-[11px] font-bold text-white tracking-widest">GLOBAL THREAT INTELLIGENCE MAP</span>
            </div>
          </div>

          {/* Map Points & Connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            {nodes.filter(n => n.type === 'attack').map((atk, i) => {
              const def = nodes.find(n => n.type === 'defense');
              if (!def) return null;
              const p1 = getPos(atk.lat, atk.lng);
              const p2 = getPos(def.lat, def.lng);
              return (
                <path
                  key={i}
                  d={`M ${p1.x}% ${p1.y}% Q ${(p1.x+p2.x)/2}% ${(p1.y+p2.y)/2 - 15}% ${p2.x}% ${p2.y}%`}
                  stroke="rgba(239, 68, 68, 0.4)"
                  strokeWidth="1"
                  fill="none"
                  strokeDasharray="5,5"
                  className="animate-pulse"
                />
              );
            })}
          </svg>

          {nodes.map((node) => {
            const pos = getPos(node.lat, node.lng);
            const isHovered = hoveredNode === node.id;
            return (
              <div 
                key={node.id}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <div className={`relative w-4 h-4 rounded-full border-2 transition-all duration-300 ${isHovered ? 'scale-150' : ''}`}
                     style={{ 
                       borderColor: node.type === 'attack' ? '#ef4444' : '#06b6d4',
                       backgroundColor: node.type === 'attack' ? '#ef444433' : '#06b6d433',
                       boxShadow: `0 0 20px ${node.type === 'attack' ? '#ef4444' : '#06b6d4'}`
                     }}>
                  {node.status === 'CRITICAL' && <div className="absolute inset-0 rounded-full animate-ping bg-red-500 opacity-50" />}
                </div>
              </div>
            );
          })}
        </section>

        {/* O'NG PANEL: STATISTICS */}
        <aside className="w-80 border-l border-cyan-900/30 bg-black/40 p-5 flex flex-col gap-8">
          <section>
            <div className="text-[10px] font-bold flex items-center gap-2 border-b border-cyan-900/30 pb-2 mb-4">
              <BarChart3 size={14} /> THREAT_DISTRIBUTION
            </div>
            <div className="space-y-4">
              <StatBar label="Malware" value={78} color="bg-red-500" />
              <StatBar label="Phishing" value={45} color="bg-orange-500" />
              <StatBar label="DDoS" value={92} color="bg-purple-500" />
              <StatBar label="SQLi" value={12} color="bg-cyan-500" />
            </div>
          </section>

          <section>
            <div className="text-[10px] font-bold flex items-center gap-2 border-b border-cyan-900/30 pb-2 mb-4">
              <Activity size={14} /> HARDWARE_STATUS
            </div>
            <div className="grid grid-cols-2 gap-3">
              <HardwareCard label="CPU_USAGE" val="42.8%" />
              <HardwareCard label="MEMORY" val="12.4GB" />
              <HardwareCard label="UPLINK" val="Stable" color="text-green-500" />
              <HardwareCard label="SEC_LEVEL" val="Elevated" color="text-red-500" />
            </div>
          </section>
        </aside>
      </main>

      {/* --- BOTTOM SECTION: TARGET TABLE --- */}
      <footer className="h-72 border-t border-cyan-900/50 bg-[#03070e] flex flex-col z-50">
        <div className="px-8 py-3 border-b border-cyan-900/20 bg-black/40 flex justify-between items-center">
          <div className="flex gap-6 text-[10px] font-bold tracking-widest uppercase">
             <span className="text-cyan-700">TOTAL NODES: <span className="text-white">{nodes.length}</span></span>
             <span className="text-cyan-700">ACTIVE SESSIONS: <span className="text-green-500">6</span></span>
          </div>
          <div className="flex gap-2">
            <button className="p-1.5 bg-cyan-500/10 border border-cyan-900/50 rounded hover:bg-cyan-500/20"><Search size={14}/></button>
            <button className="p-1.5 bg-cyan-500/10 border border-cyan-900/50 rounded hover:bg-cyan-500/20"><Settings size={14}/></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-2 custom-scrollbar">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-[10px] text-cyan-800 uppercase tracking-[0.2em]">
                <th className="pb-2 pl-4">ID_Tag</th>
                <th className="pb-2">Endpoint_Address</th>
                <th className="pb-2">OS_Architecture</th>
                <th className="pb-2 text-center">Latency</th>
                <th className="pb-2">Status_Node</th>
                <th className="pb-2">Performance_Metrics</th>
                <th className="pb-2 text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {nodes.map((node) => (
                <tr key={node.id} className="bg-cyan-950/5 border border-cyan-900/10 hover:bg-cyan-500/5 transition-all group">
                  <td className="py-3 pl-4 text-xs font-black text-cyan-500 group-hover:text-cyan-400">{node.id}</td>
                  <td className="py-3">
                    <div className="text-xs font-bold text-white">{node.ip}</div>
                    <div className="text-[9px] text-cyan-800 uppercase">{node.country}</div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2 text-[10px]">
                      <Server size={12} className="opacity-40" />
                      <span className="bg-white/5 px-2 py-0.5 rounded border border-white/5 uppercase">{node.os}</span>
                      <span className="text-[9px] text-gray-600">{node.label}</span>
                    </div>
                  </td>
                  <td className="py-3 text-center">
                    <div className="flex flex-col items-center">
                      <Zap size={10} className={node.status === 'CRITICAL' ? 'text-red-500' : 'text-yellow-500'} />
                      <span className="text-[10px] font-bold">{node.latency}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={`px-3 py-1 rounded-sm text-[9px] font-bold border ${
                      node.status === 'ONLINE' ? 'bg-green-500/10 border-green-500/30 text-green-500' : 
                      node.status === 'CRITICAL' ? 'bg-red-500/10 border-red-500/30 text-red-500 animate-pulse' :
                      'bg-gray-500/10 border-gray-500/30 text-gray-500'
                    }`}>
                      • {node.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="space-y-1.5 w-40">
                      <MiniProgress label="PROC" val={Math.round(node.cpu)} color="bg-cyan-500" />
                      <MiniProgress label="MEM" val={Math.round(node.mem)} color="bg-yellow-500" />
                    </div>
                  </td>
                  <td className="py-3 text-right pr-4">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 bg-black/40 border border-cyan-900/50 rounded text-cyan-500 hover:border-cyan-400"><Eye size={12}/></button>
                      <button className="p-1.5 bg-black/40 border border-cyan-900/50 rounded text-cyan-500 hover:border-cyan-400"><ChevronRight size={12}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #083344; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #0e7490; }
        @keyframes scanline { 0% { top: 0; } 100% { top: 100%; } }
        .scanline { position: absolute; width: 100%; height: 2px; background: rgba(6, 182, 212, 0.1); box-shadow: 0 0 15px rgba(6, 182, 212, 0.4); top: 0; left: 0; pointer-events: none; animation: scanline 8s linear infinite; z-index: 100; }
      `}</style>
      <div className="scanline" />
    </div>
  );
}

// --- YORDAMCHI KOMPONENTLAR ---
function StatHeader({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="flex flex-col items-end">
      <span className="text-[9px] text-gray-600 uppercase tracking-widest">{label}</span>
      <span className={`text-xs font-bold ${color}`}>{value}</span>
    </div>
  );
}

function StatBar({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[9px] uppercase text-gray-400">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1 w-full bg-gray-950 rounded-full overflow-hidden border border-white/5">
        <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function MiniProgress({ label, val, color }: { label: string, val: number, color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[8px] text-gray-500 w-8">{label}</span>
      <div className="flex-1 h-1 bg-gray-900 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${val}%` }} />
      </div>
      <span className="text-[8px] text-cyan-700 w-6">{val}%</span>
    </div>
  );
}

function HardwareCard({ label, val, color = "text-white" }: { label: string, val: string, color?: string }) {
  return (
    <div className="bg-cyan-950/10 border border-white/5 p-2 rounded">
      <p className="text-[8px] text-gray-600 mb-1">{label}</p>
      <p className={`text-xs font-black ${color}`}>{val}</p>
    </div>
  );
}
