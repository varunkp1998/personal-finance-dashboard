import { supabase } from './supabase';

// Sign Up
export const signUp = async (email, password) => {
  const { user, error } = await supabase.auth.signUp({ email, password });
  return { user, error };
};

// Log In
export const login = async (email, password) => {
  const { user, error } = await supabase.auth.signInWithPassword({ email, password });
  return { user, error };
};
// Google OAuth Login
export const signInWithGoogle = async () => {
    const { user, error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    return { user, error };
  };
  export const updateProfile = async (updates) => {
    const { error } = await supabase.auth.updateUser(updates);
    return { error };
  };
    
// Log Out
export const logout = async () => {
  await supabase.auth.signOut();
};
