// @ts-nocheck
import { useState } from 'react';
import { useStore } from '../store/useStore';
import { LeadStatus } from '../types';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock, MessageCircle, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const COLUMNS: { id: LeadStatus; title: string; color: string }[] = [
  { id: 'new', title: 'Novo Lead', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { id: 'contacted', title: 'Em Contato', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { id: 'replied', title: 'Respondeu', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { id: 'interested', title: 'Interessado', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  { id: 'registered', title: 'Cadastro Criado', color: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
  { id: 'deposited', title: 'Depositou', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { id: 'negotiating', title: 'Em Negociação', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { id: 'client', title: 'Cliente', color: 'bg-green-100 text-green-800 border-green-200' },
  { id: 'lost', title: 'Perdido', color: 'bg-red-100 text-red-800 border-red-200' },
];

export function Kanban() {
  const { leads, currentUser, moveLead, users } = useStore();
  const navigate = useNavigate();

  const myLeads = currentUser?.role === 'admin' 
    ? leads 
    : leads.filter(l => l.ownerId === currentUser?.id);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    moveLead(draggableId, destination.droppableId as LeadStatus);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pipeline de Vendas</h1>
        <p className="text-gray-500 mt-1">Arraste os cards para atualizar o status dos leads.</p>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
          {COLUMNS.map(column => {
            const columnLeads = myLeads.filter(l => l.status === column.id);
            
            return (
              <div key={column.id} className="flex-shrink-0 w-80 flex flex-col bg-gray-100/50 rounded-xl border border-gray-200">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white rounded-t-xl">
                  <h3 className="font-semibold text-gray-700">{column.title}</h3>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                    {columnLeads.length}
                  </span>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 p-3 overflow-y-auto min-h-[150px] transition-colors ${
                        snapshot.isDraggingOver ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      {columnLeads.map((lead, index) => {
                        const owner = users.find(u => u.id === lead.ownerId);
                        
                        // @ts-expect-error - Draggable types might not include key but React needs it
                        return (
                          <Draggable key={lead.id} draggableId={lead.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onClick={() => navigate(`/leads/${lead.id}`)}
                                className={`mb-3 p-4 bg-white rounded-lg border shadow-sm cursor-pointer hover:border-blue-300 transition-all ${
                                  snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-500 border-transparent' : 'border-gray-200'
                                }`}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-medium text-gray-900">{lead.name}</h4>
                                </div>
                                <p className="text-sm text-gray-500 mb-3">{lead.phone}</p>
                                
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatDistanceToNow(new Date(lead.updatedAt), { addSuffix: true, locale: ptBR })}
                                  </div>
                                  
                                  {owner ? (
                                    <div className="flex items-center gap-1" title={`Responsável: ${owner.name}`}>
                                      <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium text-[10px]">
                                        {owner.name.charAt(0)}
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-red-500 font-medium">Sem dono</span>
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
