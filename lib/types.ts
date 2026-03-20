export interface Client {
  id: string
  name: string
  phone: string | null
  email: string | null
  budget_min: number | null
  budget_max: number | null
  preferred_areas: string | null
  status: 'prospect' | 'active' | 'closed' | string
  source: string | null
  created_at: string
}

export interface FollowUp {
  id: string
  client_id: string
  note: string
  created_at: string
}

export interface Deal {
  id: string
  client_id: string | null
  property_address: string | null
  stage: 'prospect' | 'appointment' | 'pending' | 'sold' | string
  appointment_at: string | null
  offer_amount: number | null
  sale_price: number | null
  close_date: string | null
  commission: number | null
  notes: string | null
  updated_at: string
  created_at: string
  // Joined
  clients?: { name: string } | null
}

export interface Listing {
  id: string
  address: string
  price: number | null
  beds: number | null
  baths: number | null
  sqft: number | null
  status: 'active' | 'under_contract' | 'sold' | string
  photo_url: string | null
  agent_name: string | null
  created_at: string
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correct_index: number
  explanation: string | null
  category: string | null
}

export interface Agent {
  id: string
  name: string
  email: string
  phone: string
  avatar_url: string | null
  status: 'active' | 'inactive'
  deals_closed: number
  total_volume: number
  commission_earned: number
  active_clients: number
  joined_at: string
}

export type NotificationType =
  | 'follow_up_overdue'
  | 'follow_up_due'
  | 'deal_stage_change'
  | 'new_client'
  | 'appointment_reminder'
  | 'commission_received'
  | 'system'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  created_at: string
  /** Which roles can see this notification */
  visibility: ('broker' | 'admin')[]
  /** Optional link target */
  href?: string
  /** Client or agent name associated */
  related_name?: string
}
