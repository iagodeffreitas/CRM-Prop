import { useState, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ArrowLeft, User, Phone, Mail, MapPin, Calendar, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { LeadStatus } from '../types';

export function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { leads, users, interactions, currentUser, addInteraction, moveLead, assignLead } = useStore();
  
  const lead = leads.find(l => l.id === id);
  const owner = users.find(u => u.id === lead?.ownerId);
  const leadInteractions = interactions.filter(i => i.leadId === id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const [newNote, setNewNote] = useState('');

  if (!lead) {
    return <div className="p-6 text-center text-gray-500">Lead não encontrado.</div>;
  }

  const handleAddNote = (e: FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    
    addInteraction({
      leadId: lead.id,
      userId: currentUser!.id,
      type: 'note',
      content: newNote
    });
    setNewNote('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Lead Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-2xl font-bold">
                {lead.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{lead.name}</h2>
                <span className="inline-block mt-1 px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                  {lead.status}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="w-5 h-5 text-gray-400" />
                <span>{lead.phone}</span>
              </div>
              {lead.email && (
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span>{lead.email}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span>{lead.city ? `${lead.city} - ${lead.state}` : 'Localização não informada'}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span>Cadastrado em {format(new Date(lead.createdAt), "dd/MM/yyyy", { locale: ptBR })}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Responsável</h3>
              {currentUser?.role === 'admin' ? (
                <select 
                  value={lead.ownerId || ''}
                  onChange={(e) => assignLead(lead.id, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Sem responsável</option>
                  {users.filter(u => u.role !== 'admin').map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">
                    {owner?.name.charAt(0) || '?'}
                  </div>
                  <span className="text-gray-700 font-medium">{owner?.name || 'Sem dono'}</span>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Mudar Status</h3>
              <select 
                value={lead.status}
                onChange={(e) => moveLead(lead.id, e.target.value as LeadStatus)}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="new">Novo Lead</option>
                <option value="contacted">Em Contato</option>
                <option value="replied">Respondeu</option>
                <option value="interested">Interessado</option>
                <option value="registered">Cadastro Criado</option>
                <option value="deposited">Depositou</option>
                <option value="negotiating">Em Negociação</option>
                <option value="client">Cliente</option>
                <option value="lost">Perdido</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Adicionar Interação</h3>
            <form onSubmit={handleAddNote}>
              <textarea 
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                placeholder="Registre uma ligação, mensagem ou observação..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none h-24 mb-3"
              ></textarea>
              <div className="flex justify-end">
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Salvar Registro
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Timeline</h3>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
              
              {leadInteractions.length === 0 && (
                <p className="text-center text-gray-500 py-4 relative z-10 bg-white">Nenhuma interação registrada.</p>
              )}

              {leadInteractions.map((interaction) => {
                const author = users.find(u => u.id === interaction.userId);
                const isSystem = interaction.type === 'status_change' || interaction.type === 'owner_change';
                
                return (
                  <div key={interaction.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${isSystem ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-600'}`}>
                      {isSystem ? <CheckCircle2 className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
                    </div>
                    
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-200 bg-white shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900 text-sm">{author?.name || 'Sistema'}</span>
                        <time className="text-xs text-gray-500">{format(new Date(interaction.createdAt), "dd/MM HH:mm")}</time>
                      </div>
                      <div className="text-gray-600 text-sm">
                        {interaction.content}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Lead Creation Log */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-emerald-100 text-emerald-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm">
                  <User className="w-5 h-5" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-200 bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900 text-sm">Sistema</span>
                    <time className="text-xs text-gray-500">{format(new Date(lead.createdAt), "dd/MM HH:mm")}</time>
                  </div>
                  <div className="text-gray-600 text-sm">
                    Lead cadastrado no sistema.
                    <br/>
                    <span className="text-xs text-gray-400 mt-1 block">Origem: {lead.source}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
