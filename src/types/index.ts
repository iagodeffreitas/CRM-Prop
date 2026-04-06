export type Role = 'admin' | 'manager' | 'seller';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export type LeadStatus = 
  | 'new' 
  | 'contacted' 
  | 'replied' 
  | 'interested' 
  | 'registered' 
  | 'deposited' 
  | 'negotiating' 
  | 'client' 
  | 'lost';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  source: string;
  initialObservation?: string;
  email?: string;
  city?: string;
  state?: string;
  status: LeadStatus;
  ownerId?: string; // User ID
  createdAt: string;
  updatedAt: string;
  lastInteractionAt?: string;
}

export interface Interaction {
  id: string;
  leadId: string;
  userId: string;
  type: 'message_sent' | 'reply_received' | 'objection' | 'note' | 'status_change' | 'owner_change';
  content: string;
  createdAt: string;
}

export interface Task {
  id: string;
  leadId: string;
  userId: string;
  title: string;
  dueDate: string;
  completed: boolean;
  createdAt: string;
}
