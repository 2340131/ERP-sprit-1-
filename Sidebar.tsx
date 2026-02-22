import { useState } from 'react';
// ─── Types ────────────────────────────────────────────────────────────────────
interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
}
// ─── SVG Icons (inline, no external dependency) ───────────────────────────────
const DashboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);
const ProjectsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
    </svg>
);
const TasksIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
);
const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M12 14a4 4 0 110-8 4 4 0 010 8z" />
    </svg>
);
const ReportsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0120 9.414V19a2 2 0 01-2 2z" />
    </svg>
);
const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const CollapseIcon = ({ collapsed }: { collapsed: boolean }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-5 w-5 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
    </svg>
);
// ─── Nav Data ─────────────────────────────────────────────────────────────────
const NAV_ITEMS: NavItem[] = [
    { label: 'Dashboard', href: '/', icon: <DashboardIcon /> },
    { label: 'Projects', href: '/projects', icon: <ProjectsIcon /> },
    { label: 'Tasks', href: '/tasks', icon: <TasksIcon /> },
    { label: 'Users', href: '/users', icon: <UsersIcon /> },
    { label: 'Reports', href: '/reports', icon: <ReportsIcon /> },
    { label: 'Settings', href: '/settings', icon: <SettingsIcon /> },
];
// ─── Component ────────────────────────────────────────────────────────────────
export function Sidebar() {
    // Static preview: active item is fixed to '/' (no router yet)
    const activeHref = '/';
    // Collapsed state — wires up the toggle button for future use
    const [collapsed, setCollapsed] = useState(false);
    return (
        <aside
            className={`
                flex flex-col h-screen bg-slate-900 text-slate-100
                transition-all duration-300 ease-in-out shadow-xl
                ${collapsed ? 'w-16' : 'w-64'}
            `}
        >
            {/* ── Logo / Brand ── */}
            <div className="flex items-center justify-between px-4 py-5 border-b border-slate-700">
                {!collapsed && (
                    <span className="text-xl font-bold tracking-tight text-white">
                        ERP <span className="text-indigo-400">System</span>
                    </span>
                )}
                <button
                    onClick={() => setCollapsed((prev) => !prev)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    <CollapseIcon collapsed={collapsed} />
                </button>
            </div>
            {/* ── Navigation ── */}
            <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
                {NAV_ITEMS.map((item) => {
                    const isActive = item.href === activeHref;
                    return (
                        <a
                            key={item.href}
                            href={item.href}
                            className={`
                                flex items-center gap-3 px-3 py-2.5 rounded-lg
                                text-sm font-medium transition-all duration-150
                                ${isActive
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }
                            `}
                        >
                            <span className="flex-shrink-0">{item.icon}</span>
                            {!collapsed && <span>{item.label}</span>}
                        </a>
                    );
                })}
            </nav>
            {/* ── User Profile Footer ── */}
            <div className="p-3 border-t border-slate-700">
                <div className={`flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer`}>
                    {/* Avatar */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold">
                        IN
                    </div>
                    {!collapsed && (
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">Intern User</p>
                            <p className="text-xs text-slate-400 truncate">intern@erp.dev</p>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
