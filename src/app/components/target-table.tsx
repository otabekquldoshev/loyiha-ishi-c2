import { useState, useMemo } from "react";
import { 
  Monitor, Apple, Binary, Circle, ArrowUpDown, Eye, 
  Terminal as TerminalIcon, Globe, Activity, Shield 
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

// Target ma'lumotlari uchun interfeys
interface Target {
  id: string;
  ip: string;
  os: 'windows' | 'macos' | 'linux';
  hostname: string;
  lastSeen: string;
  status: 'online' | 'offline' | 'critical';
  cpu: number;
  ram: number;
  countryCode: string;
}

const mockTargets: Target[] = [
  { id: 'TGT-4F2A', ip: '192.168.1.105', os: 'windows', hostname: 'CORP-WS-01', lastSeen: '2s ago', status: 'online', cpu: 45, ram: 62, countryCode: 'uz' },
  { id: 'TGT-8B91', ip: '10.0.0.42', os: 'macos', hostname: 'MacBook-Pro', lastSeen: '5s ago', status: 'online', cpu: 23, ram: 48, countryCode: 'us' },
  { id: 'TGT-C3E7', ip: '172.16.0.88', os: 'linux', hostname: 'ubuntu-server', lastSeen: '12s ago', status: 'online', cpu: 67, ram: 81, countryCode: 'de' },
  { id: 'TGT-D947', ip: '192.168.2.201', os: 'windows', hostname: 'DEV-MACHINE', lastSeen: '1m ago', status: 'critical', cpu: 89, ram: 95, countryCode: 'ru' },
  { id: 'TGT-1A5C', ip: '10.10.10.15', os: 'linux', hostname: 'web-server-01', lastSeen: '3m ago', status: 'offline', cpu: 0, ram: 0, countryCode: 'cn' },
  { id: 'TGT-7E2F', ip: '192.168.1.220', os: 'windows', hostname: 'ADMIN-PC', lastSeen: '8s ago', status: 'online', cpu: 34, ram: 55, countryCode: 'uz' },
  { id: 'TGT-9D4B', ip: '172.20.0.99', os: 'macos', hostname: 'iMac-Design', lastSeen: '15s ago', status: 'online', cpu: 56, ram: 72, countryCode: 'fr' },
];

export function TargetTable() {
  const [sortField, setSortField] = useState<keyof Target>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);

  // Saralash funksiyasi
  const handleSort = (field: keyof Target) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedTargets = useMemo(() => {
    return [...mockTargets].sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [sortField, sortDirection]);

  const getOSIcon = (os: string) => {
    switch (os) {
      case 'windows': return Monitor;
      case 'macos': return Apple;
      case 'linux': return Binary;
      default: return Monitor;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#39ff14'; // Toxic Green
      case 'critical': return '#ff003c'; // Crimson Red
      default: return '#4b5563'; // Gray
    }
  };

  const getUsageColor = (value: number) => {
    if (value > 80) return '#ff003c';
    if (value > 60) return '#fbbf24';
    return '#39ff14';
  };

  return (
    <div className="rounded-lg overflow-hidden border border-cyan-500/20 bg-slate-950/40 backdrop-blur-md shadow-2xl font-mono">
      {/* Table Header Section */}
      <div className="px-6 py-4 border-b border-cyan-500/10 flex items-center justify-between bg-cyan-500/5">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-cyan-500/10 rounded border border-cyan-500/20">
            <Shield className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-xs font-black tracking-[0.2em] text-cyan-400 uppercase leading-none">
              Nexus Network Nodes
            </h3>
            <p className="text-[9px] text-slate-500 mt-1">TOTAL_TARGETS: {mockTargets.length} | ENCRYPTED_TUNNEL: ACTIVE</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] text-green-500 font-bold uppercase">
              {mockTargets.filter(t => t.status === 'online').length} Live
            </span>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-900/60">
            <TableRow className="border-cyan-500/10 hover:bg-transparent">
              <TableHead className="pl-6 py-4">
                <button onClick={() => handleSort('id')} className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-cyan-400 transition-colors">
                  UID <ArrowUpDown size={12} />
                </button>
              </TableHead>
              <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Network / Loc</TableHead>
              <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">System</TableHead>
              <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Connection</TableHead>
              <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Telemetry</TableHead>
              <TableHead className="pr-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTargets.map((target) => {
              const OSIcon = getOSIcon(target.os);
              const isSelected = selectedTarget === target.id;

              return (
                <TableRow 
                  key={target.id}
                  onClick={() => setSelectedTarget(target.id)}
                  className={`group transition-all border-cyan-500/5 cursor-pointer hover:bg-cyan-500/5 ${isSelected ? 'bg-cyan-500/10' : ''}`}
                >
                  {/* ID */}
                  <TableCell className="pl-6 py-4 font-bold text-xs text-cyan-500">
                    {target.id}
                  </TableCell>

                  {/* Flag + IP */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img 
                        src={`https://flagcdn.com/w40/${target.countryCode}.png`} 
                        alt={target.countryCode} 
                        className="w-5 h-3.5 object-cover rounded-sm border border-white/10 shadow-sm"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm text-slate-200 font-bold">{target.ip}</span>
                        <span className="text-[10px] text-slate-500 uppercase font-medium">{target.hostname}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* OS */}
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      <OSIcon className={`w-5 h-5 ${isSelected ? 'text-cyan-400' : 'text-slate-600 group-hover:text-slate-400'}`} />
                      <span className="text-[9px] text-slate-500 capitalize">{target.os}</span>
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getStatusColor(target.status), boxShadow: `0 0 8px ${getStatusColor(target.status)}` }} />
                      <span className="text-[10px] font-black uppercase" style={{ color: getStatusColor(target.status) }}>
                        {target.status}
                      </span>
                    </div>
                    <p className="text-[9px] text-slate-600 mt-1 uppercase">Seen: {target.lastSeen}</p>
                  </TableCell>

                  {/* Progress Bars */}
                  <TableCell>
                    <div className="flex flex-col gap-1.5 w-24">
                      <div className="flex items-center justify-between text-[9px] text-slate-500">
                        <span>CPU</span><span>{target.cpu}%</span>
                      </div>
                      <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full transition-all duration-500" style={{ width: `${target.cpu}%`, backgroundColor: getUsageColor(target.cpu) }} />
                      </div>
                      <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full transition-all duration-500" style={{ width: `${target.ram}%`, backgroundColor: getUsageColor(target.ram) }} />
                      </div>
                    </div>
                  </TableCell>

                  {/* Buttons */}
                  <TableCell className="pr-6 text-right">
                    <div className="flex gap-2 justify-end opacity-40 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-cyan-500/20 rounded border border-cyan-500/30 text-cyan-400 transition-transform active:scale-90">
                        <TerminalIcon size={14} />
                      </button>
                      <button className="p-2 hover:bg-slate-700/50 rounded border border-slate-700 text-slate-400">
                        <Eye size={14} />
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
  );
}
