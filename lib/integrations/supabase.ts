import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const supabaseClient = createClientComponentClient()

export const getServerSupabase = () => {
  return createServerComponentClient({ cookies })
}

export type Database = {
  public: {
    Tables: {
      datasets: {
        Row: {
          id: string
          user_id: string
          name: string
          data: any
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          data: any
          created_at?: string
        }
      }
    }
  }
}