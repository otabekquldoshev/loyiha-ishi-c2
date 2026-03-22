import { Play, Pause, X, Clock, CheckCircle2, AlertCircle } from "lucide-react";

const mockTasks = [
  { id: 'TSK-001', name: 'System Reconnaissance', target: 'TGT-4F2A', status: 'running', progress: 67, startTime: '14:20:15' },
  { id: 'TSK-002', name: 'Keylogger Deployment', target: 'TGT-8B91', status: 'completed', progress: 100, startTime: '14:15:08' },
  { id: 'TSK-003', name: 'Credential Harvesting', target: 'TGT-C3E7', status: 'running', progress: 45, startTime: '14:22:33' },
  { id: 'TSK-004', name: 'Data Exfiltration', target: 'TGT-7E2F', status: 'pending', progress: 0, startTime: '14:25:00' },
  { id: 'TSK-005', name: 'Persistence Establishment', target: 'TGT-9D4B', status: 'failed', progress: 34, startTime: '14:10:45' },
];

export function Tasks() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'var(--c2-cyan)';
      case 'completed': return 'var(--c2-toxic)';
      case 'failed': return 'var(--c2-crimson)';
      case 'pending': return '#FFA500';
      default: return '#666';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return Clock;
      case 'completed': return CheckCircle2;
      case 'failed': return AlertCircle;
      case 'pending': return Clock;
      default: return Clock;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--c2-cyan)' }}>
            Task Management
          </h1>
          <p className="text-sm text-gray-400">
            Monitor and control all active tasks
          </p>
        </div>
        <button
          className="px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 hover:scale-105 flex items-center gap-2"
          style={{
            backgroundColor: 'rgba(0, 240, 255, 0.1)',
            border: '1px solid var(--c2-cyan)',
            color: 'var(--c2-cyan)',
          }}
        >
          <Play className="w-4 h-4" />
          New Task
        </button>
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total', value: '247', color: 'var(--c2-cyan)' },
          { label: 'Running', value: '18', color: 'var(--c2-cyan)' },
          { label: 'Completed', value: '223', color: 'var(--c2-toxic)' },
          { label: 'Failed', value: '6', color: 'var(--c2-crimson)' },
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

      {/* Tasks List */}
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
            Active Tasks
          </h3>
        </div>

        <div className="divide-y" style={{ '--tw-divide-opacity': '0.1' }}>
          {mockTasks.map((task) => {
            const StatusIcon = getStatusIcon(task.status);
            return (
              <div key={task.id} className="p-4 hover:bg-cyan-500/5 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div
                      className="px-2 py-1 rounded text-xs font-mono font-semibold"
                      style={{
                        backgroundColor: `${getStatusColor(task.status)}20`,
                        color: getStatusColor(task.status),
                        border: `1px solid ${getStatusColor(task.status)}40`,
                      }}
                    >
                      {task.id}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-200">{task.name}</div>
                      <div className="text-xs text-gray-400 font-mono mt-0.5">
                        Target: {task.target} • Started: {task.startTime}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <StatusIcon 
                        className="w-4 h-4"
                        style={{ color: getStatusColor(task.status) }}
                      />
                      <span 
                        className="text-sm font-semibold uppercase"
                        style={{ color: getStatusColor(task.status) }}
                      >
                        {task.status}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      {task.status === 'running' && (
                        <button
                          className="p-1.5 rounded transition-all hover:scale-110"
                          style={{
                            backgroundColor: 'rgba(255, 165, 0, 0.1)',
                            border: '1px solid rgba(255, 165, 0, 0.3)',
                            color: '#FFA500',
                          }}
                        >
                          <Pause className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        className="p-1.5 rounded transition-all hover:scale-110"
                        style={{
                          backgroundColor: 'rgba(255, 75, 75, 0.1)',
                          border: '1px solid rgba(255, 75, 75, 0.3)',
                          color: 'var(--c2-crimson)',
                        }}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-gray-800">
                    <div
                      className="h-full transition-all duration-500"
                      style={{
                        width: `${task.progress}%`,
                        backgroundColor: getStatusColor(task.status),
                      }}
                    />
                  </div>
                  <span 
                    className="text-xs font-mono font-semibold w-12 text-right"
                    style={{ color: getStatusColor(task.status) }}
                  >
                    {task.progress}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
