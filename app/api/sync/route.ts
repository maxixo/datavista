import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })

  // Check authentication
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { type, entity, data } = body

    // Handle different sync operations
    if (entity === 'dataset') {
      if (type === 'create' || type === 'update') {
        const { error } = await supabase
          .from('datasets')
          .upsert({
            id: data.id,
            user_id: session.user.id,
            name: data.name,
            data: data.data,
            created_at: new Date(data.timestamp).toISOString(),
          })

        if (error) throw error
      } else if (type === 'delete') {
        const { error } = await supabase
          .from('datasets')
          .delete()
          .eq('id', data.id)
          .eq('user_id', session.user.id)

        if (error) throw error
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Sync error:', error)
    return NextResponse.json(
      { error: error.message || 'Sync failed' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { data, error } = await supabase
      .from('datasets')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ datasets: data })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch datasets' },
      { status: 500 }
    )
  }
}