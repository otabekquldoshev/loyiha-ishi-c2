import { Folder, File, Download, Eye, Trash2, ChevronRight } from "lucide-react";
import { useState } from "react";

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  size?: string;
  modified?: string;
  children?: FileNode[];
}

const mockFileSystem: FileNode[] = [
  {
    name: 'TGT-4F2A',
    type: 'folder',
    children: [
      {
        name: 'Documents',
        type: 'folder',
        children: [
          { name: 'credentials.txt', type: 'file', size: '2.4 KB', modified: '2024-03-22 14:23' },
          { name: 'project_specs.pdf', type: 'file', size: '1.2 MB', modified: '2024-03-21 09:15' },
        ],
      },
      {
        name: 'Desktop',
        type: 'folder',
        children: [
          { name: 'notes.txt', type: 'file', size: '856 B', modified: '2024-03-22 10:45' },
        ],
      },
    ],
  },
  {
    name: 'TGT-8B91',
    type: 'folder',
    children: [
      {
        name: 'Downloads',
        type: 'folder',
        children: [
          { name: 'database_backup.sql', type: 'file', size: '45 MB', modified: '2024-03-20 16:30' },
        ],
      },
    ],
  },
];

function FileTreeNode({ node, depth = 0 }: { node: FileNode; depth?: number }) {
  const [isExpanded, setIsExpanded] = useState(depth === 0);

  return (
    <div>
      <div
        className="flex items-center gap-2 px-3 py-2 hover:bg-cyan-500/5 transition-colors cursor-pointer rounded"
        style={{ paddingLeft: `${depth * 1.5 + 0.75}rem` }}
        onClick={() => node.type === 'folder' && setIsExpanded(!isExpanded)}
      >
        {node.type === 'folder' && (
          <ChevronRight
            className={`w-3 h-3 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
          />
        )}
        {node.type === 'folder' ? (
          <Folder className="w-4 h-4" style={{ color: 'var(--c2-cyan)' }} />
        ) : (
          <File className="w-4 h-4 text-gray-400" />
        )}
        <span className="flex-1 text-sm text-gray-300">{node.name}</span>
        {node.size && <span className="text-xs text-gray-500 font-mono">{node.size}</span>}
        {node.type === 'file' && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              className="p-1 rounded hover:bg-cyan-500/20"
              style={{ color: 'var(--c2-cyan)' }}
            >
              <Eye className="w-3 h-3" />
            </button>
            <button
              className="p-1 rounded hover:bg-cyan-500/20"
              style={{ color: 'var(--c2-cyan)' }}
            >
              <Download className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
      {node.type === 'folder' && isExpanded && node.children && (
        <div>
          {node.children.map((child, idx) => (
            <FileTreeNode key={idx} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileSystem() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--c2-cyan)' }}>
            File System Browser
          </h1>
          <p className="text-sm text-gray-400">
            Browse and exfiltrate files from compromised systems
          </p>
        </div>
      </div>

      {/* File Browser */}
      <div
        className="rounded-lg backdrop-blur-sm overflow-hidden"
        style={{
          backgroundColor: 'rgba(22, 27, 34, 0.5)',
          border: '1px solid rgba(0, 240, 255, 0.1)',
        }}
      >
        <div
          className="px-4 py-3 border-b flex items-center justify-between"
          style={{ borderColor: 'rgba(0, 240, 255, 0.1)' }}
        >
          <h3 className="font-semibold" style={{ color: 'var(--c2-cyan)' }}>
            Remote File Systems
          </h3>
          <div className="text-xs text-gray-400 font-mono">
            2 targets • 247 files
          </div>
        </div>

        <div className="p-2 group">
          {mockFileSystem.map((node, idx) => (
            <FileTreeNode key={idx} node={node} />
          ))}
        </div>
      </div>

      {/* Recent Downloads */}
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
          <h3 className="font-semibold" style={{ color: 'var(--c2-toxic)' }}>
            Recent Exfiltrations
          </h3>
        </div>

        <div className="divide-y" style={{ '--tw-divide-opacity': '0.05' }}>
          {[
            { file: 'credentials.txt', source: 'TGT-4F2A', size: '2.4 KB', time: '2 min ago' },
            { file: 'database_backup.sql', source: 'TGT-8B91', size: '45 MB', time: '1 hour ago' },
            { file: 'ssh_keys.pem', source: 'TGT-C3E7', size: '4.1 KB', time: '3 hours ago' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between hover:bg-cyan-500/5 transition-colors">
              <div className="flex items-center gap-3">
                <File className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="font-mono text-sm text-gray-200">{item.file}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    From {item.source} • {item.size}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-500 font-mono">{item.time}</span>
                <button
                  className="p-1.5 rounded transition-all hover:scale-110"
                  style={{
                    backgroundColor: 'rgba(0, 240, 255, 0.1)',
                    border: '1px solid rgba(0, 240, 255, 0.3)',
                    color: 'var(--c2-cyan)',
                  }}
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
