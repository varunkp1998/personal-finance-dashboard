import { supabase } from './supabase';

// Fetch Investments
export const getInvestments = async (user_id) => {
  const { data, error } = await supabase.from('investments').select('*').eq('user_id', user_id);
  return { data, error };
};

// Fetch Real-time Stock Price (Yahoo Finance)
export const getStockPrice = async (symbol) => {
    const response = await fetch(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`);
    const json = await response.json();
    return json.quoteResponse?.result?.[0]?.regularMarketPrice || null;
  };
  

// Fetch Real-time Mutual Fund NAV (AMFI API)
export const getMutualFundNAV = async (fundCode) => {
    const response = await fetch(`https://api.mfapi.in/mf/${fundCode}`);
    const json = await response.json();
    return json?.data?.[0]?.nav || null;
  };
  

// Update Investment Prices
export const updateInvestmentPrices = async (investments) => {
  for (let investment of investments) {
    let current_price = null;
    if (investment.type === 'Stock') {
      current_price = await getStockPrice(investment.name);
    } else if (investment.type === 'Mutual Fund') {
      current_price = await getMutualFundNAV(investment.name);
    }

    if (current_price) {
      await supabase.from('investments').update({ current_price }).eq('id', investment.id);
    }
  }
};

// Add Investment
export const addInvestment = async (investment) => {
  const { data, error } = await supabase.from('investments').insert([investment]);
  return { data, error };
};

// Delete Investment
export const deleteInvestment = async (id) => {
  const { data, error } = await supabase.from('investments').delete().eq('id', id);
  return { data, error };
};
