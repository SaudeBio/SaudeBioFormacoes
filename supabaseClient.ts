import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://TEU_PROJETO.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6...'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
