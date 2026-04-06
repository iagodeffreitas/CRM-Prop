import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { LayoutDashboard, Users, Trello, Bell, Settings, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Sidebar() {
  const location = useLocation();
  const currentUser = useStore(state => state.currentUser);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Kanban', path: '/kanban', icon: Trello },
    { name: 'Leads', path: '/leads', icon: Users },
  ];

  if (currentUser?.role === 'admin') {
    navItems.push({ name: 'Configurações', path: '/settings', icon: Settings });
  }

  return (
    <div className="flex flex-col w-64 bg-gray-900 h-screen text-white border-r border-gray-800">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl">
          IT
        </div>
        <span className="font-bold text-lg tracking-tight">InsiderTrader</span>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-gray-800 text-white" 
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-medium">
            {currentUser?.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{currentUser?.name}</p>
            <p className="text-xs text-gray-400 truncate capitalize">{currentUser?.role}</p>
          </div>
        </div>
        <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white w-full px-2 py-1.5 rounded-md hover:bg-gray-800 transition-colors">
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </div>
  );
}
