import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'

type CookiesModule = typeof import('next/headers')

const getServerCookies = (): CookiesModule['cookies'] => {
  if (typeof window !== 'undefined') {
    throw new Error('getServerSupabase can only be used on the server')
  }

  const { cookies } = require('next/headers') as CookiesModule
  return cookies
}

export const supabaseClient = createClientComponentClient<Database>()

export const getServerSupabase = () => {
  const cookiesFn = getServerCookies()
  const cookieStore = cookiesFn()
  return createServerComponentClient<Database>({
    cookies: () => cookieStore,
  })
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      datasets: {
        Row: {
          id: string
          user_id: string
          name: string
          data: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          data: Json
          created_at?: string
        }
      }
    }
  }
}
