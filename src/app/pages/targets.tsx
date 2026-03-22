import { TargetTable } from "../components/target-table";
import { ThreatMap } from "../components/threat-map";
import { Search, Filter, Plus } from "lucide-react";

export function Targets() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--c2-cyan)', fontFamily: 'var(--font-ui)' }}>
            Target Management
          </h1>
          <p className="text-sm text-gray-400">
            Monitor and control all active agents
          </p>
        </div>
        <button
          className="px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 hover:scale-105 flex items-center gap-2"
          style={{
            backgroundColor: 'rgba(0, 240, 255, 0.1)',
            border: '1px solid var(--c2-cyan)',
            color: 'var(--c2-cyan)',
            boxShadow: '0 0 20px rgba(0, 240, 255, 0.2)',
          }}
        >
          <Plus className="w-4 h-4" />
          Add Agent
        </button>
      </div>

      {/* Search and Filters */}
      <div 
        className="rounded-lg p-4 backdrop-blur-sm flex gap-4"
        style={{
          backgroundColor: 'rgba(22, 27, 34, 0.5)',
          border: '1px solid rgba(0, 240, 255, 0.1)',
        }}
      >
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID, IP, or hostname..."
            className="flex-1 bg-transparent outline-none text-sm text-gray-300"
          />
        </div>
        <button
          className="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          style={{
            backgroundColor: 'rgba(0, 240, 255, 0.05)',
            border: '1px solid rgba(0, 240, 255, 0.2)',
            color: 'var(--c2-cyan)',
          }}
        >
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      <div className="h-[450px]">
        <ThreatMap />
      </div>

      <TargetTable />
    </div>
  );
}