import { supabase } from './supabase'

export async function signIn(email: string, password: string) {
  if (!supabase) throw new Error('Supabase not configured')
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  return { data, error }
}

export async function signUp(email: string, password: string) {
  if (!supabase) throw new Error('Supabase not configured')
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  
  return { data, error }
}

export async function signOut() {
  if (!supabase) throw new Error('Supabase not configured')
  
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  if (!supabase) return null
  
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getSession() {
  if (!supabase) return null
  
  const { data: { session } } = await supabase.auth.getSession()
  return session
}