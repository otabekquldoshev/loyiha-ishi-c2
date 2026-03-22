import { Outlet } from "react-router";
import { C2Sidebar } from "./c2-sidebar";
import { C2TopBar } from "./c2-topbar";
import { C2Terminal } from "./c2-terminal";

export function DashboardLayout() {
  return (
    <div 
      className="h-screen flex overflow-hidden"
      style={{ 
        backgroundColor: 'var(--c2-obsidian)',
        fontFamily: 'var(--font-ui)',
      }}
    >
      <C2Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <C2TopBar />
        
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>

        <div className="p-4 pt-0">
          <C2Terminal />
        </div>
      </div>

      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Gradient orbs */}
        <div 
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{
            background: 'radial-gradient(circle, var(--c2-cyan) 0%, transparent 70%)',
            top: '-10%',
            right: '10%',
          }}
        />
        <div 
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{
            background: 'radial-gradient(circle, var(--c2-toxic) 0%, transparent 70%)',
            bottom: '-10%',
            left: '20%',
          }}
        />
      </div>
    </div>
  );
}
