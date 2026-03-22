import { Package, Download, Copy, Trash2, Plus } from "lucide-react";

const mockPayloads = [
  { id: 'PLD-001', name: 'windows_reverse_shell.exe', type: 'Executable', os: 'Windows', size: '2.4 MB', downloads: 47, created: '2024-03-20' },
  { id: 'PLD-002', name: 'macos_backdoor.dmg', type: 'DMG', os: 'macOS', size: '3.1 MB', downloads: 23, created: '2024-03-19' },
  { id: 'PLD-003', name: 'linux_rootkit.sh', type: 'Script', os: 'Linux', size: '156 KB', downloads: 89, created: '2024-03-18' },
  { id: 'PLD-004', name: 'keylogger_multi.py', type: 'Script', os: 'Multi', size: '45 KB', downloads: 134, created: '2024-03-17' },
  { id: 'PLD-005', name: 'persistence_module.dll', type: 'DLL', os: 'Windows', size: '892 KB', downloads: 56, created: '2024-03-16' },
];

export function Payloads() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--c2-cyan)' }}>
            Payload Arsenal
          </h1>
          <p className="text-sm text-gray-400">
            Manage and deploy attack payloads
          </p>
        </div>
        <button
          className="px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 hover:scale-105 flex items-center gap-2"
          style={{
            backgroundColor: 'rgba(57, 255, 20, 0.1)',
            border: '1px solid var(--c2-toxic)',
            color: 'var(--c2-toxic)',
          }}
        >
          <Plus className="w-4 h-4" />
          Generate Payload
        </button>
      </div>

      {/* Payload Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Payloads', value: '87', color: 'var(--c2-cyan)' },
          { label: 'Active', value: '45', color: 'var(--c2-toxic)' },
          { label: 'Total Downloads', value: '2.3K', color: 'var(--c2-cyan)' },
          { label: 'Success Rate', value: '94%', color: 'var(--c2-toxic)' },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="rounded-lg p-4 backdrop-blur-sm"
            style={{
              backgroundColor: 'rgba(22, 27, 34, 0.5)',
              border: '1px solid rgba(0, 240, 255, 0.1)',
            }}
          >
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
              {stat.label}
            </div>
            <div className="text-2xl font-bold font-mono" style={{ color: stat.color }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Payloads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockPayloads.map((payload) => (
          <div
            key={payload.id}
            className="rounded-lg p-4 backdrop-blur-sm hover:scale-[1.02] transition-all duration-300"
            style={{
              backgroundColor: 'rgba(22, 27, 34, 0.5)',
              border: '1px solid rgba(0, 240, 255, 0.1)',
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="p-2 rounded-lg"
                style={{
                  backgroundColor: 'rgba(0, 240, 255, 0.1)',
                  border: '1px solid rgba(0, 240, 255, 0.3)',
                }}
              >
                <Package className="w-5 h-5" style={{ color: 'var(--c2-cyan)' }} />
              </div>
              <div
                className="px-2 py-0.5 rounded text-xs font-mono font-semibold"
                style={{
                  backgroundColor: 'rgba(0, 240, 255, 0.1)',
                  color: 'var(--c2-cyan)',
                  border: '1px solid rgba(0, 240, 255, 0.3)',
                }}
              >
                {payload.id}
              </div>
            </div>

            <div className="mb-3">
              <h3 className="font-semibold text-gray-200 mb-1 font-mono text-sm break-all">
                {payload.name}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>{payload.type}</span>
                <span>•</span>
                <span>{payload.os}</span>
                <span>•</span>
                <span>{payload.size}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="text-xs text-gray-400">
                <span className="font-mono" style={{ color: 'var(--c2-toxic)' }}>
                  {payload.downloads}
                </span> downloads
              </div>
              <div className="text-xs text-gray-500">
                {payload.created}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:scale-105 flex items-center justify-center gap-1.5"
                style={{
                  backgroundColor: 'rgba(0, 240, 255, 0.1)',
                  border: '1px solid var(--c2-cyan)',
                  color: 'var(--c2-cyan)',
                }}
              >
                <Download className="w-3.5 h-3.5" />
                Deploy
              </button>
              <button
                className="px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                style={{
                  backgroundColor: 'rgba(0, 240, 255, 0.05)',
                  border: '1px solid rgba(0, 240, 255, 0.2)',
                  color: 'var(--c2-cyan)',
                }}
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                className="px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                style={{
                  backgroundColor: 'rgba(255, 75, 75, 0.1)',
                  border: '1px solid rgba(255, 75, 75, 0.3)',
                  color: 'var(--c2-crimson)',
                }}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
