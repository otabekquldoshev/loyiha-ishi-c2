import { useState } from "react";
import { Monitor, Apple, Binary, Circle, ArrowUpDown, Eye, Terminal as TerminalIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

interface Target {
  id: string;
  ip: string;
  os: 'windows' | 'macos' | 'linux';
  hostname: string;
  lastSeen: string;
  status: 'online' | 'offline' | 'critical';
  cpu: number;
  ram: number;
}

const mockTargets: Target[] = [
  { id: 'TGT-4F2A', ip: '192.168.1.105', os: 'windows', hostname: 'CORP-WS-01', lastSeen: '2s ago', status: 'online', cpu: 45, ram: 62 },
  { id: 'TGT-8B91', ip: '10.0.0.42', os: 'macos', hostname: 'MacBook-Pro', lastSeen: '5s ago', status: 'online', cpu: 23, ram: 48 },
  { id: 'TGT-C3E7', ip: '172.16.0.88', os: 'linux', hostname: 'ubuntu-server', lastSeen: '12s ago', status: 'online', cpu: 67, ram: 81 },
  { id: 'TGT-D947', ip: '192.168.2.201', os: 'windows', hostname: 'DEV-MACHINE', lastSeen: '1m ago', status: 'critical', cpu: 89, ram: 95 },
  { id: 'TGT-1A5C', ip: '10.10.10.15', os: 'linux', hostname: 'web-server-01', lastSeen: '3m ago', status: 'offline', cpu: 0, ram: 0 },
  { id: 'TGT-7E2F', ip: '192.168.1.220', os: 'windows', hostname: 'ADMIN-PC', lastSeen: '8s ago', status: 'online', cpu: 34, ram: 55 },
  { id: 'TGT-9D4B', ip: '172.20.0.99', os: 'macos', hostname: 'iMac-Design', lastSeen: '15s ago', status: 'online', cpu: 56, ram: 72 },
  { id: 'TGT-3C8A', ip: '10.5.5.100', os: 'linux', hostname: 'db-primary', lastSeen: '2m ago', status: 'online', cpu: 78, ram: 88 },
];

export function TargetTable() {
  const [sortField, setSortField] = useState<keyof Target>('lastSeen');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);

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
      case 'online': return 'var(--c2-toxic)';
      case 'critical': return 'var(--c2-crimson)';
      case 'offline': return '#666';
      default: return 'var(--c2-cyan)';
    }
  };

  const getUsageColor = (value: number) => {
    if (value > 80) return 'var(--c2-crimson)';
    if (value > 60) return '#FFA500';
    return 'var(--c2-toxic)';
  };

  return (
    <div 
      className="rounded-lg overflow-hidden backdrop-blur-sm"
      style={{
        backgroundColor: 'rgba(22, 27, 34, 0.5)',
        border: '1px solid rgba(0, 240, 255, 0.1)',
        fontFamily: 'var(--font-ui)',
      }}
    >
      <div 
        className="px-4 py-3 border-b flex items-center justify-between"
        style={{ borderColor: 'rgba(0, 240, 255, 0.1)' }}
      >
        <h3 className="font-semibold" style={{ color: 'var(--c2-cyan)' }}>
          Active Targets
        </h3>
        <div className="text-xs text-gray-400 font-mono">
          {mockTargets.filter(t => t.status === 'online').length} / {mockTargets.length} ONLINE
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow 
              className="border-b hover:bg-transparent"
              style={{ borderColor: 'rgba(0, 240, 255, 0.1)' }}
            >
              <TableHead className="text-gray-400 font-mono text-xs">
                <button className="flex items-center gap-1 hover:text-cyan-400 transition-colors">
                  ID <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="text-gray-400 font-mono text-xs">IP ADDRESS</TableHead>
              <TableHead className="text-gray-400 font-mono text-xs">OS</TableHead>
              <TableHead className="text-gray-400 font-mono text-xs">HOSTNAME</TableHead>
              <TableHead className="text-gray-400 font-mono text-xs">LAST SEEN</TableHead>
              <TableHead className="text-gray-400 font-mono text-xs">STATUS</TableHead>
              <TableHead className="text-gray-400 font-mono text-xs">CPU/RAM</TableHead>
              <TableHead className="text-gray-400 font-mono text-xs">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockTargets.map((target) => {
              const OSIcon = getOSIcon(target.os);
              const isSelected = selectedTarget === target.id;

              return (
                <TableRow
                  key={target.id}
                  className="border-b transition-all cursor-pointer"
                  style={{
                    borderColor: 'rgba(0, 240, 255, 0.05)',
                    backgroundColor: isSelected ? 'rgba(0, 240, 255, 0.05)' : 'transparent',
                  }}
                  onClick={() => setSelectedTarget(target.id)}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 240, 255, 0.02)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <TableCell 
                    className="font-mono text-sm"
                    style={{ color: 'var(--c2-cyan)' }}
                  >
                    {target.id}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-gray-300">
                    {target.ip}
                  </TableCell>
                  <TableCell>
                    <OSIcon className="w-4 h-4 text-gray-400" />
                  </TableCell>
                  <TableCell className="text-sm text-gray-300">
                    {target.hostname}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-gray-400">
                    {target.lastSeen}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Circle
                        className="w-2 h-2 fill-current"
                        style={{ color: getStatusColor(target.status) }}
                      />
                      <span 
                        className="text-xs uppercase font-semibold"
                        style={{ color: getStatusColor(target.status) }}
                      >
                        {target.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-3 items-center">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-12 h-1 rounded-full overflow-hidden bg-gray-800">
                            <div 
                              className="h-full transition-all"
                              style={{ 
                                width: `${target.cpu}%`,
                                backgroundColor: getUsageColor(target.cpu)
                              }}
                            />
                          </div>
                          <span 
                            className="text-xs font-mono"
                            style={{ color: getUsageColor(target.cpu) }}
                          >
                            {target.cpu}%
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-12 h-1 rounded-full overflow-hidden bg-gray-800">
                            <div 
                              className="h-full transition-all"
                              style={{ 
                                width: `${target.ram}%`,
                                backgroundColor: getUsageColor(target.ram)
                              }}
                            />
                          </div>
                          <span 
                            className="text-xs font-mono"
                            style={{ color: getUsageColor(target.ram) }}
                          >
                            {target.ram}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <button 
                        className="p-1.5 rounded transition-all hover:scale-110"
                        style={{
                          backgroundColor: 'rgba(0, 240, 255, 0.1)',
                          border: '1px solid rgba(0, 240, 255, 0.3)',
                          color: 'var(--c2-cyan)',
                        }}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        className="p-1.5 rounded transition-all hover:scale-110"
                        style={{
                          backgroundColor: 'rgba(57, 255, 20, 0.1)',
                          border: '1px solid rgba(57, 255, 20, 0.3)',
                          color: 'var(--c2-toxic)',
                        }}
                      >
                        <TerminalIcon className="w-3.5 h-3.5" />
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
