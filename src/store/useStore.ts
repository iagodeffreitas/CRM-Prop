import { create } from 'zustand';
import { Lead, User, Interaction, Task, LeadStatus } from '../types';

interface StoreState {
  currentUser: User | null;
  users: User[];
  leads: Lead[];
  interactions: Interaction[];
  tasks: Task[];
  
  // Actions
  setCurrentUser: (user: User) => void;
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateLead: (id: string, data: Partial<Lead>) => void;
  assignLead: (leadId: string, userId: string) => void;
  moveLead: (leadId: string, status: LeadStatus) => void;
  addInteraction: (interaction: Omit<Interaction, 'id' | 'createdAt'>) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  toggleTask: (taskId: string) => void;
}

const mockUsers: User[] = [
  { id: 'u1', name: 'Admin Gestor', email: 'admin@insider.com', role: 'admin' },
  { id: 'u2', name: 'Gerente Comercial', email: 'gerente@insider.com', role: 'manager' },
  { id: 'u3', name: 'Vendedor Alpha', email: 'alpha@insider.com', role: 'seller' },
  { id: 'u4', name: 'Vendedor Beta', email: 'beta@insider.com', role: 'seller' },
];

const mockLeads: Lead[] = [
  {
    id: 'l1',
    name: 'João Silva',
    phone: '11999999999',
    source: 'Campanha A / Conjunto 1 / Criativo X',
    status: 'new',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'l2',
    name: 'Maria Oliveira',
    phone: '11988888888',
    source: 'Campanha B / Conjunto 2 / Criativo Y',
    status: 'contacted',
    ownerId: 'u3',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    lastInteractionAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 'l3',
    name: 'Carlos Santos',
    phone: '11977777777',
    source: 'Campanha A / Conjunto 1 / Criativo Z',
    status: 'negotiating',
    ownerId: 'u4',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    lastInteractionAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  }
];

export const useStore = create<StoreState>((set) => ({
  currentUser: mockUsers[0], // Start as admin
  users: mockUsers,
  leads: mockLeads,
  interactions: [],
  tasks: [],

  setCurrentUser: (user) => set({ currentUser: user }),
  
  addLead: (leadData) => set((state) => {
    const newLead: Lead = {
      ...leadData,
      id: `l${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return { leads: [...state.leads, newLead] };
  }),

  updateLead: (id, data) => set((state) => ({
    leads: state.leads.map(lead => 
      lead.id === id ? { ...lead, ...data, updatedAt: new Date().toISOString() } : lead
    )
  })),

  assignLead: (leadId, userId) => set((state) => {
    const interaction: Interaction = {
      id: `i${Date.now()}`,
      leadId,
      userId: state.currentUser?.id || 'system',
      type: 'owner_change',
      content: `Lead atribuído para ${state.users.find(u => u.id === userId)?.name}`,
      createdAt: new Date().toISOString(),
    };

    return {
      leads: state.leads.map(lead => 
        lead.id === leadId ? { ...lead, ownerId: userId, updatedAt: new Date().toISOString() } : lead
      ),
      interactions: [...state.interactions, interaction]
    };
  }),

  moveLead: (leadId, status) => set((state) => {
    const interaction: Interaction = {
      id: `i${Date.now()}`,
      leadId,
      userId: state.currentUser?.id || 'system',
      type: 'status_change',
      content: `Status alterado para ${status}`,
      createdAt: new Date().toISOString(),
    };

    return {
      leads: state.leads.map(lead => 
        lead.id === leadId ? { ...lead, status, updatedAt: new Date().toISOString() } : lead
      ),
      interactions: [...state.interactions, interaction]
    };
  }),

  addInteraction: (interactionData) => set((state) => {
    const newInteraction: Interaction = {
      ...interactionData,
      id: `i${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    return {
      interactions: [...state.interactions, newInteraction],
      leads: state.leads.map(lead => 
        lead.id === interactionData.leadId 
          ? { ...lead, lastInteractionAt: new Date().toISOString(), updatedAt: new Date().toISOString() } 
          : lead
      )
    };
  }),

  addTask: (taskData) => set((state) => {
    const newTask: Task = {
      ...taskData,
      id: `t${Date.now()}`,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    return { tasks: [...state.tasks, newTask] };
  }),

  toggleTask: (taskId) => set((state) => ({
    tasks: state.tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    )
  })),
}));
