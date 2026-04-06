import { useStore } from '../store/useStore';
import { Users, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export function Dashboard() {
  const { leads, currentUser } = useStore();

  const myLeads = currentUser?.role === 'admin' 
    ? leads 
    : leads.filter(l => l.ownerId === currentUser?.id);

  const unassignedLeads = leads.filter(l => !l.ownerId);
  const newLeads = myLeads.filter(l => l.status === 'new');
  const convertedLeads = myLeads.filter(l => l.status === 'client' || l.status === 'deposited');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Bem-vindo de volta, {currentUser?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total de Leads" 
          value={myLeads.length.toString()} 
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard 
          title="Novos Leads" 
          value={newLeads.length.toString()} 
          icon={AlertCircle}
          color="bg-amber-500"
        />
        <StatCard 
          title="Convertidos" 
          value={convertedLeads.length.toString()} 
          icon={CheckCircle2}
          color="bg-emerald-500"
        />
        {currentUser?.role === 'admin' && (
          <StatCard 
            title="Sem Responsável" 
            value={unassignedLeads.length.toString()} 
            icon={Clock}
            color="bg-red-500"
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Leads Recentes</h2>
          <div className="space-y-4">
            {myLeads.slice(0, 5).map(lead => (
              <div key={lead.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{lead.name}</p>
                  <p className="text-sm text-gray-500">{lead.phone}</p>
                </div>
                <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                  {lead.status}
                </span>
              </div>
            ))}
            {myLeads.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">Nenhum lead encontrado.</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tarefas Pendentes</h2>
          <div className="space-y-4">
            <p className="text-gray-500 text-sm text-center py-4">Nenhuma tarefa para hoje.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: { title: string, value: string, icon: any, color: string }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
