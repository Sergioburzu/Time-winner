export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      families: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
        }
      }
      children: {
        Row: {
          id: string
          family_id: string
          name: string
          age: number
          avatar: string
          daily_limit_minutes: number
          accumulate_extra: boolean
          created_at: string
        }
        Insert: {
          id?: string
          family_id: string
          name: string
          age: number
          avatar: string
          daily_limit_minutes: number
          accumulate_extra?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          family_id?: string
          name?: string
          age?: number
          avatar?: string
          daily_limit_minutes?: number
          accumulate_extra?: boolean
        }
      }
      tasks: {
        Row: {
          id: string
          family_id: string
          name: string
          icon: string
          reward_minutes: number
          min_age: number | null
          max_age: number | null
          created_at: string
        }
        Insert: {
          id?: string
          family_id: string
          name: string
          icon: string
          reward_minutes: number
          min_age?: number | null
          max_age?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          family_id?: string
          name?: string
          icon?: string
          reward_minutes?: number
          min_age?: number | null
          max_age?: number | null
        }
      }
      assigned_tasks: {
        Row: {
          id: string
          child_id: string
          task_id: string
          date: string
          status: 'pending' | 'completed'
          minutes_granted: number
          created_at: string
        }
        Insert: {
          id?: string
          child_id: string
          task_id: string
          date: string
          status?: 'pending' | 'completed'
          minutes_granted: number
          created_at?: string
        }
        Update: {
          id?: string
          child_id?: string
          task_id?: string
          date?: string
          status?: 'pending' | 'completed'
          minutes_granted?: number
        }
      }
      minute_records: {
        Row: {
          id: string
          child_id: string
          date: string
          minutes_earned: number
          minutes_used: number
          minutes_carried_over: number
          created_at: string
        }
        Insert: {
          id?: string
          child_id: string
          date: string
          minutes_earned?: number
          minutes_used?: number
          minutes_carried_over?: number
          created_at?: string
        }
        Update: {
          id?: string
          child_id?: string
          date?: string
          minutes_earned?: number
          minutes_used?: number
          minutes_carried_over?: number
        }
      }
    }
  }
}
