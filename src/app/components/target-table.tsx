import { useState, useEffect } from "react";
import { 
  Monitor, Apple, Binary, Circle, ArrowUpDown, Eye, 
  Terminal as TerminalIcon, ShieldAlert, Activity, 
  Globe, Cpu, HardDrive, Database, Zap
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

// Target interfeysi - barcha parametrlar bilan
interface Target {
  id: string;
  ip: string;
  country: string;
  flag: string;
  os: 'windows' | 'macos' | 'linux';
  hostname: string;
  lastSeen: string;
  status: 'online' | 'offline' | 'critical';
  cpu: number;
  ram: number;
  disk: number;
  latency: string;
}

// Barcha targetlarni to'liq ro'yxati (hech qanday qisqartirishsiz)
const mockTargets: Target[] = [
  { id: 'TGT-4F2A', ip: '192.168.1.105', country: 'Uzbekistan', flag: '🇺🇿', os: 'windows', hostname: 'CORP-WS-01', lastSeen: '2s ago', status: 'online', cpu: 45, ram: 62, disk: 22, latency: '12ms' },
  { id: 'TGT-8B91', ip: '10.0.0.42', country: 'USA', flag: '🇺🇸', os: 'macos', hostname: 'MacBook-Pro', lastSeen: '5s ago', status: 'online', cpu: 23, ram: 48, disk: 15, latency: '45ms' },
  { id: 'TGT-C3E7', ip: '172.16.0.88', country: 'Germany', flag: '🇩🇪', os: 'linux', hostname: 'ubuntu-server', lastSeen: '12s ago', status: 'online', cpu: 67, ram: 81, disk: 44, latency: '28ms' },
  { id: 'TGT-D947', ip: '192.168.2.201', country: 'Russia', flag: '🇷🇺', os: 'windows', hostname: 'DEV-MACHINE', lastSeen: '1m ago', status: 'critical', cpu: 89, ram: 95, disk: 88, latency: '120ms' },
  { id: 'TGT-1A5C', ip: '10.10.10.15', country: 'UK', flag: '🇬🇧', os: 'linux', hostname: 'web-server-01', lastSeen: '3m ago', status: 'offline', cpu: 0, ram: 0, disk: 0, latency: '---' },
  { id: 'TGT-7E2F', ip: '192.168.1.220', country: 'Uzbekistan', flag: '🇺🇿', os: 'windows', hostname: 'ADMIN-PC', lastSeen: '8s ago', status: 'online', cpu: 34, ram: 55, disk: 30, latency: '15ms' },
  { id: 'TGT-9D4B', ip: '172.20.0.99', country: 'Japan', flag: '🇯🇵', os: 'macos', hostname: 'iMac-Design', lastSeen: '15s ago', status: 'online', cpu: 56, ram: 72, disk: 61, latency: '180ms' },
  { id: 'TGT-3C8A', ip: '10.5.5.100', country: 'China', flag: '🇨🇳', os: 'linux', hostname: 'db-primary', lastSeen: '2m ago', status: 'online', cpu: 78, ram: 88, disk: 70, latency: '95ms' },
];

export function TargetTable() {
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  // OS Ikonkalarini aniqlash
  const getOSIcon = (os: string) => {
    switch (os) {
      case 'windows': return <Monitor className="w-4 h-4 text-blue-400" />;
      case 'macos': return <Apple className="w-4 h-4 text-gray-200" />;
      case 'linux': return <Binary className="w-4 h-4 text-orange-400" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  // Status stillari (Neon effektlar bilan)
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'online': return { color: '#39ff14', bg: 'rgba(57, 255, 20, 0.05)', border: 'rgba(57, 255, 20, 0.3)', shadow: '0 0 15px rgba(57, 255, 20, 0.2)' };
      case 'critical': return { color: '#ff3131', bg: 'rgba(255, 49, 49, 0.05)', border: 'rgba(255, 49, 49, 0.3)', shadow: '0 0 15px rgba(255, 49, 49, 0.2)' };
      default: return { color: '#8b92a8', bg: 'rgba(139, 146, 168, 0.05)', border: 'rgba(139, 146, 168, 0.2)', shadow: 'none' };
    }
  };

  // Ranglar mantiqi
  const getProgressColor = (value: number) => {
    if (value > 85) return '#ff3131'; // Critical
    if (value > 60) return '#f7ff00'; // Warning
    return '#00f0ff'; // Normal
  };

  return (
    <div className="w-full rounded-xl overflow-hidden border border-cyan-500/20 bg-[#0d1117]/90 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
      
      {/* Kengaytirilgan Header */}
      <div className="px-6 py-5 border-b border-cyan-500/10 flex items-center justify-between bg-gradient-to-r from-cyan-500/10 via-transparent to-transparent">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Activity className="w-6 h-6 text-cyan-400 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
          </div>
          <div>
            <h3 className="text-sm font-black tracking-[0.2em] text-white uppercase flex items-center gap-2">
              Nexus Terminal <span className="text-cyan-500 opacity-50">|</span> 
              <span className="text-cyan-400 font-mono">v4.0.2-STABLE</span>
            </h3>
            <p className="text-[10px] text-gray-500 font-mono mt-1">SCANNING GLOBAL NETWORK NODES...</p>
          </div>
        </div>
        
        <div className="flex gap-6 items-center">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">Global Status</span>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#39ff14]/10 border border-[#39ff14]/20">
                <div className="w-1.5 h-1.5 rounded-full bg-[#39ff14] shadow-[0_0_8px_#39ff14]" />
                <span className="text-[10px] font-bold text-[#39ff14]">{mockTargets.filter(t => t.status === 'online').length} LIVE</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-red-500/10 border border-red-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_red]" />
                <span className="text-[10px] font-bold text-red-500">{mockTargets.filter(t => t.status === 'critical').length} ALERT</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <Table>
          <TableHeader className="bg-black/60 sticky top-0 z-10">
            <TableRow className="border-b border-cyan-500/20 hover:bg-transparent">
              <TableHead className="text-cyan-400 font-mono text-[11px] uppercase py-4 pl-6">Node ID</TableHead>
              <TableHead className="text-cyan-400 font-mono text-[11px] uppercase">Geo-Location & IP</TableHead>
              <TableHead className="text-cyan-400 font-mono text-[11px] uppercase">OS Platform</TableHead>
              <TableHead className="text-cyan-400 font-mono text-[11px] uppercase">Hostname</TableHead>
              <TableHead className="text-cyan-400 font-mono text-[11px] uppercase text-center">Latency</TableHead>
              <TableHead className="text-cyan-400 font-mono text-[11px] uppercase">Status Check</TableHead>
              <TableHead className="text-cyan-400 font-mono text-[11px] uppercase w-[200px]">System Load</TableHead>
              <TableHead className="text-cyan-400 font-mono text-[11px] uppercase text-right pr-6">Operations</TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {mockTargets.map((target) => {
              const statusStyle = getStatusStyle(target.status);
              const isSelected = selectedTarget === target.id;
              
              return (
                <TableRow
                  key={target.id}
                  onClick={() => setSelectedTarget(target.id)}
                  onMouseEnter={() => setHoveredRow(target.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className={`group transition-all duration-200 border-b border-white/[0.03] cursor-pointer ${
                    isSelected ? 'bg-cyan-500/10 shadow-[inset_0_0_20px_rgba(0,240,255,0.05)]' : 'hover:bg-white/[0.02]'
                  }`}
                >
                  <TableCell className="font-mono text-xs font-bold text-cyan-500/60 pl-6">
                    {target.id}
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <div className="relative group/flag">
                        <span className="text-2xl drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] group-hover/flag:scale-125 transition-transform block">
                          {target.flag}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-white font-mono font-bold tracking-tighter group-hover:text-cyan-400 transition-colors">
                          {target.ip}
                        </span>
                        <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest flex items-center gap-1">
                          <Globe className="w-2 h-2" /> {target.country}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2 bg-black/40 w-fit px-2 py-1 rounded border border-white/5">
                      {getOSIcon(target.os)}
                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">{target.os}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-xs text-gray-300 font-mono">
                    {target.hostname}
                  </TableCell>

                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <Zap className={`w-3 h-3 mb-1 ${parseInt(target.latency) > 100 ? 'text-red-500' : 'text-yellow-500'}`} />
                      <span className="text-[10px] font-mono text-gray-400">{target.latency}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div 
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-[0.15em] border transition-all duration-500"
                      style={{ 
                        color: statusStyle.color, 
                        backgroundColor: statusStyle.bg,
                        borderColor: statusStyle.border,
                        boxShadow: statusStyle.shadow 
                      }}
                    >
                      {target.status === 'critical' ? (
                        <ShieldAlert size={12} className="animate-bounce" />
                      ) : (
                        <div className={`w-1.5 h-1.5 rounded-full ${target.status === 'online' ? 'bg-[#39ff14] animate-pulse' : 'bg-gray-500'}`} />
                      )}
                      {target.status}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-3 py-2">
                      {/* CPU Section */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[9px] uppercase font-bold tracking-tighter text-gray-500 px-0.5">
                          <div className="flex items-center gap-1"><Cpu size={10} /> Processor</div>
                          <span style={{ color: getProgressColor(target.cpu) }}>{target.cpu}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden p-[1px] border border-white/5">
                          <div 
                            className="h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(0,240,255,0.3)]"
                            style={{ width: `${target.cpu}%`, backgroundColor: getProgressColor(target.cpu) }}
                          />
                        </div>
                      </div>

                      {/* RAM Section */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[9px] uppercase font-bold tracking-tighter text-gray-500 px-0.5">
                          <div className="flex items-center gap-1"><Database size={10} /> Memory</div>
                          <span style={{ color: getProgressColor(target.ram) }}>{target.ram}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden p-[1px] border border-white/5">
                          <div 
                            className="h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(0,240,255,0.3)]"
                            style={{ width: `${target.ram}%`, backgroundColor: getProgressColor(target.ram) }}
                          />
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-right pr-6">
                    <div className={`flex justify-end gap-2 transition-all duration-300 ${hoveredRow === target.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
                      <button title="Intercept Node" className="p-2.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_15px_#00f0ff] transition-all">
                        <Eye size={16} />
                      </button>
                      <button title="Open Shell" className="p-2.5 rounded bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500 hover:text-black hover:shadow-[0_0_15px_#39ff14] transition-all">
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

      {/* Footer Stats */}
      <div className="px-6 py-3 bg-black/40 border-t border-cyan-500/10 flex items-center justify-between">
        <div className="flex gap-4 items-center font-mono text-[10px] text-gray-500 uppercase">
          <span className="flex items-center gap-1"><HardDrive size={10} /> Total Data: 1.4 TB</span>
          <span className="text-cyan-900">|</span>
          <span className="flex items-center gap-1 text-cyan-600 animate-pulse">Connection: Secure (AES-256)</span>
        </div>
        <div className="text-[10px] font-mono text-cyan-500/50 italic">
          LAST GLOBAL SYNC: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
