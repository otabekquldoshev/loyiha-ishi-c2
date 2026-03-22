import { useState, useEffect } from "react";
import { 
  Monitor, Apple, Binary, Circle, ArrowUpDown, Eye, 
  Terminal as TerminalIcon, ShieldAlert, Activity, 
  Globe, Cpu, Database, Zap, HardDrive, Search, 
  ShieldCheck, Wifi, AlertTriangle, ChevronRight
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

// --- INTERFACES ---
interface Target {
  id: string;
  ip: string;
  countryCode: string;
  countryName: string;
  os: 'windows' | 'macos' | 'linux';
  hostname: string;
  lastSeen: string;
  status: 'online' | 'offline' | 'critical';
  cpu: number;
  ram: number;
  disk: number;
  latency: string;
  uptime: string;
}

// --- MOCK DATA ---
const mockTargets: Target[] = [
  { id: 'TGT-4F2A', ip: '192.168.1.105', countryCode: 'uz', countryName: 'UZBEKISTAN', os: 'windows', hostname: 'CORP-WS-01', lastSeen: '2s ago', status: 'online', cpu: 45, ram: 62, disk: 12, latency: '12ms', uptime: '12d 4h' },
  { id: 'TGT-8B91', ip: '10.0.0.42', countryCode: 'us', countryName: 'USA', os: 'macos', hostname: 'MacBook-Pro', lastSeen: '5s ago', status: 'online', cpu: 23, ram: 48, disk: 5, latency: '45ms', uptime: '2d 18h' },
  { id: 'TGT-C3E7', ip: '172.16.0.88', countryCode: 'de', countryName: 'GERMANY', os: 'linux', hostname: 'ubuntu-server', lastSeen: '28s ago', status: 'online', cpu: 67, ram: 81, disk: 34, latency: '28ms', uptime: '154d 2h' },
  { id: 'TGT-D947', ip: '192.168.2.201', countryCode: 'ru', countryName: 'RUSSIA', os: 'windows', hostname: 'DEV-MACHINE', lastSeen: '120ms', status: 'critical', cpu: 89, ram: 95, disk: 78, latency: '120ms', uptime: '45m' },
  { id: 'TGT-1A5C', ip: '10.10.10.15', countryCode: 'gb', countryName: 'UK', os: 'linux', hostname: 'web-server-01', lastSeen: '---', status: 'offline', cpu: 0, ram: 0, disk: 0, latency: '---', uptime: '0s' },
  { id: 'TGT-7E2F', ip: '192.168.1.220', countryCode: 'uz', countryName: 'UZBEKISTAN', os: 'windows', hostname: 'ADMIN-PC', lastSeen: '8s ago', status: 'online', cpu: 34, ram: 55, disk: 21, latency: '15ms', uptime: '5d 12h' },
  { id: 'TGT-9D4B', ip: '172.20.0.99', countryCode: 'jp', countryName: 'JAPAN', os: 'macos', hostname: 'iMac-Design', lastSeen: '15s ago', status: 'online', cpu: 56, ram: 72, disk: 45, latency: '180ms', uptime: '1d 2h' },
  { id: 'TGT-3C8A', ip: '10.5.5.100', countryCode: 'cn', countryName: 'CHINA', os: 'linux', hostname: 'db-primary', lastSeen: '2m ago', status: 'online', cpu: 78, ram: 88, disk: 62, latency: '95ms', uptime: '89d 5h' },
];

export function TargetTable() {
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Real-time soat effekti
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getFlagUrl = (code: string) => `https://flagcdn.com/w40/${code.toLowerCase()}.png`;

  const getOSIcon = (os: string) => {
    switch (os) {
      case 'windows': return <Monitor className="w-4 h-4 text-blue-400" />;
      case 'macos': return <Apple className="w-4 h-4 text-white" />;
      case 'linux': return <Binary className="w-4 h-4 text-orange-500" />;
      default: return <Monitor className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'online': return { color: '#39ff14', label: 'CONNECTED', pulse: true };
      case 'critical': return { color: '#ff3131', label: 'STRESS_LEVEL_HIGH', pulse: true };
      default: return { color: '#666', label: 'DISCONNECTED', pulse: false };
    }
  };

  const getUsageColor = (val: number) => {
    if (val > 85) return '#ff3131';
    if (val > 65) return '#f7ff00';
    return '#00f0ff';
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-700">
      
      {/* --- TOP CONTROL PANEL --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2 flex items-center gap-4 bg-[#0d1117]/80 border border-cyan-500/20 p-4 rounded-xl backdrop-blur-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500/40" />
            <input 
              type="text" 
              placeholder="SEARCH NODE BY IP OR HOSTNAME..."
              className="w-full bg-black/40 border border-cyan-500/10 rounded-lg pl-10 pr-4 py-2 text-xs text-cyan-400 placeholder:text-cyan-900 focus:outline-none focus:border-cyan-500/50 transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <div className="px-3 py-2 bg-cyan-500/5 border border-cyan-500/20 rounded-lg text-center min-w-[80px]">
              <div className="text-[9px] text-gray-500 uppercase font-black">Online</div>
              <div className="text-sm font-mono font-bold text-[#39ff14] tracking-tighter">
                0{mockTargets.filter(t => t.status === 'online').length}
              </div>
            </div>
            <div className="px-3 py-2 bg-red-500/5 border border-red-500/20 rounded-lg text-center min-w-[80px]">
              <div className="text-[9px] text-gray-500 uppercase font-black">Alert</div>
              <div className="text-sm font-mono font-bold text-red-500 tracking-tighter">
                0{mockTargets.filter(t => t.status === 'critical').length}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0d1117]/80 border border-cyan-500/20 p-4 rounded-xl backdrop-blur-md flex flex-col justify-center items-end">
          <div className="text-[10px] text-cyan-500/50 font-black tracking-[0.2em] mb-1 uppercase">System Synchronized</div>
          <div className="text-xl font-mono font-bold text-white tracking-widest tabular-nums">
            {currentTime}
          </div>
        </div>
      </div>

      {/* --- MAIN JADVAL --- */}
      <div className="relative rounded-2xl border border-cyan-500/10 bg-[#0d1117]/60 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.4)]">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-black/40">
              <TableRow className="border-b border-cyan-500/10 hover:bg-transparent">
                <TableHead className="py-5 text-cyan-500/50 text-[10px] uppercase font-black pl-8 tracking-widest">UID</TableHead>
                <TableHead className="text-cyan-500/50 text-[10px] uppercase font-black tracking-widest">Origin & Address</TableHead>
                <TableHead className="text-cyan-500/50 text-[10px] uppercase font-black tracking-widest text-center">Platform</TableHead>
                <TableHead className="text-cyan-500/50 text-[10px] uppercase font-black tracking-widest">System_ID</TableHead>
                <TableHead className="text-cyan-500/50 text-[10px] uppercase font-black tracking-widest text-center">Lat</TableHead>
                <TableHead className="text-cyan-500/50 text-[10px] uppercase font-black tracking-widest">Security_Status</TableHead>
                <TableHead className="text-cyan-500/50 text-[10px] uppercase font-black tracking-widest w-[220px]">Resource_Pool</TableHead>
                <TableHead className="text-cyan-500/50 text-[10px] uppercase font-black tracking-widest text-right pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {mockTargets.map((target) => {
                const status = getStatusInfo(target.status);
                const isSelected = selectedTarget === target.id;

                return (
                  <TableRow
                    key={target.id}
                    onMouseEnter={() => setHoveredRow(target.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    onClick={() => setSelectedTarget(target.id)}
                    className={`group transition-all duration-300 border-b border-white/[0.02] cursor-pointer ${
                      isSelected ? 'bg-cyan-500/10' : 'hover:bg-white/[0.03]'
                    }`}
                  >
                    <TableCell className="pl-8 text-[11px] font-bold text-cyan-500/40 font-mono">
                      {target.id}
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-4 py-1">
                        <div className="relative">
                          <img 
                            src={getFlagUrl(target.countryCode)} 
                            className="w-7 h-5 object-cover rounded shadow-lg group-hover:scale-110 transition-transform" 
                            alt={target.countryCode} 
                          />
                          <div className="absolute -inset-1 border border-cyan-500/20 rounded-sm pointer-events-none" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-white font-bold font-mono tracking-tighter">{target.ip}</span>
                          <span className="text-[9px] text-gray-500 font-black tracking-[0.1em] uppercase flex items-center gap-1">
                            <Globe size={8} /> {target.countryName}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex justify-center">
                        <div className="p-2 bg-black/40 rounded-lg border border-white/5 group-hover:border-cyan-500/40 transition-all">
                          {getOSIcon(target.os)}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-300 font-medium tracking-tight uppercase">{target.hostname}</span>
                        <span className="text-[9px] text-cyan-900 font-mono">Uptime: {target.uptime}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        <Zap className={`w-3.5 h-3.5 ${parseInt(target.latency) > 100 ? 'text-red-500 animate-pulse' : 'text-yellow-500'}`} />
                        <span className="text-[10px] font-mono font-bold text-gray-500">{target.latency}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div 
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-black/40 transition-all duration-500"
                        style={{ borderColor: `${status.color}33`, color: status.color }}
                      >
                        <div className="relative">
                          <div className={`w-1.5 h-1.5 rounded-full`} style={{ backgroundColor: status.color }} />
                          {status.pulse && (
                            <div className="absolute inset-0 w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: status.color }} />
                          )}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">{status.label}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-3 py-3">
                        {/* CPU Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[9px] font-black text-gray-600 uppercase">
                            <span className="flex items-center gap-1"><Cpu size={10} /> Processor_Load</span>
                            <span style={{ color: getUsageColor(target.cpu) }}>{target.cpu}%</span>
                          </div>
                          <div className="h-1 w-full bg-gray-900 rounded-full p-[1px] border border-white/5">
                            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${target.cpu}%`, backgroundColor: getUsageColor(target.cpu), boxShadow: `0 0 10px ${getUsageColor(target.cpu)}55` }} />
                          </div>
                        </div>
                        {/* RAM Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[9px] font-black text-gray-600 uppercase">
                            <span className="flex items-center gap-1"><Database size={10} /> Physical_Memory</span>
                            <span style={{ color: getUsageColor(target.ram) }}>{target.ram}%</span>
                          </div>
                          <div className="h-1 w-full bg-gray-900 rounded-full p-[1px] border border-white/5">
                            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${target.ram}%`, backgroundColor: getUsageColor(target.ram), boxShadow: `0 0 10px ${getUsageColor(target.ram)}55` }} />
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-right pr-8">
                      <div className={`flex justify-end gap-2 transition-all duration-300 ${hoveredRow === target.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
                        <button className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all">
                          <Eye size={16} />
                        </button>
                        <button className="p-2.5 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500 hover:text-black hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] transition-all">
                          <TerminalIcon size={16} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* --- FOOTER STATUS BAR --- */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-black/40 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded border border-white/10 group">
            <ShieldCheck size={14} className="text-cyan-500 group-hover:rotate-12 transition-transform" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Security: <span className="text-white">AES-256-GCM</span>
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded border border-white/10">
            <Wifi size={14} className="text-[#39ff14] animate-pulse" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Connection: <span className="text-[#39ff14]">ENCRYPTED_TUNNEL_ESTABLISHED</span>
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded border border-white/10">
            <AlertTriangle size={14} className="text-yellow-500" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Buffer_Status: <span className="text-white">OPTIMAL</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-700 italic">
          <div className="w-2 h-2 rounded-full bg-cyan-900 animate-pulse" />
          LISTENING_FOR_PACKETS...
          <ChevronRight size={12} className="ml-2 animate-bounce-x" />
        </div>
      </div>

      {/* --- RECENT ACTIVITY LOG (BONUS) --- */}
      <div className="p-4 bg-black/60 border border-cyan-950 rounded-xl">
        <div className="flex items-center gap-2 mb-3 text-cyan-500/50 text-[10px] font-black tracking-widest uppercase">
          <Activity size={12} /> Live_Node_Activity_Log
        </div>
        <div className="space-y-1 font-mono text-[9px]">
          <div className="text-gray-600 leading-relaxed tracking-tight underline-offset-4 decoration-cyan-900/30">
            [<span className="text-cyan-800">{new Date().toLocaleTimeString()}</span>] <span className="text-cyan-600">INFO:</span> Node TGT-4F2A pulse received from Tashkent, UZ. Payload: Health_Check_OK
          </div>
          <div className="text-gray-600 leading-relaxed tracking-tight italic opacity-50">
            [<span className="text-cyan-800">04:12:05</span>] <span className="text-yellow-700">WARN:</span> Node TGT-D947 reporting high thermal activity on Core #2. Stress level: 89%
          </div>
        </div>
      </div>
    </div>
  );
}
