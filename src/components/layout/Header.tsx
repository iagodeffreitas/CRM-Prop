import { Bell, Search } from 'lucide-react';
import { useStore } from '../../store/useStore';

export function Header() {
  const leads = useStore(state => state.leads);
  const currentUser = useStore(state => state.currentUser);
  
  // Simple alert logic: leads with no owner (if admin)
  const unassignedLeads = leads.filter(l => !l.ownerId).length;

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-96">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar leads, telefone..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          {currentUser?.role === 'admin' && unassignedLeads > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          )}
        </button>
      </div>
    </header>
  );
}
