import { Upload, Download, Activity, Server } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const mockTransferData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  upload: Math.floor(Math.random() * 500) + 100,
  download: Math.floor(Math.random() * 800) + 200,
}));

const mockTransfers = [
  { id: 'EXF-001', file: 'database_export.sql', size: '245 MB', progress: 78, speed: '12.4 MB/s', target: 'TGT-4F2A', status: 'active' },
  { id: 'EXF-002', file: 'credential_dump.txt', size: '3.2 MB', progress: 100, speed: '—', target: 'TGT-8B91', status: 'completed' },
  { id: 'EXF-003', file: 'system_logs.zip', size: '89 MB', progress: 34, speed: '8.9 MB/s', target: 'TGT-C3E7', status: 'active' },
  { id: 'EXF-004', file: 'email_archive.pst', size: '1.2 GB', progress: 12, speed: '15.2 MB/s', target: 'TGT-7E2F', status: 'active' },
];

export function Exfiltration() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'var(--c2-cyan)';
      case 'completed': return 'var(--c2-toxic)';
      case 'failed': return 'var(--c2-crimson)';
      default: return '#666';
    }
  };

  const totalUpload = mockTransferData.reduce((acc, curr) => acc + curr.upload, 0);
  const totalDownload = mockTransferData.reduce((acc, curr) => acc + curr.download, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--c2-cyan)' }}>
            Data Exfiltration
          </h1>
          <p className="text-sm text-gray-400">
            Monitor and manage data transfer operations
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Upload', value: `${(totalUpload / 1000).toFixed(1)} GB`, icon: Upload, color: 'var(--c2-crimson)' },
          { label: 'Total Download', value: `${(totalDownload / 1000).toFixed(1)} GB`, icon: Download, color: 'var(--c2-toxic)' },
          { label: 'Active Transfers', value: '3', icon: Activity, color: 'var(--c2-cyan)' },
          { label: 'Exfil Nodes', value: '12', icon: Server, color: 'var(--c2-cyan)' },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="rounded-lg p-4 backdrop-blur-sm"
              style={{
                backgroundColor: 'rgba(22, 27, 34, 0.5)',
                border: '1px solid rgba(0, 240, 255, 0.1)',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-gray-400 uppercase tracking-wider">
                  {stat.label}
                </div>
                <Icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <div className="text-2xl font-bold font-mono" style={{ color: stat.color }}>
                {stat.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Transfer Graph */}
      <div
        className="rounded-lg p-4 backdrop-blur-sm"
        style={{
          backgroundColor: 'rgba(22, 27, 34, 0.5)',
          border: '1px solid rgba(0, 240, 255, 0.1)',
        }}
      >
        <h3 className="font-semibold mb-4" style={{ color: 'var(--c2-cyan)' }}>
          24-Hour Transfer Activity
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockTransferData}>
              <defs>
                <linearGradient id="uploadGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--c2-crimson)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--c2-crimson)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="downloadGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--c2-toxic)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--c2-toxic)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="hour" 
                stroke="#666" 
                style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}
              />
              <YAxis 
                stroke="#666" 
                style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--c2-darker-surface)',
                  border: '1px solid rgba(0, 240, 255, 0.2)',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="upload"
                stroke="var(--c2-crimson)"
                strokeWidth={2}
                fill="url(#uploadGradient)"
              />
              <Area
                type="monotone"
                dataKey="download"
                stroke="var(--c2-toxic)"
                strokeWidth={2}
                fill="url(#downloadGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--c2-crimson)' }} />
            <span className="text-gray-400">Upload</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--c2-toxic)' }} />
            <span className="text-gray-400">Download</span>
          </div>
        </div>
      </div>

      {/* Active Transfers */}
      <div
        className="rounded-lg backdrop-blur-sm overflow-hidden"
        style={{
          backgroundColor: 'rgba(22, 27, 34, 0.5)',
          border: '1px solid rgba(0, 240, 255, 0.1)',
        }}
      >
        <div
          className="px-4 py-3 border-b"
          style={{ borderColor: 'rgba(0, 240, 255, 0.1)' }}
        >
          <h3 className="font-semibold" style={{ color: 'var(--c2-cyan)' }}>
            Transfer Queue
          </h3>
        </div>

        <div className="divide-y" style={{ '--tw-divide-opacity': '0.1' }}>
          {mockTransfers.map((transfer) => (
            <div key={transfer.id} className="p-4 hover:bg-cyan-500/5 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="px-2 py-1 rounded text-xs font-mono font-semibold"
                    style={{
                      backgroundColor: `${getStatusColor(transfer.status)}20`,
                      color: getStatusColor(transfer.status),
                      border: `1px solid ${getStatusColor(transfer.status)}40`,
                    }}
                  >
                    {transfer.id}
                  </div>
                  <div>
                    <div className="font-mono text-sm text-gray-200">{transfer.file}</div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      Target: {transfer.target} • Size: {transfer.size}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {transfer.status === 'active' && (
                    <div className="text-xs font-mono" style={{ color: 'var(--c2-cyan)' }}>
                      {transfer.speed}
                    </div>
                  )}
                  <div
                    className="px-2 py-1 rounded text-xs font-semibold uppercase"
                    style={{
                      color: getStatusColor(transfer.status),
                    }}
                  >
                    {transfer.status}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-gray-800">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${transfer.progress}%`,
                      backgroundColor: getStatusColor(transfer.status),
                    }}
                  />
                </div>
                <span
                  className="text-xs font-mono font-semibold w-12 text-right"
                  style={{ color: getStatusColor(transfer.status) }}
                >
                  {transfer.progress}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
