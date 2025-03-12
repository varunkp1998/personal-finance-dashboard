import { supabase } from './supabase';

// Fetch Transactions
export const getTransactions = async (user_id) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user_id)
    .order('date', { ascending: false });

  return { data, error };
};

// Add Transaction
export const addTransaction = async (transaction) => {
  const { data, error } = await supabase.from('transactions').insert([transaction]);
  return { data, error };
};

// Update Transaction
export const updateTransaction = async (id, updates) => {
  const { data, error } = await supabase.from('transactions').update(updates).eq('id', id);
  return { data, error };
};

// Delete Transaction
export const deleteTransaction = async (id) => {
  const { data, error } = await supabase.from('transactions').delete().eq('id', id);
  return { data, error };
};
