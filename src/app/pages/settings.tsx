import { Settings as SettingsIcon, Shield, Network, Bell, Database, Key } from "lucide-react";
import { Switch } from "../components/ui/switch";

export function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--c2-cyan)' }}>
          System Settings
        </h1>
        <p className="text-sm text-gray-400">
          Configure C2 infrastructure and security parameters
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-4">
        {/* Security */}
        <div
          className="rounded-lg p-4 backdrop-blur-sm"
          style={{
            backgroundColor: 'rgba(22, 27, 34, 0.5)',
            border: '1px solid rgba(0, 240, 255, 0.1)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4" style={{ color: 'var(--c2-cyan)' }} />
            <h3 className="font-semibold" style={{ color: 'var(--c2-cyan)' }}>
              Security
            </h3>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Enable Two-Factor Authentication', description: 'Require 2FA for all login attempts', enabled: true },
              { label: 'Encryption at Rest', description: 'Encrypt all stored data and logs', enabled: true },
              { label: 'Auto-Lock on Idle', description: 'Lock dashboard after 15 minutes of inactivity', enabled: false },
              { label: 'IP Whitelisting', description: 'Restrict access to whitelisted IPs only', enabled: true },
            ].map((setting, idx) => (
              <div key={idx} className="flex items-center justify-between py-2">
                <div>
                  <div className="text-sm text-gray-200 font-medium">{setting.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{setting.description}</div>
                </div>
                <Switch defaultChecked={setting.enabled} />
              </div>
            ))}
          </div>
        </div>

        {/* Network */}
        <div
          className="rounded-lg p-4 backdrop-blur-sm"
          style={{
            backgroundColor: 'rgba(22, 27, 34, 0.5)',
            border: '1px solid rgba(0, 240, 255, 0.1)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Network className="w-4 h-4" style={{ color: 'var(--c2-toxic)' }} />
            <h3 className="font-semibold" style={{ color: 'var(--c2-toxic)' }}>
              Network Configuration
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'C2 Server Address', value: 'c2.nexus.internal' },
              { label: 'Port', value: '8443' },
              { label: 'Protocol', value: 'HTTPS/TLS 1.3' },
              { label: 'Heartbeat Interval', value: '30 seconds' },
            ].map((config, idx) => (
              <div key={idx}>
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">
                  {config.label}
                </label>
                <input
                  type="text"
                  defaultValue={config.value}
                  className="w-full px-3 py-2 rounded-lg text-sm font-mono bg-black/30 border text-gray-300 focus:outline-none focus:ring-1"
                  style={{
                    borderColor: 'rgba(0, 240, 255, 0.2)',
                    '--tw-ring-color': 'var(--c2-cyan)',
                  } as any}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div
          className="rounded-lg p-4 backdrop-blur-sm"
          style={{
            backgroundColor: 'rgba(22, 27, 34, 0.5)',
            border: '1px solid rgba(0, 240, 255, 0.1)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4" style={{ color: '#FFA500' }} />
            <h3 className="font-semibold" style={{ color: '#FFA500' }}>
              Notifications
            </h3>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Agent Connected', enabled: true },
              { label: 'Agent Disconnected', enabled: true },
              { label: 'Task Completed', enabled: false },
              { label: 'Task Failed', enabled: true },
              { label: 'Critical Alerts', enabled: true },
              { label: 'System Updates', enabled: false },
            ].map((notification, idx) => (
              <div key={idx} className="flex items-center justify-between py-2">
                <div className="text-sm text-gray-200">{notification.label}</div>
                <Switch defaultChecked={notification.enabled} />
              </div>
            ))}
          </div>
        </div>

        {/* Database */}
        <div
          className="rounded-lg p-4 backdrop-blur-sm"
          style={{
            backgroundColor: 'rgba(22, 27, 34, 0.5)',
            border: '1px solid rgba(0, 240, 255, 0.1)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-4 h-4" style={{ color: 'var(--c2-crimson)' }} />
            <h3 className="font-semibold" style={{ color: 'var(--c2-crimson)' }}>
              Database Management
            </h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-sm text-gray-200">Database Size</div>
                <div className="text-xs text-gray-400 mt-0.5">Current storage usage</div>
              </div>
              <div className="text-sm font-mono" style={{ color: 'var(--c2-cyan)' }}>
                847 MB
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-sm text-gray-200">Last Backup</div>
                <div className="text-xs text-gray-400 mt-0.5">Automatic daily backup</div>
              </div>
              <div className="text-sm font-mono text-gray-400">
                2 hours ago
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                className="flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:scale-105"
                style={{
                  backgroundColor: 'rgba(0, 240, 255, 0.1)',
                  border: '1px solid var(--c2-cyan)',
                  color: 'var(--c2-cyan)',
                }}
              >
                Backup Now
              </button>
              <button
                className="flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:scale-105"
                style={{
                  backgroundColor: 'rgba(255, 75, 75, 0.1)',
                  border: '1px solid var(--c2-crimson)',
                  color: 'var(--c2-crimson)',
                }}
              >
                Clear Logs
              </button>
            </div>
          </div>
        </div>

        {/* API Keys */}
        <div
          className="rounded-lg p-4 backdrop-blur-sm"
          style={{
            backgroundColor: 'rgba(22, 27, 34, 0.5)',
            border: '1px solid rgba(0, 240, 255, 0.1)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Key className="w-4 h-4" style={{ color: 'var(--c2-toxic)' }} />
            <h3 className="font-semibold" style={{ color: 'var(--c2-toxic)' }}>
              API Keys
            </h3>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Production Key', key: 'c2_prod_8a9d2f...', created: '2024-01-15', status: 'active' },
              { name: 'Development Key', key: 'c2_dev_4f2b1e...', created: '2024-02-20', status: 'active' },
              { name: 'Legacy Key', key: 'c2_legacy_9e3c...', created: '2023-11-08', status: 'revoked' },
            ].map((apiKey, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between py-2 px-3 rounded"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
              >
                <div>
                  <div className="text-sm text-gray-200 font-medium">{apiKey.name}</div>
                  <div className="text-xs text-gray-400 font-mono mt-0.5">{apiKey.key}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">{apiKey.created}</span>
                  <span
                    className="px-2 py-0.5 rounded text-xs font-semibold"
                    style={{
                      backgroundColor: apiKey.status === 'active' ? 'rgba(57, 255, 20, 0.1)' : 'rgba(255, 75, 75, 0.1)',
                      color: apiKey.status === 'active' ? 'var(--c2-toxic)' : 'var(--c2-crimson)',
                      border: `1px solid ${apiKey.status === 'active' ? 'var(--c2-toxic)' : 'var(--c2-crimson)'}40`,
                    }}
                  >
                    {apiKey.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            className="w-full mt-4 px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:scale-105"
            style={{
              backgroundColor: 'rgba(57, 255, 20, 0.1)',
              border: '1px solid var(--c2-toxic)',
              color: 'var(--c2-toxic)',
            }}
          >
            Generate New Key
          </button>
        </div>
      </div>
    </div>
  );
}
